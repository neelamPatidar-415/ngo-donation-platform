
import { useEffect, useState } from "react";
import api from "../../services/api";

const emptyForm = {
  schemeId: "",
  title: { en: "", hi: "" },
  description: { en: "", hi: "" },
  need: "Health",
  eligibilityText: { en: "", hi: "" },
  benefits: { en: "", hi: "" },
  lastCheckedAt: new Date().toISOString().slice(0, 10),
};

function AdminSchemes() {
  const [schemes, setSchemes] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchSchemes = async () => {
    try {
      const { data } = await api.get("/admin/schemes");
      setSchemes(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load schemes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, []);

  const changeField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const changeLocalized = (field, language, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: { ...prev[field], [language]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (editingId) {
        await api.put(`/admin/schemes/${editingId}`, {
          title: form.title,
          description: form.description,
          need: form.need,
          eligibilityText: form.eligibilityText,
        });
      } else {
        await api.post("/admin/schemes", form);
      }

      setForm(emptyForm);
      setEditingId(null);
      await fetchSchemes();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save scheme.");
    } finally {
      setSaving(false);
    }
  };

  const editScheme = (scheme) => {
  setEditingId(scheme.schemeId);

  setForm({
    ...emptyForm,
    schemeId: scheme.schemeId,
    title: scheme.title,
    description: scheme.description,
    need: scheme.need,
    eligibilityText: scheme.eligibilityText,
    benefits: scheme.benefits || { en: "", hi: "" },
    lastCheckedAt: scheme.lastCheckedAt
      ? new Date(scheme.lastCheckedAt).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10),
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
};

  const changeStatus = async (schemeId, status) => {
    try {
      await api.patch(`/admin/schemes/${schemeId}/status`, { status });
      await fetchSchemes();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update status.");
    }
  };

  if (loading) return <p className="p-8">Loading schemes...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <h1 className="text-3xl font-bold">Scheme Management</h1>
      <p className="text-gray-500 mt-2">
        Create, update and publish women's welfare schemes.
      </p>

      <div className="bg-white rounded-xl shadow-sm mt-8 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-4">Scheme</th>
              <th className="p-4">Category</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {schemes.map((scheme) => (
              <tr key={scheme._id} className="border-b">
                <td className="p-4">
                  <p className="font-semibold">
                    {scheme.title?.en || scheme.schemeId}
                  </p>
                  <p className="text-sm text-gray-500">{scheme.schemeId}</p>
                </td>
                <td className="p-4">{scheme.need}</td>
                <td className="p-4">{scheme.status}</td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => editScheme(scheme)}
                      className="text-blue-700 font-medium"
                    >
                      Edit
                    </button>

                    {scheme.status !== "PUBLISHED" && (
                      <button
                        onClick={() =>
                          changeStatus(scheme.schemeId, "PUBLISHED")
                        }
                        className="text-emerald-700 font-medium"
                      >
                        Publish
                      </button>
                    )}

                    {scheme.status !== "ARCHIVED" && (
                      <button
                        onClick={() =>
                          changeStatus(scheme.schemeId, "ARCHIVED")
                        }
                        className="text-red-600 font-medium"
                      >
                        Archive
                      </button>
                    )}

                    {scheme.status === "ARCHIVED" && (
                      <button
                        onClick={() => changeStatus(scheme.schemeId, "DRAFT")}
                        className="text-gray-700 font-medium"
                      >
                        Restore
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {schemes.length === 0 && (
          <p className="p-6 text-gray-500">No schemes found.</p>
        )}
      </div>

      {error && (
        <p className="bg-red-100 text-red-700 p-3 rounded-lg mt-5">{error}</p>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm p-6 mt-8 space-y-4"
      >
        <h2 className="text-xl font-semibold">
          {editingId ? "Edit Scheme" : "Create New Scheme"}
        </h2>

        <input
          className="w-full border rounded-lg p-3"
          placeholder="Scheme ID (e.g. SCH-040)"
          value={form.schemeId}
          disabled={Boolean(editingId)}
          required
          onChange={(e) =>
            changeField("schemeId", e.target.value.trim().toUpperCase())
          }
        />

        <select
          className="w-full border rounded-lg p-3"
          value={form.need}
          onChange={(e) => changeField("need", e.target.value)}
        >
          <option>Health</option>
          <option>Livelihood</option>
          <option>Education</option>
          <option>Pension</option>
        </select>

        {["title", "description", "eligibilityText"].map((field) => (
          <div key={field} className="space-y-2">
            <h3 className="font-medium capitalize">{field}</h3>
            <input
              className="w-full border rounded-lg p-3"
              placeholder={`${field} in English`}
              value={form[field].en || ""}
              required
              onChange={(e) => changeLocalized(field, "en", e.target.value)}
            />
            <input
              className="w-full border rounded-lg p-3"
              placeholder={`${field} in Hindi`}
              value={form[field].hi || ""}
              onChange={(e) => changeLocalized(field, "hi", e.target.value)}
            />
          </div>
        ))}

        <div className="space-y-2">
          <h3 className="font-medium">Benefits</h3>

          <input
            className="w-full border rounded-lg p-3"
            placeholder="Benefits in English"
            value={form.benefits.en}
            required
            onChange={(e) => changeLocalized("benefits", "en", e.target.value)}
          />

          <input
            className="w-full border rounded-lg p-3"
            placeholder="Benefits in Hindi"
            value={form.benefits.hi}
            required
            onChange={(e) => changeLocalized("benefits", "hi", e.target.value)}
          />
        </div>

        <input
          type="date"
          className="w-full border rounded-lg p-3"
          value={form.lastCheckedAt}
          required
          onChange={(e) => changeField("lastCheckedAt", e.target.value)}
        />

        <div className="flex gap-3">
          <button
            disabled={saving}
            className="bg-emerald-700 text-white px-6 py-3 rounded-lg disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : editingId
                ? "Update Scheme"
                : "Create Draft"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
              className="border px-6 py-3 rounded-lg"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default AdminSchemes;
