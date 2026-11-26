import type { Task } from "../domain/task.js";
import type { Worker, WorkerResult } from "../domain/worker.js";
import { TaskStateMachine, WorkflowStateMachine } from "../domain/state.js";
import { Workflow } from "../domain/workflow.js";
import { Scheduler } from "./scheduler.js";
import { WorkflowValidator } from "./validator.js";
import { MetricsCollector } from "./metrics.js";
import { WorkflowMetrics } from "../domain/metrics.js";
import { WorkflowResult } from "../domain/workflow-result.js";
import { ExecutionContext } from "../domain/execution-context.js";

export class Orchestrator {
  constructor(
    private readonly worker: Worker,
    private readonly scheduler = new Scheduler(),
    private readonly validator = new WorkflowValidator(),
    private readonly metrics = new MetricsCollector(),
  ) { }

  async execute(task: Task): Promise<WorkerResult> {
    if (task.status !== "pending") {
      throw new Error(`Task ${task.id} is not pending`);
    }

    let result: WorkerResult = {
      success: false,
      output: "No attempts remaining",
    };


    const context: ExecutionContext = {};
    while (task.attempts < task.maxAttempts) {
      TaskStateMachine.transition(task, "running");

      task.attempts++;

      console.log(
        `[Mozart] Task ${task.id} — Attempt ${task.attempts}/${task.maxAttempts}`
      );

      try {
        result = await this.worker.execute(task, context);
      } catch (error) {
        result = {
          success: false,
          output: String(error),
        };

      }
      this.metrics.record(result.metrics)

      if (result.success) {
        TaskStateMachine.transition(task, "reviewing");

        // Temporary review implementation
        TaskStateMachine.transition(task, "completed");
        this.worker.release?.(task.id);

        return result;
      }

      TaskStateMachine.transition(task, "failed");
      context.previousFailure = result.output; //saves reason why task failed
      console.log(`[Mozart] Failed: ${result.output}`);

      if (task.attempts < task.maxAttempts) {
        TaskStateMachine.transition(task, "pending");

        console.log("[Mozart] Retrying...");
      }
    }
    this.worker.release?.(task.id);

    return result;
  }

  //MARK: EXECUTE WORKFLOW
  async executeWorkflow(workflow: Workflow): Promise<WorkflowResult> {
    if (workflow.status !== "pending") {
      throw new Error("Workflow is not pending");
    }

    this.validator.validate(workflow);
    this.metrics.reset();

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
            return this.buildReport(workflow);
          }
        }
      }

      WorkflowStateMachine.transition(workflow, "completed")
      return this.buildReport(workflow);

    } catch (error) {
      WorkflowStateMachine.transition(workflow, "failed")
      throw error;
    }
  }

  getMetrics(): WorkflowMetrics {
    return this.metrics.getSummary();
  }

  private buildReport(workflow: Workflow): WorkflowResult {
    return {
      workflowId: workflow.id,
      status: workflow.status,
      totalTasks: workflow.tasks.length,

      completedTasks: workflow.tasks.filter(
        task => task.status === "completed"
      ).length,

      failedTasks: workflow.tasks.filter(
        task => task.status === "failed"
      ).length,

      pendingTasks: workflow.tasks.filter(
        task => task.status === "pending"
      ).length,

      blockedTasks: workflow.tasks.filter(
        task => task.status === "blocked"
      ).length,

      metrics: this.metrics.getSummary(),
    };
  }
}

