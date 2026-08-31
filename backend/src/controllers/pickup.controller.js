import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Pickup } from "../models/pickup.model.js";
import { Listing } from "../models/listing.model.js";

const VALID_TRANSITIONS = {
  claimed: ["en_route", "cancelled"],
  en_route: ["arrived", "cancelled"],
  arrived: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

const getMyPickups = asyncHandler(async (req, res) => {
  const filter =
    req.user.role === "ngo"
      ? { ngo: req.user._id }
      : { restaurant: req.user._id };

  const pickups = await Pickup.find(filter)
    .populate("listing")
    .populate("ngo", "name phone")
    .populate("restaurant", "name phone address")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, pickups, "Pickups fetched"));
});

const updatePickupStatus = asyncHandler(async (req, res) => {
  const { status, cancelReason } = req.body;
  const pickup = await Pickup.findById(req.params.id);

  if (!pickup) {
    throw new ApiError(404, "Pickup not found");
  }

  const isParty =
    pickup.ngo.toString() === req.user._id.toString() ||
    pickup.restaurant.toString() === req.user._id.toString();

  if (!isParty) {
    throw new ApiError(403, "You are not part of this pickup");
  }

  // Only the NGO can mark movement toward the restaurant.
  // Either side can mark a pickup as completed or cancelled.
  const ngoOnlyStatuses = ["en_route", "arrived"];
  if (ngoOnlyStatuses.includes(status) && req.user.role !== "ngo") {
    throw new ApiError(
      403,
      "Only the NGO can update pickup movement status"
    );
  }

  const allowedNext = VALID_TRANSITIONS[pickup.status] || [];
  if (!allowedNext.includes(status)) {
    throw new ApiError(
      400,
      `Cannot transition pickup from '${pickup.status}' to '${status}'`
    );
  }

  pickup.status = status;
  if (status === "cancelled") pickup.cancelReason = cancelReason;
  if (status === "completed") pickup.completedAt = new Date();
  await pickup.save();

  // keep listing status in sync
  const listingStatusMap = {
    completed: "picked_up",
    cancelled: "available", // reopen listing if pickup falls through
  };
  if (listingStatusMap[status]) {
    await Listing.findByIdAndUpdate(pickup.listing, {
      status: listingStatusMap[status],
      ...(status === "cancelled" && { claimedBy: null, claimedAt: null }),
    });
  }

  const io = req.app.get("io");
  io?.emit("pickup:statusUpdate", { pickupId: pickup._id, status });

  return res
    .status(200)
    .json(new ApiResponse(200, pickup, "Pickup status updated"));
});

export { getMyPickups, updatePickupStatus };