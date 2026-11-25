export type TaskStatus =
  | "pending"
  | "reviewing"
  | "running"
  | "completed"
  | "failed"
  | "blocked";

export interface Task {
  id: string;
  objective: string;
  dependencies: string[];
  acceptanceCriteria: string[];
  attempts: number;
  maxAttempts: number;
  status: TaskStatus;
}
