import { Router } from "express";

import { rentalController } from "./rental.controller.js";
import { rentalValidation } from "./rental.validation.js";

import guard from "../../middlewares/guard.js";
import validateRequest from "../../middlewares/validateRequest.js";

const router = Router();

router.post(
  "/",
  guard("CUSTOMER"),
  validateRequest(
    rentalValidation.createRentalSchema
  ),
  rentalController.createRental
);

router.get(
  "/",
  guard("CUSTOMER"),
  rentalController.getMyRentals
);

router.get(
  "/:id",
  guard("CUSTOMER"),
  rentalController.getRentalById
);

router.patch(
  "/:id/cancel",
  guard("CUSTOMER"),
  rentalController.cancelRental
);

export const rentalRoutes = router;
