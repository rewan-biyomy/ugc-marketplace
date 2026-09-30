import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Plus, Trash2, Save } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { dialects, niches, professions } from "../data/seed";
import Select from "../components/Select";
import ProtectedRoute from "../components/ProtectedRoute";

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
  const [works, setWorks] = useState(user.works || []);
  const [workTitle, setWorkTitle] = useState("");
  const [workUrl, setWorkUrl] = useState("");

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  // رفع الصورة الشخصية — تحويل الملف إلى Base64 للتخزين المؤقت
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => update("image", reader.result);
    reader.readAsDataURL(file);
  };

  const addWork = () => {
    if (!workTitle.trim() || !workUrl.trim()) return;
    setWorks((w) => [...w, { title: workTitle, url: workUrl }]);
    setWorkTitle(""); setWorkUrl("");
  };

  const handleSave = () => {
    updateProfile(user.id, {
      ...form,
      price: Number(form.price),
      works,
      // إن كان صانع محتوى: أعماله تظهر تلقائياً في معرض الفيديوهات
      ...(user.role === "creator" && { videos: [...(user.videos || []), ...works.map((w) => w.url)] }),
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

        {/* إضافة أعمال */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-300">أعمالي (روابط فيديو)</label>
          <div className="mb-3 flex gap-2">
            <input placeholder="عنوان العمل" value={workTitle} onChange={(e) => setWorkTitle(e.target.value)} className={inputCls} />
            <input placeholder="رابط الفيديو" value={workUrl} onChange={(e) => setWorkUrl(e.target.value)} className={inputCls} dir="ltr" />
            <button type="button" onClick={addWork} title="إضافة"
              className="shrink-0 rounded-xl bg-sage p-3 text-navy-800 transition-transform hover:scale-105">
              <Plus className="h-5 w-5" />
            </button>
          </div>
          {works.map((work, i) => (
            <div key={i} className="mb-2 flex items-center justify-between rounded-xl border border-navy-600 bg-navy-950 px-4 py-2.5">
              <span className="text-sm font-semibold">{work.title}</span>
              <button type="button" onClick={() => setWorks((w) => w.filter((_, idx) => idx !== i))}
                className="text-red-400 transition-colors hover:text-red-300"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>

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