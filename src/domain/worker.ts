import type { Task } from "./task";

export interface WorkerResult {
  success: boolean;
  output: string;
}

export interface Worker {
  execute(task: Task): Promise<WorkerResult>;
}
