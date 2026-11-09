import express from "express";
import {
  getSchemes,
  getSchemeDetails,
  getFilters,
} from "../controllers/schemeController.js";

const router = express.Router();

router.get("/filters", getFilters);
router.get("/", getSchemes);
router.get("/:schemeId", getSchemeDetails);

export default router;