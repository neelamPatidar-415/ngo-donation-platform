import express from "express";

import {
  getEligibilityQuestions,
  checkEligibility,
  askEligibilityAssistant,
} from "../controllers/eligibilityController.js";

const router = express.Router();

router.get("/questions", getEligibilityQuestions);
router.post("/check", checkEligibility);
router.post("/assistant", askEligibilityAssistant);

export default router;