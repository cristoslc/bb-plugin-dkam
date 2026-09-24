# bb-plugin-dkam

DKAM — Distracted Keyboardless Agent Mode. A BB plugin that provides a
metacognitive support layer for hands-free agentic coding: the operator is
walking or biking, with no screen and no keyboard.

## Why

An agent running unattended for long stretches drifts. When the operator
cannot look at a screen, there is no cheap way to notice:

- **Working memory evaporates.** "What is it doing right now?" has no answer
  without a screen. DKAM externalizes that: an on-demand state snapshot the
  operator pulls by voice.
- **Drift is invisible.** An agent quietly wandering off the stated task is
  the most expensive failure mode in hands-free use, because it costs the
  whole walk. DKAM anchors each episode to a stated intent and interrupts
  when activity diverges.
- **Marathons burn context and attention.** Long unattended runs compound
  errors. DKAM caps working-thread runs to ~5-10 minute "episodes" and forces
  a re-grounding at each boundary.
- **Consequential actions are dangerous at speed.** Commits, pushes, and
  deletes made while the operator is mid-intersection cannot be reviewed in
  the moment. DKAM queues them with a heads-up for review at a stop or back
  at the desk.
- **The phone is the only screen.** DKAM serves a websocket HTML page
  ("phone channel") that speaks recaps and drift alerts via TTS and accepts
  voice input, transcribed through BB's existing voice transcription
  service.

DKAM does NOT narrate agent output. It is a metacognitive layer, not a
newsreader.

## Architecture

```
┌──────────────┐        ┌───────────────────┐        ┌────────────────┐
│ Operator     │◄──────►│ Meta thread       │───────►│ Working thread │
│ (phone,      │ phone  │ (intent anchor,   │ reads  │ (muted, does   │
│ walking)     │ channel│ metacognition)    │ state  │  the work)     │
└──────────────┘        └───────────────────┘        └────────────────┘
                              │ via GET /api/v1/plugins/agent-graph/http/graph
                              ▼
                        agent-graph plugin
```

- **Meta thread** — the operator's interface thread. Holds the intent anchor,
  runs the metacognitive prompts, communicates via the phone channel.
- **Working thread(s)** — ordinary BB threads, muted to the operator.
- **Phone channel** — `bb.http.experimental_websocket("/dkam")` plus a served
  HTML page.

The sole integration point with the agent-graph plugin is:

```
GET /api/v1/plugins/agent-graph/http/graph?threadId=<id>
```

which returns the `Graph` JSON model of the working thread's activity.

## Status: scaffold

This repository is a scaffold. Implemented so far:

- `bb dkam status | watch | unwatch | recap` CLI (`defineCli`-based)
- `state_snapshot` agent tool (zod-parameterized)
- Settings: TTS API key (secret), operator mode, episode length
- Watch registry (KV-backed)

Marked TODO (stubbed on purpose):

- Drift watcher background service (`bb.background.service`)
- Phone channel websocket + HTML page (`bb.http.experimental_websocket`)
- Graph summarization of agent-graph output
- Episode boundary logic and re-grounding
- Consequential-action queue
- Test suite (test command TBD, see AGENTS.md)

## Development

```sh
npm install
bb plugin install .
bb plugin build   # verify it compiles
bb dkam status    # try the CLI
```