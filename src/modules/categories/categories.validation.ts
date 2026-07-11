import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Category name is required",
      })
      .trim()
      .min(2, "Category name must be at least 2 characters")
      .max(50, "Category name cannot exceed 50 characters"),

    description: z
      .string()
      .trim()
      .max(255, "Description cannot exceed 255 characters")
      .optional(),
  }),
});

export const updateCategorySchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Category name must be at least 2 characters")
      .max(50, "Category name cannot exceed 50 characters")
      .optional(),

    description: z
      .string()
      .trim()
      .max(255, "Description cannot exceed 255 characters")
      .optional(),
  }),
});

export const categoriesValidation = {
  createCategorySchema,
  updateCategorySchema,
};
