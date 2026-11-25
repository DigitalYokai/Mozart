import type { TaskStatus, Task } from "./task.js";


const transitions: Record<TaskStatus, TaskStatus[]> = {
  pending: ["running", "blocked"],
  running: ["reviewing", "failed"],
  reviewing: ["completed", "failed"],
  failed: ["pending"],
  blocked: ["pending"],
  completed: [],
}

export class TaskStateMachine {
  static canTransition(
    from: TaskStatus,
    to: TaskStatus
  ): boolean {
    return transitions[from].includes(to);
  }

  static transition(task: Task, to: TaskStatus): void {
    if (!this.canTransition(task.status, to)) {
      throw new Error(
        `Invalid transition: ${task.status} -> ${to}`
      );
    }

    task.status = to;
  }
}
