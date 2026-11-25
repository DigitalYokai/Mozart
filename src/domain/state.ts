import type { TaskStatus } from "./task.js";
import type { WorkflowStatus } from "./workflow.js"



export class StateMachine<T extends string> {
  constructor(
    private readonly transitions: Record<T, T[]>
  ) { }

  canTransition(from: T, to: T): boolean {
    return this.transitions[from].includes(to);
  }

  transition(entity: { status: T }, to: T): void {
    if (!this.canTransition(entity.status, to)) {
      throw new Error(
        `[STATE MACHINE] Invalid transition: ${entity.status} -> ${to}`
      );
    }

    entity.status = to;
  }
}

export const TaskStateMachine = new StateMachine<TaskStatus>({
  pending: ["running", "blocked"],
  running: ["reviewing", "failed"],
  reviewing: ["completed", "failed"],
  failed: ["pending"],
  blocked: ["pending"],
  completed: [],
});

export const WorkflowStateMachine = new StateMachine<WorkflowStatus>({
  pending: ["running"],
  running: ["completed", "failed"],
  completed: [],
  failed: [],
})

