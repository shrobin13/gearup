
import { Router } from "express";

import { categoriesController } from "./categories.controller.js";
import guard from "../../middlewares/guard.js";
import { authMiddleware } from "../../middlewares/auth.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { categoriesValidation } from "./categories.validation.js";

const router = Router();

// Public
router.get("/", categoriesController.getAllCategories);
router.get("/:id", categoriesController.getCategoryById);

// Admin
router.post(
  "/",
  authMiddleware,
  guard("ADMIN"),
  validateRequest(categoriesValidation.createCategorySchema),
  categoriesController.createCategory
);

router.put(
  "/:id",
  authMiddleware,
  guard("ADMIN"),
  validateRequest(categoriesValidation.updateCategorySchema),
  categoriesController.updateCategory
);

router.delete(
  "/:id",
  authMiddleware,
  guard("ADMIN"),
  categoriesController.deleteCategory
);

export const categoriesRoutes = router;
