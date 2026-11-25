import { TaskStateMachine } from "../domain/state";
import { Task } from "../domain/task";
import { Worker, WorkerResult } from "../domain/worker";

export class Orchestrator {
  constructor(private readonly worker: Worker) { }

  async execute(task: Task): Promise<WorkerResult> {
    TaskStateMachine.transition(task, "running");
    task.attempts++;

    console.log(`[Mozart] Starting task ${task.id}`);

    let result: WorkerResult;

    try {
      result = await this.worker.execute(task);

    } catch (error) {
      TaskStateMachine.transition(task, "failed");
      throw error;
    }

    if (!result.success) {
      TaskStateMachine.transition(task, "failed");
      return result;
    }

    TaskStateMachine.transition(task, "reviewing");

    //TODO: implement review
    TaskStateMachine.transition(task, "completed");

    return result;
  }
}
