// Contract-conformance tests for integration contract specs.
// Standard: ~/.agents/agents-md-detail/integration-contracts.md
// 1. Every spec under docs/domain-architecture/events/ validates against
//    the meta-schema.
// 2. Inverse test: a deliberately malformed spec raises a validation error.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parse, stringify } from "yaml";

const REPO_ROOT = join(import.meta.dirname, "..");
const EVENTS_DIR = join(REPO_ROOT, "docs", "domain-architecture", "events");

// The meta-schema is expressed in YAML but validated with JSON Schema
// draft-07 semantics. Vitest runs without a JSON Schema runtime dependency
// by default, so this file implements the narrow draft-07 subset the
// meta-schema uses (type, required, enum, pattern, min/max, additionalProperties).
// If the meta-schema grows beyond this subset, add a real validator
// (ajv) as a devDependency and replace these helpers.
type Schema = {
  type?: string;
  required?: string[];
  properties?: Record<string, Schema>;
  enum?: string[];
  pattern?: string;
  minimum?: number;
  minItems?: number;
  uniqueItems?: boolean;
  minProperties?: number;
  additionalProperties?: boolean | Schema;
  items?: Schema;
};

const META_SCHEMA: Schema = parse(
  readFileSync(join(EVENTS_DIR, "schemas", "event-spec.schema.yaml"), "utf8"),
);

function validate(value: unknown, schema: Schema, path: string): string[] {
  const errors: string[] = [];
  if (schema.type === "object") {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      return [`${path || "spec"} must be an object`];
    }
    const obj = value as Record<string, unknown>;
    for (const key of schema.required ?? []) {
      if (!(key in obj)) errors.push(`${path || "spec"} missing required field '${key}'`);
    }
    const props = schema.properties ?? {};
    for (const [key, val] of Object.entries(obj)) {
      if (key in props) {
        errors.push(...validate(val, props[key]!, path ? `${path}.${key}` : key));
      } else if (schema.additionalProperties === false) {
        errors.push(`${path || "spec"} has unexpected field '${key}'`);
      } else if (typeof schema.additionalProperties === "object") {
        errors.push(...validate(val, schema.additionalProperties, path ? `${path}.${key}` : key));
      }
    }
  } else if (schema.type === "array") {
    if (!Array.isArray(value)) return [`${path} must be an array`];
    if (schema.minItems !== undefined && value.length < schema.minItems) {
      errors.push(`${path} must have at least ${schema.minItems} item(s)`);
    }
    if (schema.uniqueItems && new Set(value.map((v) => stringify(v))).size !== value.length) {
      errors.push(`${path} items must be unique`);
    }
    if (schema.items) {
      value.forEach((item, i) => errors.push(...validate(item, schema.items!, `${path}[${i}]`)));
    }
  } else if (schema.type === "string") {
    if (typeof value !== "string") return [`${path} must be a string`];
    if (schema.enum && !schema.enum.includes(value)) {
      errors.push(`${path} must be one of: ${schema.enum.join(", ")}`);
    }
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) {
      errors.push(`${path} must match pattern ${schema.pattern}`);
    }
  } else if (schema.type === "integer") {
    if (typeof value !== "number" || !Number.isInteger(value)) {
      return [`${path} must be an integer`];
    }
    if (schema.minimum !== undefined && value < schema.minimum) {
      errors.push(`${path} must be >= ${schema.minimum}`);
    }
  }
  return errors;
}

function eventSpecPaths(): string[] {
  return readdirSync(EVENTS_DIR)
    .filter((name) => name.endsWith(".yaml"))
    .map((name) => join(EVENTS_DIR, name))
    .filter((p) => statSync(p).isFile());
}

describe("integration contract specs", () => {
  it.each(eventSpecPaths().map((p) => [p.slice(REPO_ROOT.length + 1), p]))(
    "%s conforms to the event-spec meta-schema",
    (_label, path) => {
      const spec = parse(readFileSync(path, "utf8"));
      expect(validate(spec, META_SCHEMA, "")).toEqual([]);
    },
  );

  it("filename matches the event name (kebab-case of PascalCase)", () => {
    for (const path of eventSpecPaths()) {
      const spec = parse(readFileSync(path, "utf8")) as { event: string };
      const kebab = spec.event
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .toLowerCase();
      const base = path.split("/").pop()!;
      expect(base).toBe(`${kebab}.yaml`);
    }
  });

  it("event names referenced in DOMAIN-EVENTS.md all have a spec", () => {
    const narrative = readFileSync(
      join(REPO_ROOT, "docs", "domain-architecture", "DOMAIN-EVENTS.md"),
      "utf8",
    );
    const referenced = [...narrative.matchAll(/`([A-Z][a-zA-Z0-9]+\.[a-zA-Z0-9_.]+)`/g)]
      .map((m) => m[1]!.split(".")[0]!)
      .filter((name) => name !== "GET");
    for (const name of referenced) {
      const kebab = name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
      expect(eventSpecPaths().some((p) => p.endsWith(`${kebab}.yaml`))).toBe(true);
    }
  });

  it("inverse: a deliberately malformed spec fails validation", () => {
    const malformed = { event: "orderSubmitted", version: 1 };
    expect(validate(malformed, META_SCHEMA, "").length).toBeGreaterThan(0);
  });
});