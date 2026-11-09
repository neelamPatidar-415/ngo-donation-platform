import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

import Navbar from "../../components/Navbar";
import { getEligibilityQuestions, checkEligibility } from "../../services/schemeService";

export default function EligibilityFinder() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    getEligibilityQuestions()
      .then(setQuestions)
      .catch(() => setError("सवाल लोड नहीं हो सके।"))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const result = await checkEligibility(answers);

      navigate("/eligibility/results", {
        state: { result },
      });
    } catch (err) {
      setError(err.response?.data?.message || "कुछ गलत हुआ। पुनः प्रयास करें।");
    } finally {
      setSubmitting(false);
    }
  };

  const updateAnswer = (field, value) => {
    setAnswers((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return <div className="p-20 text-center" role="status">सवाल लोड हो रहे हैं...</div>;
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-2xl px-5 py-10">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-[#347354]">
          <ArrowLeft size={17} /> होम पर वापस जाएँ
        </Link>

        <div className="mt-8 rounded-3xl border border-[#e8e9df] bg-white p-6 md:p-9">
          <span className="rounded-full bg-[#edf4eb] px-4 py-2 text-sm font-semibold text-[#347354]">
            योजना पात्रता खोजक
          </span>

          <h1 className="mt-6 text-3xl font-bold">
            अपने बारे में कुछ जानकारी दें
          </h1>

          <p className="mt-3 leading-7 text-gray-500">
            आपके जवाबों के आधार पर हम आपको संभावित योजनाओं की जानकारी देंगे।
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-7">
            {questions.map((question, index) => (
              <div key={question.field}>
                <label
                  htmlFor={question.field}
                  className="mb-3 block font-semibold leading-7"
                >
                  {index + 1}. {question.label.hi}
                </label>

                {question.type === "number" && (
                  <input
                    id={question.field}
                    type="number"
                    min="1"
                    max="120"
                    value={answers[question.field] ?? ""}
                    onChange={(e) => updateAnswer(
                      question.field,
                      e.target.value === "" ? "" : Number(e.target.value)
                    )}
                    placeholder="अपनी आयु दर्ज करें"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3"
                  />
                )}

                {question.type === "select" && (
                  <select
                    id={question.field}
                    value={answers[question.field] ?? ""}
                    onChange={(e) => updateAnswer(question.field, e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3"
                  >
                    <option value="">चुनें</option>
                    {question.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label.hi}
                      </option>
                    ))}
                  </select>
                )}

                {question.type === "boolean" && (
                  <div className="flex flex-wrap gap-3">
                    {[
                      { value: true, label: "हाँ" },
                      { value: false, label: "नहीं" },
                    ].map((option) => (
                      <button
                        key={String(option.value)}
                        type="button"
                        aria-pressed={answers[question.field] === option.value}
                        onClick={() => updateAnswer(question.field, option.value)}
                        className={`min-w-24 rounded-xl border px-6 py-3 font-medium ${
                          answers[question.field] === option.value
                            ? "border-[#347354] bg-[#edf4eb] text-[#347354]"
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {error && (
              <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#347354] px-6 py-4 font-semibold text-white disabled:opacity-60"
            >
              {submitting ? "जाँच हो रही है..." : "संभावित योजनाएँ देखें"}
              {!submitting && <ArrowRight size={18} />}
            </button>

            <p className="text-center text-xs leading-6 text-gray-400">
              आपकी जानकारी के आधार पर संभावित मिलान दिखाए जाएँगे।
              यह सरकारी पात्रता की गारंटी नहीं है।
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}