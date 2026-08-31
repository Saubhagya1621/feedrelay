import mongoose, { Schema } from "mongoose";

const pickupSchema = new Schema(
  {
    listing: {
      type: Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    ngo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["claimed", "en_route", "arrived", "completed", "cancelled"],
      default: "claimed",
    },
    claimedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    cancelReason: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

pickupSchema.index({ listing: 1 });
pickupSchema.index({ ngo: 1, status: 1 });

export const Pickup = mongoose.model("Pickup", pickupSchema);
