import type { Workflow } from "../domain/workflow.js"
export class WorkflowValidator {
  validate(workflow: Workflow): void {
    const ids = new Set<string>();

    for (const task of workflow.tasks) {
      //Check for duplicate tasks ids
      if (ids.has(task.id)) {
        throw new Error(`[VALIDATOR] Duplicate task ID: ${task.id}`);
      }

      ids.add(task.id)


      //Check for nonexisting dependencies 
      for (const task of workflow.tasks) {
        for (const dependency of task.dependencies) {
          if (!ids.has(dependency)) {
            throw new Error(
              `[VALIDATOR] Task ${task.id} has unknown dependency: ${dependency}`
            );
          }
        }
      }
    }
  }
}
