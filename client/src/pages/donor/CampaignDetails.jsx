
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCampaignDetails } from "../../services/campaignService";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function CampaignDetails() {
  const { campaignId } = useParams();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadCampaign = async () => {
      try {
        const result = await getCampaignDetails(campaignId);
        if (!cancelled) setCampaign(result);
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message || "Unable to load campaign."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadCampaign();

    return () => {
      cancelled = true;
    };
  }, [campaignId]);

  if (loading) {
    return <p className="text-center py-20">Loading campaign...</p>;
  }

  if (error || !campaign) {
    return (
      <main className="min-h-screen bg-[#FAF8F3] p-8 text-center">
        <p role="alert" className="text-red-700">
          {error || "Campaign not found."}
        </p>
        <Link to="/campaigns" className="text-emerald-800 underline mt-4 inline-block">
          Back to campaigns
        </Link>
      </main>
    );
  }

  const progress = Math.min(
    100,
    Math.round((campaign.raisedAmount / campaign.goalAmount) * 100)
  );

  return (
    <main className="min-h-screen bg-[#FAF8F3] px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Link to="/campaigns" className="text-emerald-800 font-medium">
          ← Back to campaigns
        </Link>

        <article className="bg-white border border-stone-200 rounded-2xl p-6 md:p-10 mt-6">
          <span className="text-sm text-emerald-800 font-semibold">
            {campaign.category}
          </span>

          <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mt-3">
            {campaign.title.en}
          </h1>

          <p className="text-lg text-stone-600 mt-4">{campaign.summary.en}</p>

          <div className="mt-8">
            <div className="flex justify-between gap-3 text-sm">
              <span className="font-bold">
                {formatCurrency(campaign.raisedAmount)} raised
              </span>
              <span className="text-stone-500">{progress}% of goal</span>
            </div>

            <div className="h-3 bg-stone-100 rounded-full overflow-hidden mt-3">
              <div
                className="h-full bg-emerald-700 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-stone-600 mt-3">
              Goal: {formatCurrency(campaign.goalAmount)}
            </p>
          </div>

          <hr className="my-8 border-stone-200" />

          <h2 className="text-xl font-bold text-stone-900">
            About this campaign
          </h2>

          <p className="text-stone-600 leading-7 mt-3 whitespace-pre-line">
            {campaign.description.en}
          </p>

          <div className="mt-8">
            <Link
              to={`/campaigns/${campaign.campaignId}/donate`}
              className="inline-block bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-8 py-3 rounded-lg transition"
            >
              Donate Now
            </Link>
          </div>

          {campaign.impact?.en && (
            <section className="bg-emerald-50 rounded-xl p-5 mt-8">
              <h2 className="font-bold text-emerald-900">Intended impact</h2>
              <p className="text-emerald-900 mt-2">{campaign.impact.en}</p>
            </section>
          )}

          <p className="text-xs text-stone-500 mt-8">
            Campaign information is illustrative demo data and must be verified
            by the Trust Admin before publication.
          </p>
        </article>
      </div>
    </main>
  );
}
