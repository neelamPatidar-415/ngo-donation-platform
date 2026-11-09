import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    razorpayOrderId: {
  type: String,
  unique: true,
  sparse: true,
},
razorpayPaymentId: {
  type: String,
  default: null,
},
paymentStatus: {
  type: String,
  enum: ["PENDING", "SUCCESS", "FAILED"],
  default: "PENDING",
},
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    frequency: {
      type: String,
      enum: ["ONE_TIME", "MONTHLY"],
      default: "ONE_TIME",
    },
    donorName: {
      type: String,
      required: true,
      trim: true,
    },
    donorPan: {
      type: String,
      default: null,
      uppercase: true,
      trim: true,
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },
    paymentReference: {
      type: String,
      unique: true,
      sparse: true,
    },
    paidAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

donationSchema.index({ donor: 1, createdAt: -1 });

export default mongoose.model("Donation", donationSchema);
