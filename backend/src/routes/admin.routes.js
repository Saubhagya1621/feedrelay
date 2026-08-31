import { Router } from "express";
import {
  getOverviewStats,
  getExpiredListings,
  getCancelledPickups,
} from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.use(verifyJWT, authorizeRoles("admin"));

router.route("/stats").get(getOverviewStats);
router.route("/listings/expired").get(getExpiredListings);
router.route("/pickups/cancelled").get(getCancelledPickups);

export default router;
