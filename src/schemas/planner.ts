import { z } from "zod";

export const plannedTaskSchema = z.strictObject({
  id: z.string(),
  objective: z.string(),
  dependencies: z.array(z.string()),
  acceptanceCriteria: z.array(z.string()),
});

export const plannerSchema = z.strictObject({
  objective: z.string(),
  tasks: z.array(plannedTaskSchema),
});

export const plannerOutputSchema =
  z.toJSONSchema(plannerSchema);
