import { Router } from "express";

import { reviewController } from "./review.controller.js";
import { reviewValidation } from "./review.validation.js";

import guard from "../../middlewares/guard.js";
import validateRequest from "../../middlewares/validateRequest.js";

const router = Router();

router.post(
  "/",
  guard("CUSTOMER"),
  validateRequest(
    reviewValidation.createReviewSchema
  ),
  reviewController.createReview
);

router.get(
  "/:gearId",
  reviewController.getReviewsByGearId
);

export const reviewRoutes = router;
