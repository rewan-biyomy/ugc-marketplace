import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Search, PlusCircle, LayoutDashboard, MessageCircle, LogOut, Shield, User, Menu, X, Pencil } from "lucide-react";
import { useAuthStore } from "../store/authStore";

const ROLE_LINKS = {
  guest: [{ to: "/", label: "البحث عن صانع محتوى", icon: Search }],
  client: [
    { to: "/", label: "البحث", icon: Search },
    { to: "/request", label: "اطلب إعلان", icon: PlusCircle },
    { to: "/dashboard/client", label: "لوحة العميل", icon: LayoutDashboard },
    { to: "/messages", label: "الرسائل", icon: MessageCircle },
  ],
  creator: [
    { to: "/", label: "البحث", icon: Search },
    { to: "/dashboard/creator", label: "لوحة صانع المحتوى", icon: LayoutDashboard },
    { to: "/messages", label: "الرسائل", icon: MessageCircle },
  ],
  admin: [{ to: "/admin", label: "لوحة التحكم", icon: Shield }],
};

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const links = ROLE_LINKS[user?.role || "guest"];

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!menuRef.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <nav ref={menuRef} aria-label="التنقل الرئيسي" className="fixed right-4 top-4 z-[90]">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
        aria-expanded={open}
        aria-controls="floating-navigation-menu"
        className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-navy-950/90 text-white shadow-lg shadow-black/20 backdrop-blur transition hover:border-sage/60 hover:text-sage focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div id="floating-navigation-menu" className="absolute right-0 top-14 w-[min(19rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-navy-600 bg-navy-950/95 p-3 text-white shadow-2xl backdrop-blur-xl">
          <Link to="/" className="mb-2 flex items-center gap-3 rounded-xl px-3 py-3" onClick={() => setOpen(false)}>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage font-black text-navy-900">U</span>
            <span className="text-lg font-extrabold">سوق <span className="text-sage">UGC</span></span>
          </Link>

          {user && (
            <div className="mb-2 flex items-center gap-3 border-y border-white/10 px-3 py-3">
              {user.image ? <img src={user.image} alt="" className="h-10 w-10 rounded-full object-cover" /> :
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-700"><User className="h-5 w-5 text-sage" /></span>}
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{user.name}</p>
                <p className="text-xs text-gray-400">{user.role === "creator" ? "صانع محتوى" : user.role === "client" ? "عميل" : "إدارة"}</p>
              </div>
            </div>
          )}

          <div className="space-y-1">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} onClick={() => setOpen(false)}
                className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${isActive ? "bg-sage/10 text-sage" : "text-gray-200 hover:bg-white/5 hover:text-white"}`}>
                <Icon className="h-4 w-4" /> {label}
              </NavLink>
            ))}
          </div>

          {user ? (
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
              <Link to="/profile/edit" onClick={() => setOpen(false)} className="flex items-center justify-center gap-2 rounded-xl bg-navy-800 px-3 py-2.5 text-sm font-semibold hover:bg-navy-700">
                <Pencil className="h-4 w-4" /> تعديل الحساب
              </Link>
              <button type="button" onClick={handleLogout} className="flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-300 hover:bg-red-400/10">
                <LogOut className="h-4 w-4" /> تسجيل الخروج
              </button>
            </div>
          ) : (
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
              <Link to="/login" onClick={() => setOpen(false)} className="rounded-xl border border-sage/50 px-3 py-2.5 text-center text-sm font-bold text-sage hover:bg-sage/10">دخول</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="rounded-xl bg-sage px-3 py-2.5 text-center text-sm font-bold text-navy-900 hover:bg-sage-light">حساب جديد</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}