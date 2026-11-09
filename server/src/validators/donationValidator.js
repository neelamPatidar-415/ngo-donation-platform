
import { z } from "zod";

export const createDonationSchema = z.object({
  campaignId: z.string().trim().min(1),
  amount: z.coerce.number().finite().min(1).max(1000000),
  frequency: z.enum(["ONE_TIME", "MONTHLY"]),
  donorName: z.string().trim().min(2).max(80),
  donorPan: z.union([
    z.literal(""),
    z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/i),
  ]).optional(),
}).strict();

export const verifyPaymentSchema = z.object({
  donationId: z.string().regex(/^[a-f\d]{24}$/i),
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().regex(/^[a-f\d]{64}$/i),
}).strict();
