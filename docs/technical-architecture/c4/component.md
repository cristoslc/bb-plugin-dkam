# C4: Components

Components inside the DKAM plugin container (see
[container.md](container.md)). Detail that exists in code is verifiable in
`server.ts`; TODO components are named with their planned registration.

```mermaid
flowchart TB
    subgraph plugin["DKAM plugin (server.ts factory)"]
        cli["CLI\nbb dkam status|watch|unwatch|recap"]
        tool["state_snapshot\nagent tool"]
        registry["Watch registry\n(bb.storage.kv → SQLite)"]
        graphclient["GraphClient\nanticorruption layer"]
        summarizer["Graph summarizer\n(render Graph → speakable text)"]
        watcher["DriftWatcher\n(background service, TODO)"]
        channel["PhoneChannel\n(experimental_websocket /dkam, TODO)"]
        settings["Settings\nTTS key, mode, episode length"]
    end

    cli --> registry
    tool --> graphclient
    cli --> graphclient
    graphclient --> summarizer
    watcher --> graphclient
    watcher --> registry
    channel --> registry
```

| Component | Surface | Status |
|---|---|---|
| CLI | `bb.cli.register(defineCli(...))` | implemented |
| `state_snapshot` tool | `bb.agents.registerTool`, zod | implemented (stub output) |
| Watch registry | `bb.storage.kv` | implemented (KV) |
| Settings | `bb.settings.define` | implemented |
| GraphClient | `fetchGraph` + `summarizeGraph` in `server.ts` | fetch implemented; summarizer stub |
| DriftWatcher | `bb.background.service("drift-watcher")` | TODO |
| PhoneChannel | `bb.http.experimental_websocket("/dkam")` + HTML | TODO |
| Action queue | deferred consequential actions | TODO |

## Sequence: operator pulls a state snapshot

```mermaid
sequenceDiagram
    actor Op as Operator (phone)
    participant PC as PhoneChannel
    participant S as Supervision (GraphClient + summarizer)
    participant AG as agent-graph

    Op->>PC: "where am I?" (voice)
    PC->>S: snapshot.requested(threadId)
    S->>AG: GET /api/v1/plugins/agent-graph/http/graph?threadId
    AG-->>S: Graph JSON
    S->>S: summarizeGraph(Graph)
    S-->>PC: snapshot.delivered(threadId, text)
    PC-->>Op: TTS speaks the snapshot
```

## Sequence: drift alert and episode boundary

```mermaid
sequenceDiagram
    participant W as DriftWatcher
    participant S as Supervision
    participant PC as PhoneChannel
    participant Op as Operator (phone)

    loop each poll interval
        W->>S: fetchGraph(threadId)
        S->>S: compare activity vs intent anchor
        alt drift judged
            S->>PC: drift_alert.raised(threadId, anchor, observed, severity)
            PC->>Op: TTS interrupt
        else episode cap reached
            S->>PC: episode.boundary_reached(threadId, n, elapsed)
            PC->>Op: TTS boundary announcement
            Note over S: working thread held until re-grounding
        end
    end
```

Deployment and container views: [context.md](context.md),
[container.md](container.md), [deployment.md](deployment.md).