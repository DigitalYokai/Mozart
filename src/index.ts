import { CodexWorker } from "./workers/codex.js";
import { Orchestrator } from "./engine/orchestrator.js";
import type { Task } from "./domain/task.js";

const worker = new CodexWorker(
  "/tmp/mozart-playground"
);

const mozart = new Orchestrator(worker);

const task: Task = {
  id: "001",
  objective: "Create a hello world program in Go.",
  status: "pending",
  dependencies: [],
  acceptanceCriteria: ["A main.go file exists"],
  attempts: 0,
  maxAttempts: 1,
};

const result = await mozart.execute(task);

console.log(result);
