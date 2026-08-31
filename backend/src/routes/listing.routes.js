import { Router } from "express";
import {
  createListing,
  getAvailableListings,
  getListingById,
  getMyListings,
  claimListing,
  cancelListing,
} from "../controllers/listing.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.use(verifyJWT); // all listing routes require auth

router.route("/").post(authorizeRoles("restaurant"), createListing);
router.route("/feed").get(authorizeRoles("ngo", "admin"), getAvailableListings);
router.route("/mine").get(authorizeRoles("restaurant"), getMyListings);
router.route("/:id").get(getListingById);
router.route("/:id/claim").post(authorizeRoles("ngo"), claimListing);
router
  .route("/:id/cancel")
  .post(authorizeRoles("restaurant"), cancelListing);

export default router;
