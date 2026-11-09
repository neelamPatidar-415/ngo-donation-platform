
import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/admin/dashboard");
        setData(response.data.data);
      } catch (err) {
        console.error("Admin dashboard error:", err);
        setError(
          err.response?.data?.message ||
          err.message ||
          "Unable to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="p-10">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="p-10 text-red-600">
        <h2 className="font-bold text-xl">Dashboard Error</h2>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-green-700 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data?.stats) {
    return <div className="p-10">Dashboard data is unavailable.</div>;
  }

  const { stats, recentDonations = [] } = data;

  const cards = [
    ["Total Donors", stats.totalDonors ?? 0],
    ["Total Schemes", stats.totalSchemes ?? 0],
    ["Published Schemes", stats.publishedSchemes ?? 0],
    ["Total Campaigns", stats.totalCampaigns ?? 0],
    ["Active Campaigns", stats.activeCampaigns ?? 0],
    ["Total Donations", stats.totalDonations ?? 0],
    ["Successful Donations", stats.successfulDonations ?? 0],
    [
      "Total Amount Raised",
      `₹${(stats.totalAmountRaised ?? 0).toLocaleString("en-IN")}`,
    ],
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <h1 className="text-3xl font-bold text-gray-800">
        Trust Admin Dashboard
      </h1>

      <p className="text-gray-500 mt-2">
        Monitor donations, schemes and campaigns.
      </p>

      <div className="flex flex-wrap gap-3 mt-6">
        <Link
          to="/admin/schemes"
          className="bg-emerald-700 text-white px-5 py-3 rounded-lg hover:bg-emerald-800"
        >
          Manage Schemes
        </Link>

        <Link
          to="/admin/campaigns"
          className="bg-emerald-700 text-white px-5 py-3 rounded-lg"
        >
          Manage Campaigns
        </Link>

        <Link
          to="/admin/ai-drafts"
          className="rounded-lg bg-green-700 px-4 py-3 text-white"
        >
          AI Summary Review
        </Link>

        <Link
          to="/admin/reports"
          className="bg-blue-700 text-white px-5 py-3 rounded-lg"
        >
          Donation Reports
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
        {cards.map(([label, value]) => (
          <div key={label} className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-gray-500">{label}</p>
            <h2 className="text-2xl font-bold mt-2">{value}</h2>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mt-8 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-5">Recent Donations</h2>

        {recentDonations.length === 0 ? (
          <p className="text-gray-500">No successful donations yet.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="py-3">Donor</th>
                <th>Campaign</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {recentDonations.map((donation) => (
                <tr key={donation._id} className="border-b">
                  <td className="py-3">{donation.donor?.name || "Donor"}</td>
                  <td>
                    {donation.campaign?.title?.en ||
                      donation.campaign?.title ||
                      donation.campaign?.campaignId ||
                      "Campaign"}
                  </td>
                  <td>₹{(donation.amount ?? 0).toLocaleString("en-IN")}</td>
                  <td>
                    {donation.paidAt
                      ? new Date(donation.paidAt).toLocaleDateString("en-IN")
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
