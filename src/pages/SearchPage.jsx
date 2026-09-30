import { useState } from "react";
import { SearchX } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import FilterBar from "../components/FilterBar";
import VideoCard from "../components/VideoCard";

/** صفحة البحث — تعرض صناع المحتوى من المخزن العالمي */
export default function SearchPage() {
  const users = useAuthStore((s) => s.users);
  const creators = users.filter((u) => u.role === "creator");

  const [filters, setFilters] = useState({ role: "الكل", dialect: "الكل", niche: "الكل" });
  const handleFilterChange = (key, value) => setFilters((p) => ({ ...p, [key]: value }));

  const filtered = creators.filter(
    (c) =>
      (filters.role === "الكل" || c.profession === filters.role) &&
      (filters.dialect === "الكل" || c.dialect === filters.dialect) &&
      (filters.niche === "الكل" || c.niche === filters.niche)
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-extrabold md:text-4xl">سوق محتوى المستخدم</h1>
        <p className="text-gray-400">UGC Video Marketplace — اختر صانع المحتوى المناسب لبراندك</p>
      </div>

      <div className="mb-8"><FilterBar filters={filters} onChange={handleFilterChange} /></div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((creator) => <VideoCard key={creator.id} creator={creator} />)}
        </div>
      ) : (
        <div className="py-20 text-center">
          <SearchX className="mx-auto mb-4 h-12 w-12 text-gray-500" />
          <p className="text-xl text-gray-400">لا توجد نتائج مطابقة</p>
          <button onClick={() => setFilters({ role: "الكل", dialect: "الكل", niche: "الكل" })}
            className="mt-4 rounded-xl border border-sage px-6 py-2 font-bold text-sage transition-colors hover:bg-sage hover:text-navy-800">
            إعادة تعيين الفلاتر
          </button>
        </div>
      )}
    </main>
  );
}