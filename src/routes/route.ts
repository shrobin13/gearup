
import { Router } from "express";

import { authRoutes } from "../modules/auth/auth.route.js";
import { categoriesRoutes } from "../modules/categories/categories.route.js";
import { gearRoutes } from "../modules/gear/gear.route.js";
import { rentalRoutes } from "../modules/rentals/rental.routes.js";
import { paymentRoutes } from "../modules/payments/payment.route.js";
import { reviewRoutes } from "../modules/review/review.route.js";
import { providerOrderRoutes } from "../modules/providers/provider.route.js";
import { adminRoutes } from "../modules/admin/admin.route.js";

const router = Router();

router.use("/auth", authRoutes);

router.use("/categories", categoriesRoutes);

router.use("/gear", gearRoutes);

router.use(
  "/provider/gear",
  gearRoutes
);

router.use(
  "/rentals",
  rentalRoutes
);

router.use(
  "/payments",
  paymentRoutes
);

router.use(
  "/reviews",
  reviewRoutes
);

router.use(
  "/provider/orders",
  providerOrderRoutes
);

router.use(
  "/admin",
  adminRoutes
);

export default router;
