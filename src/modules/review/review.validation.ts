import { z } from "zod";

export const createReviewSchema = z.object({
  body: z.object({
    gearItemId: z.string().uuid(),

    rating: z
      .number()
      .int()
      .min(1)
      .max(5),

    comment: z
      .string()
      .trim()
      .min(3)
      .max(1000),
  }),
});

export const reviewValidation = {
  createReviewSchema,
};
