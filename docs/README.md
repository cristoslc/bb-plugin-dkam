# docs/

Documentation for DKAM, split into two architectural surfaces plus
cross-cutting hubs. Read a hub first; drill into spokes for detail.

**Domain architecture** (what DKAM means to its domain experts):
- [DOMAIN-MODEL-L1.md](DOMAIN-MODEL-L1.md) — L1 prose glossary (surface, no hub above it)
- `domain-architecture/` — context map, cross-context events, L2 model, event contracts

**Technical architecture** (how DKAM is built and deployed):
- [ARCHITECTURE.md](ARCHITECTURE.md) — hub → `technical-architecture/`

**Cross-cutting:**
- [DEVELOPER-WORKFLOWS.md](DEVELOPER-WORKFLOWS.md) — build, test, deploy
- [USER-EXPERIENCE.md](USER-EXPERIENCE.md) — operator experience, journeys
- `adr/` — numbered decision records
- `plans/` — implementation plans
- `musings/` — pre-artifact thought capture
- `retros/` — post-session reflections
- `tech-debt/` — logged debt too complex to fix inline
- `agents-detail/` — project-specific agent guidance (see root AGENTS.md)

See also [../AGENTS.md](../AGENTS.md) and [../PURPOSE.md](../PURPOSE.md).