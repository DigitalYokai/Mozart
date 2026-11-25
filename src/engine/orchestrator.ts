import type { Task } from "../domain/task.js";
import type { Worker, WorkerResult } from "../domain/worker.js";
import { TaskStateMachine, WorkflowStateMachine } from "../domain/state.js";
import { Workflow } from "../domain/workflow.js";
import { Scheduler } from "./scheduler.js";
import { WorkflowValidator } from "./validator.js";

export class Orchestrator {
  constructor(
    private readonly worker: Worker,
    private readonly scheduler = new Scheduler(),
    private readonly validator = new WorkflowValidator()
  ) { }

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

  //MARK: EXECUTE WORKFLOW
  async executeWorkflow(workflow: Workflow): Promise<void> {
    if (workflow.status !== "pending") {
      throw new Error("Workflow is not pending");
    }

    this.validator.validate(workflow);

    WorkflowStateMachine.transition(workflow, "running");


    try {
      while (
        !workflow.tasks.every(t => t.status === "completed")
      ) {
        const ready = this.scheduler.getReadyTasks(workflow);

        if (ready.length === 0) {
          throw new Error("No executable tasks remaining");
        }

        for (const task of ready) {
          const result = await this.execute(task);

          if (!result.success) {
            WorkflowStateMachine.transition(workflow, "failed")
            return;
          }
        }
      }

      WorkflowStateMachine.transition(workflow, "completed")
    } catch (error) {
      WorkflowStateMachine.transition(workflow, "failed")
      throw error;
    }
  }
}

