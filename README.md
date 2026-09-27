# DKAM

A BB plugin that lets one operator supervise a running coding agent while being
away from every screen, and never have to return to a desk to unblock the work.

The operator states a mission and its boundaries. The agent chooses means,
executes inside those boundaries, and records every call it made on its own
authority. DKAM enforces the boundaries outside the agent so nothing ever waits
for a human, keeps a duty log of those calls, and speaks at most one report per
run.

## Status

**Design only. Nothing is implemented.**

The design, the evidence it rests on, the milestone order, and the experiment
that validates or kills the premise are all in
[docs/HANDOFF.md](docs/HANDOFF.md). Read that first.

## Why it is shaped this way

The operator drives an agent by talking to it inside a running turn, and stops
or corrects it often. The interruptions are not caused by agents going off
track. They are caused by ordinary protocol friction: the agent stops to ask,
hands back something incomplete, fans out before anyone looked, and the operator
thinks of a question mid-run.

So the design removes the reasons the channel is needed, rather than adding a
watcher:

- **Assume and proceed.** Reversible decisions are taken and logged, not
  announced and not asked about.
- **Enforce outside the agent.** The harness refuses out-of-bounds actions; the
  agent adapts instead of stalling. An agent that needs a permission is a defect
  in the mandate.
- **Log the judgment calls.** The duty log is the artifact, written in the
  operator's language, with the reason for each call.
- **Interrupt almost never.** Nothing inside the boundaries ever wakes anyone.
  One report at the end, plus anything irreversible.
- **No model in the safety path.** Deciding whether to halt is where language
  models measurably fail. Compressing state into a sentence a human can act on
  is where they are fine. Those are different jobs with different failure costs.

## Layout

```
server.ts          headless plugin entry, currently a stub
docs/HANDOFF.md    the design
docs/ARCHITECTURE.md  target modules and planned BB surfaces
docs/adr/          decision records
scripts/staging/   two-stage pipeline stubs
```

## Verify

```sh
npm install
npm run typecheck
npm test        # no tests yet; see the exemption in AGENTS.md
npm run build
```

## License

Private.
