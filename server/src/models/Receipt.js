
import mongoose from "mongoose";

const receiptSchema = new mongoose.Schema(
  {
    receiptNumber: {
      type: String,
      required: true,
      unique: true,
    },
    donation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donation",
      required: true,
      unique: true,
    },
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    donorName: { type: String, required: true },
    donorPan: { type: String, default: null },
    amount: { type: Number, required: true },
    paymentReference: { type: String, required: true },
    issuedAt: { type: Date, default: Date.now },
    financialYear: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Receipt", receiptSchema);
