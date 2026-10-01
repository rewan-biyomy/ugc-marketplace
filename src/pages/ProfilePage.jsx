import { useParams, Link, useNavigate } from "react-router-dom";
import { BadgeCheck, Star, ArrowRight, LogIn, Pencil, Play, BriefcaseBusiness } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import OrderBox from "../components/OrderBox";
import { getCreatorWorks } from "../utils/portfolio";

/** البروفايل العام لصانع المحتوى — مع بوكس الطلب */
export default function ProfilePage() {
  const { id } = useParams();
  const { users, user: currentUser } = useAuthStore();
  const navigate = useNavigate();
  const creator = users.find((u) => u.id === Number(id) && u.role === "creator");

  if (!creator) return (
    <main className="py-20 text-center">
      <p className="text-xl text-gray-400">صانع المحتوى غير موجود</p>
      <Link to="/" className="mt-4 inline-block text-sage hover:underline">العودة للبحث</Link>
    </main>
  );

  const works = getCreatorWorks(creator);
  const isOwnProfile = currentUser?.id === creator.id;

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-20">
      <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-sage">
        <ArrowRight className="h-4 w-4" /> العودة للنتائج
      </Link>

      <section className="relative mb-10 overflow-hidden rounded-3xl border border-navy-600 bg-navy-900">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-sage via-mint to-transparent" />
        <div className="flex flex-col gap-7 p-6 sm:p-9 md:flex-row md:items-center">
          <img src={creator.image} alt={creator.name} className="h-28 w-28 shrink-0 rounded-2xl border border-white/15 object-cover shadow-xl sm:h-36 sm:w-36" />
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-sage/10 px-3 py-1 text-xs font-bold text-sage">صانع محتوى UGC</span>
              <span className="flex items-center gap-1 text-sm text-amber-300"><Star className="h-4 w-4 fill-current" /> {creator.rating || "جديد"}</span>
            </div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-black text-white sm:text-4xl">{creator.name}</h1>
              <BadgeCheck aria-label="حساب صانع محتوى" className="h-6 w-6 text-sage" />
            </div>
            <p className="mb-4 text-sm text-gray-300">{creator.bio || "صانع محتوى مستقل"}</p>
            <div className="flex flex-wrap gap-2">
              {[creator.profession, creator.dialect && `لهجة ${creator.dialect}`, creator.niche].filter(Boolean).map((tag) => (
                <span key={tag} className="rounded-lg border border-white/10 bg-navy-950/60 px-3 py-1.5 text-xs font-semibold text-gray-200">{tag}</span>
              ))}
              <span className="rounded-lg border border-white/10 bg-navy-950/60 px-3 py-1.5 text-xs font-semibold text-gray-200">{works.length} أعمال</span>
            </div>
          </div>
          {isOwnProfile && <Link to="/profile/edit" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-sage/50 px-4 py-2.5 text-sm font-bold text-sage transition-colors hover:bg-sage/10"><Pencil className="h-4 w-4" /> تعديل الملف</Link>}
        </div>
      </section>

      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <section aria-labelledby="portfolio-heading">
          <div className="mb-5 flex items-end justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <p className="mb-1 text-xs font-bold uppercase text-sage">Portfolio</p>
              <h2 id="portfolio-heading" className="text-2xl font-extrabold">معرض الأعمال</h2>
            </div>
            <span className="text-sm text-gray-400">{works.length} فيديو</span>
          </div>
          {works.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {works.map((work) => (
                <article key={work.id} className="group overflow-hidden rounded-xl border border-white/10 bg-navy-900 transition-colors hover:border-sage/50">
                  <div className="relative aspect-[9/16] bg-black">
                    <video src={work.url} poster={creator.image} controls playsInline preload="metadata" className="h-full w-full object-cover" />
                    <span aria-hidden="true" className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100"><Play className="h-4 w-4" /></span>
                  </div>
                  <h3 className="truncate px-3 py-3 text-sm font-bold">{work.title}</h3>
                </article>
              ))}
            </div>
          ) : (
            <div className="flex min-h-56 flex-col items-center justify-center border-y border-dashed border-white/15 py-12 text-center">
              <BriefcaseBusiness className="mb-3 h-8 w-8 text-gray-500" />
              <p className="font-semibold text-gray-300">لا توجد أعمال منشورة بعد</p>
              {isOwnProfile && <Link to="/profile/edit" className="mt-3 text-sm font-bold text-sage hover:underline">أضف أول أعمالك</Link>}
            </div>
          )}
        </section>

        <aside aria-label="حجز خدمة">
          {currentUser?.role === "client" ? (
          <OrderBox creator={creator} />
          ) : isOwnProfile ? (
            <div className="border-y border-white/10 py-6 text-sm text-gray-400">هذا هو ملفك العام كما يظهر للعملاء.</div>
          ) : (
            <div className="flex flex-col items-start gap-4 border-y border-white/10 py-6">
              <div>
                <p className="text-sm text-gray-400">سعر الفيديو يبدأ من</p>
                <p className="mt-1 text-3xl font-black text-white">{creator.price || 0} <span className="text-sm font-semibold text-gray-400">ج.م</span></p>
              </div>
              <button onClick={() => navigate("/login")} className="flex w-full items-center justify-center gap-2 rounded-xl bg-sage px-5 py-3 font-extrabold text-navy-900 transition-colors hover:bg-sage-light">
                <LogIn className="h-5 w-5" /> دخول لطلب فيديو
              </button>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}