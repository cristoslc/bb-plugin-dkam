# Integration events (crossing bounded contexts)

Events below cross a DKAM context boundary (Supervision ↔ Phone Channel) or
arrive from foreign contexts (BB core, agent-graph). Each has a
machine-checkable YAML spec in [events/](events/), validated against
`events/schemas/event-spec.schema.yaml` by `npm test`.

| Event | Spec | Producing context | Consuming context | Delivery | Status |
|---|---|---|---|---|---|
| `DriftAlertRaised` | [events/drift-alert-raised.yaml](events/drift-alert-raised.yaml) | Supervision | PhoneChannel | websocket → TTS | spec'd, unimplemented |
| `EpisodeBoundaryReached` | [events/episode-boundary-reached.yaml](events/episode-boundary-reached.yaml) | Supervision | PhoneChannel, Supervision | websocket → TTS; re-grounding prompt | spec'd, unimplemented |
| `ActionQueued` | [events/action-queued.yaml](events/action-queued.yaml) | Supervision | PhoneChannel | websocket → TTS heads-up | spec'd, unimplemented |
| `SnapshotRequested` | [events/snapshot-requested.yaml](events/snapshot-requested.yaml) | PhoneChannel | Supervision | websocket in | spec'd, unimplemented |
| `SnapshotDelivered` | [events/snapshot-delivered.yaml](events/snapshot-delivered.yaml) | Supervision | PhoneChannel | websocket → TTS | spec'd, unimplemented |
| `VoiceTranscribed` | [events/voice-transcribed.yaml](events/voice-transcribed.yaml) | PhoneChannel | Supervision | websocket in (BB voice transcription) | spec'd, unimplemented |
| `GraphStateRead` | [events/graph-state-read.yaml](events/graph-state-read.yaml) | AgentGraph (foreign) | Supervision | HTTP GET poll | spec'd, unimplemented |

Rules:

- Internal events within a single context do not belong here.
- Spec-first: the YAML spec under `events/` is written (and conformance-tested)
  before the producing code. A spec change is either safe (additive, optional)
  or breaking — breaking changes bump `version` and deprecate first, remove
  later.
- `AgentGraph` is a foreign context; DKAM cannot change its contract. The
  `GraphStateRead` spec describes what DKAM consumes, not what agent-graph
  must serve — the wire contract it depends on is fixed in AGENTS.md.