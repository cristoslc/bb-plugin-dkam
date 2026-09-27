# Architecture (technical surface)

DKAM is a headless BB plugin: one backend entry (`server.ts`) loaded by the BB
server, no frontend bundle, no `bb.app`.

**The design is not settled and no code exists yet.** The current, authoritative
description of what DKAM is and how it is built is
[HANDOFF.md](HANDOFF.md). Read that first. This hub exists to hold the technical
surface once the first milestone lands.

Target shape, from the handoff:

```
server.ts                 plugin factory, CLI, settings
mandate/
  job-card.ts             parse and validate a job card
  roe.ts                  the rules-of-engagement rule set
  enforce.ts              harness-side refusal; no model in this path
  duty-log.ts             append, render, query
comms/
  verbs.ts                fixed verb vocabulary and grammar
  speak.ts                sentence construction, one-sentence budget
  channel.ts              websocket page, push-to-talk, Web Speech out
report/
  compose.ts              the one end-of-run report
```

Planned BB surfaces:

- `bb.cli.register(defineCli(...))` — `bb dkam` subcommands
- `bb.settings.define` — non-secret run settings only; no API keys
- `bb.storage.kv` / `bb.storage.database()` — job cards, duty log, ROE
- `bb.http.experimental_websocket` — the phone channel
- `api.system.transcribeVoice` — voice input, using bb's configured service
- Web Speech API in the phone page — voice output, no vendor
- `bb.server.loopbackBaseUrl` — for reading verified facts from agent-graph
- A pre-tool interception surface for ROE enforcement, TBD

The interface contract with agent-graph remains the single read point:

```
GET /api/v1/plugins/agent-graph/http/graph?threadId=<id>
```

It is used only as a source of verified facts. See
[adr/0001](adr/0001-headless-plugin-and-agent-graph-contract.md).

Technical detail beyond this hub will live in `technical-architecture/`, which is
deliberately empty until there is code to describe.
