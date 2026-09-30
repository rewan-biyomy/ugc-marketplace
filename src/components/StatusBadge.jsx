import { ORDER_STATUSES } from "../data/seed";

/** شارة ملوّنة لحالة الطلب */
export default function StatusBadge({ status }) {
  const config = ORDER_STATUSES[status] || ORDER_STATUSES.pending;
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-bold ${config.color}`}>
      {config.label}
    </span>
  );
}