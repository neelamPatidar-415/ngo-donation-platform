import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateSchemeSummary = async (noticeText) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing.");
  }

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || "gemini-3.1-flash-lite",
    contents: `
Create a concise, easy-to-understand summary of this government scheme.

Rules:
- Use ONLY the information in the supplied notice.
- Do not invent eligibility, benefits, dates, documents or procedures.
- If information is missing, leave it out.
- Hindi must be simple and accessible to rural readers.
- Return valid JSON with exactly two string fields: "en" and "hi".

OFFICIAL NOTICE:
${noticeText}
`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          en: { type: "STRING" },
          hi: { type: "STRING" },
        },
        required: ["en", "hi"],
      },
    },
  });

  const result = JSON.parse(response.text);

  if (!result.en?.trim() || !result.hi?.trim()) {
    throw new Error("AI returned an incomplete summary.");
  }

  return result;
};