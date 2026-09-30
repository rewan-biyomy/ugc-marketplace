import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { orderPackages, SHIPPING_FEE, filterOptions } from "../data/seed";
import { useAuthStore } from "../store/authStore";
import { useOrdersStore } from "../store/ordersStore";
/** نموذج طلب إعلان جديد (صفحة مستقلة للعميل) */
export default function RequestForm() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const users = useAuthStore((state) => state.users);
  const createOrder = useOrdersStore((state) => state.createOrder);
  const [form, setForm] = useState({
    creatorId: "",
    productName: "",
    script: "",
    dialect: "مصرية",
    packageType: "raw",
    quantity: 1,
    shipping: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const availableCreators = users.filter((user) => user.role === "creator");

  // تحديث أي حقل في النموذج
  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  // حساب الإجمالي
  const creator = availableCreators.find((c) => c.id === Number(form.creatorId));
  const total = creator
    ? Math.round(
        creator.price * orderPackages[form.packageType].multiplier * form.quantity +
          (form.shipping ? SHIPPING_FEE : 0)
      )
    : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser || currentUser.role !== "client") {
      navigate("/login");
      return;
    }

    if (!creator) return;

    setSubmitting(true);
    createOrder({
      ...form,
      clientId: currentUser.id,
      clientName: currentUser.name,
      creatorId: creator.id,
      creatorName: creator.name,
      quantity: Number(form.quantity),
      total,
    });
    setSubmitting(false);
    navigate("/dashboard/client");
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-extrabold text-white">طلب فيديو إعلاني جديد</h1>
      <p className="mb-8 text-gray-400">املأ البيانات وهنوصل طلبك لصانع المحتوى</p>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl bg-night-800 border border-night-600 p-6">
        {/* اختيار صانع المحتوى */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-300">صانع المحتوى</label>
          <select
            required
            value={form.creatorId}
            onChange={(e) => update("creatorId", e.target.value)}
            className="w-full cursor-pointer rounded-xl border border-night-600 bg-night-700 px-4 py-3 text-white outline-none focus:border-mint"
          >
            <option value="">— اختر صانع محتوى —</option>
            {availableCreators.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.role} - {c.price} ج.م)
              </option>
            ))}
          </select>
        </div>

        {/* اسم المنتج */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-300">اسم المنتج</label>
          <input
            type="text"
            required
            value={form.productName}
            onChange={(e) => update("productName", e.target.value)}
            className="w-full rounded-xl border border-night-600 bg-night-700 px-4 py-3 text-white outline-none focus:border-mint"
            placeholder="اسم المنتج أو البراند"
          />
        </div>

        {/* السكريبت */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-300">السكريبت الإعلاني</label>
          <textarea
            required
            rows={5}
            value={form.script}
            onChange={(e) => update("script", e.target.value)}
            className="w-full resize-none rounded-xl border border-night-600 bg-night-700 px-4 py-3 text-white outline-none focus:border-mint"
            placeholder="اكتب السكريبت كامل..."
          />
        </div>

        {/* اللهجة المطلوبة + نوع الباقة */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-300">اللهجة</label>
            <select
              value={form.dialect}
              onChange={(e) => update("dialect", e.target.value)}
              className="w-full cursor-pointer rounded-xl border border-night-600 bg-night-700 px-4 py-3 text-white outline-none focus:border-mint"
            >
              {filterOptions.dialects.slice(1).map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-300">نوع الفيديو</label>
            <select
              value={form.packageType}
              onChange={(e) => update("packageType", e.target.value)}
              className="w-full cursor-pointer rounded-xl border border-night-600 bg-night-700 px-4 py-3 text-white outline-none focus:border-mint"
            >
              {Object.entries(orderPackages).map(([key, pkg]) => (
                <option key={key} value={key}>{pkg.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* الكمية + شحن العينة */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-300">عدد الفيديوهات</label>
            <input
              type="number"
              min="1"
              max="10"
              value={form.quantity}
              onChange={(e) => update("quantity", Number(e.target.value))}
              className="w-full rounded-xl border border-night-600 bg-night-700 px-4 py-3 text-white outline-none focus:border-mint"
            />
          </div>
          <div className="flex items-end pb-2">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={form.shipping}
                onChange={(e) => update("shipping", e.target.checked)}
                className="h-5 w-5 accent-mint"
              />
              <span className="font-semibold text-white">طلب شحن العينة (+{SHIPPING_FEE} ج.م)</span>
            </label>
          </div>
        </div>

        {/* الإجمالي + الإرسال */}
        <div className="flex items-center justify-between border-t border-dashed border-night-600 pt-5">
          <span className="text-lg font-bold text-white">
            الإجمالي: <span className="text-mint-light">{creator ? total : "—"} ج.م</span>
          </span>
          <button
            type="submit"
            disabled={submitting || !creator}
            className="rounded-xl bg-mint px-10 py-3 font-extrabold text-night-900 transition-all hover:bg-mint-light disabled:opacity-50"
          >
            {submitting ? "جاري الإرسال..." : "إرسال الطلب"}
          </button>
        </div>
      </form>
    </main>
  );
}