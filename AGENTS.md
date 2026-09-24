# AGENTS.md

## Purpose

See [PURPOSE.md](PURPOSE.md) for the one-paragraph outcome this project
exists to deliver.

## Project purpose

DKAM (Distracted Keyboardless Agent Mode) is a BB plugin providing a
metacognitive support layer for hands-free agentic coding — the operator is
walking or biking, with no screen and no keyboard.

DKAM does NOT narrate agent output. It:

1. **Externalizes working memory** — a "state snapshot" the operator pulls on
   demand ("where am I"), summarizing what the working thread is doing.
2. **Monitors for drift** — compares the working thread's activity against a
   stated episode intent anchor and interrupts when the agent diverges.
3. **Manages episodes** — caps working-thread runs to ~5-10 minutes and forces
   re-grounding at episode boundaries.
4. **Defers consequential actions** — commits/pushes/deletes are queued with a
   heads-up, reviewed at a stop or back at desk.
5. **Provides a phone channel** — a websocket-served HTML page for TTS output
   and voice input.

## Architecture

- **Meta thread** — the operator's interface thread. Holds the intent anchor,
  runs the metacognitive prompts, communicates with the operator via the
  phone channel.
- **Working thread(s)** — ordinary BB threads, muted to the operator. The
  meta thread reads their state via agent-graph's HTTP endpoint.
- **Phone channel** — `bb.http.experimental_websocket("/dkam")` plus a served
  HTML page. Carries recaps and drift alerts; receives voice (transcribed via
  BB's existing voice transcription AI service).

## Interface contract with agent-graph

The sole integration point between DKAM and the agent-graph plugin:

```
GET /api/v1/plugins/agent-graph/http/graph?threadId=<id>
```

Returns the `Graph` JSON model of that thread's activity. Nothing else is
assumed about agent-graph's internals.

## Key BB plugin surfaces used

- `bb.cli.register(defineCli(...))` — `bb dkam status|watch|unwatch|recap`
- `bb.agents.registerTool` — the `state_snapshot` tool (zod-parameterized)
- `bb.settings.define` — TTS API key (secret), operator mode, episode length
- `bb.storage.kv` / `bb.storage.database()` — watch registry and later state
- `bb.background.service` — drift watcher (TODO)
- `bb.http.experimental_websocket` — phone channel (TODO)
- `bb.server.loopbackBaseUrl` — base URL for agent-graph HTTP calls

## Conventions

- Headless plugin: no `bb.app`, no frontend bundle.
- New experimental BB surfaces keep the `experimental_` prefix.
- Scaffold stubs are marked with `TODO` comments; do not silently remove them
  without implementing the subsystem.

## Test command

TODO: not yet determined. Once tests exist, declare the command here.

## Navigation

Project navigation, hubs, and spokes: [docs/agents-detail/project-navigation.md](docs/agents-detail/project-navigation.md).