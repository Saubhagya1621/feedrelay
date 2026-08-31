import mongoose, { Schema } from "mongoose";

const feedbackSchema = new Schema(
  {
    pickup: {
      type: Schema.Types.ObjectId,
      ref: "Pickup",
      required: true,
    },
    fromUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fromRole: {
      type: String,
      enum: ["restaurant", "ngo"],
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

feedbackSchema.index({ pickup: 1, fromRole: 1 }, { unique: true });

export const Feedback = mongoose.model("Feedback", feedbackSchema);
