
import mongoose from "mongoose";
import Donation from "../models/Donation.js";
import Campaign from "../models/Campaign.js";
import {
  createRazorpayOrder,
  verifyRazorpaySignature,
} from "./paymentService.js";

// 1. Create donation + Razorpay order
export const createDonationOrder = async (user, data) => {
  const { campaignId, amount, frequency, donorName, donorPan } = data;

  const campaign = await Campaign.findOne({
    campaignId,
    status: "ACTIVE",
  });

  if (!campaign) {
    throw new Error("Campaign not found or is not active.");
  }

  const donation = await Donation.create({
    donor: user._id,
    campaign: campaign._id,
    amount: Number(amount),
    frequency,
    donorName: donorName.trim(),
    donorPan: donorPan?.toUpperCase() || "",
    paymentStatus: "PENDING",
  });

  try {
    const order = await createRazorpayOrder(
      donation.amount,
      donation._id
    );

    donation.razorpayOrderId = order.id;
    await donation.save();

    return {
      donationId: donation._id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    };
  } catch (error) {
    await Donation.findByIdAndDelete(donation._id);
    throw error;
  }
};

// 2. Verify payment
export const verifyDonationPayment = async (user, data) => {
  const {
    donationId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = data;

  const donation = await Donation.findOne({
    _id: donationId,
    donor: user._id,
    razorpayOrderId: razorpay_order_id,
  });

  if (!donation) {
    throw new Error("Donation or payment order not found.");
  }

  // Idempotency: don't increment campaign total twice.
  if (donation.paymentStatus === "SUCCESS") {
    return donation;
  }

  if (donation.paymentStatus !== "PENDING") {
    throw new Error("This donation cannot be verified.");
  }

  const validSignature = verifyRazorpaySignature(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  );

  if (!validSignature) {
    throw new Error("Invalid payment signature.");
  }

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const updatedDonation = await Donation.findOneAndUpdate(
        {
          _id: donationId,
          donor: user._id,
          razorpayOrderId: razorpay_order_id,
          paymentStatus: "PENDING",
        },
        {
          $set: {
            paymentStatus: "SUCCESS",
            razorpayPaymentId: razorpay_payment_id,
            paidAt: new Date(),
          },
        },
        { new: true, session }
      );

      if (!updatedDonation) {
        const existing = await Donation.findById(donationId).session(session);

        if (existing?.paymentStatus === "SUCCESS") {
          return;
        }

        throw new Error("Donation verification could not be completed.");
      }

      const updatedCampaign = await Campaign.findByIdAndUpdate(
        donation.campaign,
        { $inc: { raisedAmount: donation.amount } },
        { new: true, session }
      );

      if (!updatedCampaign) {
        throw new Error("Campaign not found.");
      }
    });
  } finally {
    await session.endSession();
  }

  return Donation.findById(donationId);
};

// 3. Fetch donations belonging to logged-in donor
export const getDonorDonations = async (userId) => {
  return Donation.find({ donor: userId })
    .populate("campaign", "campaignId title")
    .sort({ createdAt: -1 });
};
