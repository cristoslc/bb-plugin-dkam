# docs/

Documentation for DKAM. One file matters right now:

- [HANDOFF.md](HANDOFF.md) — **authoritative.** The design: operator evidence,
  the mandate and comms halves, the model seam, target modules, milestone order,
  open questions, and the experiment that validates or kills the premise.

Everything else is either a thin hub that will grow, or deliberately empty until
there is code to describe.

**Hubs:**
- [ARCHITECTURE.md](ARCHITECTURE.md) — technical surface, target module layout,
  planned BB surfaces, the agent-graph read contract
- [DEVELOPER-WORKFLOWS.md](DEVELOPER-WORKFLOWS.md) — build, install, verify

**Deliberately empty until code exists:**
- `domain-architecture/` — the domain model is rebuilt spec-first after
  milestone 1, not before
- `technical-architecture/` — C4 and tech-stack detail follow the code

**Cross-cutting:**
- `adr/` — numbered decision records
- `plans/` — implementation plans
- `musings/` — pre-artifact thought capture
- `retros/` — post-session reflections
- `tech-debt/` — logged debt too complex to fix inline
- `agents-detail/` — project-specific agent guidance (see root AGENTS.md)

See also [../AGENTS.md](../AGENTS.md) and [../PURPOSE.md](../PURPOSE.md).
