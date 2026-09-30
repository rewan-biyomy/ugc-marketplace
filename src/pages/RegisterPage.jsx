// src/pages/RegisterPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { dialects, niches, professions } from "../data/seed";
import Select from "../components/Select";

/** صفحة إنشاء حساب — عميل أو صانع محتوى */
export default function RegisterPage() {
  const [form, setForm] = useState({ role: "client", name: "", email: "", password: "",
    profession: "موديل", dialect: "مصرية", niche: "فاشون", price: 500 });
  const [error, setError] = useState("");
  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = register(form);
    if (result.ok) navigate("/");
    else setError(result.error);
  };

  const inputCls = "w-full rounded-xl border border-navy-600 bg-navy-950 px-4 py-3 outline-none focus:border-sage placeholder:text-gray-500";

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4 py-10">
      <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-4 rounded-2xl border border-navy-600 bg-navy-900 p-8">
        <h1 className="text-center text-3xl font-extrabold">حساب <span className="text-sage">جديد</span></h1>
        {error && <p className="rounded-xl bg-red-500/10 border border-red-500/40 px-4 py-2 text-sm text-red-400">{error}</p>}

        {/* نوع الحساب */}
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-navy-950 p-1.5">
          {[["client", "عميل"], ["creator", "صانع محتوى"]].map(([key, label]) => (
            <button key={key} type="button" onClick={() => update("role", key)}
              className={`rounded-lg py-2.5 font-bold transition-colors ${form.role === key ? "bg-sage text-navy-800" : "text-gray-300 hover:text-white"}`}>
              {label}
            </button>
          ))}
        </div>

        <input required placeholder="الاسم الكامل" value={form.name} onChange={(e) => update("name", e.target.value)} className={inputCls} />
        <input required type="email" placeholder="البريد الإلكتروني" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputCls} />
        <input required type="password" minLength={6} placeholder="كلمة المرور (6 أحرف على الأقل)" value={form.password} onChange={(e) => update("password", e.target.value)} className={inputCls} />

        {/* حقول صانع المحتوى فقط */}
        {form.role === "creator" && (
          <div className="space-y-4 rounded-xl border border-navy-600 bg-navy-950 p-4">
            <p className="text-sm font-bold text-sage">بياناتك المهنية</p>
            <div className="grid grid-cols-2 gap-3">
              <Select value={form.profession} onChange={(v) => update("profession", v)} options={professions} placeholder="التخصص" />
              <Select value={form.dialect} onChange={(v) => update("dialect", v)} options={dialects} placeholder="اللهجة" />
              <Select value={form.niche} onChange={(v) => update("niche", v)} options={niches} placeholder="النيش" />
              <input type="number" min="50" placeholder="السعر للفيديو" value={form.price} onChange={(e) => update("price", e.target.value)} className={inputCls} />
            </div>
          </div>
        )}

        <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-sage py-3.5 font-extrabold text-navy-800 transition-all hover:bg-sage-light">
          <UserPlus className="h-5 w-5" /> إنشاء الحساب
        </button>
        <p className="text-center text-sm text-gray-400">لديك حساب؟ <Link to="/login" className="font-bold text-sage hover:underline">ادخل من هنا</Link></p>
      </motion.form>
    </main>
  );
}