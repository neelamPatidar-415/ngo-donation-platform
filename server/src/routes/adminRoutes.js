
import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import allowRoles from "../middleware/roleMiddleware.js";

import { getAdminDashboard } from "../controllers/adminController.js";

import {
  getAllAdminSchemes,
  createScheme,
  updateScheme,
  updateSchemeStatus,
} from "../controllers/adminSchemeController.js";

import {
  getAdminCampaigns,
  createCampaign,
  updateCampaign,
  updateCampaignStatus,
} from "../controllers/adminCampaignController.js";

import {
  getDonationReport,
  exportDonationCSV,
  exportForm10BDData,
} from "../controllers/adminReportController.js";

const router = Router();

router.use(protect);
router.use(allowRoles("TRUST_ADMIN"));

// Dashboard
router.get("/dashboard", getAdminDashboard);

// Scheme management
router.get("/schemes", getAllAdminSchemes);
router.post("/schemes", createScheme);
router.put("/schemes/:schemeId", updateScheme);
router.patch("/schemes/:schemeId/status", updateSchemeStatus);

router.get("/campaigns", getAdminCampaigns);
router.post("/campaigns", createCampaign);
router.put("/campaigns/:campaignId", updateCampaign);
router.patch("/campaigns/:campaignId/status", updateCampaignStatus);

router.get("/reports/donations", getDonationReport);
router.get("/reports/donations/export", exportDonationCSV);
router.get("/reports/form-10bd/export", exportForm10BDData);

export default router;
