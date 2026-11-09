import Scheme from "../models/Scheme.js";

const evaluateRule = (rule, answers) => {
  const actualValue = answers[rule.field];

  if (actualValue === undefined || actualValue === null || actualValue === "") {
    return "UNKNOWN";
  }

  let matched = false;

  switch (rule.operator) {
    case "equals":
      matched = actualValue === rule.value;
      break;

    case "gte":
      matched = Number(actualValue) >= Number(rule.value);
      break;

    case "lte":
      matched = Number(actualValue) <= Number(rule.value);
      break;

    default:
      return "UNKNOWN";
  }

  return matched ? "MATCHED" : "NOT_MATCHED";
};

export const findEligibleSchemes = async (answers) => {
  const schemes = await Scheme.find({
    status: "PUBLISHED",
  }).lean();

  const results = schemes.map((scheme) => {
    const matchedRules = [];
    const failedRules = [];
    const unknownRules = [];

    for (const rule of scheme.eligibilityRules) {
      const result = evaluateRule(rule, answers);

      const explanation = rule.description;

      if (result === "MATCHED") matchedRules.push(explanation);
      else if (result === "NOT_MATCHED") failedRules.push(explanation);
      else unknownRules.push(explanation);
    }

    // const isPossibleMatch = failedRules.length === 0;
    const isPossibleMatch =
  failedRules.length === 0 && matchedRules.length > 0;

    return {
      schemeId: scheme.schemeId,
      title: scheme.title,
      need: scheme.need,
      benefits: scheme.benefits,
      lastCheckedAt: scheme.lastCheckedAt,

      possibleMatch: isPossibleMatch,
      confidence: unknownRules.length === 0 ? "COMPLETE" : "INCOMPLETE",

      rulesUsed: matchedRules,
      unmetConditions: failedRules,
      unknownConditions: unknownRules,
    };
  });

  return {
    possibleMatches: results.filter((item) => item.possibleMatch),
    otherSchemes: results.filter((item) => !item.possibleMatch),
    disclaimer:
      "These are possible matches based on your answers, not a guarantee of eligibility. Please contact the helpline or relevant authority for confirmation.",
  };
};
