
import { Router } from "express";

import { paymentController } from "./payment.controller.js";
import { paymentValidation } from "./payment.validation.js";

import guard from "../../middlewares/guard.js";
import validateRequest from "../../middlewares/validateRequest.js";

const router = Router();

router.post(
  "/create",
  guard("CUSTOMER"),
  validateRequest(
    paymentValidation.createPaymentSchema
  ),
  paymentController.createPayment
);

router.post(
  "/confirm",
  guard("CUSTOMER"),
  validateRequest(
    paymentValidation.confirmPaymentSchema
  ),
  paymentController.confirmPayment
);

router.get(
  "/",
  guard("CUSTOMER"),
  paymentController.getMyPayments
);

router.get(
  "/:id",
  guard("CUSTOMER"),
  paymentController.getPaymentById
);

export const paymentRoutes = router;
