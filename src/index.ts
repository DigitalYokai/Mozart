import { Mozart } from "./mozart.js";
import { CodexPlanner } from "./planners/codex.js";
import { CodexWorker } from "./workers/codex.js";
import { Orchestrator } from "./engine/orchestrator.js";

const workingDirectory = "/tmp/mozart-playground";

const planner = new CodexPlanner(workingDirectory);
const worker = new CodexWorker(workingDirectory);

const orchestrator = new Orchestrator(worker);

const mozart = new Mozart(planner, orchestrator);

const result = await mozart.run({
  objective: "Build a simple HTTP server in Go.",
  constraints: [
    "Use only the standard library.",
    "Expose a GET /health endpoint.",
    "Include automated tests.",
  ],
});

console.log(JSON.stringify(result, null, 2));
