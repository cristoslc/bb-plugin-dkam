# Developer workflows

## Build

```sh
npm install
npx tsc --noEmit     # typecheck
bb plugin build      # emits dist/server.js + map + meta
```

## Install / run locally

```sh
bb plugin install .   # path install (register in place)
bb plugin reload dkam # after changing server.ts
bb dkam status        # try the CLI
```

## Test

```sh
npm test   # vitest run — contract conformance over docs/domain-architecture/events/
```

The command is also declared in the root `AGENTS.md` under `## Test command`.
Plugin runtime tests (CLI behavior against a live server) are TBD.

## Deploy

Two-stage pipeline (staging + production) scripts live in `scripts/staging/`:
`deploy.sh`, `e2e.sh`, `teardown.sh`. The branch name is the staging identity.
See `~/.agents/agents-md-detail/two-stage-pipelines.md`.

## Local dev notes

- No frontend bundle; there is no `bb plugin dev` app watch. Rebuild and
  `bb plugin reload dkam` after edits.
- Settings are read once per load — reload after changing one
  (`bb plugin config dkam`).
- The TTS API key is a secret setting; it is stored server-side and never
  sent to the frontend. Request it through the secrets flow, never paste it
  in chat.
- Agent-graph dependency: `bb dkam recap` and `state_snapshot` need the
  agent-graph plugin serving
  `GET /api/v1/plugins/agent-graph/http/graph?threadId=<id>`.