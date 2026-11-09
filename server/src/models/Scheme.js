import mongoose from "mongoose";

const eligibilityRuleSchema = new mongoose.Schema(
  {
    field: {
      type: String,
      required: true,
    },
    operator: {
      type: String,
      enum: ["equals", "gte", "lte"],
      required: true,
    },
    value: mongoose.Schema.Types.Mixed,
    description: {
      en: String,
      hi: String,
    },
  },
  { _id: false }
);

const schemeSchema = new mongoose.Schema(
  {
    schemeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    title: {
      en: { type: String, required: true },
      hi: { type: String, required: true },
    },

    description: {
      en: { type: String, default: "" },
      hi: { type: String, default: "" },
    },

    need: {
      type: String,
      required: true,
      enum: ["Pension", "Livelihood", "Health"],
    },

    districts: {
      type: [String],
      default: [],
    },

    eligibilityText: {
      en: String,
      hi: String,
    },

    eligibilityRules: {
      type: [eligibilityRuleSchema],
      default: [],
    },

    benefits: {
      en: { type: String, required: true },
      hi: { type: String, required: true },
    },

    requiredDocuments: {
      en: { type: [String], default: [] },
      hi: { type: [String], default: [] },
    },

    applicationSteps: {
      en: { type: [String], default: [] },
      hi: { type: [String], default: [] },
    },

    helpCentre: {
      name: String,
      address: String,
      phone: String,
    },

    officialSource: {
      type: String,
      default: "",
    },

    lastCheckedAt: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED", "ARCHIVED"],
      default: "DRAFT",
    },

    summaryGeneratedByAI: {
      type: Boolean,
      default: false,
    },

    summary: {
      en: { type: String, default: "" },
      hi: { type: String, default: "" },
    },
  },
  { timestamps: true },
);

schemeSchema.index({ status: 1, need: 1 });
schemeSchema.index({ status: 1, districts: 1 });

const Scheme = mongoose.model("Scheme", schemeSchema);

export default Scheme;