
import {
  getOrCreateReceipt,
  getDonorReceipts,
} from "../services/receiptService.js";

import { generateReceiptPDF } from "../services/pdfService.js";

export const downloadReceipt = async (req, res, next) => {
  try {
    const receipt = await getOrCreateReceipt(
      req.params.donationId,
      req.user._id
    );

    generateReceiptPDF(receipt, res);
  } catch (error) {
    next(error);
  }
};

export const myReceipts = async (req, res, next) => {
  try {
    const receipts = await getDonorReceipts(req.user._id);

    res.status(200).json({
      success: true,
      data: { receipts },
    });
  } catch (error) {
    next(error);
  }
};
