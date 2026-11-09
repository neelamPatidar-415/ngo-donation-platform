
import {
  createDonationOrder,
  verifyDonationPayment,
  getDonorDonations,
} from "../services/donationService.js";

export const create = async (req, res, next) => {
  try {
    const order = await createDonationOrder(req.user, req.body);

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const donation = await verifyDonationPayment(req.user, req.body);

    res.status(200).json({
      success: true,
      message: "Payment verified successfully.",
      data: { donation },
    });
  } catch (error) {
    next(error);
  }
};

export const myDonations = async (req, res, next) => {
  try {
    const donations = await getDonorDonations(req.user._id);

    res.status(200).json({
      success: true,
      data: { donations },
    });
  } catch (error) {
    next(error);
  }
};
