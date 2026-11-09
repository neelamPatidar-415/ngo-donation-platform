import { GoogleGenAI } from "@google/genai";
import { findEligibleSchemes } from "./eligibilityService.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const allowedMaritalStatuses = [
  "married",
  "widow",
  "unmarried",
  "other",
];

export const answerEligibilityQuestion = async (question) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing.");
  }

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || "gemini-3.1-flash-lite",
    contents: `
Extract only facts explicitly stated by the user.
The user may write in Hindi or English.

Return JSON with these optional fields:
- age: number
- maritalStatus: married, widow, unmarried, or other
- hasBplCard: boolean
- isShgMember: boolean
- isPregnant: boolean
- isFirstChild: boolean

Do not guess or infer missing answers.
If a fact is not explicitly stated, omit that field.

USER QUESTION:
${question}
`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          age: { type: "NUMBER" },
          maritalStatus: {
            type: "STRING",
            enum: allowedMaritalStatuses,
          },
          hasBplCard: { type: "BOOLEAN" },
          isShgMember: { type: "BOOLEAN" },
          isPregnant: { type: "BOOLEAN" },
          isFirstChild: { type: "BOOLEAN" },
        },
      },
    },
  });

  const extracted = JSON.parse(response.text || "{}");

  // Accept only known fields and valid values.
  const answers = {};

  if (Number.isInteger(extracted.age) && extracted.age > 0 && extracted.age <= 120) {
    answers.age = extracted.age;
  }

  if (allowedMaritalStatuses.includes(extracted.maritalStatus)) {
    answers.maritalStatus = extracted.maritalStatus;
  }

  for (const field of [
    "hasBplCard",
    "isShgMember",
    "isPregnant",
    "isFirstChild",
  ]) {
    if (typeof extracted[field] === "boolean") {
      answers[field] = extracted[field];
    }
  }

  if (Object.keys(answers).length === 0) {
    return {
      answers,
      needsMoreInformation: true,
      possibleMatches: [],
      otherSchemes: [],
      followUp: "कृपया अपनी उम्र, वैवाहिक स्थिति और संबंधित जानकारी बताएं।",
      disclaimer:
        "These results are indicative only and do not guarantee eligibility.",
    };
  }

  const result = await findEligibleSchemes(answers);

  return {
    ...result,
    answers,
    needsMoreInformation: Object.keys(answers).length < 6,
    followUp:
      Object.keys(answers).length < 6
        ? "कुछ जानकारी अभी बाकी है। कृपया Eligibility Finder के प्रश्नों के उत्तर दें।"
        : null,
  };
};