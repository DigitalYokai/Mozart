import { ExecutionMetrics } from "./metrics";
import type { Task } from "./task";

export interface WorkerResult<T = unknown> {
  success: boolean;
  output: string;
  data?: T;
  metrics: ExecutionMetrics
}

export interface Worker<T = unknown> {
  execute(task: Task): Promise<WorkerResult>;
}
