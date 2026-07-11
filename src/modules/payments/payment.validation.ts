
import { z } from "zod";

export const createPaymentSchema = z.object({
  body: z.object({
    rentalOrderId: z.string().uuid(),
    provider: z.enum(["STRIPE", "SSLCOMMERZ"]),
  }),
});

export const confirmPaymentSchema = z.object({
  body: z.object({
    transactionId: z.string().min(1),
    paymentId: z.string().uuid(),
  }),
});

export const paymentValidation = {
  createPaymentSchema,
  confirmPaymentSchema,
};
