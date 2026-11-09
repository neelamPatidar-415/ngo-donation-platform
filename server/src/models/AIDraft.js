import mongoose from "mongoose";

const aiDraftSchema = new mongoose.Schema(
  {
    scheme: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scheme",
      required: true,
      index: true,
    },
    generatedSummary: {
      en: { type: String, required: true },
      hi: { type: String, required: true },
    },
    sourceUrl: { type: String, required: true },
    lastCheckedAt: { type: Date, required: true },
    status: {
      type: String,
      enum: ["PENDING_REVIEW", "APPROVED", "REJECTED"],
      default: "PENDING_REVIEW",
      index: true,
    },
    generatedBy: { type: String, default: "Gemini" },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: Date,
    rejectionReason: String,
  },
  { timestamps: true }
);

export default mongoose.model("AIDraft", aiDraftSchema);