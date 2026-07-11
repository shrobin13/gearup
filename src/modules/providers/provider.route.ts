import { Router } from "express";


import guard from "../../middlewares/guard.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { gearValidation } from "../gear/gear.validation.js";
import { gearController } from "../gear/gear.controller.js";

const router = Router();

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

export const providerGearRoutes = router;
