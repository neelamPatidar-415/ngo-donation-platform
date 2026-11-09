import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import allowRoles from "../middleware/roleMiddleware.js";

import {
  createSummaryDraft,
  getSummaryDrafts,
  reviewSummaryDraft,
} from "../controllers/aiController.js";

const router = express.Router();

router.use(protect);
router.use(allowRoles("TRUST_ADMIN"));

router.post("/schemes/:schemeId/summary-drafts", createSummaryDraft);
router.get("/summary-drafts", getSummaryDrafts);
router.patch("/summary-drafts/:draftId/review", reviewSummaryDraft);

export default router;