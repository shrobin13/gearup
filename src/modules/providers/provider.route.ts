import { Router } from "express";

import { providerOrderController } from "./provider.controller.js";

import { authMiddleware } from "../../middlewares/auth.js";
import guard from "../../middlewares/guard.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { providerOrderValidation } from "./provider.validation.js";

const router = Router();

router.get(
  "/",
  authMiddleware,
  guard("PROVIDER"),
  providerOrderController.getProviderOrders
);

router.patch(
  "/:id",
  authMiddleware,
  guard("PROVIDER"),
  validateRequest(
    providerOrderValidation.updateOrderStatusSchema
  ),
  providerOrderController.updateOrderStatus
);

export const providerOrderRoutes = router;
