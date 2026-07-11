
import { z } from "zod";

export const createPaymentSchema = z.object({
  body: z.object({
    rentalOrderId: z
      .string({
        required_error: "Rental order id is required",
      })
      .uuid(),

    provider: z.enum([
      "STRIPE",
      "SSLCOMMERZ",
    ]),
  }),
});

export const confirmPaymentSchema = z.object({
  body: z.object({
    transactionId: z
      .string({
        required_error:
          "Transaction id is required",
      })
      .min(1),

    paymentId: z
      .string({
        required_error: "Payment id is required",
      })
      .uuid(),
  }),
});

export const paymentValidation = {
  createPaymentSchema,
  confirmPaymentSchema,
};
