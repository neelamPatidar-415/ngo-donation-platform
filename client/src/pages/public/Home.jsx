import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight, ShieldCheck, HeartHandshake } from "lucide-react";

import Navbar from "../../components/Navbar";
import SchemeCard from "../../components/SchemeCard";
import { getSchemes, getSchemeFilters } from "../../services/schemeService";

export default function Home() {
  const [schemes, setSchemes] = useState([]);
  const [filters, setFilters] = useState({ needs: [], districts: [] });
  const [need, setNeed] = useState("");
  const [district, setDistrict] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSchemes = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getSchemes({
        need,
        district,
        search,
      });

      setSchemes(result.schemes);
    } catch {
      setError("योजनाएँ लोड नहीं हो सकीं। कृपया दोबारा प्रयास करें।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSchemeFilters()
      .then(setFilters)
      .catch(() => setFilters({ needs: [], districts: [] }));
  }, []);

  useEffect(() => {
    const timer = setTimeout(loadSchemes, 300);
    return () => clearTimeout(timer);
  }, [need, district, search]);

  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
        <section className="mx-auto max-w-7xl px-5 py-12 md:py-20">
          <div className="grid items-center gap-10 md:grid-cols-[1.3fr_0.7fr]">
            <div>
              <span className="mb-5 inline-block rounded-full bg-[#e9f2e8] px-4 py-2 text-sm font-semibold text-[#347354]">
                महिलाओं के लिए योजनाओं की जानकारी
              </span>

              <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">
                सही योजना की जानकारी,
                <span className="text-[#347354]"> अब आसानी से।</span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-gray-600">
                अपनी जरूरत के अनुसार सरकारी योजनाएँ खोजें। जानें कि कौन-सी
                योजनाएँ आपके लिए उपयोगी हो सकती हैं और आवेदन कैसे करें।
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/eligibility"
                  className="inline-flex items-center gap-2 rounded-full bg-[#347354] px-6 py-3.5 font-semibold text-white hover:bg-[#285b42]"
                >
                  अपनी पात्रता जानें <ArrowRight size={18} />
                </Link>

                <a
                  href="#schemes"
                  className="rounded-full border border-[#d7dfd5] bg-white px-6 py-3.5 font-semibold hover:bg-[#f0f4ee]"
                >
                  सभी योजनाएँ देखें
                </a>
              </div>
            </div>

            <div className="rounded-3xl bg-[#eaf1e6] p-7 md:p-10">
              <div className="mb-6 inline-flex rounded-2xl bg-white p-4 text-[#347354]">
                <HeartHandshake size={34} />
              </div>

              <h2 className="text-2xl font-bold leading-relaxed">
                आपके लिए सही जानकारी, एक ही जगह।
              </h2>

              <p className="mt-3 leading-7 text-gray-600">
                पेंशन, आजीविका और स्वास्थ्य से जुड़ी योजनाओं को सरल भाषा में
                समझें।
              </p>

              <div className="mt-7 flex items-center gap-3 rounded-xl bg-white p-4">
                <ShieldCheck className="shrink-0 text-[#347354]" />
                <p className="text-sm text-gray-600">
                  योजनाओं की जानकारी और पात्रता की शर्तें स्पष्ट रूप से देखें।
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="schemes" className="bg-[#f0f3ec] py-14 md:py-16">
          <div className="mx-auto max-w-7xl px-5">
            <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="mb-2 text-sm font-semibold text-[#347354]">
                  महिला कल्याण योजनाएँ
                </p>
                <h2 className="text-3xl font-bold">
                  आपके लिए उपलब्ध योजनाएँ
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  अपनी जरूरत के अनुसार योजनाएँ खोजें।
                </p>
              </div>

              <Link
                to="/eligibility"
                className="font-semibold text-[#347354] hover:underline"
              >
                पात्रता खोजें →
              </Link>
            </div>

            <div className="mb-7 grid gap-3 md:grid-cols-[1fr_200px_200px]">
              <div className="flex items-center gap-3 rounded-xl border border-[#e0e4dc] bg-white px-4">
                <Search size={19} className="text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="योजना खोजें..."
                  aria-label="योजना खोजें"
                  className="w-full bg-transparent py-3 outline-none"
                />
              </div>

              <select
                value={need}
                onChange={(e) => setNeed(e.target.value)}
                aria-label="जरूरत के अनुसार फ़िल्टर"
                className="rounded-xl border border-[#e0e4dc] bg-white px-4 py-3"
              >
                <option value="">सभी जरूरतें</option>
                {filters.needs.map((item) => (
                  <option key={item} value={item}>
                    {item === "Pension" ? "पेंशन" :
                     item === "Health" ? "स्वास्थ्य" : "आजीविका"}
                  </option>
                ))}
              </select>

              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                aria-label="जिले के अनुसार फ़िल्टर"
                className="rounded-xl border border-[#e0e4dc] bg-white px-4 py-3"
              >
                <option value="">सभी जिले</option>
                {filters.districts.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="py-16 text-center text-gray-500" role="status">
                योजनाएँ लोड हो रही हैं...
              </div>
            ) : error ? (
              <div className="rounded-xl bg-white p-8 text-center text-red-600">
                {error}
                <button onClick={loadSchemes} className="ml-3 underline">
                  पुनः प्रयास करें
                </button>
              </div>
            ) : schemes.length === 0 ? (
              <div className="rounded-2xl bg-white p-12 text-center">
                <h3 className="text-xl font-bold">कोई योजना नहीं मिली</h3>
                <p className="mt-2 text-gray-500">
                  अपनी खोज या फ़िल्टर बदलकर देखें।
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setNeed("");
                    setDistrict("");
                  }}
                  className="mt-4 font-semibold text-[#347354] underline"
                >
                  सभी योजनाएँ देखें
                </button>
              </div>
            ) : (
              <>
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {schemes.map((scheme) => (
                    <SchemeCard key={scheme.schemeId} scheme={scheme} />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-14">
          <div className="rounded-3xl bg-[#244c38] px-7 py-10 text-white md:flex md:items-center md:justify-between md:px-12">
            <div>
              <h2 className="text-2xl font-bold">
                जानना चाहती हैं कि कौन-सी योजना आपके लिए है?
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/75">
                कुछ आसान सवालों के जवाब दें और संभावित योजनाओं की जानकारी पाएँ।
              </p>
            </div>

            <Link
              to="/eligibility"
              className="mt-6 inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-[#244c38] md:mt-0"
            >
              पात्रता खोजें <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </main>

      <footer id="help" className="border-t border-[#e8e9df] bg-white py-8">
        <div className="mx-auto max-w-7xl px-5 text-sm text-gray-500">
          <p className="font-bold text-[#347354]">सहारा सेतु</p>
          <p className="mt-2">महिलाओं और परिवारों के लिए योजना संबंधी जानकारी।</p>
          <p className="mt-3">यह एक डेमो प्लेटफॉर्म है। योजना की पात्रता संबंधित प्राधिकरण से सत्यापित करें।</p>
        </div>
      </footer>
    </div>
  );
}