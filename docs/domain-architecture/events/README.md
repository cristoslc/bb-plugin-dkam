# Event contract specs

YAML specs for DKAM's integration events — machine-checkable contracts for
data crossing context boundaries (Supervision ↔ Phone Channel, and inbound
from agent-graph). Narrative table: [../DOMAIN-EVENTS.md](../DOMAIN-EVENTS.md).

Each spec validates against the meta-schema in
[schemas/event-spec.schema.yaml](schemas/event-spec.schema.yaml); conformance
is enforced by `npm test` (vitest, `tests/contracts.test.ts`), including an
inverse malformed-spec test. Standard:
`~/.agents/agents-md-detail/integration-contracts.md`.

Specs (all `version: 1`, `since: 1`):

- `drift-alert-raised.yaml` — DriftAlertRaised
- `episode-boundary-reached.yaml` — EpisodeBoundaryReached
- `action-queued.yaml` — ActionQueued
- `snapshot-requested.yaml` — SnapshotRequested
- `snapshot-delivered.yaml` — SnapshotDelivered
- `voice-transcribed.yaml` — VoiceTranscribed
- `graph-state-read.yaml` — GraphStateRead

Events are spec-first: the YAML spec lands before the producing code, and a
new event ships with its spec and conformance tests in the same change.