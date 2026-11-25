import { Task } from "../domain/task";
import type { Workflow } from "../domain/workflow"

export class Scheduler {
  getReadyTasks(workflow: Workflow): Task[] {
    const completed = new Set(
      workflow.tasks
        .filter(task => task.status === "completed")
        .map(task => task.id)
    );

    return workflow.tasks.filter(task =>
      task.status === "pending" &&
      task.dependencies.every(id => completed.has(id))
    );
  }
}
