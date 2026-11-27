import type { Task } from "./task.js";
import type { WorkerResult } from "./worker.js";
import type { DeveloperResult } from "./developer-result.js";
import type { ReviewerResult } from "./reviewer-result.js";
import type { ExecutionMetrics } from "./metrics.js";

export interface ReviewRequest {
  task: Task;
  developerResult: WorkerResult<DeveloperResult>;
}

export interface ReviewResult {
  review: ReviewerResult;
  metrics?: ExecutionMetrics;
}

export interface Reviewer {
  review(request: ReviewRequest): Promise<ReviewResult>;
}
