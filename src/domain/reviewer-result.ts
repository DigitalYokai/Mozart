import type { z } from "zod";

import type {
  reviewerSchema,
  criterionReviewSchema,
} from "../schemas/reviewer.js";

export type ReviewerResult =
  z.infer<typeof reviewerSchema>;

export type CriterionReview =
  z.infer<typeof criterionReviewSchema>;
