# ADR-0001: Headless single-process plugin, agent-graph as sole integration point

Date: 2026-09-24
Status: adopted

## Context

DKAM must supervise BB working threads while the operator is away from any
screen. It needs to read thread state (agent-graph's graph model), talk to
the operator by voice, and run a background watcher — all from within the BB
plugin system, with the operator's phone as the only display.

## Options considered

1. **Standalone service beside BB** — own process, own storage, integrates
   via BB's HTTP API.
2. **BB plugin with frontend bundle** — standard plugin shape, plus a
   `bb.app` page.
3. **Headless BB plugin** — server entry only; UI exists only as the phone
   channel page served over `experimental_websocket`.

## Decision

Option 3, with one fixed integration point: agent-graph's
`GET /api/v1/plugins/agent-graph/http/graph?threadId=<id>`.

Rationale:

- A separate process would duplicate storage, settings, and auth BB already
  provides, and would fight plugin lifecycle (reload/dispose).
- A frontend bundle would target the BB app UI — exactly the screen the
  operator does not have. The only UI that matters is the phone page, which
  the websocket route serves directly.
- The single-endpoint contract with agent-graph keeps the anticorruption
  layer tiny: one fetch function (`fetchGraph` in `server.ts`) and one
  summarizer. Nothing else about agent-graph may leak into DKAM.

## Consequences

- Phone-channel HTML is served as strings/routes from the plugin, not a
  bundled app; keep it small.
- If agent-graph's endpoint shape changes, only `fetchGraph`/`summarizeGraph`
  need updating.
- Plugin SQLite (`bb.storage.database()`) becomes necessary once episode and
  drift history outgrow KV; planned as the first storage migration.