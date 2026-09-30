// src/pages/LoginPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn } from "lucide-react";
import { useAuthStore } from "../store/authStore";

/** صفحة تسجيل الدخول */
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(email, password);
    if (result.ok) {
      const dest = { client: "/dashboard/client", creator: "/dashboard/creator", admin: "/admin" }[result.user.role];
      navigate(dest);
    } else setError(result.error);
  };

  // حسابات تجريبية للاختبار السريع
  const demoAccounts = [
    { label: "عميل", email: "client@ugc.com" },
    { label: "صانع محتوى", email: "creator@ugc.com" },
    { label: "أدمن", email: "admin@ugc.com" },
  ];

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4 py-10">
      <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-5 rounded-2xl border border-navy-600 bg-navy-900 p-8">
        <h1 className="text-center text-3xl font-extrabold">تسجيل <span className="text-sage">الدخول</span></h1>

        {error && <p className="rounded-xl bg-red-500/10 border border-red-500/40 px-4 py-2 text-sm text-red-400">{error}</p>}

        <div className="relative">
          <Mail className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="البريد الإلكتروني" className="w-full rounded-xl border border-navy-600 bg-navy-950 py-3 pl-4 pr-11 outline-none focus:border-sage" />
        </div>
        <div className="relative">
          <Lock className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="كلمة المرور" className="w-full rounded-xl border border-navy-600 bg-navy-950 py-3 pl-4 pr-11 outline-none focus:border-sage" />
        </div>

        <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-sage py-3.5 font-extrabold text-navy-800 transition-all hover:bg-sage-light">
          <LogIn className="h-5 w-5" /> دخول
        </button>

        {/* حسابات تجريبية — كلمة المرور 123456 */}
        <div className="rounded-xl border border-navy-600 bg-navy-950 p-4">
          <p className="mb-2 text-xs text-gray-400">حسابات للتجربة (كلمة المرور: 123456)</p>
          <div className="flex flex-wrap gap-2">
            {demoAccounts.map((acc) => (
              <button key={acc.email} type="button"
                onClick={() => { setEmail(acc.email); setPassword("123456"); setError(""); }}
                className="rounded-lg bg-navy-700 px-3 py-1.5 text-xs font-bold text-sage hover:bg-navy-600">
                {acc.label}
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-gray-400">
          ليس لديك حساب؟ <Link to="/register" className="font-bold text-sage hover:underline">سجل الآن</Link>
        </p>
      </motion.form>
    </main>
  );
}