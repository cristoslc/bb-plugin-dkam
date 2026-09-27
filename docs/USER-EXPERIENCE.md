# User experience

DKAM has no UI in BB. Its user experience is an operator who is away from every
screen and does not want to come back to a desk. This doc captures the promises
and the journeys that follow from that.

## Onboarding

1. Install the plugin (`bb plugin install .` or git URL).
2. Start a working thread, then `bb dkam watch <threadId> --rules <file>` where
   the file is the operator's constraint set, or add rules with
   `bb dkam rules add`.
3. Open the phone channel page, pocket it, walk. Push-to-talk is one button; the
   screen is never required.

## UX principles

- **The desk is optional, never required.** No journey ends with "go back and
  fix this". Unresolved items park and are batched.
- **Facts and violations only.** The phone speaks a verified fact or a rule
  violation with a fix verb. Never narration, never a summary of agent prose.
- **One word back.** Every alert is answerable with one word from a fixed
  vocabulary. If an alert cannot be answered in one word, it is not an alert.
- **Assumptions never block.** A decision no rule covers gets stated and the run
  continues. Silence from the operator is a valid answer.
- **Alerts earn the stop.** Speak only on a change in a verified fact or a new
  violation. Repeating an unchanged fact is noise and trains the operator to
  ignore the channel.

## Journeys

- **Walk out.** Rules declared, phone pocketed, thread running. Nothing is
  spoken until a fact changes.
- **Violation.** Spoken: rule id, what tripped it, one fix word. Operator says
  the word. Rule is satisfied, run continues.
- **Assumption.** Spoken as a count at the next boundary, not as an
  interruption. Playback on demand with `decisions`.
- **Park.** Violation goes unanswered. At the next safe step the run parks and
  says so once. Any later word, at any hour, resumes it.
- **Hard invariant.** A trunk merge or push is refused while unattended. Spoken
  once, action denied, run continues with the rest of the work.
- **Batched review.** Later, at a desk or not: "8 assumptions, 2 violations, 1
  parked run". Thirty seconds. The run was never waiting.

## Quality attributes

- **Latency:** a fact is read from the environment at turn end; the check is
  milliseconds. The agent-graph fetch keeps its 5s cap.
- **Availability:** the phone page reconnects on wake; a parked run survives
  plugin reload because the ledger is on disk.
- **Calmness:** cadence is tuned by operator mode. Walking mode speaks fewer
  facts than desk mode by design.
- **Comprehensibility under load:** a spoken line is one sentence, one number or
  one name, and at most one fix word.

## Accessibility

Speech is the interface, not a fallback. Voice input quality degrades with wind
and motion, so push-to-talk beats always-on, and a transcript outside the verb
vocabulary is logged rather than obeyed. Visual confirmation on the phone page
is secondary and never required to answer an alert.
