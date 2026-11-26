import { randomUUID } from "node:crypto";

import type { Plan } from "../domain/plan.js";
import type { Workflow } from "../domain/workflow.js";
import type { Task } from "../domain/task.js";
import { WorkflowValidator } from "./validator.js"

export class WorkflowFactory {

  constructor(
    private readonly validator = new WorkflowValidator()
  ) { }

  create(plan: Plan, maxAttempts = 3): Workflow {
    if (!Number.isInteger(maxAttempts) || maxAttempts < 1) {
      throw new Error("maxAttempts must be a positive integer");
    }

    const tasks: Task[] = plan.tasks.map(
      (plannedTask): Task => ({
        ...plannedTask,
        dependencies: [...plannedTask.dependencies],
        acceptanceCriteria: [...plannedTask.acceptanceCriteria],
        status: "pending",
        attempts: 0,
        maxAttempts,
      })
    );

    const workflow: Workflow = {
      id: randomUUID(),
      objective: plan.objective,
      status: "pending",
      tasks,
    };

    this.validator.validate(workflow);

    return workflow;
  }
}
