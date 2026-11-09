
import api from "./api";

export const getCampaigns = async (params = {}) => {
  const { data } = await api.get("/campaigns", { params });
  return data.data;
};

export const getCampaignDetails = async (campaignId) => {
  const { data } = await api.get(`/campaigns/${campaignId}`);
  return data.data.campaign;
};
