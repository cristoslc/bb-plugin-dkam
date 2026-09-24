# User experience

DKAM has no UI in BB; its user experience is the operator's experience of
being interrupted well (or not) while walking or biking. This doc captures
the promises and patterns for that.

## Onboarding

1. Install the plugin (`bb plugin install .` or git URL).
2. Set the TTS API key (secret setting) and pick an operator mode
   (`bb plugin config dkam`).
3. Start a working thread, then `bb dkam watch <threadId> --intent "<what
   this episode is for>"`.
4. Open the phone channel page (TODO) on the phone, pocket it, walk.

## UX principles

- **Interruptions must earn the stop.** Every alert should be worth stopping
  for; anything less is a recap, delivered at the next natural pause.
- **Answers, not narration.** The operator asks "where am I" and gets a
  compact snapshot — never a stream of agent output.
- **Hands-free both directions.** All interaction is speech: TTS out, voice
  in. Nothing requires typing or looking.
- **Deferred danger.** Consequential actions (commit/push/delete) are never
  executed silently mid-walk; they queue with a heads-up.
- **Grounded by default.** Episodes are capped; the system assumes drift is
  likely and forces re-grounding, rather than assuming alignment.

## Quality attributes

- **Latency:** a state snapshot should complete in a few seconds (agent-graph
  fetch is capped at a 5s timeout).
- **Availability:** the phone channel must survive a pocketed phone screen
  locking (websocket reconnect, TODO).
- **Calmness:** alert cadence is tuned by operator mode (walking vs biking).

## User journeys

- **Pull a snapshot:** "where am I?" → phone speaks a compact state summary.
- **Drift alert:** agent wanders → phone interrupts with the divergence and
  the anchor it was judged against.
- **Boundary:** episode cap reached → phone announces the boundary, asks for
  re-grounding; working thread pauses until grounded.
- **Review queue:** operator stops → walks through queued actions, approves
  or drops each.

## Accessibility

Speech-first is the primary accessibility feature; visual UI is optional and
secondary. Voice input quality degrades with wind/motion — transcription
confidence should gate how much DKAM acts on heard commands.