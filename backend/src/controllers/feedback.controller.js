import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Feedback } from "../models/feedback.model.js";
import { Pickup } from "../models/pickup.model.js";

const createFeedback = asyncHandler(async (req, res) => {
  const { pickupId, rating, comment } = req.body;

  if (!pickupId || !rating) {
    throw new ApiError(400, "pickupId and rating are required");
  }

  const pickup = await Pickup.findById(pickupId);
  if (!pickup) {
    throw new ApiError(404, "Pickup not found");
  }

  if (pickup.status !== "completed") {
    throw new ApiError(400, "Feedback can only be left on completed pickups");
  }

  const isParty =
    pickup.ngo.toString() === req.user._id.toString() ||
    pickup.restaurant.toString() === req.user._id.toString();
  if (!isParty) {
    throw new ApiError(403, "You are not part of this pickup");
  }

  const fromRole = req.user.role === "ngo" ? "ngo" : "restaurant";

  const existing = await Feedback.findOne({ pickup: pickupId, fromRole });
  if (existing) {
    throw new ApiError(409, "You have already left feedback for this pickup");
  }

  const feedback = await Feedback.create({
    pickup: pickupId,
    fromUser: req.user._id,
    fromRole,
    rating,
    comment,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, feedback, "Feedback submitted"));
});

const getFeedbackForPickup = asyncHandler(async (req, res) => {
  const feedback = await Feedback.find({ pickup: req.params.pickupId });

  return res
    .status(200)
    .json(new ApiResponse(200, feedback, "Feedback fetched"));
});

export { createFeedback, getFeedbackForPickup };
