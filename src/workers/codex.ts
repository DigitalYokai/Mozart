import { Codex } from "@openai/codex-sdk";
import type { Worker, WorkerResult } from "../domain/worker.js";
import type { Task } from "../domain/task.js";
import { buildDeveloperPrompt } from "../prompts/developer.js";
import { developerOutputSchema, developerSchema } from "../schemas/developer.js";
import { DeveloperResult } from "../domain/developer-result.js";
import { handleCodexEvent } from "../events/codex.js";

export class CodexWorker implements Worker<DeveloperResult> {
  private readonly codex = new Codex();

  constructor(
    private readonly workingDirectory: string
  ) { }

  async execute(task: Task): Promise<WorkerResult<DeveloperResult>> {
    const thread = this.codex.startThread({
      workingDirectory: this.workingDirectory,
      sandboxMode: "workspace-write",
      approvalPolicy: "never",
    });

    const prompt = buildDeveloperPrompt(task)

    try {
      const { events } = await thread.runStreamed(prompt, {
        outputSchema: developerOutputSchema,
      });

      let finalResponse = "";
      let completed = false;

      // MARK: LOG CODEX EVENTS
      for await (const event of events) {
        handleCodexEvent(event)

        switch (event.type) {
          case "item.completed":
            if (event.item.type === "agent_message") {
              finalResponse = event.item.text;
            }
            break;

          case "turn.completed":
            completed = true;
            break;

          case "turn.failed":
            throw new Error(event.error.message);
        }
      }

      if (!completed || !finalResponse) {
        throw new Error("Codex did not complete its response");
      }

      // MARK: PARSE TASK RESULT
      const response = developerSchema.parse(
        JSON.parse(finalResponse)
      );

      return {
        success: response.success,
        output: response.summary,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        output: String(error),
      };
    }
  }
}
