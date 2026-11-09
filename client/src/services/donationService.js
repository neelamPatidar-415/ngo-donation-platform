import api from "./api";

export const createDonationOrder = async (data) => {
  const response = await api.post("/donations", data);
  return response.data.data;
};

export const verifyDonationPayment = async (data) => {
  const response = await api.post("/donations/verify", data);
  return response.data.data.donation;
};

export const getMyDonations = async () => {
  const response = await api.get("/donations/my");
  return response.data.data.donations;
};