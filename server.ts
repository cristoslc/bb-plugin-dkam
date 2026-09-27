// bb-plugin-dkam — headless backend entry.
//
// DKAM is a mandate layer. The operator (the Captain) states a mission and its
// boundaries; the agent chooses means, executes inside those boundaries, and
// records every call it made on its own authority. DKAM has two halves:
//
//   Mandate — the job card, the rules of engagement, harness-side enforcement
//             that never asks a human, and the duty log.
//   Comms   — one end-of-run report, and a hands-free channel that speaks only
//             what cannot wait: one sentence, one number or name, one word back.
//
// The authoritative design is docs/HANDOFF.md. Nothing is implemented yet.
//
// Milestones, in order (from the handoff):
//   1. Duty log: an agent tool appends a call plus a reason; `bb dkam decisions`
//      prints it. No voice, no enforcement, no reporting.
//   2. ROE enforcement: one rule, trunk-merge refusal, implemented in the
//      harness so the agent adapts rather than stalls.
//   3. The end-of-run report, composed from the duty log.
//   4. Voice: stop, where am I, decisions. transcribeVoice in, Web Speech out.
//   5. The experiment: one real thread, one real job card, operator walks away.
//
// Before milestone 1, do not add drift detection, a prose intent anchor, an
// LLM in any halt/allow/veto path, or narration of agent output. The handoff
// explains why each of those was removed.
import type { BbPluginApi } from "@get-bb/plugin-sdk";

export default async function plugin(bb: BbPluginApi) {
  bb.log.info("dkam loaded — no subsystems registered yet, see docs/HANDOFF.md");

  // Milestone 1 registers:
  //   bb.agents.registerTool  — duty_log_append(call, reason)
  //   bb.cli.register         — `bb dkam status | decisions | report`
  //   bb.settings.define      — run settings, no secrets
  // and stores job cards, the duty log, and the ROE via bb.storage.
}
