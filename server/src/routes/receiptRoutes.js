
import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  downloadReceipt,
  myReceipts,
} from "../controllers/receiptController.js";

const router = Router();

router.use(protect);

router.get("/my", myReceipts);
router.get("/:donationId/pdf", downloadReceipt);

export default router;
