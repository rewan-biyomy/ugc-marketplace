import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Plus, Trash2, Save, Pencil, X, Check } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { dialects, niches, professions } from "../data/seed";
import Select from "../components/Select";
import ProtectedRoute from "../components/ProtectedRoute";
import { createWorkId, getCreatorWorks } from "../utils/portfolio";

/** صفحة تعديل البروفايل — كل الأدوار (عميل/صانع) */
function EditProfileContent() {
  const { user, updateProfile } = useAuthStore();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    name: user.name, bio: user.bio || "", image: user.image || "",
    profession: user.profession || "موديل", dialect: user.dialect || "مصرية",
    niche: user.niche || "فاشون", price: user.price || 500,
  });
  const [works, setWorks] = useState(() => getCreatorWorks(user));
  const [workTitle, setWorkTitle] = useState("");
  const [workUrl, setWorkUrl] = useState("");
  const [editingWorkId, setEditingWorkId] = useState(null);
  const [workError, setWorkError] = useState("");

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  // رفع الصورة الشخصية — تحويل الملف إلى Base64 للتخزين المؤقت
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => update("image", reader.result);
    reader.readAsDataURL(file);
  };

  const saveWorks = (nextWorks) => {
    setWorks(nextWorks);
    updateProfile(user.id, { works: nextWorks, videos: [] });
  };

  const resetWorkEditor = () => {
    setEditingWorkId(null);
    setWorkTitle("");
    setWorkUrl("");
    setWorkError("");
  };

  const saveWork = () => {
    const title = workTitle.trim();
    const url = workUrl.trim();

    if (!title || !url) {
      setWorkError("أدخل عنوان العمل ورابط الفيديو.");
      return;
    }

    try {
      const parsedUrl = new URL(url);
      if (!["http:", "https:"].includes(parsedUrl.protocol)) throw new Error();
    } catch {
      setWorkError("أدخل رابط فيديو صحيحًا يبدأ بـ https://.");
      return;
    }

    const nextWorks = editingWorkId
      ? works.map((work) => work.id === editingWorkId ? { ...work, title, url } : work)
      : [...works, { id: createWorkId(), title, url }];

    saveWorks(nextWorks);
    resetWorkEditor();
  };

  const handleSave = () => {
    updateProfile(user.id, {
      ...form,
      price: Number(form.price),
      works,
      videos: [],
    });
    navigate(user.role === "creator" ? `/profile/${user.id}` : "/");
  };

  const inputCls = "w-full rounded-xl border border-navy-600 bg-navy-950 px-4 py-3 outline-none focus:border-sage placeholder:text-gray-500";

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-extrabold">تعديل <span className="text-sage">البروفايل</span></h1>

      <div className="space-y-6 rounded-2xl border border-navy-600 bg-navy-900 p-6">
        {/* الصورة الشخصية */}
        <div className="flex items-center gap-4">
          <div className="relative">
            {form.image ? (
              <img src={form.image} alt="صورتك" className="h-24 w-24 rounded-full border-4 border-sage object-cover" />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-navy-600 bg-navy-950">
                <Camera className="h-8 w-8 text-gray-500" />
              </div>
            )}
            <button onClick={() => fileRef.current.click()} type="button" title="تغيير الصورة"
              className="absolute -bottom-1 -left-1 rounded-full bg-sage p-2 text-navy-800 transition-transform hover:scale-110">
              <Camera className="h-4 w-4" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </div>
          <p className="text-sm text-gray-400">اضغط على الأيقونة لرفع صورة شخصية جديدة</p>
        </div>

        <input placeholder="الاسم" value={form.name} onChange={(e) => update("name", e.target.value)} className={inputCls} />

        {/* الوصف */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-300">نبذة تعريفية (البايو)</label>
          <textarea rows={4} value={form.bio} onChange={(e) => update("bio", e.target.value)}
            placeholder="عرّف عن نفسك وعن خبراتك..." className={`${inputCls} resize-none`} />
        </div>

        {/* حقول صانع المحتوى */}
        {user.role === "creator" && (
          <div className="grid gap-4 rounded-xl border border-navy-600 bg-navy-950 p-4 sm:grid-cols-2">
            <Select value={form.profession} onChange={(v) => update("profession", v)} options={professions} placeholder="التخصص" />
            <Select value={form.dialect} onChange={(v) => update("dialect", v)} options={dialects} placeholder="اللهجة" />
            <Select value={form.niche} onChange={(v) => update("niche", v)} options={niches} placeholder="النيش" />
            <input type="number" min="50" value={form.price} onChange={(e) => update("price", e.target.value)} className={inputCls} placeholder="السعر للفيديو" />
          </div>
        )}

        {user.role === "creator" && <div>
          <label className="mb-2 block text-sm font-semibold text-gray-300">أعمالي (روابط فيديو)</label>
          <div className="mb-3 grid gap-2 sm:grid-cols-[1fr_1.4fr_auto_auto]">
            <input placeholder="عنوان العمل" value={workTitle} onChange={(e) => setWorkTitle(e.target.value)} className={inputCls} />
            <input placeholder="رابط الفيديو" value={workUrl} onChange={(e) => setWorkUrl(e.target.value)} className={inputCls} dir="ltr" />
            <button type="button" onClick={saveWork} title={editingWorkId ? "حفظ العمل" : "إضافة العمل"}
              className="flex items-center justify-center gap-2 rounded-xl bg-sage px-4 py-3 font-bold text-navy-800 transition-colors hover:bg-sage-light">
              {editingWorkId ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              <span className="sm:hidden">{editingWorkId ? "حفظ" : "إضافة"}</span>
            </button>
            {editingWorkId && <button type="button" onClick={resetWorkEditor} title="إلغاء التعديل"
              className="flex items-center justify-center rounded-xl border border-navy-600 px-3 text-gray-300 hover:text-white">
              <X className="h-5 w-5" />
            </button>}
          </div>
          {workError && <p role="alert" className="mb-3 text-sm text-red-400">{workError}</p>}
          {works.map((work) => (
            <div key={work.id} className="mb-2 flex min-w-0 items-center justify-between gap-3 rounded-xl border border-navy-600 bg-navy-950 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{work.title}</p>
                <p dir="ltr" className="truncate text-left text-xs text-gray-400">{work.url}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button type="button" title="تعديل العمل" aria-label={`تعديل ${work.title}`}
                  onClick={() => { setEditingWorkId(work.id); setWorkTitle(work.title); setWorkUrl(work.url); setWorkError(""); }}
                  className="rounded-lg p-2 text-gray-300 hover:bg-navy-700 hover:text-sage"><Pencil className="h-4 w-4" /></button>
                <button type="button" title="حذف العمل" aria-label={`حذف ${work.title}`}
                  onClick={() => { saveWorks(works.filter((item) => item.id !== work.id)); if (editingWorkId === work.id) resetWorkEditor(); }}
                  className="rounded-lg p-2 text-red-400 hover:bg-red-500/10 hover:text-red-300"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>}

        <button onClick={handleSave} className="flex w-full items-center justify-center gap-2 rounded-xl bg-sage py-4 font-extrabold text-navy-800 transition-all hover:bg-sage-light">
          <Save className="h-5 w-5" /> حفظ التعديلات
        </button>
      </div>
    </main>
  );
}

/** الصفحة محمية: تتطلب تسجيل دخول */
export default function EditProfilePage() {
  return <ProtectedRoute><EditProfileContent /></ProtectedRoute>;
}