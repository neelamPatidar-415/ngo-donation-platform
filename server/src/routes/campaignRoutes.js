
import { Router } from "express";
import {
  getCampaigns,
  getCampaign,
} from "../controllers/campaignController.js";

const router = Router();

router.get("/", getCampaigns);
router.get("/:campaignId", getCampaign);

export default router;
