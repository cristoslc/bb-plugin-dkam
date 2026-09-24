# Integration events (crossing bounded contexts)

Events below cross a DKAM context boundary (Supervision ↔ Phone Channel) or
arrive from foreign contexts (BB core, agent-graph). Formal YAML specs for
each event live in [events/](events/) as they are implemented.

| Event | Producing context | Consuming context | Payload shape | Delivery |
|---|---|---|---|---|
| `drift_alert.raised` | Supervision | Phone Channel | threadId, anchor, observed, severity | websocket message → TTS |
| `episode.boundary_reached` | Supervision | Phone Channel, Supervision | threadId, episodeNumber, elapsed | websocket → TTS; re-grounding prompt |
| `action.queued` | Supervision | Phone Channel | threadId, kind (commit/push/delete), summary | websocket → TTS heads-up |
| `snapshot.requested` | Phone Channel | Supervision | threadId | websocket in |
| `snapshot.delivered` | Supervision | Phone Channel | threadId, text | websocket → TTS |
| `voice.transcribed` | Phone Channel | Supervision | text, confidence | websocket in (BB voice transcription) |
| `graph.state_read` | agent-graph (foreign) | Supervision | Graph JSON | HTTP GET poll |

Rules:

- Internal events within a single context do not belong here.
- Every event implemented in code gets a YAML spec under `events/` with
  contract-conformance tests, per the integration contracts standard.