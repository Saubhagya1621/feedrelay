import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Listing } from "../models/listing.model.js";
import { Pickup } from "../models/pickup.model.js";

// Helper: derive urgency from time remaining until expiry
const computeUrgency = (expiresAt) => {
  const hoursLeft = (new Date(expiresAt) - new Date()) / (1000 * 60 * 60);
  if (hoursLeft <= 1) return "high";
  if (hoursLeft <= 3) return "medium";
  return "low";
};

const createListing = asyncHandler(async (req, res) => {
  const {
    foodType,
    description,
    quantity,
    preparedAt,
    expiresAt,
    pickupLocation,
  } = req.body;

  if (!foodType || !quantity?.value || !quantity?.unit || !expiresAt) {
    throw new ApiError(
      400,
      "foodType, quantity (value & unit) and expiresAt are required"
    );
  }

  const listing = await Listing.create({
    restaurant: req.user._id,
    foodType,
    description,
    quantity,
    preparedAt: preparedAt || new Date(),
    expiresAt,
    urgency: computeUrgency(expiresAt),
    pickupLocation: pickupLocation || undefined,
  });

  const io = req.app.get("io");
  io?.emit("listing:new", listing);

  return res
    .status(201)
    .json(new ApiResponse(201, listing, "Listing created successfully"));
});

// Feed: available listings, sorted by urgency then soonest expiry
const getAvailableListings = asyncHandler(async (req, res) => {
  const listings = await Listing.find({
    status: "available",
    expiresAt: { $gt: new Date() },
  })
    .populate("restaurant", "name address phone")
    .sort({ urgency: 1, expiresAt: 1 });

  const urgencyRank = { high: 0, medium: 1, low: 2 };
  listings.sort((a, b) => urgencyRank[a.urgency] - urgencyRank[b.urgency]);

  return res
    .status(200)
    .json(new ApiResponse(200, listings, "Available listings fetched"));
});

const getListingById = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate(
    "restaurant",
    "name address phone"
  );

  if (!listing) {
    throw new ApiError(404, "Listing not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, listing, "Listing fetched"));
});

const getMyListings = asyncHandler(async (req, res) => {
  const listings = await Listing.find({ restaurant: req.user._id }).sort({
    createdAt: -1,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, listings, "Your listings fetched"));
});

// NGO claims a listing — atomic to prevent race conditions on simultaneous claims
const claimListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findOneAndUpdate(
    { _id: req.params.id, status: "available" },
    { status: "claimed", claimedBy: req.user._id, claimedAt: new Date() },
    { new: true }
  );

  if (!listing) {
    throw new ApiError(
      409,
      "Listing is no longer available (already claimed or expired)"
    );
  }

  const pickup = await Pickup.create({
    listing: listing._id,
    ngo: req.user._id,
    restaurant: listing.restaurant,
    status: "claimed",
  });

  const io = req.app.get("io");
  io?.emit("listing:claimed", { listingId: listing._id, pickup });

  return res
    .status(200)
    .json(new ApiResponse(200, { listing, pickup }, "Listing claimed"));
});

const cancelListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findOne({
    _id: req.params.id,
    restaurant: req.user._id,
  });

  if (!listing) {
    throw new ApiError(404, "Listing not found");
  }

  if (listing.status !== "available") {
    throw new ApiError(400, "Only available listings can be cancelled");
  }

  listing.status = "cancelled";
  await listing.save();

  const io = req.app.get("io");
  io?.emit("listing:cancelled", { listingId: listing._id });

  return res
    .status(200)
    .json(new ApiResponse(200, listing, "Listing cancelled"));
});

export {
  createListing,
  getAvailableListings,
  getListingById,
  getMyListings,
  claimListing,
  cancelListing,
};
