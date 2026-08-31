import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Listing } from "../models/listing.model.js";
import { Pickup } from "../models/pickup.model.js";
import { User } from "../models/user.model.js";

const getOverviewStats = asyncHandler(async (req, res) => {
  const [totalMealsSaved, activeListings, completedPickups, totalNgos, totalRestaurants, disputedPickups] =
    await Promise.all([
      Pickup.countDocuments({ status: "completed" }),
      Listing.countDocuments({ status: "available" }),
      Pickup.countDocuments({ status: "completed" }),
      User.countDocuments({ role: "ngo" }),
      User.countDocuments({ role: "restaurant" }),
      Pickup.countDocuments({ status: "cancelled" }),
    ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalMealsSaved,
        activeListings,
        completedPickups,
        totalNgos,
        totalRestaurants,
        disputedPickups,
      },
      "Platform stats fetched"
    )
  );
});

const getExpiredListings = asyncHandler(async (req, res) => {
  const expired = await Listing.find({
    status: "available",
    expiresAt: { $lt: new Date() },
  }).populate("restaurant", "name");

  return res
    .status(200)
    .json(new ApiResponse(200, expired, "Expired unclaimed listings"));
});

const getCancelledPickups = asyncHandler(async (req, res) => {
  const cancelled = await Pickup.find({ status: "cancelled" })
    .populate("listing")
    .populate("ngo", "name")
    .populate("restaurant", "name")
    .sort({ updatedAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, cancelled, "Cancelled/disputed pickups"));
});

export { getOverviewStats, getExpiredListings, getCancelledPickups };
