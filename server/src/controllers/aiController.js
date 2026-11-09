import AIDraft from "../models/AIDraft.js";
import Scheme from "../models/Scheme.js";
import { generateSchemeSummary } from "../services/aiService.js";

export const createSummaryDraft = async (req, res, next) => {
  try {
    const { noticeText, sourceUrl, lastCheckedAt } = req.body;

    if (!noticeText?.trim() || !sourceUrl || !lastCheckedAt) {
      return res.status(400).json({
        success: false,
        message: "Notice text, source URL and last-checked date are required.",
      });
    }

    try {
      new URL(sourceUrl);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid source URL.",
      });
    }

    const scheme = await Scheme.findOne({
      schemeId: req.params.schemeId,
    });

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found.",
      });
    }

    const generatedSummary = await generateSchemeSummary(noticeText);

    const draft = await AIDraft.create({
      scheme: scheme._id,
      generatedSummary,
      sourceUrl,
      lastCheckedAt: new Date(lastCheckedAt),
    });

    res.status(201).json({
      success: true,
      message: "AI summary draft generated. Admin review required.",
      data: { draft },
    });
  } catch (error) {
    next(error);
  }
};

export const getSummaryDrafts = async (req, res, next) => {
  try {
    const drafts = await AIDraft.find()
      .populate("scheme", "schemeId title")
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { drafts },
    });
  } catch (error) {
    next(error);
  }
};

export const reviewSummaryDraft = async (req, res, next) => {
  try {
    const { decision, rejectionReason } = req.body;

    if (!["APPROVED", "REJECTED"].includes(decision)) {
      return res.status(400).json({
        success: false,
        message: "Decision must be APPROVED or REJECTED.",
      });
    }

    const draft = await AIDraft.findById(req.params.draftId);

    if (!draft) {
      return res.status(404).json({
        success: false,
        message: "Draft not found.",
      });
    }

    if (draft.status !== "PENDING_REVIEW") {
      return res.status(409).json({
        success: false,
        message: "This draft has already been reviewed.",
      });
    }

    if (decision === "APPROVED") {
      const scheme = await Scheme.findById(draft.scheme);

      if (!scheme) {
        return res.status(404).json({
          success: false,
          message: "Associated scheme not found.",
        });
      }

      scheme.summary = draft.generatedSummary;
      scheme.officialSource = draft.sourceUrl;
      scheme.lastCheckedAt = draft.lastCheckedAt;
      await scheme.save();
    }

    draft.status = decision;
    draft.reviewedBy = req.user._id;
    draft.reviewedAt = new Date();

    if (decision === "REJECTED") {
      draft.rejectionReason = rejectionReason || "";
    }

    await draft.save();

    res.json({
      success: true,
      message: `Summary draft ${decision.toLowerCase()}.`,
      data: { draft },
    });
  } catch (error) {
    next(error);
  }
};