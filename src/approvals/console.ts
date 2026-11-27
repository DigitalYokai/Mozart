import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

import type {
  ApprovalProvider,
  ApprovalDecision,
} from "../domain/approval.js";

import type { Workflow } from "../domain/workflow.js";

export class ConsoleApproval implements ApprovalProvider {
  async approve(
    workflow: Workflow
  ): Promise<ApprovalDecision> {
    console.log("\n--- PROPOSED WORKFLOW ---\n");

    console.log(`Objective: ${workflow.objective}`);

    for (const task of workflow.tasks) {
      console.log(`\n[${task.id}] ${task.objective}`);

      console.log(
        `Dependencies: ${task.dependencies.join(", ") || "None"}`
      );

      console.log("Acceptance criteria:");

      for (const criterion of task.acceptanceCriteria) {
        console.log(`  - ${criterion}`);
      }
    }

    const readline = createInterface({
      input: stdin,
      output: stdout,
    });

    try {
      const answer = await readline.question(
        "\nApprove workflow? [y/N]: "
      );

      return {
        approved: answer.trim().toLowerCase() === "y",
      };
    } finally {
      readline.close();
    }
  }
}
