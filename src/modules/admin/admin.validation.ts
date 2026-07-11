import { z } from "zod";

export const updateUserStatusSchema = z.object({
  body: z.object({
    status: z.enum([
      "ACTIVE",
      "SUSPENDED",
    ]),
  }),
});

export const adminValidation = {
  updateUserStatusSchema,
};
