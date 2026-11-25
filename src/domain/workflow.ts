import { Task } from "./task";

export type WorkflowStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed";

export interface Workflow {
  id: string;
  objective: string;
  status: WorkflowStatus;
  tasks: Task[];
}
