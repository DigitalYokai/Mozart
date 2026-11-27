import { Codex } from "@openai/codex-sdk";

import type {
  Reviewer,
  ReviewRequest,
  ReviewResult,
} from "../domain/reviewer.js";

import type { TokenUsage } from "../domain/metrics.js";

import {
  reviewerSchema,
  reviewerOutputSchema,
} from "../schemas/reviewer.js";

import { buildReviewerPrompt } from "../prompts/reviewer.js";
import { handleCodexEvent } from "../events/codex.js";

export class CodexReviewer implements Reviewer {
  private readonly codex = new Codex();

  constructor(
    private readonly workingDirectory: string
  ) { }

  async review(
    request: ReviewRequest
  ): Promise<ReviewResult> {
    const startedAt = performance.now();

    let usage: TokenUsage | undefined;
    let finalResponse = "";
    let completed = false;

    const thread = this.codex.startThread({
      workingDirectory: this.workingDirectory,
      sandboxMode: "read-only",
      approvalPolicy: "never",
    });

    const prompt = buildReviewerPrompt(request);

    const { events } = await thread.runStreamed(
      prompt,
      {
        outputSchema: reviewerOutputSchema,
      }
    );

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
            cachedInputTokens:
              event.usage.cached_input_tokens,
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
      throw new Error("Reviewer did not complete");
    }

    const review = reviewerSchema.parse(
      JSON.parse(finalResponse)
    );

    return {
      review,
      metrics: {
        durationMs: performance.now() - startedAt,
        usage,
      },
    };
  }
}
