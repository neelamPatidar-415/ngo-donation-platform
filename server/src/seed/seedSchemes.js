import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Scheme from "../models/Scheme.js";

dotenv.config();

const schemes = [
  {
    schemeId: "SCH-014",

    title: {
      en: "State Widow Pension",
      hi: "राज्य विधवा पेंशन योजना",
    },

    description: {
      en: "Financial assistance for eligible widows.",
      hi: "पात्र विधवा महिलाओं के लिए आर्थिक सहायता।",
    },

    need: "Pension",

    eligibilityText: {
      en: "Widow aged 18–79 with a BPL card.",
      hi: "18 से 79 वर्ष की आयु की विधवा महिला जिसके पास BPL कार्ड हो।",
    },

    eligibilityRules: [
      {
        field: "maritalStatus",
        operator: "equals",
        value: "widow",
        description: {
          en: "Applicant must be a widow.",
          hi: "आवेदक विधवा होनी चाहिए।",
        },
      },
      {
        field: "age",
        operator: "gte",
        value: 18,
        description: {
          en: "Applicant must be at least 18 years old.",
          hi: "आवेदक की आयु कम से कम 18 वर्ष होनी चाहिए।",
        },
      },
      {
        field: "age",
        operator: "lte",
        value: 79,
        description: {
          en: "Applicant must be 79 years old or younger.",
          hi: "आवेदक की आयु 79 वर्ष या उससे कम होनी चाहिए।",
        },
      },
      {
        field: "hasBplCard",
        operator: "equals",
        value: true,
        description: {
          en: "A BPL card is required.",
          hi: "BPL कार्ड आवश्यक है।",
        },
      },
    ],

    benefits: {
      en: "₹600 per month.",
      hi: "₹600 प्रति माह।",
    },

    requiredDocuments: { en: [], hi: [] },
    applicationSteps: { en: [], hi: [] },
    districts: [],
    helpCentre: {},
    officialSource: "",
    lastCheckedAt: new Date("2026-09-12"),
    status: "PUBLISHED",
  },

  {
    schemeId: "SCH-022",

    title: {
      en: "Self-Help Group Loan Support",
      hi: "स्वयं सहायता समूह ऋण सहायता योजना",
    },

    description: {
      en: "Financial support for registered self-help group members.",
      hi: "पंजीकृत स्वयं सहायता समूह की सदस्यों के लिए वित्तीय सहायता।",
    },

    need: "Livelihood",

    eligibilityText: {
      en: "Member of a registered SHG.",
      hi: "पंजीकृत स्वयं सहायता समूह की सदस्य।",
    },

    eligibilityRules: [
      {
        field: "isShgMember",
        operator: "equals",
        value: true,
        description: {
          en: "Applicant must be a registered SHG member.",
          hi: "आवेदक पंजीकृत स्वयं सहायता समूह की सदस्य होनी चाहिए।",
        },
      },
    ],

    benefits: {
      en: "Loan up to ₹3 lakh at lower interest.",
      hi: "कम ब्याज दर पर ₹3 लाख तक का ऋण।",
    },

    requiredDocuments: { en: [], hi: [] },
    applicationSteps: { en: [], hi: [] },
    districts: [],
    helpCentre: {},
    officialSource: "",
    lastCheckedAt: new Date("2026-08-30"),
    status: "PUBLISHED",
  },

  {
    schemeId: "SCH-031",

    title: {
      en: "Maternity Cash Benefit",
      hi: "मातृत्व नकद लाभ योजना",
    },

    description: {
      en: "Financial assistance for eligible pregnant women.",
      hi: "पात्र गर्भवती महिलाओं के लिए आर्थिक सहायता।",
    },

    need: "Health",

    eligibilityText: {
      en: "Pregnant woman expecting her first child.",
      hi: "पहली संतान की अपेक्षा कर रही गर्भवती महिला।",
    },

    eligibilityRules: [
      {
        field: "isPregnant",
        operator: "equals",
        value: true,
        description: {
          en: "Applicant must be pregnant.",
          hi: "आवेदक गर्भवती होनी चाहिए।",
        },
      },
      {
        field: "isFirstChild",
        operator: "equals",
        value: true,
        description: {
          en: "The benefit is for the first child.",
          hi: "यह लाभ पहली संतान के लिए है।",
        },
      },
    ],

    benefits: {
      en: "₹5,000 in instalments.",
      hi: "किस्तों में ₹5,000।",
    },

    requiredDocuments: { en: [], hi: [] },
    applicationSteps: { en: [], hi: [] },
    districts: [],
    helpCentre: {},
    officialSource: "",
    lastCheckedAt: new Date("2026-10-05"),
    status: "PUBLISHED",
  },
];

const seedSchemes = async () => {
  try {
    await connectDB();

    for (const scheme of schemes) {
      await Scheme.findOneAndUpdate(
        { schemeId: scheme.schemeId },
        scheme,
        { upsert: true, new: true, runValidators: true }
      );
    }

    console.log("Three sample schemes seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedSchemes();