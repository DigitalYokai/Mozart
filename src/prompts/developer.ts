import type { Task } from "../domain/task.js";

export function buildDeveloperPrompt(task: Task): string {
  return `
You are a software engineering worker managed by Mozart.

TASK ID:
${task.id}

OBJECTIVE:
${task.objective}

ACCEPTANCE CRITERIA:
${task.acceptanceCriteria.map(
    (criterion, index) => `${index + 1}. ${criterion}`
  ).join("\n")}

ATTEMPT:
${task.attempts} of ${task.maxAttempts}

INSTRUCTIONS:
- Inspect the existing repository before making changes.
- Implement only the requested task.
- Avoid unrelated modifications.
- Verify the implementation where possible.
- Report changes, test results and unresolved issues.
`.trim();
}
