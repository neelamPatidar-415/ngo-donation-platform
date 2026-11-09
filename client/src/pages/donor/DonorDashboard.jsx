import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import useAuth from "../../hooks/useAuth";

export default function DonorDashboard() {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await api.get("/donations/my");
        setDonations(res.data.data.donations || []);
      } catch (error) {
        console.error("Failed to load donations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const successful = donations.filter(
    (d) => d.paymentStatus === "SUCCESS"
  );

  const total = successful.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-5 md:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome, {user?.name || "Donor"}!
          </h1>
          <p className="mt-2 text-gray-600">
            Thank you for supporting women's empowerment.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-gray-500">Total donated</p>
            <h2 className="mt-2 text-3xl font-bold text-green-700">
              ₹{total.toLocaleString("en-IN")}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-gray-500">Successful donations</p>
            <h2 className="mt-2 text-3xl font-bold">
              {successful.length}
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to="/campaigns" className="rounded-lg bg-green-700 px-5 py-3 text-white">
            Explore Campaigns
          </Link>

          <Link to="/donor/history" className="rounded-lg border px-5 py-3">
            Donation History
          </Link>

          <Link to="/schemes" className="rounded-lg border px-5 py-3">
            Explore Schemes
          </Link>
        </div>

        <section className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-bold">Recent Donations</h2>

          {loading ? (
            <p>Loading donations...</p>
          ) : donations.length === 0 ? (
            <p className="text-gray-500">
              You haven't made any donations yet.
            </p>
          ) : (
            successful.slice(0, 5).map((donation) => (
              <div
                key={donation._id}
                className="flex flex-wrap justify-between gap-3 border-b py-4 last:border-0"
              >
                <div>
                  <p className="font-semibold">
                    {donation.campaign?.title?.en || "Campaign"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(donation.paidAt).toLocaleDateString("en-IN")}
                  </p>
                </div>

                <p className="font-bold text-green-700">
                  ₹{donation.amount.toLocaleString("en-IN")}
                </p>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}