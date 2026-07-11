
import { z } from "zod";

export const createGearSchema = z.object({
  body: z.object({
    categoryId: z.string().uuid().optional().or(z.literal("")),
    category: z.string().uuid().optional().or(z.literal("")),

    name: z
      .string()
      .trim()
      .min(2)
      .max(100)
      .optional(),

    description: z
      .string()
      .trim()
      .min(10)
      .max(2000)
      .optional(),

    brand: z
      .string()
      .trim()
      .min(2)
      .max(100)
      .optional(),

    pricePerDay: z.number().positive().optional(),

    stock: z.number().int().min(0).optional(),

    imageUrl: z.string().url().optional(),
  }),
});

export const updateGearSchema = z.object({
  body: z.object({
    categoryId: z.string().uuid().optional().or(z.literal("")),
    category: z.string().uuid().optional().or(z.literal("")),

    name: z
      .string()
      .trim()
      .min(2)
      .max(100)
      .optional(),

    description: z
      .string()
      .trim()
      .min(10)
      .max(2000)
      .optional(),

    brand: z
      .string()
      .trim()
      .min(2)
      .max(100)
      .optional(),

    pricePerDay: z.number().positive().optional(),

    stock: z.number().int().min(0).optional(),

    imageUrl: z.string().url().optional(),
  }),
});

export const gearValidation = {
  createGearSchema,
  updateGearSchema,
};
