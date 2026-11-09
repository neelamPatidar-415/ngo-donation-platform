import { useState } from "react";
import api from "../../services/api";

export default function EligibilityAssistant() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [listening, setListening] = useState(false);

  const askAssistant = async (e) => {
    e?.preventDefault();

    if (!question.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await api.post("/eligibility/assistant", {
        question: question.trim(),
      });

      setResult(res.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const startVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Voice input is not supported in this browser. Please type instead.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "hi-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event) => {
      setQuestion((prev) =>
        `${prev} ${event.results[0][0].transcript}`.trim()
      );
    };

    recognition.onerror = () => {
      setError("Voice recognition failed. Please try again.");
    };

    recognition.onend = () => setListening(false);

    recognition.start();
  };

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="text-center">
          <span className="text-sm font-semibold text-green-700">
            SCHEME ASSISTANT
          </span>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            योजना सहायक
          </h1>

          <p className="mt-3 text-gray-600">
            अपनी परिस्थिति बताएं और अपने लिए संभावित सरकारी योजनाएं खोजें।
          </p>
        </div>

        <form
          onSubmit={askAssistant}
          className="space-y-4 rounded-2xl border bg-white p-5 shadow-sm"
        >
          <label className="font-semibold text-gray-800">
            अपना सवाल लिखें या बोलें
          </label>

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            maxLength={1000}
            rows={5}
            placeholder="उदाहरण: मैं 35 साल की विधवा हूं और मेरे पास BPL कार्ड है..."
            className="w-full rounded-xl border p-4 outline-none focus:border-green-600"
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={startVoiceInput}
              disabled={listening || loading}
              className="rounded-lg border border-green-700 px-4 py-2 text-green-700 disabled:opacity-50"
            >
              {listening ? "सुन रही हूँ..." : "🎤 बोलकर पूछें"}
            </button>

            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="rounded-lg bg-green-700 px-6 py-3 font-semibold text-white disabled:opacity-50"
            >
              {loading ? "खोज रहे हैं..." : "योजनाएं खोजें"}
            </button>
          </div>
        </form>

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-5">
            <div className="rounded-xl border bg-white p-5">
              <h2 className="text-lg font-bold">आपकी बताई जानकारी</h2>

              <div className="mt-3 flex flex-wrap gap-2">
                {Object.entries(result.answers || {}).map(([key, value]) => (
                  <span
                    key={key}
                    className="rounded-full bg-green-50 px-3 py-2 text-sm text-green-800"
                  >
                    {key}: {String(value)}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                संभावित योजनाएं
              </h2>

              {result.possibleMatches?.length ? (
                result.possibleMatches.map((scheme) => (
                  <div
                    key={scheme.schemeId}
                    className="mt-3 rounded-xl border bg-white p-5"
                  >
                    <h3 className="font-bold">
                      {scheme.title?.hi || scheme.title?.en || scheme.schemeId}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {scheme.schemeId}
                    </p>

                    <p className="mt-3 text-sm">
                      {scheme.benefits?.hi || scheme.benefits?.en || ""}
                    </p>

                    {scheme.rulesUsed?.length > 0 && (
                      <div className="mt-3">
                        <p className="font-semibold text-green-700">
                          मेल खाने वाली शर्तें
                        </p>
                        {scheme.rulesUsed.map((rule, i) => (
                          <p key={i} className="mt-1 text-sm text-gray-600">
                            ✓ {rule}
                          </p>
                        ))}
                      </div>
                    )}

                    {scheme.unknownConditions?.length > 0 && (
                      <div className="mt-3">
                        <p className="font-semibold text-amber-700">
                          अभी आवश्यक जानकारी
                        </p>
                        {scheme.unknownConditions.map((rule, i) => (
                          <p key={i} className="mt-1 text-sm text-gray-600">
                            • {rule}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="mt-3 rounded-xl bg-white p-5 text-gray-600">
                  अभी कोई संभावित योजना नहीं मिली। कृपया अधिक जानकारी दें।
                </p>
              )}
            </div>

            {result.needsMoreInformation && (
              <div className="rounded-xl bg-amber-50 p-4 text-amber-900">
                {result.followUp}
              </div>
            )}

            {result.otherSchemes?.length > 0 && (
              <details className="rounded-xl border bg-white p-4">
                <summary className="cursor-pointer font-semibold">
                  अन्य योजनाएं देखें ({result.otherSchemes.length})
                </summary>

                {result.otherSchemes.map((scheme) => (
                  <p key={scheme.schemeId} className="mt-3 text-sm">
                    {scheme.title?.hi || scheme.title?.en || scheme.schemeId}
                    {scheme.unmetConditions?.length > 0 && (
                      <span className="block text-gray-500">
                        कारण: {scheme.unmetConditions.join(", ")}
                      </span>
                    )}
                  </p>
                ))}
              </details>
            )}

            <p className="rounded-lg bg-gray-100 p-4 text-sm text-gray-600">
              {result.disclaimer ||
                "ये केवल संभावित मिलान हैं, पात्रता की गारंटी नहीं। अंतिम पुष्टि संबंधित सरकारी विभाग से करें।"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}