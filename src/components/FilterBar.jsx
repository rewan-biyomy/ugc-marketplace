// src/components/FilterBar.jsx
import { professions } from "../data/seed";
import { dialects, niches } from "../data/seed";
import { Search, X } from "lucide-react";
import Select from "./Select";

/** شريط الفلاتر — يستخدم القائمة المخصصة المظلمة */
export default function FilterBar({ filters, onChange, query, onQueryChange }) {
  return (
    <div className="space-y-4 rounded-2xl border border-navy-600 bg-navy-900 p-4">
      <label className="flex items-center gap-3 rounded-xl border border-navy-600 bg-navy-950 px-4 transition-colors focus-within:border-sage">
        <Search aria-hidden="true" className="h-5 w-5 shrink-0 text-sage" />
        <span className="sr-only">ابحث بالاسم أو التخصص أو المجال</span>
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="ابحث بالاسم أو التخصص أو المجال"
          className="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-gray-500"
        />
        {query && <button type="button" onClick={() => onQueryChange("")} aria-label="مسح البحث"
          className="rounded-lg p-1.5 text-gray-400 hover:bg-navy-700 hover:text-white"><X className="h-4 w-4" /></button>}
      </label>
      <div className="flex flex-wrap items-center justify-center gap-4">
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-400">الدور</label>
        <Select value={filters.role} onChange={(v) => onChange("role", v)} options={["الكل", ...professions]} />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-400">اللهجة</label>
        <Select value={filters.dialect} onChange={(v) => onChange("dialect", v)} options={["الكل", ...dialects]} />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-400">النيش</label>
        <Select value={filters.niche} onChange={(v) => onChange("niche", v)} options={["الكل", ...niches]} />
      </div>
      </div>
    </div>
  );
}