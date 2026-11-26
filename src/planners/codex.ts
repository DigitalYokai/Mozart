import { Codex } from "@openai/codex-sdk";

import type {
  Planner,
  PlanningRequest,
  PlanningResult,
} from "../domain/planner.js";

import type { TokenUsage } from "../domain/metrics.js";

import { buildPlannerPrompt } from "../prompts/planner.js";

import {
  plannerSchema,
  plannerOutputSchema,
} from "../schemas/planner.js";

import { handleCodexEvent } from "../events/codex.js";

export class CodexPlanner implements Planner {
  private readonly codex = new Codex();

  constructor(
    private readonly workingDirectory: string
  ) { }

  async plan(request: PlanningRequest): Promise<PlanningResult> {

    const startedAt = performance.now();

    let usage: TokenUsage | undefined;
    let finalResponse = "";
    let completed = false;

    const thread = this.codex.startThread({
      workingDirectory: this.workingDirectory,
      sandboxMode: "read-only",
      approvalPolicy: "never",
    });

    const prompt = buildPlannerPrompt(request);

    const { events } = await thread.runStreamed(prompt, {
      outputSchema: plannerOutputSchema,
    });

    for await (const event of events) {
      handleCodexEvent(event);

      switch (event.type) {
        case "item.completed":
          if (event.item.type === "agent_message") {
            finalResponse = event.item.text;
          }
          break;

        case "turn.completed":
          completed = true;

          usage = {
            inputTokens: event.usage.input_tokens,
            cachedInputTokens: event.usage.cached_input_tokens,
            outputTokens: event.usage.output_tokens,
          };

          break;

        case "turn.failed":
          throw new Error(event.error.message);

        case "error":
          throw new Error(event.message);
      }
    }

    if (!completed || !finalResponse || !usage) {
      throw new Error("Planner did not complete");
    }

    const plan = plannerSchema.parse(
      JSON.parse(finalResponse)
    );

    return {
      plan,
      metrics: {
        durationMs: performance.now() - startedAt,
        usage,
      },
    };
  }
}
