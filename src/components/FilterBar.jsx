// src/components/FilterBar.jsx
import { professions } from "../data/seed";
import { dialects, niches } from "../data/seed";
import Select from "./Select";

/** شريط الفلاتر — يستخدم القائمة المخصصة المظلمة */
export default function FilterBar({ filters, onChange }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 rounded-2xl border border-navy-600 bg-navy-900 p-4">
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
  );
}