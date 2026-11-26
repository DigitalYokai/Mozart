import type { z } from "zod";
import { developerSchema } from "../schemas/developer";

export type DeveloperResult = z.infer<
  typeof developerSchema
>;
