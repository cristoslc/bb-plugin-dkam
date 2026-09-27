# Developer workflows

## Read first

[docs/HANDOFF.md](HANDOFF.md) is authoritative, including the milestone order
and the list of things not to build. Do not start from this file.

## Build

```sh
npm install
npm run typecheck   # tsc --noEmit
npm run build       # bb plugin build -> dist/
```

## Install and reload

```sh
bb plugin install .    # path install, registers in place
bb plugin reload dkam  # after editing server.ts
```

There is no CLI surface yet. Milestone 1 adds `bb dkam status | decisions |
report`.

## Test

```sh
npm test
```

`vitest run --passWithNoTests`. No tests exist yet; the exemption and its reason
are declared in the root `AGENTS.md`. Coverage requirements resume at
milestone 1, which is the duty log: append, render, query, and the invariant
that every entry carries a reason.

## Deploy

Two-stage pipeline scripts live in `scripts/staging/`, keyed on the branch name
as the staging identity. All three are stubs that fail loud with a `TODO`; there
is no staging target yet.

## Definition of done for a milestone

- `npm run typecheck` clean
- `npm test` passing, with at least one failure-expecting test written before
  the fix it validates
- `npm run build` emits `dist/`
- `AGENTS.md` and `HANDOFF.md` updated if the design moved, written for a cold
  reader with no references to superseded drafts
