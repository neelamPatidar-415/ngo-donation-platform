import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

import Navbar from "../../components/Navbar";

export default function EligibilityResults() {
  const { state } = useLocation();
  const result = state?.result;

  if (!result) {
    return (
      <div className="p-20 text-center">
        परिणाम उपलब्ध नहीं हैं।
        <Link to="/eligibility" className="ml-2 text-green-700 underline">
          दोबारा जाँचें
        </Link>
      </div>
    );
  }

  const { possibleMatches, otherSchemes, disclaimer } = result;

  const renderScheme = (scheme) => (
    <article
      key={scheme.schemeId}
      className="rounded-2xl border border-[#e8e9df] bg-white p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs text-gray-400">{scheme.schemeId}</span>
          <h3 className="mt-1 text-lg font-bold">{scheme.title.hi}</h3>
          <p className="mt-2 font-semibold text-[#347354]">
            {scheme.benefits.hi}
          </p>
        </div>
        <CheckCircle2 className="shrink-0 text-[#347354]" />
      </div>

      <div className="mt-5">
        <p className="mb-2 text-sm font-semibold">जिन शर्तों का मिलान हुआ</p>
        {scheme.rulesUsed.length ? (
          scheme.rulesUsed.map((rule, i) => (
            <p key={i} className="mb-1 text-sm text-gray-600">
              ✓ {rule.hi}
            </p>
          ))
        ) : (
          <p className="text-sm text-gray-500">अभी कोई शर्त सत्यापित नहीं हुई।</p>
        )}
      </div>

      {scheme.unknownConditions.length > 0 && (
        <div className="mt-4 rounded-xl bg-amber-50 p-3">
          <p className="mb-1 text-sm font-semibold text-amber-900">
            कुछ जानकारी की पुष्टि बाकी है
          </p>
          {scheme.unknownConditions.map((rule, i) => (
            <p key={i} className="text-sm text-amber-800">
              • {rule.hi}
            </p>
          ))}
        </div>
      )}

      <Link
        to={`/schemes/${scheme.schemeId}`}
        className="mt-5 inline-block font-semibold text-[#347354] underline"
      >
        योजना की पूरी जानकारी →
      </Link>
    </article>
  );

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-4xl px-5 py-10">
        <Link to="/eligibility" className="inline-flex items-center gap-2 text-sm text-[#347354]">
          <ArrowLeft size={17} /> दोबारा जाँचें
        </Link>

        <h1 className="mt-8 text-3xl font-bold">
          आपके लिए संभावित योजनाएँ
        </h1>

        <p className="mt-3 text-gray-500">
          आपके द्वारा दी गई जानकारी के आधार पर ये योजनाएँ मेल खाती हैं।
        </p>

        <div className="mt-7 space-y-5">
          {possibleMatches.length ? (
            possibleMatches.map(renderScheme)
          ) : (
            <div className="rounded-2xl bg-white p-8 text-center">
              <AlertCircle className="mx-auto text-amber-600" size={32} />
              <p className="mt-3 font-semibold">
                अभी कोई संभावित योजना नहीं मिली।
              </p>
              <p className="mt-2 text-sm text-gray-500">
                आप अपनी जानकारी दोबारा जाँच सकती हैं या सहायता केंद्र से संपर्क कर सकती हैं।
              </p>
            </div>
          )}
        </div>

        {otherSchemes.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-xl font-bold">
              अन्य योजनाएँ
            </h2>
            <div className="space-y-3">
              {otherSchemes.map((scheme) => (
                <div key={scheme.schemeId} className="rounded-xl border border-gray-200 bg-white p-4">
                  <p className="font-semibold">{scheme.title.hi}</p>
                  {scheme.unmetConditions.map((rule, i) => (
                    <p key={i} className="mt-2 text-sm text-gray-500">
                      • {rule.hi}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </section>
        )}

        <p className="mt-8 rounded-xl bg-amber-50 p-5 text-sm leading-7 text-amber-900">
          {disclaimer}
        </p>

        <p className="mt-5 text-sm text-gray-500">
          संबंधित सहायता केंद्र से संपर्क करने का विकल्प आगे जोड़ा जाएगा।
        </p>
      </main>
    </div>
  );
}