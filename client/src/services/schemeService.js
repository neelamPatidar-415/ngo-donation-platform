
import api from "./api";

export const getSchemes = async (params = {}) => {
  const { data } = await api.get("/schemes", { params });
  return data.data;
};

export const getSchemeDetails = async (schemeId) => {
  const { data } = await api.get(`/schemes/${schemeId}`);
  return data.data;
};

export const getSchemeFilters = async () => {
  const { data } = await api.get("/schemes/filters");
  return data.data;
};

export const getEligibilityQuestions = async () => {
  const { data } = await api.get("/eligibility/questions");
  return data.data;
};

export const checkEligibility = async (answers) => {
  const { data } = await api.post("/eligibility/check", answers);
  return data.data;
};