import { Task } from "../domain/task";
import { Worker, WorkerResult } from "../domain/worker";

export class Orchestrator {
  constructor(private readonly worker: Worker) { }

  async execute(task: Task): Promise<WorkerResult> {
    if (task.status !== "pending") {
      throw new Error(`Task ${task.id} is not pending`);
    }

    task.status = "running";
    task.attempts++;

    console.log(`[Mozart] Starting task ${task.id}`);

    try {
      const result = await this.worker.execute(task);

      task.status = result.success ? "completed" : "failed";

      return result;
    } catch (error) {
      task.status = "failed";

      throw error;
    }
  }
}
