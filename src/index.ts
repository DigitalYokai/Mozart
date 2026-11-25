import { Orchestrator } from "./engine/orchestrator.js";
import { MockWorker } from "./workers/mock.js";
import type { Workflow } from "./domain/workflow.js";

const mozart = new Orchestrator(new MockWorker());

const workflow: Workflow = {
  id: "workflow-001",
  objective: "Implement authentication",
  status: "pending",
  tasks: [
    {
      id: "001",
      objective: "Create database schema",
      status: "pending",
      dependencies: [],
      acceptanceCriteria: ["Schema exists"],
      attempts: 0,
      maxAttempts: 3,
    },
    {
      id: "002",
      objective: "Implement authentication API",
      status: "pending",
      dependencies: ["001"],
      acceptanceCriteria: ["Login endpoint works"],
      attempts: 0,
      maxAttempts: 3,
    },
    {
      id: "003",
      objective: "Write authentication tests",
      status: "pending",
      dependencies: ["002"],
      acceptanceCriteria: ["All tests pass"],
      attempts: 0,
      maxAttempts: 3,
    },
  ],
};
workflow.tasks[0].dependencies.push("999");
await mozart.executeWorkflow(workflow);

console.log(workflow);
