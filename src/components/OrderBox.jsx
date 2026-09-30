import { useState } from "react";
import OrderModal from "./OrderModal";
import { orderPackages } from "../data/seed";

/**
 * بوكس حجز الخدمة
 *
 * المسؤول عن:
 * - اختيار نوع الباقة
 * - اختيار عدد الفيديوهات
 * - حساب السعر
 * - فتح OrderModal
 */

export default function OrderBox({ creator }) {
  const [packageType, setPackageType] = useState("raw");
  const [quantity, setQuantity] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  if (!creator) {
    return null;
  }

  const selectedPackage =
    orderPackages[packageType] || orderPackages.raw;

  const total = Math.round(
    Number(creator.price || 0) *
      Number(selectedPackage.multiplier || 1) *
      quantity
  );

  return (
    <>
      <div className="rounded-2xl border border-night-600 bg-night-800 p-6 lg:sticky lg:top-24">
        <h2 className="mb-1 text-2xl font-extrabold text-white">
          Secure Your Booking
        </h2>

        <p className="mb-6 text-sm text-gray-400">
          السعر الأساسي:{" "}
          <span className="font-bold text-mint-light">
            {creator.price || 0} ج.م
          </span>{" "}
          / فيديو
        </p>

        {/* اختيار نوع الباقة */}
        <div className="mb-5 space-y-3">
          {Object.entries(orderPackages).map(([key, pkg]) => {
            const isSelected = packageType === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setPackageType(key)}
                className={`flex w-full items-center justify-between rounded-xl border p-4 text-right transition-all ${
                  isSelected
                    ? "border-mint bg-mint/10"
                    : "border-night-600 bg-night-700 hover:border-mint/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`h-4 w-4 rounded-full border-2 ${
                      isSelected
                        ? "border-mint bg-mint"
                        : "border-gray-500"
                    }`}
                  />

                  <span className="font-semibold text-white">
                    {pkg.label}
                  </span>
                </div>

                <span className="text-sm text-gray-400">
                  {key === "edited"
                    ? "Full Edit"
                    : "Raw Video"}
                </span>
              </button>
            );
          })}
        </div>

        {/* عدد الفيديوهات */}
        <div className="mb-6 flex items-center justify-between rounded-xl border border-night-600 bg-night-700 p-3">
          <span className="font-semibold text-white">
            عدد الفيديوهات
          </span>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() =>
                setQuantity((q) => Math.max(1, q - 1))
              }
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-night-600 text-xl font-bold text-white transition-colors hover:bg-mint hover:text-night-900"
              aria-label="تقليل العدد"
            >
              −
            </button>

            <span className="w-6 text-center text-lg font-bold text-mint-light">
              {quantity}
            </span>

            <button
              type="button"
              onClick={() =>
                setQuantity((q) => Math.min(10, q + 1))
              }
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-night-600 text-xl font-bold text-white transition-colors hover:bg-mint hover:text-night-900"
              aria-label="زيادة العدد"
            >
              +
            </button>
          </div>
        </div>

        {/* الإجمالي */}
        <div className="mb-5 flex items-center justify-between border-t border-dashed border-night-600 pt-4">
          <span className="font-bold text-gray-300">
            الإجمالي المبدئي:
          </span>

          <span className="text-2xl font-extrabold text-mint-light">
            {total} ج.م
          </span>
        </div>

        {/* زر الحجز */}
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="w-full rounded-xl bg-mint py-4 text-lg font-extrabold text-night-900 transition-all hover:bg-mint-light hover:shadow-[0_0_25px_rgba(52,211,153,0.4)] active:scale-[0.98]"
        >
          احجز الآن
        </button>
      </div>

      {/* Order Modal */}
      <OrderModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        creator={creator}
        packageType={packageType}
        quantity={quantity}
      />
    </>
  );
}