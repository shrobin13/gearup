import { z } from "zod";
import { Role } from "../../../generated/prisma/enums.js";

export const updateUserSchema = z.object({
  body: z.object({
    role: z.nativeEnum(Role).optional(),
    status: z.enum(["ACTIVE", "SUSPENDED"]).optional(),
  }).refine(
    (data) => data.role !== undefined || data.status !== undefined,
    {
      message: "At least one of role or status must be provided",
      path: ["body"],
    }
  ),
});

export const adminValidation = {
  updateUserSchema,
};
