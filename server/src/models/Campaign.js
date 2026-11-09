
import mongoose from "mongoose";

const localizedTextSchema = new mongoose.Schema(
  {
    en: { type: String, required: true, trim: true },
    hi: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const campaignSchema = new mongoose.Schema(
  {
    campaignId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: localizedTextSchema,
      required: true,
    },
    summary: {
      type: localizedTextSchema,
      required: true,
    },
    description: {
      type: localizedTextSchema,
      required: true,
    },
    category: {
      type: String,
      enum: ["Health", "Livelihood", "Education", "General"],
      required: true,
    },
    goalAmount: {
      type: Number,
      required: true,
      min: 1,
    },
    raisedAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "COMPLETED", "ARCHIVED"],
      default: "ACTIVE",
    },
    endDate: {
      type: Date,
      default: null,
    },
    impact: {
      type: localizedTextSchema,
      default: () => ({ en: "", hi: "" }),
    },
  },
  { timestamps: true }
);

campaignSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model("Campaign", campaignSchema);
