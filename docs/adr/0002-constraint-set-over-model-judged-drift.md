# ADR-0002: Constraint set checked by code, not drift judged by a model

Date: 2026-09-26
Status: adopted
Supersedes: the drift-detection and phone-channel direction in ADR-0001 (the
headless-plugin decision and the agent-graph contract in ADR-0001 stand)

## Context

ADR-0001 fixed the plugin shape. It did not fix how DKAM decides that a running
agent has gone wrong. The first design assumed a prose intent anchor judged by a
model, with alerts delivered over a phone channel.

Three lines of evidence killed that design.

**1. Model-judged drift does not work.** *From Confident Closing to Silent
Failure* (arXiv 2606.09863) measures false success at 45 to 48 percent on
tau2-bench single-control domains and 75.8 percent on AppWorld coding
trajectories that make explicit status claims. No LLM judge configuration
across five judges, five prompt strategies, and full task specifications beat
AUROC 0.65; judges anchor on confident closing language rather than verified
state. Cheap lexical detectors reach 0.83 to 0.95 on the same trajectories.
The paper's own recommendation is lightweight, domain-calibrated detectors as
triage rather than an LLM judge as monitor.

**2. The operator's corrections are not judgments, they are declarations.**
Sampling 13,905 short operator-typed messages from the opencode history yields
260 corrections. They cluster on named prohibitions and named preferences:
household value terms versus valueflows vocabulary, economic event versus
journal entry as the primary entity, a kbase builder versus a docs generator.
Each is expressible as a checkable rule. None requires a model to interpret
prose.

**3. A desk requirement defeats the purpose.** The operator's requirement is
that he does not return to the desk. Any design that routes a class of decision
to a desk review has not solved the problem, it has relocated it.

## Options considered

1. **Keep model-judged drift against a prose anchor.** Rejected: the detector
   is the component with measured failure (AUROC 0.65), and its false negatives
   land precisely on the runs where nobody is watching.
2. **Route unspeakable corrections to a desk queue.** Rejected: violates the
   standing requirement, and hands-free review is a three-way divided-attention
   task with no supporting ergonomics literature.
3. **Compile the operator's semantics into a declarative constraint set that
   code checks at turn boundaries, speak only mechanical violations, and treat
   uncovered decisions as stated assumptions that do not block.** Adopted.

## Decision

Option 3.

- The intent anchor is replaced by a **ConstraintSet**: ordered `Rule` records,
  each with an id, a check kind (banned terms, required terms, declared value,
  path prohibition, required artifact), a payload, and a one-word spoken fix.
- A **RuleViolation** is raised only by a mechanical check. No model participates.
- A decision no rule covers becomes an **Assumption**: the agent states the
  default it took in one sentence and continues. It never blocks on a human.
- An unanswered violation **parks** the run at the next safe step and holds.
  It resumes on any later input. It never waits at a permission prompt.
- Alerts speak rule id plus fix, because a name is speakable and an argument
  is not. Voice verbs stay a fixed one-word vocabulary for the same reason.
- Consequential actions remain deferred, expressed as hard invariants: no merge
  or push to a trunk branch while the run is unattended.

## Consequences

- The checkable surface grows with the operator's declarations. Novel semantics
  are not detected, they are declared. This is the deliberate trade: a missed
  detection is replaced by a rule the operator writes once.
- Assumptions can be wrong and land in the repository. Mitigation is the ledger:
  every assumption is recorded, counted aloud, and reviewable in one batch. The
  run is never blocked waiting for that review.
- Pre-declared rules also improve desk-mode work, since the same checks run
  whether or not the operator is away. That is the only part of this design
  that the local history independently supports.
- ADR-0001's agent-graph contract is retained but demoted: the graph is a
  read-only source of verified facts, not the substrate for a drift judgment.

## Evidence trail

- Local: `~/.local/share/opencode/opencode.db` (4,950 sessions, 18,303
  user-role messages) and `~/.bb/bb.db` (129 threads, 589 accepted inputs, 569
  arriving mid-turn, 28 manual stops).
- External: arXiv 2606.09863 (verified directly); Brewer et al. 2011 on
  divided attention and implementation intentions, which is the basis for
  pre-committing rules instead of relying on recall.
