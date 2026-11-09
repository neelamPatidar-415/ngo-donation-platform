
import mongoose from "mongoose";
import Donation from "../models/Donation.js";
import Receipt from "../models/Receipt.js";
import ReceiptCounter from "../models/ReceiptCounter.js";

const getFinancialYear = (date) => {
  const year = date.getFullYear();
  const start = date.getMonth() >= 3 ? year : year - 1;
  return `${start}-${String(start + 1).slice(-2)}`;
};

export const getOrCreateReceipt = async (donationId, userId) => {
  const existing = await Receipt.findOne({
    donation: donationId,
    donor: userId,
  });

  if (existing) return existing;

  const donation = await Donation.findOne({
    _id: donationId,
    donor: userId,
    paymentStatus: "SUCCESS",
  });

  if (!donation) {
    const error = new Error("Verified successful donation not found.");
    error.statusCode = 404;
    throw error;
  }

  const session = await mongoose.startSession();
  let receipt;

  try {
    await session.withTransaction(async () => {
      const alreadyCreated = await Receipt.findOne({
        donation: donation._id,
      }).session(session);

      if (alreadyCreated) {
        receipt = alreadyCreated;
        return;
      }

      const date = donation.paidAt || new Date();
      const financialYear = getFinancialYear(date);
      const counterId = `DONATION-${financialYear}`;

      const counter = await ReceiptCounter.findOneAndUpdate(
        { _id: counterId },
        { $inc: { sequence: 1 } },
        { new: true, upsert: true, session }
      );

      const receiptNumber =
        `NGO/${financialYear}/${String(counter.sequence).padStart(6, "0")}`;

      [receipt] = await Receipt.create(
        [{
          receiptNumber,
          donation: donation._id,
          donor: donation.donor,
          donorName: donation.donorName,
          donorPan: donation.donorPan,
          amount: donation.amount,
          paymentReference: donation.razorpayPaymentId,
          issuedAt: date,
          financialYear,
        }],
        { session }
      );
    });
  } finally {
    await session.endSession();
  }

  return receipt;
};

export const getDonorReceipts = async (userId) => {
  return Receipt.find({ donor: userId })
    .sort({ issuedAt: -1 })
    .lean();
};
