import { z } from "zod";

export const updateOrderStatusSchema =
  z.object({
    body: z.object({
      status: z.enum([
        "CONFIRMED",
        "PAID",
        "PICKED_UP",
        "RETURNED",
      ]),
    }),
  });

export const providerOrderValidation = {
  updateOrderStatusSchema,
};
