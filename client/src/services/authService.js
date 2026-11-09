
import api from "./api";

export const registerDonor = async (userData) => {
  const { data } = await api.post("/auth/register", userData);
  return data.data;
};

export const loginDonor = async (credentials) => {
  const { data } = await api.post("/auth/login", credentials);
  return data.data;
};

export const getCurrentUser = async () => {
  const { data } = await api.get("/auth/me");
  return data.data.user;
};
