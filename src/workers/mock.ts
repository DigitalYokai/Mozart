import type { Worker, WorkerResult } from "../domain/worker";
import type { Task } from "../domain/task";

export class MockWorker implements Worker {
  async execute(task: Task): Promise<WorkerResult> {
    console.log(`[WORKER] Executing: ${task.objective}`);

    await new Promise(resolve => setTimeout(resolve, 1000))

    return {
      success: true,
      output: `successfully executed task ${task.objective}`
    }
  }
}
