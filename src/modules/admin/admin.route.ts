import { Router } from "express";

import { adminController } from "./admin.controller.js";
import { adminValidation } from "./admin.validation.js";

import guard from "../../middlewares/guard.js";
import validateRequest from "../../middlewares/validateRequest.js";

const router = Router();

router.get(
  "/users",
  guard("ADMIN"),
  adminController.getAllUsers
);

router.patch(
  "/users/:id",
  guard("ADMIN"),
  validateRequest(
    adminValidation.updateUserStatusSchema
  ),
  adminController.updateUserStatus
);

router.get(
  "/gear",
  guard("ADMIN"),
  adminController.getAllGear
);

router.get(
  "/rentals",
  guard("ADMIN"),
  adminController.getAllRentals
);

export const adminRoutes = router;
