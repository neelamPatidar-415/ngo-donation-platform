
import Campaign from "../models/Campaign.js";

const editableFields = [
  "title",
  "summary",
  "description",
  "category",
  "goalAmount",
  "status",
  "endDate",
  "impact",
];

export const getAdminCampaigns = async (req, res, next) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json({ success: true, data: campaigns });
  } catch (error) {
    next(error);
  }
};

export const createCampaign = async (req, res, next) => {
  try {
    const {
      campaignId,
      title,
      summary,
      description,
      category,
      goalAmount,
      endDate,
      impact,
    } = req.body;

    if (
      !campaignId || !title?.en || !summary?.en ||
      !description?.en || !category ||
      !Number.isFinite(Number(goalAmount)) ||
      Number(goalAmount) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Provide campaign ID, English content, category and a valid goal amount.",
      });
    }

    const existing = await Campaign.findOne({ campaignId });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Campaign ID already exists.",
      });
    }

    const campaign = await Campaign.create({
      campaignId,
      title,
      summary,
      description,
      category,
      goalAmount: Number(goalAmount),
      raisedAmount: 0,
      endDate: endDate || null,
      impact: impact || { en: "", hi: "" },
      status: "ACTIVE",
    });

    res.status(201).json({
      success: true,
      message: "Campaign created successfully.",
      data: campaign,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCampaign = async (req, res, next) => {
  try {
    const updates = {};

    for (const field of editableFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (
      updates.goalAmount !== undefined &&
      (!Number.isFinite(Number(updates.goalAmount)) ||
        Number(updates.goalAmount) <= 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Goal amount must be greater than zero.",
      });
    }

    if (updates.goalAmount !== undefined) {
      updates.goalAmount = Number(updates.goalAmount);
    }

    const campaign = await Campaign.findOneAndUpdate(
      { campaignId: req.params.campaignId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found.",
      });
    }

    res.json({
      success: true,
      message: "Campaign updated successfully.",
      data: campaign,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCampaignStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["ACTIVE", "COMPLETED", "ARCHIVED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid campaign status.",
      });
    }

    const campaign = await Campaign.findOneAndUpdate(
      { campaignId: req.params.campaignId },
      { $set: { status } },
      { new: true, runValidators: true }
    );

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found.",
      });
    }

    res.json({ success: true, data: campaign });
  } catch (error) {
    next(error);
  }
};
