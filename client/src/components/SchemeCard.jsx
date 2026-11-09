import { Link } from "react-router-dom";
import { ArrowUpRight, HeartHandshake } from "lucide-react";

const categories = {
  Pension: "पेंशन",
  Livelihood: "आजीविका",
  Health: "स्वास्थ्य",
};

export default function SchemeCard({ scheme }) {
  return (
    <article className="group flex flex-col rounded-2xl border border-[#e8e9df] bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full bg-[#edf4eb] px-3 py-1.5 text-xs font-semibold text-[#347354]">
          {categories[scheme.need] || scheme.need}
        </span>
        <HeartHandshake className="text-[#78a386]" size={22} />
      </div>

      <h3 className="mb-2 text-lg font-bold leading-relaxed">
        {scheme.title.hi}
      </h3>

      <p className="mb-4 text-sm leading-7 text-gray-500">
        {scheme.description.hi}
      </p>

      <div className="mb-5 rounded-xl bg-[#f6f8f3] p-3">
        <p className="mb-1 text-xs text-gray-500">योजना का लाभ</p>
        <p className="font-bold text-[#347354]">{scheme.benefits.hi}</p>
      </div>

      <div className="mt-auto flex items-center justify-between">
        <span className="text-xs text-gray-400">{scheme.schemeId}</span>

        <Link
          to={`/schemes/${scheme.schemeId}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#347354] hover:underline"
        >
          पूरी जानकारी <ArrowUpRight size={16} />
        </Link>
      </div>
    </article>
  );
}