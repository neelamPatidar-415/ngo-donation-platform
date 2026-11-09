
import Scheme from "../models/Scheme.js";

const editableFields = [
  "title",
  "description",
  "need",
  "districts",
  "eligibilityText",
  "eligibilityRules",
  "benefits",
  "requiredDocuments",
  "applicationSteps",
  "helpCentre",
  "officialSource",
  "lastCheckedAt",
];

export const getAllAdminSchemes = async (req, res, next) => {
  try {
    const schemes = await Scheme.find().sort({ updatedAt: -1 });

    res.json({
      success: true,
      data: schemes,
    });
  } catch (error) {
    next(error);
  }
};

export const createScheme = async (req, res, next) => {
  try {
    const {
      schemeId,
      title,
      description,
      need,
      eligibilityText,
    } = req.body;

    if (!schemeId || !title || !description || !need || !eligibilityText) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required scheme details.",
      });
    }

    const existing = await Scheme.findOne({ schemeId });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Scheme ID already exists.",
      });
    }

    const scheme = await Scheme.create({
      ...req.body,
      status: "DRAFT",
    });

    res.status(201).json({
      success: true,
      data: scheme,
      message: "Scheme created as draft.",
    });
  } catch (error) {
    next(error);
  }
};

export const updateScheme = async (req, res, next) => {
  try {
    const updates = {};

    for (const field of editableFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update.",
      });
    }

    const scheme = await Scheme.findOneAndUpdate(
      { schemeId: req.params.schemeId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found.",
      });
    }

    res.json({
      success: true,
      data: scheme,
      message: "Scheme updated successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const updateSchemeStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["DRAFT", "PUBLISHED", "ARCHIVED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid scheme status.",
      });
    }

    const scheme = await Scheme.findOneAndUpdate(
      { schemeId: req.params.schemeId },
      { $set: { status } },
      { new: true, runValidators: true }
    );

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found.",
      });
    }

    res.json({
      success: true,
      data: scheme,
      message: `Scheme ${status.toLowerCase()} successfully.`,
    });
  } catch (error) {
    next(error);
  }
};
