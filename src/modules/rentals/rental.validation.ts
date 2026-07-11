import { z } from "zod";

export const createRentalSchema = z.object({
  body: z.object({
    gearItemId: z
      .string({
        required_error: "Gear item id is required",
      })
      .uuid(),

    quantity: z
      .number({
        required_error: "Quantity is required",
      })
      .int()
      .positive(),

    startDate: z.coerce.date(),

    endDate: z.coerce.date(),
  }),
});

export const rentalValidation = {
  createRentalSchema,
};
