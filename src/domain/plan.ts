
import type { z } from "zod";

import type {
  plannedTaskSchema,
  plannerSchema,
} from "../schemas/planner.js";

export type PlannedTask = z.infer<typeof plannedTaskSchema>;

export type Plan = z.infer<typeof plannerSchema>;
