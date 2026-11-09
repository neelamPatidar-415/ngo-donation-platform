
import { useEffect, useState } from "react";
import api from "../../services/api";

const initialForm = {
  campaignId: "",
  title: { en: "", hi: "" },
  summary: { en: "", hi: "" },
  description: { en: "", hi: "" },
  category: "Health",
  goalAmount: 100000,
  endDate: "",
  impact: { en: "", hi: "" },
};

function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadCampaigns = async () => {
    try {
      const { data } = await api.get("/admin/campaigns");
      setCampaigns(data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load campaigns.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const updateField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const updateLocalized = (field, lang, value) =>
    setForm((prev) => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value },
    }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (editingId) {
        await api.put(`/admin/campaigns/${editingId}`, {
          title: form.title,
          summary: form.summary,
          description: form.description,
          category: form.category,
          goalAmount: Number(form.goalAmount),
          endDate: form.endDate || null,
          impact: form.impact,
        });
      } else {
        await api.post("/admin/campaigns", {
          ...form,
          goalAmount: Number(form.goalAmount),
        });
      }

      setForm(initialForm);
      setEditingId(null);
      await loadCampaigns();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save campaign.");
    } finally {
      setSaving(false);
    }
  };

  const editCampaign = (campaign) => {
    setEditingId(campaign.campaignId);
    setForm({
      ...initialForm,
      ...campaign,
      title: campaign.title || { en: "", hi: "" },
      summary: campaign.summary || { en: "", hi: "" },
      description: campaign.description || { en: "", hi: "" },
      impact: campaign.impact || { en: "", hi: "" },
      endDate: campaign.endDate
        ? new Date(campaign.endDate).toISOString().slice(0, 10)
        : "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const changeStatus = async (campaignId, status) => {
    try {
      await api.patch(`/admin/campaigns/${campaignId}/status`, { status });
      await loadCampaigns();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update status.");
    }
  };

  if (loading) return <p className="p-8">Loading campaigns...</p>;

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <h1 className="text-3xl font-bold">Campaign Management</h1>
      <p className="text-gray-500 mt-2">
        Create, edit and manage donation campaigns.
      </p>

      
      <section className="bg-white rounded-xl shadow-sm mt-8 overflow-x-auto">
        <h2 className="text-xl font-semibold p-6">All Campaigns</h2>
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4">Campaign</th>
              <th className="p-4">Goal</th>
              <th className="p-4">Raised</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <tr key={campaign._id} className="border-t">
                <td className="p-4">
                  <p className="font-semibold">
                    {campaign.title?.en || campaign.campaignId}
                  </p>
                  <p className="text-sm text-gray-500">{campaign.campaignId}</p>
                </td>
                <td className="p-4">₹{campaign.goalAmount?.toLocaleString("en-IN")}</td>
                <td className="p-4">₹{campaign.raisedAmount?.toLocaleString("en-IN")}</td>
                <td className="p-4">{campaign.status}</td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => editCampaign(campaign)} className="text-blue-700">
                      Edit
                    </button>
                    {campaign.status !== "ACTIVE" && (
                      <button onClick={() => changeStatus(campaign.campaignId, "ACTIVE")} className="text-emerald-700">
                        Activate
                      </button>
                    )}
                    {campaign.status !== "COMPLETED" && (
                      <button onClick={() => changeStatus(campaign.campaignId, "COMPLETED")} className="text-orange-700">
                        Complete
                      </button>
                    )}
                    {campaign.status !== "ARCHIVED" && (
                      <button onClick={() => changeStatus(campaign.campaignId, "ARCHIVED")} className="text-red-600">
                        Archive
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {campaigns.length === 0 && <p className="p-6 text-gray-500">No campaigns found.</p>}
      </section>

      {error && (
        <p className="bg-red-100 text-red-700 p-3 rounded-lg mt-5">{error}</p>
      )}

      <form onSubmit={submit} className="bg-white rounded-xl p-6 mt-8 space-y-4 shadow-sm">
        <h2 className="text-xl font-semibold">
          {editingId ? "Edit Campaign" : "Create Campaign"}
        </h2>

        <input
          className="w-full border rounded-lg p-3"
          placeholder="Campaign ID (CMP-004)"
          value={form.campaignId}
          disabled={Boolean(editingId)}
          required
          onChange={(e) => updateField("campaignId", e.target.value.toUpperCase())}
        />

        <select
          className="w-full border rounded-lg p-3"
          value={form.category}
          onChange={(e) => updateField("category", e.target.value)}
        >
          {["Health", "Livelihood", "Education", "General"].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>

        {["title", "summary", "description", "impact"].map((field) => (
          <div key={field} className="space-y-2">
            <h3 className="font-medium capitalize">{field}</h3>
            <input
              className="w-full border rounded-lg p-3"
              placeholder={`${field} in English`}
              value={form[field].en || ""}
              required={field !== "impact"}
              onChange={(e) => updateLocalized(field, "en", e.target.value)}
            />
            <input
              className="w-full border rounded-lg p-3"
              placeholder={`${field} in Hindi`}
              value={form[field].hi || ""}
              onChange={(e) => updateLocalized(field, "hi", e.target.value)}
            />
          </div>
        ))}

        <label className="block">
          <span className="block mb-2 font-medium">Goal amount (₹)</span>
          <input
            type="number"
            min="1"
            required
            className="w-full border rounded-lg p-3"
            value={form.goalAmount}
            onChange={(e) => updateField("goalAmount", e.target.value)}
          />
        </label>

        <label className="block">
          <span className="block mb-2 font-medium">End date (optional)</span>
          <input
            type="date"
            className="w-full border rounded-lg p-3"
            value={form.endDate}
            onChange={(e) => updateField("endDate", e.target.value)}
          />
        </label>

        <div className="flex gap-3">
          <button
            disabled={saving}
            className="bg-emerald-700 text-white px-6 py-3 rounded-lg disabled:opacity-50"
          >
            {saving ? "Saving..." : editingId ? "Update Campaign" : "Create Campaign"}
          </button>

          {editingId && (
            <button
              type="button"
              className="border px-6 py-3 rounded-lg"
              onClick={() => {
                setEditingId(null);
                setForm(initialForm);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

    </main>
  );
}

export default AdminCampaigns;
