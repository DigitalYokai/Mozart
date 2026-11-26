import { Plan } from "./plan";
import { ExecutionMetrics } from "./metrics.ts"

export interface PlanningRequest {
  objective: string;
  constraints: string[];
}

export interface PlanningResult {
  plan: Plan;
  metrics?: ExecutionMetrics;
}

export interface Planner {
  plan(request: PlanningRequest): Promise<PlanningResult>;
}
