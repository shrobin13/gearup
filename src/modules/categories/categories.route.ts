
import { Router } from "express";

import { categoriesController } from "./categories.controller.js";
import guard from "../../middlewares/guard.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { categoriesValidation } from "./categories.validation.js";

const router = Router();

// Public
router.get("/", categoriesController.getAllCategories);
router.get("/:id", categoriesController.getCategoryById);

// Admin
router.post(
  "/",
  guard("ADMIN"),
  validateRequest(categoriesValidation.createCategorySchema),
  categoriesController.createCategory
);

router.put(
  "/:id",
  guard("ADMIN"),
  validateRequest(categoriesValidation.updateCategorySchema),
  categoriesController.updateCategory
);

router.delete(
  "/:id",
  guard("ADMIN"),
  categoriesController.deleteCategory
);

export const categoriesRoutes = router;
