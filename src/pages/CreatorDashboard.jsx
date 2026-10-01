// src/pages/CreatorDashboard.jsx
import { useState } from "react";
import { Inbox, Check, X, CheckCheck } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useOrdersStore } from "../store/ordersStore";
import ProtectedRoute from "../components/ProtectedRoute";
import { normalizeVideoUrl } from "../utils/portfolio";
import { storeMediaFiles } from "../services/mediaStorage";
import StatusBadge from "../components/StatusBadge";

function CreatorDashboardContent() {
  const user = useAuthStore((s) => s.user);
  const { orders, updateStatus, deliverOrder } = useOrdersStore();
  const myOrders = orders.filter((o) => o.creatorId === user.id);
  const [tab, setTab] = useState("all");
  const [deliveryLinks, setDeliveryLinks] = useState({});
  const [deliveryFiles, setDeliveryFiles] = useState({});
  const [deliveryErrors, setDeliveryErrors] = useState({});
  const [submittingOrderId, setSubmittingOrderId] = useState(null);
  const filtered = tab === "all" ? myOrders : myOrders.filter((o) => o.status === tab);

  const submitDelivery = async (orderId) => {
    const link = deliveryLinks[orderId]?.trim() || "";
    const url = link ? normalizeVideoUrl(link) : "";
    const files = deliveryFiles[orderId] || [];
    if ((link && !url) || (!url && files.length === 0)) {
      setDeliveryErrors((errors) => ({ ...errors, [orderId]: "أضف ملفًا واحدًا على الأقل أو أدخل رابطًا صالحًا." }));
      return;
    }

    setSubmittingOrderId(orderId);
    setDeliveryErrors((errors) => ({ ...errors, [orderId]: "" }));
    try {
      const media = files.length ? await storeMediaFiles(files) : [];
      deliverOrder(orderId, { url, media });
    } catch (error) {
      setDeliveryErrors((errors) => ({ ...errors, [orderId]: error.message || "تعذر حفظ الملفات." }));
    } finally {
      setSubmittingOrderId(null);
    }
  };

  // إجراءات حسب الحالة
  const actions = {
    pending: [
      { label: "قبول", status: "in_progress", icon: Check, cls: "bg-sage text-navy-800 hover:bg-sage-light" },
      { label: "رفض", status: "rejected", icon: X, cls: "bg-red-500/20 text-red-400 hover:bg-red-500/30" },
    ],
  };

  const tabs = [{ key: "all", label: "الكل" }, { key: "pending", label: "وارد" }, { key: "in_progress", label: "جاري" }, { key: "delivered", label: "بانتظار الموافقة" }, { key: "completed", label: "مكتمل" }];

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-extrabold">لوحة صانع المحتوى</h1>

      <div className="mb-6 flex gap-2 overflow-x-auto">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`rounded-xl px-5 py-2 font-semibold transition-colors ${tab === t.key ? "bg-sage text-navy-800" : "border border-navy-600 bg-navy-900 text-gray-300"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <Inbox className="mx-auto mb-4 h-12 w-12 text-gray-500" />
          <p className="text-gray-400">لا توجد طلبات هنا</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((o) => (
            <div key={o.id} className="rounded-2xl border border-navy-600 bg-navy-900 p-5">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-bold">{o.productName}</h3>
                <StatusBadge status={o.status} />
              </div>
              <p className="mb-1 text-sm text-gray-400">العميل: {o.clientName} · {o.quantity} فيديو · {o.packageType === "edited" ? "بمونتاج" : "خام"}</p>
              {o.script && <p className="mb-3 rounded-xl bg-navy-950 p-3 text-sm text-gray-300">السكريبت: {o.script}</p>}
              {o.status === "in_progress" && (
                <div className="mb-4">
                  <label htmlFor={`delivery-files-${o.id}`} className="mb-2 block text-sm font-semibold text-gray-300">ملفات المشروع (صور، فيديو، مستندات وغيرها)</label>
                  <input id={`delivery-files-${o.id}`} type="file" multiple
                    onChange={(event) => { setDeliveryFiles((files) => ({ ...files, [o.id]: Array.from(event.target.files || []) })); setDeliveryErrors((errors) => ({ ...errors, [o.id]: "" })); }}
                    className="mb-3 block w-full rounded-xl border border-navy-600 bg-navy-950 px-4 py-3 text-sm text-gray-300 file:ml-3 file:rounded-lg file:border-0 file:bg-sage file:px-3 file:py-2 file:font-bold file:text-navy-800" />
                  <label htmlFor={`delivery-${o.id}`} className="mb-2 block text-sm font-semibold text-gray-300">أو رابط مشاركة</label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input id={`delivery-${o.id}`} type="url" dir="ltr" value={deliveryLinks[o.id] || ""}
                      onChange={(event) => { setDeliveryLinks((links) => ({ ...links, [o.id]: event.target.value })); setDeliveryErrors((errors) => ({ ...errors, [o.id]: "" })); }}
                      placeholder="https://... (اختياري عند إرفاق ملفات)" className="min-w-0 flex-1 rounded-xl border border-navy-600 bg-navy-950 px-4 py-3 text-white outline-none focus:border-sage" />
                    <button type="button" disabled={submittingOrderId === o.id} onClick={() => submitDelivery(o.id)} className="flex items-center justify-center gap-2 rounded-xl bg-sage px-4 py-3 font-bold text-navy-800 hover:bg-sage-light disabled:cursor-wait disabled:opacity-60">
                      <CheckCheck className="h-4 w-4" /> {submittingOrderId === o.id ? "جارٍ الحفظ..." : "تسليم المشروع"}
                    </button>
                  </div>
                  {deliveryErrors[o.id] && <p role="alert" className="mt-2 text-sm text-red-400">{deliveryErrors[o.id]}</p>}
                </div>
              )}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="font-extrabold text-sage">{o.total} ج.م</span>
                <div className="flex gap-2">
                  {(actions[o.status] || []).map((a) => (
                    <button key={a.status} onClick={() => updateStatus(o.id, a.status)}
                      className={`flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-bold transition-colors ${a.cls}`}>
                      <a.icon className="h-4 w-4" /> {a.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
export default function CreatorDashboard() {
  return <ProtectedRoute roles={["creator"]}><CreatorDashboardContent /></ProtectedRoute>;
}