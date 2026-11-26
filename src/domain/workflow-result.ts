import type { WorkflowStatus } from "./workflow.js";
import type { WorkflowMetrics } from "./metrics.js";

export interface WorkflowResult {
  workflowId: string;
  status: WorkflowStatus;
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  pendingTasks: number;
  blockedTasks: number;
  metrics: WorkflowMetrics;
}
