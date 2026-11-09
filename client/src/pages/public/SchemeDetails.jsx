import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, FileText, MapPin } from "lucide-react";

import Navbar from "../../components/Navbar";
import { getSchemeDetails } from "../../services/schemeService";

export default function SchemeDetails() {
  const { schemeId } = useParams();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getSchemeDetails(schemeId)
      .then(setScheme)
      .catch(() => setError("योजना की जानकारी उपलब्ध नहीं है।"))
      .finally(() => setLoading(false));
  }, [schemeId]);

  if (loading) {
    return <div className="p-20 text-center" role="status">जानकारी लोड हो रही है...</div>;
  }

  if (error) {
    return (
      <div className="p-20 text-center">
        {error}
        <Link to="/" className="ml-2 text-green-700 underline">होम पर जाएँ</Link>
      </div>
    );
  }

  const notAvailable = "यह जानकारी अभी उपलब्ध नहीं है।";

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-4xl px-5 py-10">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-[#347354]">
          <ArrowLeft size={17} /> सभी योजनाएँ
        </Link>

        <div className="rounded-3xl border border-[#e8e9df] bg-white p-6 md:p-10">
          <span className="rounded-full bg-[#edf4eb] px-4 py-2 text-sm font-semibold text-[#347354]">
            {scheme.need}
          </span>

          <h1 className="mt-6 text-3xl font-bold leading-relaxed">
            {scheme.title.hi}
          </h1>

          <p className="mt-3 leading-8 text-gray-600">
            {scheme.description.hi}
          </p>

          <div className="mt-8 rounded-2xl bg-[#edf4eb] p-6">
            <p className="text-sm text-gray-500">योजना का लाभ</p>
            <p className="mt-2 text-2xl font-bold text-[#347354]">
              {scheme.benefits.hi}
            </p>
          </div>

          <section className="mt-9">
            <h2 className="mb-3 flex items-center gap-2 text-xl font-bold">
              <FileText className="text-[#347354]" /> पात्रता
            </h2>
            <p className="leading-8 text-gray-600">
              {scheme.eligibilityText?.hi || notAvailable}
            </p>
          </section>

          <section className="mt-8">
            <h2 className="mb-3 text-xl font-bold">आवश्यक दस्तावेज़</h2>
            {scheme.requiredDocuments?.hi?.length ? (
              <ul className="list-inside list-disc space-y-2 text-gray-600">
                {scheme.requiredDocuments.hi.map((doc, i) => (
                  <li key={i}>{doc}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">{notAvailable}</p>
            )}
          </section>

          <section className="mt-8">
            <h2 className="mb-3 text-xl font-bold">आवेदन कैसे करें?</h2>
            {scheme.applicationSteps?.hi?.length ? (
              <ol className="list-inside list-decimal space-y-2 text-gray-600">
                {scheme.applicationSteps.hi.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            ) : (
              <p className="text-gray-500">{notAvailable}</p>
            )}
          </section>

          <section className="mt-8 rounded-xl bg-[#f6f8f3] p-5">
            <h2 className="flex items-center gap-2 font-bold">
              <MapPin size={18} /> नजदीकी सहायता केंद्र
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              {scheme.helpCentre?.name || notAvailable}
            </p>
            {scheme.helpCentre?.address && <p>{scheme.helpCentre.address}</p>}
            {scheme.helpCentre?.phone && <p>{scheme.helpCentre.phone}</p>}
          </section>

          <div className="mt-8 flex items-start gap-3 border-t border-gray-100 pt-5 text-sm text-gray-500">
            <CalendarDays size={18} className="shrink-0" />
            <div>
              <p>
                अंतिम जाँच:
                {" "}
                {new Date(scheme.lastCheckedAt).toLocaleDateString("hi-IN")}
              </p>
              {scheme.officialSource ? (
                <a
                  href={scheme.officialSource}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-[#347354] underline"
                >
                  आधिकारिक स्रोत देखें
                </a>
              ) : (
                <p className="mt-1">आधिकारिक स्रोत का लिंक अभी उपलब्ध नहीं है।</p>
              )}
            </div>
          </div>

          <p className="mt-6 rounded-xl bg-amber-50 p-4 text-sm leading-7 text-amber-900">
            यह जानकारी प्रारंभिक मार्गदर्शन के लिए है। अंतिम पात्रता संबंधित
            सरकारी प्राधिकरण से सत्यापित करें।
          </p>
        </div>
      </main>
    </div>
  );
}