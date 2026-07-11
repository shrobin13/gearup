import { Router } from "express";
import { authController } from "./auth.controller.js";
import { authMiddleware } from "../../middlewares/auth.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { authValidation } from "./auth.validation.js";

const router = Router();

router.post("/register", validateRequest(authValidation.registerUserSchema), authController.registerUser);
router.post("/login", validateRequest(authValidation.loginUserSchema), authController.loginUser);
router.post("/refresh-token", validateRequest(authValidation.refreshTokenSchema), authController.refreshToken);
router.get("/me", authMiddleware, authController.me);

export const authRoutes = router;
