// src/pages/AdminDashboard.jsx
import { useState } from "react";
import { Users, Video, Banknote, Shield } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useOrdersStore } from "../store/ordersStore";
import ProtectedRoute from "../components/ProtectedRoute";
import Select from "../components/Select";

const STATUS_OPTIONS = ["pending", "in_progress", "delivered", "completed", "rejected"];

function AdminDashboardContent() {
  const { users, deleteUser } = useAuthStore();
  const { orders, updateStatus } = useOrdersStore();
  const [tab, setTab] = useState("users");

  const creators = users.filter((u) => u.role === "creator");
  const clients = users.filter((u) => u.role === "client");
  const revenue = orders.filter((o) => o.status === "completed").reduce((sum, o) => sum + o.total, 0);

  const stats = [
    { label: "المستخدمون", value: users.length, icon: Users },
    { label: "صناع المحتوى", value: creators.length, icon: Video },
    { label: "العملاء", value: clients.length, icon: Shield },
    { label: "إيرادات مكتملة", value: `${revenue} ج.م`, icon: Banknote },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-extrabold">لوحة تحكم <span className="text-sage">الأدمن</span></h1>

      {/* إحصائيات */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-center gap-4 rounded-2xl border border-navy-600 bg-navy-900 p-5">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sage/10"><Icon className="h-6 w-6 text-sage" /></span>
            <div><p className="text-sm text-gray-400">{label}</p><p className="text-xl font-extrabold">{value}</p></div>
          </div>
        ))}
      </div>

      {/* تبويبات */}
      <div className="mb-6 flex gap-2">
        {[["users", "المستخدمون"], ["orders", "الطلبات"]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`rounded-xl px-6 py-2 font-semibold transition-colors ${tab === key ? "bg-sage text-navy-800" : "border border-navy-600 bg-navy-900 text-gray-300"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* جدول المستخدمين */}
      {tab === "users" && (
        <div className="overflow-x-auto rounded-2xl border border-navy-600">
          <table className="w-full text-right text-sm">
            <thead className="bg-navy-950 text-gray-400">
              <tr>
                <th className="p-4">المستخدم</th><th className="p-4">الدور</th>
                <th className="p-4">البريد</th><th className="p-4">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-600">
              {users.map((u) => (
                <tr key={u.id} className="bg-navy-900">
                  <td className="flex items-center gap-2 p-4">
                    <img src={u.image || "https://i.pravatar.cc/150?img=5"} alt="" className="h-8 w-8 rounded-full object-cover" />
                    {u.name}
                  </td>
                  <td className="p-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                      u.role === "admin" ? "bg-red-500/20 text-red-400" :
                      u.role === "creator" ? "bg-sage/20 text-sage" : "bg-blue-500/20 text-blue-400"}`}>
                      {{ admin: "أدمن", creator: "صانع محتوى", client: "عميل" }[u.role]}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400" dir="ltr">{u.email}</td>
                  <td className="p-4">
                    {u.role !== "admin" && (
                      <button onClick={() => { if (confirm(`حذف ${u.name}؟`)) deleteUser(u.id); }}
                        className="text-sm font-bold text-red-400 hover:text-red-300">حذف</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* جدول الطلبات مع تغيير الحالة */}
      {tab === "orders" && (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-navy-600 bg-navy-900 p-4">
              <div>
                <p className="font-bold">{o.productName}</p>
                <p className="text-xs text-gray-400">{o.clientName} → {o.creatorName} · {o.total} ج.م</p>
              </div>
              <div className="w-48"><Select value={o.status} onChange={(v) => updateStatus(o.id, v)} options={STATUS_OPTIONS} /></div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
export default function AdminDashboard() {
  return <ProtectedRoute roles={["admin"]}><AdminDashboardContent /></ProtectedRoute>;
}