import Razorpay from "razorpay";
import crypto from "crypto";

const getRazorpay = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay API keys are missing. Check server/.env");
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

export const createRazorpayOrder = async (amount, donationId) => {
  return getRazorpay().orders.create({
    amount: Math.round(amount * 100),
    currency: "INR",
    receipt: `don_${donationId}`,
    notes: { donationId: String(donationId) },
  });
};

export const verifyRazorpaySignature = (
  orderId,
  paymentId,
  signature
) => {
  const secret = process.env.RAZORPAY_KEY_SECRET;

  if (!secret) {
    throw new Error("Razorpay secret is missing.");
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const expectedBuffer = Buffer.from(expected, "hex");
  const receivedBuffer = Buffer.from(signature, "hex");

  return (
    expectedBuffer.length === receivedBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
  );
};