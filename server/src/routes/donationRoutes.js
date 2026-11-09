
import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import {
  create,
  verifyPayment,
  myDonations,
} from "../controllers/donationController.js";
import {
  createDonationSchema,
  verifyPaymentSchema,
} from "../validators/donationValidator.js";

const router = Router();

router.use(protect);

router.post("/", validate(createDonationSchema), create);
router.post("/verify", validate(verifyPaymentSchema), verifyPayment);
router.get("/my", myDonations);

export default router;
