import { Router } from "express";

import { adminController } from "./admin.controller.js";
import { adminValidation } from "./admin.validation.js";

import { authMiddleware } from "../../middlewares/auth.js";
import guard from "../../middlewares/guard.js";
import validateRequest from "../../middlewares/validateRequest.js";

const router = Router();

router.get(
  "/users",
  authMiddleware,
  guard("ADMIN"),
  adminController.getAllUsers
);

router.patch(
  "/users/:id",
  authMiddleware,
  guard("ADMIN"),
  validateRequest(
    adminValidation.updateUserStatusSchema
  ),
  adminController.updateUserStatus
);

router.get(
  "/gear",
  authMiddleware,
  guard("ADMIN"),
  adminController.getAllGear
);

router.get(
  "/rentals",
  authMiddleware,
  guard("ADMIN"),
  adminController.getAllRentals
);

export const adminRoutes = router;
