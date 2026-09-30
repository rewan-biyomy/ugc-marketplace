import { useParams, Link, useNavigate } from "react-router-dom";
import { BadgeCheck, Star, Mic2, FileText, Gauge, ArrowRight, LogIn } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import OrderBox from "../components/OrderBox";

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

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <Link to="/" className="mb-6 inline-flex items-center gap-1 text-sm text-gray-400 hover:text-sage">
        <ArrowRight className="h-4 w-4" /> العودة للنتائج
      </Link>

      {/* بطاقة المعلومات */}
      <div className="mb-10 flex flex-col items-center gap-6 rounded-2xl border border-navy-600 bg-navy-900 p-8 md:flex-row md:items-start">
        <img src={creator.image} alt={creator.name} className="h-32 w-32 rounded-full border-4 border-sage object-cover" />
        <div className="flex-1 text-center md:text-right">
          <div className="mb-1 flex items-center justify-center gap-2 md:justify-start">
            <h1 className="text-3xl font-extrabold">{creator.name}</h1>
            <BadgeCheck className="h-6 w-6 text-sage" />
          </div>
          <p className="mb-2 text-gray-400">{creator.profession} · لهجة {creator.dialect} · {creator.niche}</p>
          <p className="mb-3 max-w-2xl text-sm leading-relaxed text-gray-300">{creator.bio || "لا يوجد وصف بعد"}</p>
          <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
            <span className="flex items-center gap-1 rounded-full border border-navy-600 bg-navy-950 px-4 py-1 text-sm text-sage">
              <Star className="h-3.5 w-3.5 fill-sage" /> {creator.rating}
            </span>
            <span className="flex items-center gap-1 rounded-full border border-navy-600 bg-navy-950 px-4 py-1 text-sm text-sage">
              <Mic2 className="h-3.5 w-3.5" /> جودة صوت 100%
            </span>
            <span className="flex items-center gap-1 rounded-full border border-navy-600 bg-navy-950 px-4 py-1 text-sm text-sage">
              <FileText className="h-3.5 w-3.5" /> دقة سكريبت 5.0
            </span>
            <span className="flex items-center gap-1 rounded-full border border-navy-600 bg-navy-950 px-4 py-1 text-sm text-sage">
              <Gauge className="h-3.5 w-3.5" /> سرعة تسليم 100%
            </span>
          </div>
        </div>
      </div>

      {/* الأعمال + الطلب */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-xl font-bold">معرض الأعمال</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {(creator.videos || []).map((video, i) => (
              <div key={i} className="group relative aspect-[9/16] overflow-hidden rounded-2xl border border-navy-600 transition-all hover:border-sage">
                <video src={video} poster={creator.image} muted loop autoPlay playsInline preload="metadata"
                  className="h-full w-full object-cover" />
                <span className="absolute bottom-3 right-3 rounded-lg bg-navy-950/80 px-3 py-1 text-xs font-bold backdrop-blur">فيديو {i + 1}</span>
              </div>
            ))}
            {(creator.works || []).map((work, i) => (
              <div key={`w${i}`} className="relative aspect-[9/16] overflow-hidden rounded-2xl border border-navy-600">
                <video src={work.url} muted loop autoPlay playsInline preload="metadata" className="h-full w-full object-cover" />
                <span className="absolute bottom-3 right-3 rounded-lg bg-navy-950/80 px-3 py-1 text-xs font-bold backdrop-blur">{work.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* بوكس الطلب — للعميل فقط */}
        {currentUser?.role === "client" ? (
          <OrderBox creator={creator} />
        ) : (
          <div className="flex h-fit flex-col items-center gap-3 rounded-2xl border border-navy-600 bg-navy-900 p-8 lg:sticky lg:top-24">
            <p className="text-center text-gray-300">سجّل دخولك كعميل لتتمكن من طلب فيديو إعلاني</p>
            <button onClick={() => navigate("/login")}
              className="flex items-center gap-2 rounded-xl bg-sage px-8 py-3 font-extrabold text-navy-800 hover:bg-sage-light">
              <LogIn className="h-5 w-5" /> تسجيل الدخول
            </button>
          </div>
        )}
      </div>
    </main>
  );
}