import { Router } from "express";
import {
  createFeedback,
  getFeedbackForPickup,
} from "../controllers/feedback.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(createFeedback);
router.route("/:pickupId").get(getFeedbackForPickup);

export default router;
