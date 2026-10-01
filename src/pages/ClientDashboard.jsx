// src/pages/ClientDashboard.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Package } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useOrdersStore } from "../store/ordersStore";
import ProtectedRoute from "../components/ProtectedRoute";
import StatusBadge from "../components/StatusBadge";
import MediaPreview from "../components/MediaPreview";

const TABS = [
  { key: "all", label: "الكل" }, { key: "pending", label: "قيد الانتظار" },
  { key: "in_progress", label: "جاري التنفيذ" }, { key: "delivered", label: "بانتظار موافقتك" }, { key: "completed", label: "مكتمل" },
];

function ClientDashboardContent() {
  const user = useAuthStore((s) => s.user);
  const allOrders = useOrdersStore((s) => s.orders);
  const approveDelivery = useOrdersStore((s) => s.updateStatus);
  const orders = allOrders.filter((order) => order.clientId === user.id);
  const [tab, setTab] = useState("all");
  const filtered = tab === "all" ? orders : orders.filter((o) => o.status === tab);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold">لوحة العميل</h1>
        <Link to="/request" className="flex items-center gap-2 rounded-xl bg-sage px-6 py-3 font-bold text-navy-800 hover:bg-sage-light">
          <PlusCircle className="h-5 w-5" /> طلب إعلان جديد
        </Link>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`whitespace-nowrap rounded-xl px-5 py-2 font-semibold transition-colors ${
              tab === t.key ? "bg-sage text-navy-800" : "border border-navy-600 bg-navy-900 text-gray-300 hover:border-sage/50"}`}>
            {t.label} ({t.key === "all" ? orders.length : orders.filter((o) => o.status === t.key).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <Package className="mx-auto mb-4 h-12 w-12 text-gray-500" />
          <p className="text-gray-400">لا توجد طلبات هنا</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((o) => (
            <div key={o.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-navy-600 bg-navy-900 p-5 transition-colors hover:border-sage/40">
              <div>
                <h3 className="mb-1 font-bold">{o.productName}</h3>
                <p className="text-sm text-gray-400">صانع المحتوى: <span className="text-sage">{o.creatorName}</span> · {o.quantity} فيديو · {o.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-extrabold text-sage">{o.total} ج.م</span>
                <StatusBadge status={o.status} />
              </div>
              {o.status === "delivered" && (o.deliveredUrl || o.deliveredMedia?.length > 0) && (
                <div className="w-full border-t border-navy-600 pt-4">
                  <h4 className="mb-3 font-bold">ملفات المشروع المستلمة</h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {(o.deliveredMedia || []).map((media) => (
                      <div key={media.assetId} className="min-w-0 overflow-hidden rounded-xl border border-navy-600 bg-navy-950">
                        <div className="aspect-video bg-black">
                          <MediaPreview media={media} title={media.fileName} className="h-full w-full object-contain" />
                        </div>
                        <p className="truncate px-3 py-2 text-sm text-gray-300">{media.fileName}</p>
                      </div>
                    ))}
                    {o.deliveredUrl && (
                      <div className="aspect-video overflow-hidden rounded-xl bg-black">
                        <MediaPreview media={o.deliveredUrl} title={`تسليم ${o.productName}`} className="h-full w-full object-contain" />
                      </div>
                    )}
                  </div>
                  <button type="button" onClick={() => approveDelivery(o.id, "completed")} className="mt-4 rounded-xl bg-sage px-5 py-3 font-bold text-navy-800 hover:bg-sage-light">
                    موافقة على المشروع
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
export default function ClientDashboard() {
  return <ProtectedRoute roles={["client"]}><ClientDashboardContent /></ProtectedRoute>;
}