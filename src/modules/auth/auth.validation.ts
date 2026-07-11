import { z } from "zod";
import { Role } from "../../../generated/prisma/enums.js";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

export const loginUserSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .email("Invalid email address"),
    password: z
      .string()
      .min(1, "Password is required"),
  }),
});

export const registerUserSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name cannot exceed 100 characters"),
      email: z
        .string()
        .trim()
        .email("Invalid email address"),
      password: passwordSchema,
      confirmPassword: z
        .string()
        .min(1, "Confirm password is required"),
      role: z.nativeEnum(Role).optional(),
      phone: z
        .string()
        .trim()
        .min(6, "Phone number must be at least 6 characters")
        .max(20, "Phone number cannot exceed 20 characters")
        .optional(),
      address: z
        .string()
        .trim()
        .max(255, "Address cannot exceed 255 characters")
        .optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z
      .string()
      .min(1, "Refresh token is required"),
  }),
});

export type LoginUserInput = z.infer<typeof loginUserSchema>["body"];
export type RegisterUserInput = z.infer<typeof registerUserSchema>["body"];
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>["body"];

export const authValidation = {
  loginUserSchema,
  registerUserSchema,
  refreshTokenSchema,
};
