
import { useEffect, useState } from "react";
import api from "../../services/api";

function AdminReports() {
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/reports/donations")
      .then(({ data }) => setReport(data.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Unable to load reports.")
      )
      .finally(() => setLoading(false));
  }, []);

  const downloadCSV = async (endpoint, filename) => {
    try {
      const response = await api.get(endpoint, { responseType: "blob" });
      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setError("Unable to download report.");
    }
  };

  if (loading) return <p className="p-8">Loading reports...</p>;
  if (error) return <p className="p-8 text-red-600">{error}</p>;
  if (!report) return <p className="p-8">No report data available.</p>;

  const { summary, campaignStats, recentDonations } = report;

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <h1 className="text-3xl font-bold">Donation Reports</h1>
      <p className="text-gray-500 mt-2">
        Reports based on successfully verified donations.
      </p>

      <div className="grid sm:grid-cols-3 gap-5 mt-8">
        {[
          ["Total Donations", summary.totalDonations],
          ["Total Amount Raised", `₹${(summary.totalAmount || 0).toLocaleString("en-IN")}`],
          ["Average Donation", `₹${Math.round(summary.averageDonation || 0).toLocaleString("en-IN")}`],
        ].map(([label, value]) => (
          <div key={label} className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-gray-500">{label}</p>
            <h2 className="text-2xl font-bold mt-2">{value}</h2>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mt-8">
        <button
          onClick={() => downloadCSV(
            "/admin/reports/donations/export",
            "donation-report.csv"
          )}
          className="bg-emerald-700 text-white px-5 py-3 rounded-lg"
        >
          Download Donation CSV
        </button>

        <button
          onClick={() => downloadCSV(
            "/admin/reports/form-10bd/export",
            "form-10bd-preparation.csv"
          )}
          className="bg-blue-700 text-white px-5 py-3 rounded-lg"
        >
          Export Form 10BD Data
        </button>
      </div>

      <section className="bg-white p-6 rounded-xl shadow-sm mt-8 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Campaign-wise Donations</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-3">Campaign</th>
              <th className="p-3">Donations</th>
              <th className="p-3">Amount Raised</th>
            </tr>
          </thead>
          <tbody>
            {campaignStats.map((item) => (
              <tr key={item._id} className="border-b">
                <td className="p-3">
                  {item.title?.en || item.campaignId || "Campaign"}
                </td>
                <td className="p-3">{item.donationCount}</td>
                <td className="p-3">
                  ₹{item.totalAmount.toLocaleString("en-IN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="bg-white p-6 rounded-xl shadow-sm mt-8 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Recent Donations</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-3">Donor</th>
              <th className="p-3">Campaign</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentDonations.map((d) => (
              <tr key={d._id} className="border-b">
                <td className="p-3">{d.donorName || d.donor?.name || "-"}</td>
                <td className="p-3">
                  {d.campaign?.title?.en || d.campaign?.campaignId || "-"}
                </td>
                <td className="p-3">₹{d.amount.toLocaleString("en-IN")}</td>
                <td className="p-3">
                  {d.paidAt ? new Date(d.paidAt).toLocaleDateString("en-IN") : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <p className="text-sm text-gray-500 mt-5">
        Form 10BD export is a preparation file only. Verify all statutory
        fields and donor details before filing.
      </p>
    </main>
  );
}

export default AdminReports;
