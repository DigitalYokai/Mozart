import type {
  Planner,
  PlanningRequest,
} from "./domain/planner.js";

import type { MozartResult } from "./domain/mozart-result.js";

import { Orchestrator } from "./engine/orchestrator.js";
import { WorkflowFactory } from "./engine/workflow-factory.js";
import { ApprovalProvider } from "./domain/approval.js";

export class Mozart {
  constructor(
    private readonly planner: Planner,
    private readonly orchestrator: Orchestrator,
    private readonly approval: ApprovalProvider,
    private readonly factory = new WorkflowFactory(),
  ) { }

  async run(
    request: PlanningRequest,
    maxAttempts = 3,
  ): Promise<MozartResult> {
    console.log("[Mozart] Planning...");

    const planning = await this.planner.plan(request);

    const workflow = this.factory.create(
      planning.plan,
      maxAttempts,
    );
    const decision = await this.approval.approve(workflow);

    if (!decision.approved) {
      return {
        status: "rejected",
        planning,
        reason: decision.reason ?? "Workflow rejected",
      };
    }
    console.log("[Mozart] Workflow created");
    console.log(`[Mozart] Tasks: ${workflow.tasks.length}`);

    const execution =
      await this.orchestrator.executeWorkflow(workflow);

    return {
      status: "executed",
      planning,
      execution,
    };
  }
}
