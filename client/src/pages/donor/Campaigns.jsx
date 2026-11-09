
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCampaigns } from "../../services/campaignService";

const categories = ["All", "Health", "Livelihood", "Education"];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadCampaigns = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await getCampaigns(
          category === "All" ? {} : { category }
        );

        if (!cancelled) {
          setCampaigns(result.campaigns);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message || "Unable to load campaigns."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadCampaigns();

    return () => {
      cancelled = true;
    };
  }, [category]);

  return (
    <main className="min-h-screen bg-[#FAF8F3] px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <section className="mb-10">
          <p className="text-emerald-700 font-semibold text-sm">
            MAKE A DIFFERENCE
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mt-3">
            Support a cause that matters
          </h1>

          <p className="text-stone-600 mt-3 max-w-2xl">
            Explore campaigns supporting women's health, education,
            and livelihood opportunities.
          </p>
        </section>

        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`rounded-full px-5 py-2 text-sm font-medium border ${
                category === item
                  ? "bg-emerald-800 text-white border-emerald-800"
                  : "bg-white text-stone-700 border-stone-300 hover:border-emerald-700"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {loading && (
          <p className="text-center py-16 text-stone-600">
            Loading campaigns...
          </p>
        )}

        {error && (
          <div role="alert" className="bg-red-50 text-red-700 p-4 rounded-xl">
            {error}
            <button
              onClick={() => setCategory((current) => current)}
              className="ml-3 underline font-semibold"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && campaigns.length === 0 && (
          <p className="text-center py-16 text-stone-600">
            No active campaigns found in this category.
          </p>
        )}

        {!loading && !error && campaigns.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => {
              const progress = Math.min(
                100,
                Math.round(
                  (campaign.raisedAmount / campaign.goalAmount) * 100
                )
              );

              return (
                <article
                  key={campaign.campaignId}
                  className="bg-white border border-stone-200 rounded-2xl p-6 flex flex-col shadow-sm hover:shadow-md transition"
                >
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 rounded-full px-3 py-1 self-start">
                    {campaign.category}
                  </span>

                  <h2 className="text-xl font-bold text-stone-900 mt-4">
                    {campaign.title.en}
                  </h2>

                  <p className="text-stone-600 text-sm mt-3 flex-grow">
                    {campaign.summary.en}
                  </p>

                  <div className="mt-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold">
                        {formatCurrency(campaign.raisedAmount)} raised
                      </span>
                      <span className="text-stone-500">
                        {progress}%
                      </span>
                    </div>

                    <div
                      className="h-2 bg-stone-100 rounded-full overflow-hidden"
                      role="progressbar"
                      aria-label="Campaign fundraising progress"
                      aria-valuenow={progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className="h-full bg-emerald-700 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <p className="text-sm text-stone-500 mt-2">
                      Goal: {formatCurrency(campaign.goalAmount)}
                    </p>
                  </div>

                  <Link
                    to={`/campaigns/${campaign.campaignId}`}
                    className="block text-center mt-6 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg py-3"
                  >
                    View campaign
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
