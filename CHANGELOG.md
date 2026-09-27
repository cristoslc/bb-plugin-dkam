# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- **Design reset.** DKAM is now a mandate layer plus a comms layer, not a
  metacognitive monitor. The authoritative design is `docs/HANDOFF.md`.
- `PURPOSE.md`, `AGENTS.md`, `README.md`, `docs/README.md`, and
  `docs/ARCHITECTURE.md` rewritten to match.
- `server.ts` reduced to an honest stub. The `bb dkam status|watch|unwatch|
  recap` CLI, the `state_snapshot` tool, the TTS-key/operator-mode/episode-length
  settings, the watch registry, and the agent-graph summariser are gone.
- Test command now `vitest run --passWithNoTests`, with a declared exemption
  until milestone 1.

### Removed

- Domain model: L1 glossary, L2 model, context map, domain events doc, and all
  seven event specifications with their meta-schema. Replaced by
  `docs/HANDOFF.md`, rebuilt spec-first after the code exists.
- The conformance test suite that guarded those specifications.
- C4 context, container, component, and deployment diagrams, and the tech-stack
  doc, which described the previous design.
- The user-experience hub and its spoke directory, superseded by the comms
  section of the handoff.
- ADR-0002, which recorded a design that did not survive review. The number is
  not reused.

- Project docs tree (architecture, domain model, ADRs) and developer workflows