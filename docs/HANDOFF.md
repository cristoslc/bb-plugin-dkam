# DKAM — Handoff

Status: design starting point. Nothing here is implemented.
Date: 2026-09-26

This document is the whole current understanding, written to be read cold. It
replaces the existing DKAM documentation rather than amending it.

---

## 1. What DKAM is

DKAM is a BB plugin that lets one operator supervise a running coding agent
while being away from every screen, and never have to return to a desk to
unblock the work.

The relationship it implements is a **mandate**, not a monitor. The operator is
the Captain. The agent is a lieutenant with delegated authority. The Captain
states the mission and the boundaries. The lieutenant chooses means, executes,
records every call it made on its own authority, and reports. The Captain may be
absent. Absence is the normal case, not the failure case.

DKAM is two systems in one plugin:

- **The mandate model** — what the agent is allowed to do, what it is not, and
  what it must write down.
- **The comms model** — how the Captain hears from it, and how rarely.

Both are required. The mandate makes absence safe. The comms make absence
tolerable.

---

## 2. The operator, as measured

These are the facts the design is built on. They come from the operator's own
bb and opencode histories, sampled in September 2026.

| Observation | Value |
|---|---|
| Messages sent into an already-running turn | 569 of 589 |
| Threads with at least one mid-turn message | 126 of 129 |
| Manual stops of a running turn | 28 |
| Turn aborts in opencode | 994 of 16,323 turns |
| Tool calls that failed | 4,545 of 186,102 |
| Operator messages opening with "no" or "nope" | 1.9% |
| Operator messages containing don't / stop / undo / revert | 4.7% |
| Operator messages re-anchoring ("again", "as I said") | 1.9% |
| Agent-initiated questions in bb | 3 |

The operator drives by talking. He stays inside the turn, corrects in short
blunt words, and kills runs that are going wrong. He runs 10+ agents
concurrently and loses track of which is which.

### Why an operator interrupts a running turn

607 mid-turn messages were extracted and read. Of the 464 short enough to
classify:

| Cause | Share |
|---|---|
| A question asked of the running agent | 34% |
| A correction or rejection | 19% |
| Adding scope or naming the next step | 14% |
| A bare approval ("go", "yes", "very well, make it so") | 8% |
| A product bug noticed while watching | 1% |

The corrections cluster into three kinds:

- **Incomplete work.** Gaps found by inspecting the result, for example missing
  session-agent mappings or missing history on one thread.
- **Wrong shape, visible on screen.** Pixel and proportion corrections on output
  the operator was already looking at.
- **Unintended side effects.** Work fanning out further than intended, or
  visuals changing that were not asked for.

Almost none of this is an agent going off track on its own. It is the ordinary
friction of driving a capable agent: it stops to ask, it hands back something
incomplete, it fans out before anyone looked, and the operator thinks of a
question mid-run. **The design problem is the interaction protocol, not
supervision.**

---

## 3. Mission and non-goals

**Mission.** Keep the Captain's judgment in the loop on work that is running
without them, at a cost of one spoken line and one spoken word.

**Non-goals.**

- No narration of agent output. Ever.
- No drift detection, semantic or otherwise.
- No model in any path that can halt, allow, or veto an action.
- No design where a decision must be taken at a desk.
- No dashboard. The phone is an accessory, not a surface.

---

## 4. Part A — The mandate model

### 4.1 The job card

Every supervised run is governed by a job card, written by the operator or by
the orchestrator that spawned the run:

```yaml
mission: move auth off cookies onto the session store
done_when: tests green and login route untouched
scope:
  may_touch: [src/auth/**, tests/auth/**]
  must_not_touch: [src/auth/login.ts, docs/adr/**]
```

The job card is authored upstream, by the orchestrator, not by DKAM. DKAM reads
it and holds the run to it. If the boundary is wrong, that is an orchestration
bug and it is fixed there.

### 4.2 Rules of engagement

The ROE is the set of things the run may not do unattended. It is enforced
**outside the agent**, by the harness, not requested by the agent:

- No merge to a trunk branch while unsupervised.
- No push to a trunk branch while unsupervised.
- No write outside `scope.may_touch`.
- No deletion outside an explicit allowance.
- Spend ceilings per run and per day.

When the harness refuses an action, the agent receives a tool error and adapts.
It does not ask the operator, and it does not stall. An agent that needs a
permission is a defect in the mandate, not a request for a human.

### 4.3 Delegated authority: assume and proceed

For any reversible decision, the lieutenant picks the most defensible default
and continues. It does not announce, and it does not ask.

Silence is not consent. It is the absence of a question.

Every such decision is written to the duty log. The Captain is not interrupted;
the decision is available for review afterwards, in the Captain's own terms.

The only things that earn an interruption are irreversible actions, and actions
whose being wrong wastes substantial work.

### 4.4 The duty log

The duty log is the product artifact. It is not telemetry. It is the record of
every judgment call the run made on its own authority, written so a human can
read it in one pass:

```
Called without asking:
- treated economic event, not journal entry, as the primary entity
  (matches the Cove domain model; the alternative would have inverted
  every downstream aggregate)
- put the new terms in the glossary rather than the plan, per house style
- read the Copilot sessions as unmappable and skipped 88 of them
```

Rules for the log:

- Every entry states the call **and** the reason.
- Entries are written in the operator's vocabulary, not the agent's.
- Nothing is aggregated into counts. "88 skipped" is worthless. "The Copilot
  sessions cannot be mapped, everything else is in" is the useful form.
- A count may appear, but only as support for a sentence, never as the entry.

### 4.5 The report

One interruption per run, at the end, containing:

1. What changed, in one sentence.
2. Every call made on its own authority, from the duty log.
3. Anything refused by the ROE, and what the run did instead.
4. Whether the done condition is met, and if not, why.

---

## 5. Part B — The comms model

### 5.1 Interruption budget

An interruption is expensive and attention is scarce. Therefore:

- Nothing inside the ROE ever interrupts.
- Reversible decisions never interrupt.
- One interruption per run for the report.
- One interruption per ROE refusal, spoken once.

Everything else is pull. The Captain asks, and the answer is short.

### 5.2 What the Captain can do, hands-free, with no screen

| Verb | Effect |
|---|---|
| "where am I" | One sentence of verified fact: tests, files, minutes, current activity |
| "status" | Same, shorter |
| "stop" | Guaranteed halt of the run, confirmed aloud |
| "decisions" | Play back the duty log, newest first, one call per line |
| "quiet" | Suppress optional speech until the report; the run continues |

Push-to-talk, not always-on. Wind and motion degrade transcription, and a
fixed vocabulary is the only thing reliably recognised while walking. A
transcript outside this vocabulary is logged, never obeyed.

### 5.3 Transport

- **Voice in:** `api.system.transcribeVoice` on the plugin SDK, using the
  voice service already configured for bb.
- **Voice out:** the Web Speech API in the phone page. No vendor, no key.
- **Batched, non-urgent items:** bb's built-in `push-notifications`.

No custom TTS provider, no API key setting, no bespoke notification path.

### 5.4 Language rules for anything spoken

- One sentence. One number or one name. At most one action word.
- Say the thing that matters, not the size of the thing.
- If it cannot be said in one sentence, it is not for the channel; it goes in
  the report.

---

## 6. The seam: what may use a model

This is the line that keeps the design honest.

| Job | Model? | Why |
|---|---|---|
| Deciding to halt, allow, or veto | **Never** | LLM judges top out near AUROC 0.65 at detecting false success; cheap lexical detectors reach 0.83 to 0.95 on the same trajectories. A bad verdict here is a destructive action. Source: *From Confident Closing to Silent Failure*, arXiv 2606.09863. |
| Enforcing the ROE | **Never** | Mechanical, or it is not enforcement. |
| Compressing state into a sentence a human can act on | **Yes** | A bad compression produces a bad sentence, not a bad action. |
| Rendering a duty log entry in operator vocabulary | **Yes** | Same reason. |

Reading the evidence correctly: the measured failure is a model *inferring
whether a run went wrong*. It is not a model *writing the sentence about what
happened*. Those are different jobs with different failure costs.

---

## 7. The working prototype: overnight autonomy

The operator already runs this shape for the sleeping case. Overnight autonomy
delegates authority, states boundaries, suppresses interruptions, and produces
a morning briefing. That briefing is a duty log in prose.

DKAM's honest claim is therefore narrow and testable: do the same thing when
the operator is walking rather than asleep, and make the duty log a real
artifact rather than a paragraph in a chat window. Everything proposed here
should be measured against that bar, and the overnight path is the reference
implementation to harden rather than a competitor.

---

## 8. What a clean start means

### Delete

The existing domain model, the L1 and L2 documents, the context map, and all
seven event specifications. The concepts they encode — prose intent, drift
judged by a model, episode caps, narrative phone channel, action queue for
operator review — are not part of this design. The conformance test suite goes
with them and is replaced by tests for the mandate and comms paths.

### Keep

The packaging. `bb plugin new` output, the CLI registration pattern, the
build and test commands, the agent-graph read contract as a source of verified
facts, and the worktree and docs conventions.

### Target shape

```
server.ts                 plugin factory, CLI, settings
mandate/
  job-card.ts             parse and validate a job card
  roe.ts                  the ROE rule set
  enforce.ts              harness-side refusal; no model
  duty-log.ts             append, render, query
comms/
  verbs.ts                the fixed verb vocabulary and grammar
  speak.ts                sentence construction, one-sentence budget
  channel.ts              websocket page, push-to-talk, Web Speech out
report/
  compose.ts              the one end-of-run report
```

`docs/domain-architecture/` is rebuilt after the code exists, spec-first, not
before.

### First milestone, in order

1. **Duty log only.** The agent can append a call with a reason; `bb dkam
   decisions <thread>` prints it. No voice, no enforcement, no reporting. This
   is the smallest thing that is worth anything, because the duty log is the
   artifact the whole design rests on.
2. **ROE enforcement.** One rule, trunk-merge refusal, implemented in the
   harness. Test that the agent adapts rather than stalls.
3. **The report.** One interruption at end of run, composed from the duty log.
4. **Voice.** `stop`, `where am I`, `decisions`, over `transcribeVoice` in and
   Web Speech out.
5. **The experiment.** One real thread, one real job card, Captain walks away.
   Did the absence work?

### The experiment that validates or kills this

Run one genuine thread with a job card and a duty log, by hand, no plugin. Walk
away. Come back and read only the duty log and the report.

- If the duty log is something you actually read, and the report is enough to
  accept the work without scrolling the thread, the design is real.
- If the duty log is something you skip, then a log is not the answer and the
  premise needs replacing before any code is written.

This costs an afternoon. It is cheaper than every other question in this
document.

---

## 9. Open questions

1. **Where does the job card live?** Versioned in the repo beside the code, or
   passed at spawn time. Recommendation: in the repo, reviewable in a PR.
2. **Who writes it?** The orchestrator, by default. Does bb have a spawn-time
   metadata channel for this, or does DKAM parse it from the first message?
3. **How much of the ROE can be expressed as pre-tool hooks** versus needing
   harness-level refusal? This determines whether DKAM is a plugin at all or a
   permission-layer change.
4. **What is the walk-away duration worth designing for?** Twenty minutes and
   four hours have different designs, and the operator has not said which.
5. **Is the operator's absence always voluntary?** Unplanned interruption, such
   as a phone call, has different requirements from a planned walk.

---

## 10. Evidence and sources

Local, sampled September 2026:

- `~/.bb/bb.db` — 129 threads, 613 turn requests, 589 accepted inputs, 569
  arriving mid-turn, 28 manual stops, 607 steering messages extracted and read.
- `~/.local/share/opencode/opencode.db` — 4,950 sessions, 18,303 user-role
  messages, 16,323 turns, 994 aborts, 186,102 tool calls.

External:

- *From Confident Closing to Silent Failure: Characterizing False Success in
  LLM Agents*, arXiv 2606.09863. False success at 45–48% on tau2-bench
  single-control and 75.8% on AppWorld coding trajectories. No LLM judge
  configuration beats AUROC 0.65; lexical detectors reach 0.83–0.95.
- Brewer et al. 2011, divided attention interferes with fulfilling
  activity-based intentions, and implementation intentions at encoding
  ameliorate it. This is the basis for pre-committing boundaries rather than
  relying on recall.
- *An Exploratory Study of Walking, Listening, and Remembering*, PMC10713016.
  Speech perception is largely unaffected by walking; adding a memory task
  degrades performance in both conditions. This bounds what the voice channel
  can reasonably carry: one fact, one word back.
- DORA, proactive failure notification: alert fatigue is documented and
  desensitisation is the default failure mode of noisy supervision.
