import { Codex } from "@openai/codex-sdk";
import type { Worker, WorkerResult } from "../domain/worker.js";
import type { Task } from "../domain/task.js";
import { buildDeveloperPrompt } from "../prompts/developer.js";
import { developerOutputSchema, developerSchema } from "../schemas/developer.js";
import { DeveloperResult } from "../domain/developer-result.js";

export class CodexWorker implements Worker {
  private readonly codex = new Codex();

  constructor(
    private readonly workingDirectory: string
  ) { }

  async execute(task: Task): Promise<WorkerResult> {
    const thread = this.codex.startThread({
      workingDirectory: this.workingDirectory,
      sandboxMode: "workspace-write",
      approvalPolicy: "never",
    });

    const prompt = buildDeveloperPrompt(task)

    try {
      const result = await thread.run(prompt, {
        outputSchema: developerOutputSchema,
      });

      const response: DeveloperResult = developerSchema.parse(
        JSON.parse(result.finalResponse)
      );

      console.log("[CODEX]", response);
      return {
        success: response.success,
        output: response.summary,
      };
    } catch (error) {
      return {
        success: false,
        output: String(error),
      };
    }
  }
}
