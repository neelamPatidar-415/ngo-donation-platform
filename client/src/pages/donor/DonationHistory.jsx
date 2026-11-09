import { useEffect, useState } from "react";
import { getMyDonations } from "../../services/donationService";
import { downloadReceipt } from "../../services/receiptService";

export default function DonationHistory() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    getMyDonations()
      .then(setDonations)
      .catch(() => setError("Unable to load donation history."))
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = async (id) => {
    try {
      setDownloading(id);
      await downloadReceipt(id);
    } catch {
      setError("Unable to download receipt.");
    } finally {
      setDownloading(null);
    }
  };

  if (loading) return <p className="p-8">Loading history...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-5 md:p-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-2xl font-bold">Donation History</h1>

        {error && (
          <p className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">
            {error}
          </p>
        )}

        {donations.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center text-gray-500">
            No donations found yet.
          </div>
        ) : (
          <div className="space-y-4">
            {donations.map((donation) => (
              <div
                key={donation._id}
                className="flex flex-col justify-between gap-4 rounded-xl bg-white p-5 shadow-sm md:flex-row md:items-center"
              >
                <div>
                  <h2 className="font-semibold">
                    {donation.campaign?.title?.en || "Campaign"}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {new Date(
                      donation.paidAt || donation.createdAt
                    ).toLocaleDateString("en-IN")}
                  </p>

                  <p className="mt-1 text-sm">
                    {donation.frequency.replace("_", " ")}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div>
                    <p className="font-bold">
                      ₹{donation.amount.toLocaleString("en-IN")}
                    </p>

                    <p className={
                      donation.paymentStatus === "SUCCESS"
                        ? "text-sm text-green-700"
                        : "text-sm text-red-600"
                    }>
                      {donation.paymentStatus}
                    </p>
                  </div>

                  {donation.paymentStatus === "SUCCESS" && (
                    <button
                      disabled={downloading === donation._id}
                      onClick={() => handleDownload(donation._id)}
                      className="rounded-lg bg-green-700 px-4 py-2 text-white disabled:opacity-50"
                    >
                      {downloading === donation._id
                        ? "Downloading..."
                        : "Download Receipt"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}