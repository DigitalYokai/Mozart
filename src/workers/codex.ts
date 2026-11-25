import { Codex } from "@openai/codex-sdk";
import type { Worker, WorkerResult } from "../domain/worker.js";
import type { Task } from "../domain/task.js";

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

    try {
      const result = await thread.run(task.objective);

      return {
        success: true,
        output: result.finalResponse,
      };
    } catch (error) {
      return {
        success: false,
        output: String(error),
      };
    }
  }
}
