import { findEligibleSchemes } from "../services/eligibilityService.js";

import { answerEligibilityQuestion } from "../services/eligibilityAssistantService.js";

export const askEligibilityAssistant = async (req, res, next) => {
  try {
    const { question } = req.body;

    if (
      typeof question !== "string" ||
      !question.trim() ||
      question.length > 1000
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid question (maximum 1000 characters).",
      });
    }

    const result = await answerEligibilityQuestion(question.trim());

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getEligibilityQuestions = (req, res) => {
  const questions = [
    {
      field: "age",
      type: "number",
      label: {
        en: "What is your age?",
        hi: "आपकी आयु कितनी है?",
      },
    },
    {
      field: "maritalStatus",
      type: "select",
      label: {
        en: "What is your marital status?",
        hi: "आपकी वैवाहिक स्थिति क्या है?",
      },
      options: [
        { value: "married", label: { en: "Married", hi: "विवाहित" } },
        { value: "widow", label: { en: "Widow", hi: "विधवा" } },
        { value: "unmarried", label: { en: "Unmarried", hi: "अविवाहित" } },
        { value: "other", label: { en: "Other", hi: "अन्य" } },
      ],
    },
    {
      field: "hasBplCard",
      type: "boolean",
      label: {
        en: "Do you have a BPL card?",
        hi: "क्या आपके पास BPL कार्ड है?",
      },
    },
    {
      field: "isShgMember",
      type: "boolean",
      label: {
        en: "Are you a member of a registered SHG?",
        hi: "क्या आप पंजीकृत स्वयं सहायता समूह की सदस्य हैं?",
      },
    },
    {
      field: "isPregnant",
      type: "boolean",
      label: {
        en: "Are you currently pregnant?",
        hi: "क्या आप वर्तमान में गर्भवती हैं?",
      },
    },
    {
      field: "isFirstChild",
      type: "boolean",
      label: {
        en: "Are you expecting your first child?",
        hi: "क्या यह आपकी पहली संतान होगी?",
      },
    },
  ];

  res.status(200).json({
    success: true,
    data: questions,
  });
};

export const checkEligibility = async (req, res, next) => {
  try {
    const result = await findEligibleSchemes(req.body);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};