import { CodexReviewer } from "./reviewers/codex.js";
import type { Task } from "./domain/task.js";

const reviewer = new CodexReviewer(
  "/tmp/mozart-playground"
);

const task: Task = {
  id: "001",
  objective: "Implement an HTTP server in Go",
  status: "reviewing",
  dependencies: [],
  acceptanceCriteria: [
    "A main.go file exists",
    "A GET /health endpoint exists",
    "A nonexistent_file.go file exists",
  ],
  attempts: 1,
  maxAttempts: 3,
};

const result = await reviewer.review({
  task,
  developerResult: {
    success: true,
    output: "All requirements implemented successfully.",
    data: {
      success: true,
      summary: "All files have been created.",
      filesChanged: [
        "main.go",
        "nonexistent_file.go",
      ],
      testsPassed: true,
      issues: [],
    },
  },
});

console.log(JSON.stringify(result, null, 2));
