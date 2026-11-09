
import api from "./api";

export const getMyReceipts = async () => {
  const { data } = await api.get("/receipts/my");
  return data.data.receipts;
};

export const downloadReceipt = async (donationId) => {
  const response = await api.get(`/receipts/${donationId}/pdf`, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(response.data);
  const link = document.createElement("a");

  link.href = url;
  link.download = `donation-${donationId}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
};
