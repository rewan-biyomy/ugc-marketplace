// src/components/VideoCard.jsx
import { Link } from "react-router-dom";
import { BadgeCheck, BriefcaseBusiness, Star } from "lucide-react";
import MediaPreview from "./MediaPreview";
import { getCreatorWorks } from "../utils/portfolio";

/** كارت يعرض عمل الصانع الحقيقي أو صورته عند عدم وجود أعمال منشورة */
export default function VideoCard({ creator }) {
  const works = getCreatorWorks(creator);
  const featuredWork = works[0];

  return (
    <Link to={`/profile/${creator.id}`}
      className="group relative block aspect-[9/16] overflow-hidden rounded-2xl border border-navy-600 bg-navy-900 transition-all duration-300 hover:scale-[1.03] hover:border-sage hover:shadow-[0_0_30px_rgba(148,210,189,0.25)]">
      {featuredWork ? (
        <MediaPreview media={featuredWork} title={featuredWork.title} poster={creator.image} controls={false} linkFallback={false} className="absolute inset-0 h-full w-full object-cover" />
      ) : creator.image ? (
        <img src={creator.image} alt={creator.name} className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500"><BriefcaseBusiness className="h-10 w-10" /></div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

      {/* شارة اللهجة */}
      <span className="absolute right-3 top-3 rounded-full border border-sage/30 bg-navy-950/80 px-3 py-1 text-xs font-semibold text-sage backdrop-blur">
        {creator.dialect}
      </span>

      {/* أيقونة تشغيل عند الـ Hover */}
      {/* المعلومات السفلية */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-4">
        <div className="mb-2 flex items-center gap-2">
          <img src={creator.image} alt={creator.name} className="h-8 w-8 rounded-full border-2 border-sage object-cover" />
          <h3 className="font-bold">{creator.name}</h3>
          <BadgeCheck className="h-4 w-4 text-sage" />
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-sm text-gray-300">
            <Star className="h-3.5 w-3.5 fill-sage text-sage" /> {creator.rating}
          </span>
          <span className="rounded-lg bg-sage px-3 py-1 text-sm font-bold text-navy-800">{creator.price} ج.م</span>
        </div>
      </div>
    </Link>
  );
}