import type { Task } from "../domain/task.js";
import type { Worker, WorkerResult } from "../domain/worker.js";
import { TaskStateMachine } from "../domain/state.js";
import { Workflow } from "../domain/workflow.js";

export class Orchestrator {
  constructor(private readonly worker: Worker) { }

  async execute(task: Task): Promise<WorkerResult> {
    if (task.status !== "pending") {
      throw new Error(`Task ${task.id} is not pending`);
    }

    let result: WorkerResult = {
      success: false,
      output: "No attempts remaining",
    };

    while (task.attempts < task.maxAttempts) {
      TaskStateMachine.transition(task, "running");

      task.attempts++;

      console.log(
        `[Mozart] Task ${task.id} — Attempt ${task.attempts}/${task.maxAttempts}`
      );

      try {
        result = await this.worker.execute(task);
      } catch (error) {
        result = {
          success: false,
          output: String(error),
        };
      }

      if (result.success) {
        TaskStateMachine.transition(task, "reviewing");

        // Temporary review implementation
        TaskStateMachine.transition(task, "completed");

        return result;
      }

      TaskStateMachine.transition(task, "failed");

      console.log(`[Mozart] Failed: ${result.output}`);

      if (task.attempts < task.maxAttempts) {
        TaskStateMachine.transition(task, "pending");

        console.log("[Mozart] Retrying...");
      }
    }

    return result;
  }

  async executeWorkflow(workflow: Workflow): Promise<void> {
    if (workflow.status !== "pending") {
      throw new Error("Workflow is not pending");
    }
    workflow.status = "running";

    console.log(`[Mozart] Objective: ${workflow.objective}`);

    for (const task of workflow.tasks) {
      const result = await this.execute(task);

      if (!result.success) {
        workflow.status = "failed";
        console.log(`[Mozart] Workflow failed at task ${task.id}`);

        return;
      }
    }

    workflow.status = "completed";

    console.log("[Mozart] Workflow completed");
  }
}

