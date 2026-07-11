import { Router } from "express";

import { gearController } from "./gear.controller.js";
import { gearValidation } from "./gear.validation.js";

import guard from "../../middlewares/guard.js";
import validateRequest from "../../middlewares/validateRequest.js";

const router = Router();

router.get("/", gearController.getAllGear);

router.get(
  "/:id",
  gearController.getGearById
);

router.post(
  "/",
  guard("PROVIDER"),
  validateRequest(
    gearValidation.createGearSchema
  ),
  gearController.createGear
);

router.put(
  "/:id",
  guard("PROVIDER"),
  validateRequest(
    gearValidation.updateGearSchema
  ),
  gearController.updateGear
);

router.delete(
  "/:id",
  guard("PROVIDER"),
  gearController.deleteGear
);

export const gearRoutes = router;
