// bb-plugin-dkam — headless backend entry.
//
// DKAM (Distracted Keyboardless Agent Mode) is a metacognitive layer between a
// hands-free operator (walking/biking, no screen or keyboard) and one or more
// working BB agent threads. It does NOT narrate agent output. It:
//
//   1. Externalizes working memory  — on-demand "where am I" state snapshots
//   2. Monitors for drift           — alerts when a working thread diverges
//                                     from its stated intent anchor
//   3. Manages episodes             — caps working runs (~5-10 min) and forces
//                                     re-grounding at episode boundaries
//   4. Defers consequential actions — queues commits/pushes/deletes for review
//                                     at a stop or back at desk
//   5. Provides a phone channel     — websocket-served HTML page for TTS
//                                     output and voice input
//
// Architecture:
//   - Meta thread:    the operator's interface thread. Holds the intent
//                     anchor, runs metacognitive prompts, talks to the
//                     operator over the phone channel.
//   - Working thread: an ordinary (muted) BB thread doing the actual work.
//   - Phone channel:  bb.http.experimental_websocket("/dkam") + served HTML.
//
// Interface contract with agent-graph (the sole integration point):
//   GET /api/v1/plugins/agent-graph/http/graph?threadId=<id>
//   → the `Graph` JSON model of that working thread's activity.
//
// This file is a SCAFFOLD. Subsystems marked TODO are stubs on purpose.
import { defineCli, cliCommand, PluginCliError, type BbPluginApi } from "@get-bb/plugin-sdk";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** One watched working thread and its episode state. */
interface WatchEntry {
  threadId: string;
  /** Stated episode intent anchor, in the operator's own words. */
  intentAnchor: string;
  /** ISO timestamp when this watch entry was created. */
  watchedAt: string;
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

const PLUGIN_NAME = "DKAM";

// ---------------------------------------------------------------------------
// Plugin factory
// ---------------------------------------------------------------------------

export default async function plugin(bb: BbPluginApi) {
  bb.log.info("loaded");

  // Declarative settings — rendered in BB's settings UI and editable with
  // `bb plugin config dkam`. Read once per load; reload after changing.
  const settings = bb.settings.define({
    // TODO: TTS provider API key. Keep secret: stored server-side only.
    ttsApiKey: {
      type: "string",
      label: "TTS API key",
      description: "API key for the text-to-speech provider used by the phone channel.",
      secret: true,
    },
    mode: {
      type: "select",
      label: "Operator mode",
      description: "Affects alert cadence and verbosity.",
      options: ["walking", "biking", "desk"],
      default: "walking",
    },
    episodeLengthMinutes: {
      type: "number",
      label: "Episode length (minutes)",
      description: "Working-thread run cap before forcing re-grounding (5-10 min recommended).",
      default: 8,
    },
  });
  const { episodeLengthMinutes } = await settings.get();
  bb.log.info(`episode length: ${episodeLengthMinutes} minutes`);

  // -----------------------------------------------------------------------
  // Watch registry (intent-anchor storage)
  // -----------------------------------------------------------------------
  // TODO: move to bb.storage.database() once drift/episode state grows past
  // what a KV list needs (episode boundaries, queued consequential actions,
  // drift event history). For the scaffold, one KV key holds the registry.

  const WATCH_KEY = "watched-threads";

  async function readWatches(): Promise<WatchEntry[]> {
    return (await bb.storage.kv.get<WatchEntry[]>(WATCH_KEY)) ?? [];
  }
  async function writeWatches(entries: WatchEntry[]): Promise<void> {
    await bb.storage.kv.set(WATCH_KEY, entries);
  }

  // -----------------------------------------------------------------------
  // Agent-graph client (interface contract)
  // -----------------------------------------------------------------------

  /**
   * Fetch a working thread's graph from the agent-graph plugin.
   * Contract: GET /api/v1/plugins/agent-graph/http/graph?threadId=<id>
   * returns the `Graph` JSON.
   */
  async function fetchGraph(threadId: string): Promise<unknown> {
    const url =
      `${bb.server.loopbackBaseUrl}/api/v1/plugins/agent-graph/http/graph?threadId=${encodeURIComponent(threadId)}`;
    const response = await fetch(url, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) {
      throw new Error(`agent-graph responded ${response.status} for thread ${threadId}`);
    }
    return response.json();
  }

  /** TODO: turn the `Graph` JSON into a compact, speakable text summary. */
  function summarizeGraph(_graph: unknown): string {
    return "Graph summarization is not implemented yet (scaffold stub).";
  }

  // -----------------------------------------------------------------------
  // Agent tool: state_snapshot
  // -----------------------------------------------------------------------

  bb.agents.registerTool({
    name: "state_snapshot",
    description:
      "Fetch a compact text snapshot of what a watched working thread is doing, from the agent-graph model. Used by the DKAM meta thread to answer 'where am I'.",
    presentation: {
      label: {
        pending: "Fetching state snapshot",
        completed: "Fetched state snapshot",
      },
    },
    parameters: z.object({
      threadId: z.string().min(1).describe("The working thread to snapshot"),
    }),
    async execute({ threadId }, { signal }) {
      // TODO: full graph fetch + summarize + drift comparison once the
      // agent-graph endpoint lands. Scaffold behavior: try the contract,
      // fall back to a clear stub message.
      try {
        const graph = await fetchGraph(threadId);
        return summarizeGraph(graph);
      } catch (error) {
        if (signal?.aborted) throw error;
        bb.log.warn(`state_snapshot: ${error instanceof Error ? error.message : String(error)}`);
        return "agent-graph endpoint not yet available";
      }
    },
  });

  // -----------------------------------------------------------------------
  // CLI: bb dkam
  // -----------------------------------------------------------------------

  bb.cli.register(
    defineCli({
      name: "dkam",
      summary: "DKAM metacognitive layer for distracted, keyboardless agent mode",
      commands: {
        status: cliCommand({
          summary: "Show whether DKAM is watching any working threads",
          run: async () => {
            const watches = await readWatches();
            if (watches.length === 0) {
              return { exitCode: 0, stdout: "DKAM is not watching any threads." };
            }
            const lines = watches.map(
              (w) => `${w.threadId}  anchor: "${w.intentAnchor}"  since ${w.watchedAt}`,
            );
            return { exitCode: 0, stdout: [`DKAM is watching ${watches.length} thread(s):`, ...lines].join("\n") };
          },
        }),
        watch: cliCommand({
          summary: "Start watching a working thread",
          description:
            "Stores an intent anchor for the thread; DKAM uses it for drift detection at episode boundaries.",
          positionals: [{ name: "threadId", description: "Thread to watch", required: true }],
          options: {
            intent: {
              type: "string",
              description: "Stated episode intent anchor",
              required: true,
            },
          },
          run: async (input) => {
            const { threadId } = input.positionals;
            const watches = await readWatches();
            if (watches.some((w) => w.threadId === threadId)) {
              throw new PluginCliError(`already watching ${threadId}`, {
                code: "already_watching",
                hint: "Run `bb dkam unwatch " + threadId + "` first, or use `bb dkam status`.",
              });
            }
            // TODO: also resolve the thread via bb.sdk.threads.get and fail
            // fast on unknown ids once the watcher lands.
            await writeWatches([
              ...watches,
              {
                threadId,
                intentAnchor: input.options.intent,
                watchedAt: new Date().toISOString(),
              },
            ]);
            return { exitCode: 0, stdout: `Watching ${threadId} (anchor: "${input.options.intent}")` };
          },
        }),
        unwatch: cliCommand({
          summary: "Stop watching a working thread",
          positionals: [{ name: "threadId", description: "Thread to stop watching", required: true }],
          run: async (input) => {
            const watches = await readWatches();
            const remaining = watches.filter((w) => w.threadId !== input.positionals.threadId);
            if (remaining.length === watches.length) {
              throw new PluginCliError(`not watching ${input.positionals.threadId}`, {
                code: "not_watching",
                hint: "Run `bb dkam status` to list watched threads.",
              });
            }
            await writeWatches(remaining);
            return { exitCode: 0, stdout: `Stopped watching ${input.positionals.threadId}` };
          },
        }),
        recap: cliCommand({
          summary: "Print a text state snapshot of a working thread",
          positionals: [{ name: "threadId", description: "Thread to recap", required: true }],
          run: async (input, ctx) => {
            try {
              const graph = await fetchGraph(input.positionals.threadId);
              return { exitCode: 0, stdout: summarizeGraph(graph) };
            } catch (error) {
              if (ctx.signal?.aborted) throw error;
              bb.log.warn(`recap: ${error instanceof Error ? error.message : String(error)}`);
              throw new PluginCliError(
                "agent-graph endpoint not yet available",
                {
                  code: "agent_graph_unavailable",
                  hint: "The agent-graph plugin must serve GET /api/v1/plugins/agent-graph/http/graph?threadId=<id>.",
                },
              );
            }
          },
        }),
      },
    }),
  );

  // -----------------------------------------------------------------------
  // Background service: drift watcher
  // -----------------------------------------------------------------------

  // TODO: register bb.background.service("drift-watcher") that polls the
  // agent-graph endpoint for each watched thread, compares current activity
  // against the intent anchor, and pushes drift alerts + episode-boundary
  // re-grounding prompts over the phone channel. Sleeps must wake on abort.

  // -----------------------------------------------------------------------
  // Phone channel (websocket)
  // -----------------------------------------------------------------------

  // TODO: register bb.http.experimental_websocket("/dkam", handler) plus a
  // served HTML page. The channel carries recaps and drift alerts to the
  // operator's phone (TTS output) and receives voice input, transcribed
  // through BB's existing voice transcription AI service.

  // -----------------------------------------------------------------------
  // Consequential-action queue
  // -----------------------------------------------------------------------

  // TODO: intercept/queue commits, pushes, and deletes from watched working
  // threads with a heads-up, surfaced for review at a stop or back at desk.

  // Cleanup on reload/disable/shutdown; hooks run LIFO.
  bb.onDispose(() => {
    bb.log.info("disposed");
  });
}