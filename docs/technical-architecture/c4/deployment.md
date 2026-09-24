# C4: Deployment

```mermaid
flowchart LR
    subgraph host["BB host machine"]
        server["BB server\n+ DKAM plugin"]
    end
    phone["Operator's phone\n(phone channel page)"]

    server -- "BB Connect port share / public URL" --> phone
```

- DKAM installs as a BB plugin (path install for development, git install for
  distribution). It runs inside the BB server process on the host machine.
- The phone channel must be reachable from the operator's phone. BB Connect
  (`bb connect expose <port>`) provides the remote URL; localhost URLs do not
  work remotely.
- No containers, no separate processes beyond BB's own background service
  worker for the plugin.
- Environments: the operator's main BB installation is the only deployment
  target today; a staging target will follow the two-stage pipeline mandate
  in `scripts/staging/`.