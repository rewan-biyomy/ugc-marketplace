import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

/**
 * قائمة اختيار مخصصة بالكامل — لا تعتمد على قائمة المتصفح البيضاء
 * usage: <Select value={x} onChange={setX} options={["a","b"]} />
 */
export default function Select({ value, onChange, options, placeholder = "اختر..." }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // إغلاق القائمة عند الضغط خارجها
  useEffect(() => {
    const handler = (e) => !ref.current?.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* الزر الظاهر */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${
          open ? "border-sage" : "border-navy-600"
        } bg-navy-900 text-white hover:border-sage/60`}
      >
        <span className={value ? "" : "text-gray-400"}>{value || placeholder}</span>
        <ChevronDown className={`h-4 w-4 text-sage transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {/* عناصر القائمة المنسدلة */}
      {open && (
        <div className="absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-navy-600 bg-navy-900 py-1 shadow-2xl">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => { onChange(option); setOpen(false); }}
              className={`flex w-full items-center justify-between px-4 py-2.5 text-right text-sm transition-colors ${
                option === value ? "bg-sage/10 text-sage font-bold" : "text-gray-200 hover:bg-navy-700"
              }`}
            >
              {option}
              {option === value && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}