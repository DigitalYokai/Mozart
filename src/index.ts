import { Orchestrator } from "./engine/orchestrator.js";
import { MockWorker } from "./workers/mock.js";
import type { Task } from "./domain/task.js";

const worker = new MockWorker();
const mozart = new Orchestrator(worker);

const task: Task = {
  id: "001",
  objective: "Implement authentication",
  status: "pending",
  dependencies: [],
  acceptanceCriteria: [
    "Authentication middleware exists",
    "Tests pass",
  ],
  attempts: 0,
  maxAttempts: 3,
};

const result = await mozart.execute(task);

console.log(result);
console.log(task);
