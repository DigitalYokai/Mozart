import type { Workflow } from "./workflow.js";

export interface ApprovalDecision {
  approved: boolean;
  reason?: string;
}

export interface ApprovalProvider {
  approve(workflow: Workflow): Promise<ApprovalDecision>;
}
