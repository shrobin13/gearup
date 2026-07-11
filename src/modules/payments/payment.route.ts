
import { Router } from "express";

import { paymentController } from "./payment.controller.js";
import { paymentValidation } from "./payment.validation.js";

import { authMiddleware } from "../../middlewares/auth.js";
import guard from "../../middlewares/guard.js";
import validateRequest from "../../middlewares/validateRequest.js";

const router = Router();

router.post(
  "/create",
  authMiddleware,
  guard("CUSTOMER"),
  validateRequest(
    paymentValidation.createPaymentSchema
  ),
  paymentController.createPayment
);

router.post(
  "/confirm",
  authMiddleware,
  guard("CUSTOMER"),
  validateRequest(
    paymentValidation.confirmPaymentSchema
  ),
  paymentController.confirmPayment
);

router.get(
  "/",
  authMiddleware,
  guard("CUSTOMER"),
  paymentController.getMyPayments
);

router.get(
  "/:id",
  authMiddleware,
  guard("CUSTOMER"),
  paymentController.getPaymentById
);

export const paymentRoutes = router;
