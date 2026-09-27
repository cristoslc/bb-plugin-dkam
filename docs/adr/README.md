# Architecture Decision Records

Numbered decision records for DKAM.

- Files: `NNNN-decision-title.md`, starting at `0001`.
- Each record: Context, Options considered, Decision, Consequences.
- Lifecycle: `proposed` → `adopted` → (later) `superseded` by a newer record
  that names it. Superseded records stay for history.
- No hub file — this README is the only index besides the file list itself.

## Records

- `0001-headless-plugin-and-agent-graph-contract.md` — headless single-process
  plugin; agent-graph endpoint as sole read point (adopted)

The mandate-and-comms design is not recorded here yet. It is held in
[HANDOFF.md](../HANDOFF.md) until milestone 1 proves it, at which point it
becomes ADR-0002. `0002` was previously used by a record that has been removed;
the number is deliberately not reused.
