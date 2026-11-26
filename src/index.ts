import { CodexPlanner } from "./planners/codex.js";
import { WorkflowFactory } from "./engine/workflow-factory.js";

const planner = new CodexPlanner(
  "/tmp/mozart-playground"
);

const factory = new WorkflowFactory();

const result = await planner.plan({
  objective: "Build a REST API for managing tasks in Go.",
  constraints: [
    "Use the Go standard library.",
    "Use in-memory storage.",
    "Include automated tests.",
  ],
});

const workflow = factory.create(result.plan, 3);

console.log(JSON.stringify(workflow, null, 2)); 
