import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, PlusCircle, LayoutDashboard, MessageCircle, LogOut, Shield, User } from "lucide-react";
import { useAuthStore } from "../store/authStore";

/** شريط التنقل — المحتوى يتغير حسب دور المستخدم */
export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/"); };

  // روابط حسب الدور
  const roleLinks = {
    guest: [{ to: "/", label: "البحث", icon: Search }],
    client: [
      { to: "/", label: "البحث", icon: Search },
      { to: "/request", label: "اطلب إعلان", icon: PlusCircle },
      { to: "/dashboard/client", label: "لوحتي", icon: LayoutDashboard },
      { to: "/messages", label: "الرسائل", icon: MessageCircle },
    ],
    creator: [
      { to: "/", label: "البحث", icon: Search },
      { to: "/dashboard/creator", label: "لوحتي", icon: LayoutDashboard },
      { to: "/messages", label: "الرسائل", icon: MessageCircle },
    ],
    admin: [
      { to: "/admin", label: "لوحة التحكم", icon: Shield },
    ],
  };
  const links = roleLinks[user?.role || "guest"];

  return (
    <nav className="sticky top-0 z-50 border-b border-navy-600 bg-navy-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sage font-extrabold text-navy-800">U</span>
          <span className="text-xl font-extrabold">سوق <span className="text-sage">UGC</span></span>
        </Link>

        <div className="flex flex-wrap items-center gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                  isActive ? "bg-sage/10 text-sage" : "text-gray-300 hover:bg-navy-700 hover:text-white"
                }`}>
              <Icon className="h-4 w-4" /> {label}
            </NavLink>
          ))}
        </div>

        {user ? (
          <div className="flex items-center gap-3">
            <Link to="/profile/edit" className="flex items-center gap-2">
              {user.image ? (
                <img src={user.image} alt={user.name} className="h-9 w-9 rounded-full border-2 border-sage object-cover" />
              ) : (
                <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-sage bg-navy-700">
                  <User className="h-4 w-4 text-sage" />
                </span>
              )}
              <span className="hidden text-sm font-bold sm:block">{user.name}</span>
            </Link>
            <button onClick={handleLogout} title="تسجيل الخروج"
              className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-navy-700 hover:text-red-400">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="rounded-xl border border-sage px-4 py-2 text-sm font-bold text-sage transition-colors hover:bg-sage hover:text-navy-800">دخول</Link>
            <Link to="/register" className="rounded-xl bg-sage px-4 py-2 text-sm font-bold text-navy-800 transition-colors hover:bg-sage-light">حساب جديد</Link>
          </div>
        )}
      </div>
    </nav>
  );
}