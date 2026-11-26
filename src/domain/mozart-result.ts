import type { PlanningResult } from "./planner.js";
import type { WorkflowResult } from "./workflow-result.js";

export interface MozartResult {
  planning: PlanningResult;
  execution: WorkflowResult;
}
