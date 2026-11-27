import { z } from "zod";

export const criterionReviewSchema = z.strictObject({
  criterion: z.string(),
  satisfied: z.boolean(),
  evidence: z.string(),
});

export const reviewerSchema = z.strictObject({
  approved: z.boolean(),
  summary: z.string(),
  criteria: z.array(criterionReviewSchema),
  issues: z.array(z.string()),
});

export const reviewerOutputSchema =
  z.toJSONSchema(reviewerSchema);
