# Musing: the decision loop, a swipe card surface, and deferral signals

Date: 2026-10-31
Status: idea. The loop is design-level and has moved into HANDOFF.md. The swipe
surface and the deferral signals stay here until a real run produces evidence
they are wanted.

## The loop that survives every mechanism

Strip the interaction mechanism out of DKAM and one loop remains:

1. **Brief.** The agent states the situation, self-contained, evidence cited,
   readable by someone with no thread memory.
2. **Recommend.** The agent names every option with its cost and picks one, with
   the reason that decided it.
3. **Decide.** The operator approves, amends, or defers. The outcome is recorded,
   and a decided ruling is quoted back verbatim where it was applied.

This loop is the same at every altitude and over every transport. Voice, swipe,
keyboard, and the end-of-run report are all renderings of the same three-step
unit. That is the load-bearing conclusion: the data model must store briefs and
rulings, never utterances, so the transport stays swappable.

The format work already exists outside DKAM. The six-part decision brief, the
repeat-in-full rule for pending items, and the fresh-reader test are codified in
`~/.agents/agents-md-detail/reply-state-header.md`. DKAM should adopt that shape
rather than invent its own. The mapping to the end-of-run report is close to
exact, and the relay policy answers a question the handoff had left open: a child
worker's ruling request travels to the operator only inside its parent's relay,
carrying the full brief, never a pointer to a pointer.

## The mapping worth stealing

The sashay closure loop already separates the full record from the handoff
delta: the chronicle stays reachable, the relay carries the delta, and the relay
opens with a state header. DKAM's two artifacts are the same pair:

- **Duty log : report :: chronicle : relay.** The log is the full record and is
  always queryable. The report is the delta, spoken once, with pending items
  brief-shaped.

## A swipe card surface, phone or watch

One decision per card, one hand, no typing. The card renders the six brief parts
scrollable; on a watch, it renders the recommendation and the stakes only.

- **Left / right:** move between pending decisions, so the operator can see the
  queue size before ruling on anything.
- **Up:** approve the recommendation as stated.
- **Down:** not approved. Opens the alternatives, or captures one line of
  feedback, or asks for new options.

Up-on-recommendation is deliberately narrow: approving the recommendation costs
one gesture, amending costs a keyboard, so the surface pays for the common case
and routes the rest to a desk. Whether watch is viable depends on whether the
stakes line fits a 40mm screen, which is untested.

## Deferral signals

Deferral is data. Three signals worth recording per decision:

- **Skipped count.** How many times the operator navigated past this card
  without ruling.
- **Resolution surface.** Ruled on the wrist, ruled on the phone, or only ever
  resolved at the desk.
- **Age.** How long a decision stayed pending, and whether it expired into the
  default.

Two readings, and they point in opposite directions:

- **Tuning signal.** A decision class that is always skipped and always
  resolved as "approve" is evidence the class belongs in assume-and-proceed,
  not in the ruling lane. A class that is always skipped and never resolved is
  evidence the brief is wrong-shaped: too long, or missing the one fact that
  mattered.
- **Disengagement signal.** Rising skip counts across all classes mean the
  operator has stopped ruling, and the agent should stop asking and start
  logging.

**The trap:** never auto-approve on skip. Silence staying non-consensual is the
backbone of the design. A skip raises the signal; it never casts a vote. The
honest version of "the operator keeps skipping this" is a proposal to move the
decision class into assume-and-proceed, made in the report, ruled once.
