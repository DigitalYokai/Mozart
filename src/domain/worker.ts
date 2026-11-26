import type { Task } from "./task";

export interface WorkerResult<T = unknown> {
  success: boolean;
  output: string;
  data?: T;
}

export interface Worker<T = unknown> {
  execute(task: Task): Promise<WorkerResult>;
}
