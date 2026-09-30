// src/pages/CreatorDashboard.jsx
import { useState } from "react";
import { Inbox, Check, X, CheckCheck } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useOrdersStore } from "../store/ordersStore";
import ProtectedRoute from "../components/ProtectedRoute";
import StatusBadge from "../components/StatusBadge";

function CreatorDashboardContent() {
  const user = useAuthStore((s) => s.user);
  const { orders, updateStatus } = useOrdersStore();
  const myOrders = orders.filter((o) => o.creatorId === user.id);
  const [tab, setTab] = useState("all");
  const filtered = tab === "all" ? myOrders : myOrders.filter((o) => o.status === tab);

  // إجراءات حسب الحالة
  const actions = {
    pending: [
      { label: "قبول", status: "in_progress", icon: Check, cls: "bg-sage text-navy-800 hover:bg-sage-light" },
      { label: "رفض", status: "rejected", icon: X, cls: "bg-red-500/20 text-red-400 hover:bg-red-500/30" },
    ],
    in_progress: [
      { label: "تم التسليم", status: "completed", icon: CheckCheck, cls: "bg-sage text-navy-800 hover:bg-sage-light" },
    ],
  };

  const tabs = [{ key: "all", label: "الكل" }, { key: "pending", label: "وارد" }, { key: "in_progress", label: "جاري" }, { key: "completed", label: "مكتمل" }];

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