# Tech stack

| Concern | Choice | Notes |
|---|---|---|
| Language | TypeScript (strict) | `tsconfig.json` target ES2022, bundler resolution |
| Runtime | Node 22 (BB host) | plugins load as ESM TypeScript directly |
| BB Plugin SDK | `@get-bb/plugin-sdk` 0.5.9 | `engines.bb >= 0.43` |
| Validation | zod 4 | tool parameters, RPC contracts |
| Storage | `bb.storage.kv` (now), `bb.storage.database()` (planned) | plugin-scoped SQLite `data.db` |
| HTTP | `bb.http.experimental_websocket` (planned) | phone channel |
| Background | `bb.background.service` (planned) | drift watcher |
| Build | `bb plugin build` | emits `dist/server.js` + map + meta |
| Tests | TBD | command will be declared in AGENTS.md once a suite exists |

The SDK declaration packages (`better-sqlite3`, `hono`, `@types/react*`) are
devDependencies only because the SDK's bundled types import them — none are
used by DKAM code directly.