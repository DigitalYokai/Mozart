import type { PlanningResult } from "./planner.js";
import type { WorkflowResult } from "./workflow-result.js";

export type MozartResult =
  | {
    status: "rejected";
    planning: PlanningResult;
    reason?: string;
  }
  | {
    status: "executed";
    planning: PlanningResult;
    execution: WorkflowResult;
  };
