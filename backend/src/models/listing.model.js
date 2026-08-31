import mongoose, { Schema } from "mongoose";

const listingSchema = new Schema(
  {
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    foodType: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    quantity: {
      value: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        enum: ["kg", "servings", "packets", "liters"],
        required: true,
      },
    },
    preparedAt: {
      type: Date,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "claimed", "picked_up", "expired", "cancelled"],
      default: "available",
    },
    urgency: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    pickupLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },
    claimedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    claimedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

listingSchema.index({ pickupLocation: "2dsphere" });
listingSchema.index({ status: 1, expiresAt: 1 });

export const Listing = mongoose.model("Listing", listingSchema);
