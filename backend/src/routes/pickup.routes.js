import { Router } from "express";
import { getMyPickups, updatePickupStatus } from "../controllers/pickup.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getMyPickups);
router.route("/:id/status").patch(updatePickupStatus);

export default router;
