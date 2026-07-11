import { Router } from "express";

import { rentalController } from "./rental.controller.js";
import { rentalValidation } from "./rental.validation.js";

import { authMiddleware } from "../../middlewares/auth.js";
import guard from "../../middlewares/guard.js";
import validateRequest from "../../middlewares/validateRequest.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  guard("CUSTOMER"),
  validateRequest(
    rentalValidation.createRentalSchema
  ),
  rentalController.createRental
);

router.get(
  "/",
  authMiddleware,
  guard("CUSTOMER"),
  rentalController.getMyRentals
);

router.get(
  "/:id",
  authMiddleware,
  guard("CUSTOMER"),
  rentalController.getRentalById
);

router.patch(
  "/:id/cancel",
  authMiddleware,
  guard("CUSTOMER"),
  rentalController.cancelRental
);

export const rentalRoutes = router;
