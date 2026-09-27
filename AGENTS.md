# AGENTS.md

## Purpose

See [PURPOSE.md](PURPOSE.md) for the one-paragraph outcome this project exists
to deliver.

## Current state

**Nothing is implemented.** The design lives in [docs/HANDOFF.md](docs/HANDOFF.md),
which is authoritative. Read it before doing anything in this repo. It contains
the operator evidence, the two-sided design, the seam that keeps a model out of
any halt/allow/veto path, the target module layout, the milestone order, and the
afternoon-long experiment that validates or kills the premise.

Do not add, and do not reintroduce:

- drift detection, semantic or otherwise
- a prose intent anchor
- a model in any path that can halt, allow, or veto an action
- narration of agent output
- any design that requires a decision at a desk
- any API-key setting; voice uses bb's configured service, output uses the Web
  Speech API

## Architecture

One headless BB plugin entry, `server.ts`, with no `bb.app` and no frontend
bundle. Target module layout and the planned BB surfaces are listed in
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Interface contract with agent-graph

The single read point, used only as a source of verified facts:

```
GET /api/v1/plugins/agent-graph/http/graph?threadId=<id>
```

## Conventions

- New experimental BB surfaces keep the `experimental_` prefix.
- Stubs are marked `TODO` with the milestone they belong to. Do not remove a
  stub without implementing the subsystem it stands for.
- Docs are written for a cold reader. No references to superseded drafts, and no
  narrative of how a decision evolved. If a decision changed, the current
  reasoning is written as if it were always the reasoning.
- Domain and technical documentation are written after the code exists,
  spec-first, not before.

## Test command

```
npm test
```

`vitest run --passWithNoTests`. There are currently no automated tests.

**Declared exemption:** this project has no tests until milestone 1 (the duty
log) lands. The reason is that the only tests that existed guarded event
specifications for a design that has been removed, and there is no runtime to
test yet. The command is declared and runnable so that the first real test
needs no setup change. Test coverage requirements resume at milestone 1.

## Navigation

Project navigation, hubs, and spokes: [docs/agents-detail/project-navigation.md](docs/agents-detail/project-navigation.md).
