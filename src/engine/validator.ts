import type { Workflow } from "../domain/workflow.js"
export class WorkflowValidator {

  private detectCycles(workflow: Workflow): void {
    const tasks = new Map(
      workflow.tasks.map(task => [task.id, task])
    );

    const visiting = new Set<string>();
    const visited = new Set<string>();

    const visit = (id: string): void => {
      if (visiting.has(id)) {
        throw new Error(
          `[VALIDATOR] Circular dependency detected: ${id}`
        );
      }

      if (visited.has(id)) {
        return;
      }

      visiting.add(id);
      const task = tasks.get(id)!; //Its ok to force unwrapp because we already checked for non existing ids in the validate function

      for (const dependency of task.dependencies) {
        visit(dependency);
      }

      visiting.delete(id);
      visited.add(id);
    }

    for (const task of workflow.tasks) {
      visit(task.id);
    }
  }


  validate(workflow: Workflow): void {
    const ids = new Set<string>();

    for (const task of workflow.tasks) {
      //Check for duplicate tasks ids
      if (ids.has(task.id)) {
        throw new Error(`[VALIDATOR] Duplicate task ID: ${task.id}`);
      }

      ids.add(task.id)



    }

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

    this.detectCycles(workflow);
  }


}
