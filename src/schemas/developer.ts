import { z } from "zod";

export const developerSchema = z.strictObject({
  success: z.boolean(),
  summary: z.string(),
  filesChanged: z.array(z.string()),
  testsPassed: z.boolean().nullable(),
  issues: z.array(z.string()),
});

export const developerOutputSchema = z.toJSONSchema(
  developerSchema
);
