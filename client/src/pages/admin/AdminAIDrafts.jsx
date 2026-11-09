import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminAIDrafts() {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    schemeId: "",
    noticeText: "",
    sourceUrl: "",
    lastCheckedAt: new Date().toISOString().slice(0, 10),
  });

  const loadDrafts = async () => {
    try {
      const res = await api.get("/ai/summary-drafts");
      setDrafts(res.data.data.drafts || []);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load drafts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrafts();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);

    try {
      await api.post(
        `/ai/schemes/${encodeURIComponent(form.schemeId)}/summary-drafts`,
        {
          noticeText: form.noticeText,
          sourceUrl: form.sourceUrl,
          lastCheckedAt: form.lastCheckedAt,
        }
      );

      setMessage("Summary draft generated successfully!");
      setForm({
        schemeId: "",
        noticeText: "",
        sourceUrl: "",
        lastCheckedAt: new Date().toISOString().slice(0, 10),
      });

      await loadDrafts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate draft.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReview = async (draftId, decision) => {
    const reason =
      decision === "REJECTED"
        ? window.prompt("Reason for rejection:") || ""
        : "";

    try {
      await api.patch(`/ai/summary-drafts/${draftId}/review`, {
        decision,
        rejectionReason: reason,
      });

      setMessage(`Draft ${decision.toLowerCase()} successfully.`);
      setError("");
      await loadDrafts();
    } catch (err) {
      setError(err.response?.data?.message || "Review failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            AI Scheme Summary Review
          </h1>
          <p className="mt-2 text-gray-600">
            Generate Hindi and English scheme summaries and review them before approval.
          </p>
        </div>

        {error && (
          <p className="rounded-lg bg-red-100 p-3 text-red-700">{error}</p>
        )}

        {message && (
          <p className="rounded-lg bg-green-100 p-3 text-green-700">
            {message}
          </p>
        )}

        <form
          onSubmit={handleGenerate}
          className="space-y-4 rounded-xl border bg-white p-5 shadow-sm"
        >
          <h2 className="text-lg font-semibold">Generate New Draft</h2>

          <input
            required
            value={form.schemeId}
            onChange={(e) =>
              setForm({ ...form, schemeId: e.target.value.trim() })
            }
            placeholder="Scheme ID (e.g. SCH-014)"
            className="w-full rounded-lg border p-3"
          />

          <textarea
            required
            minLength={20}
            maxLength={20000}
            rows={6}
            value={form.noticeText}
            onChange={(e) =>
              setForm({ ...form, noticeText: e.target.value })
            }
            placeholder="Paste official government notice text..."
            className="w-full rounded-lg border p-3"
          />

          <input
            required
            type="url"
            value={form.sourceUrl}
            onChange={(e) =>
              setForm({ ...form, sourceUrl: e.target.value })
            }
            placeholder="Official source URL"
            className="w-full rounded-lg border p-3"
          />

          <label className="block text-sm font-medium">
            Last checked date
          </label>

          <input
            required
            type="date"
            value={form.lastCheckedAt}
            onChange={(e) =>
              setForm({ ...form, lastCheckedAt: e.target.value })
            }
            className="w-full rounded-lg border p-3"
          />

          <button
            disabled={submitting}
            className="rounded-lg bg-green-700 px-5 py-3 font-semibold text-white disabled:opacity-50"
          >
            {submitting ? "Generating..." : "Generate AI Draft"}
          </button>
        </form>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Generated Drafts</h2>

          {loading ? (
            <p>Loading drafts...</p>
          ) : drafts.length === 0 ? (
            <p className="rounded-lg bg-white p-5 text-gray-500">
              No AI drafts available yet.
            </p>
          ) : (
            drafts.map((draft) => (
              <article
                key={draft._id}
                className="space-y-4 rounded-xl border bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">
                      {draft.scheme?.schemeId || "Scheme"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {draft.scheme?.title?.en || ""}
                    </p>
                  </div>

                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                    {draft.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-semibold">English Summary</h4>
                  <p className="mt-1 text-gray-700">
                    {draft.generatedSummary?.en}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold">Hindi Summary</h4>
                  <p className="mt-1 text-gray-700">
                    {draft.generatedSummary?.hi}
                  </p>
                </div>

                <div className="text-sm text-gray-500">
                  <p>Source: {draft.sourceUrl}</p>
                  <p>
                    Last checked:{" "}
                    {new Date(draft.lastCheckedAt).toLocaleDateString()}
                  </p>
                </div>

                {draft.status === "PENDING_REVIEW" && (
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleReview(draft._id, "APPROVED")}
                      className="rounded-lg bg-green-700 px-4 py-2 text-white"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => handleReview(draft._id, "REJECTED")}
                      className="rounded-lg bg-red-600 px-4 py-2 text-white"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </article>
            ))
          )}
        </section>
      </div>
    </div>
  );
}