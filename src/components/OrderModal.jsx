import { useEffect, useState } from "react";
import { useOrdersStore } from "../store/ordersStore";
import { useAuthStore } from "../store/authStore";
import { orderPackages } from "../data/seed";

/**
 * رسوم الشحن
 */
const SHIPPING_FEE = 100;

/**
 * مودال إنشاء طلب جديد
 */
export default function OrderModal({
  isOpen,
  onClose,
  creator,
  packageType,
  quantity,
}) {
  const createOrder = useOrdersStore(
    (state) => state.createOrder
  );

  const currentUser = useAuthStore(
    (state) => state.user
  );

  const [productName, setProductName] = useState("");
  const [script, setScript] = useState("");
  const [shipping, setShipping] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => {
      if (event.key === "Escape" && !submitting) onClose();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen, onClose, submitting]);

  if (!isOpen) {
    return null;
  }

  if (!creator) {
    return null;
  }

  const selectedPackage =
    orderPackages[packageType] || orderPackages.raw;

  const baseTotal =
    Number(creator.price || 0) *
    Number(selectedPackage.multiplier || 1) *
    Number(quantity || 1);

  const total = Math.round(
    baseTotal + (shipping ? SHIPPING_FEE : 0)
  );

  /**
   * إنشاء الطلب
   */
  const handleSubmit = async (event) => {
    event?.preventDefault();

    if (!currentUser) {
      alert("يجب تسجيل الدخول أولاً لإنشاء الطلب");
      return;
    }

    if (currentUser.role !== "client") {
      alert("إنشاء الطلبات متاح لحسابات العملاء فقط");
      return;
    }

    if (!productName.trim()) {
      alert("من فضلك أدخل اسم المنتج");
      return;
    }

    setSubmitting(true);

    try {
      const order = createOrder({
        clientId: currentUser.id,
        clientName: currentUser.name,

        creatorId: creator.id,
        creatorName: creator.name,

        productName: productName.trim(),
        script: script.trim(),

        packageType,
        quantity: Number(quantity),

        shipping,
        shippingFee: shipping ? SHIPPING_FEE : 0,

        total,
      });

      console.log("تم إنشاء الطلب:", order);

      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        setProductName("");
        setScript("");
        setShipping(false);
        onClose();
      }, 1800);
    } catch (error) {
      console.error("Create order error:", error);
      alert("حدث خطأ أثناء إنشاء الطلب");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-black/70 px-3 py-4 backdrop-blur-sm sm:px-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !submitting) {
          onClose();
        }
      }}
    >
      <div className="flex min-h-full items-center justify-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-modal-title"
        className="my-auto flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-night-600 bg-night-800 shadow-2xl"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-night-600 p-4 sm:p-6">
          <div>
            <h2 id="order-modal-title" className="text-2xl font-extrabold text-white">
              إنشاء طلب جديد
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              طلب محتوى من {creator.name}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-night-700 text-xl text-gray-300 transition hover:bg-night-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="إغلاق"
          >
            ×
          </button>
        </div>

        {/* Success */}
        {success ? (
          <div className="overflow-y-auto p-10 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-mint/15">
              <span className="text-3xl text-mint">
                ✓
              </span>
            </div>

            <h3 className="mb-2 text-2xl font-extrabold text-white">
              تم إنشاء الطلب بنجاح
            </h3>

            <p className="text-gray-400">
              أصبح الطلب ظاهرًا في لوحة طلباتك.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain p-4 sm:p-6">
              {/* Product Name */}
              <div>
                <label
                  htmlFor="productName"
                  className="mb-2 block text-sm font-bold text-gray-200"
                >
                  اسم المنتج
                </label>

                <input
                  id="productName"
                  type="text"
                  value={productName}
                  onChange={(event) =>
                    setProductName(event.target.value)
                  }
                  placeholder="مثال: عطر شرقي فاخر"
                  disabled={submitting}
                  className="w-full rounded-xl border border-night-600 bg-night-700 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-mint disabled:opacity-60"
                />
              </div>

              {/* Script */}
              <div>
                <label
                  htmlFor="script"
                  className="mb-2 block text-sm font-bold text-gray-200"
                >
                  تفاصيل السكريبت
                </label>

                <textarea
                  id="script"
                  value={script}
                  onChange={(event) =>
                    setScript(event.target.value)
                  }
                  placeholder="اكتب المطلوب من صانع المحتوى بالتفصيل..."
                  rows={5}
                  disabled={submitting}
                  className="w-full resize-none rounded-xl border border-night-600 bg-night-700 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-mint disabled:opacity-60"
                />
              </div>

              {/* Package summary */}
              <div className="rounded-xl border border-night-600 bg-night-700 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-gray-400">
                    الباقة
                  </span>

                  <span className="font-bold text-white">
                    {selectedPackage.label}
                  </span>
                </div>

                <div className="mb-3 flex items-center justify-between">
                  <span className="text-gray-400">
                    عدد الفيديوهات
                  </span>

                  <span className="font-bold text-white">
                    {quantity}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">
                    سعر الفيديو
                  </span>

                  <span className="font-bold text-mint-light">
                    {creator.price} ج.م
                  </span>
                </div>
              </div>

              {/* Shipping */}
              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-night-600 bg-night-700 p-4">
                <div>
                  <p className="font-bold text-white">
                    شحن المنتج لصانع المحتوى
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    رسوم الشحن: {SHIPPING_FEE} ج.م
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={shipping}
                  onChange={(event) =>
                    setShipping(event.target.checked)
                  }
                  disabled={submitting}
                  className="h-5 w-5 accent-emerald-400"
                />
              </label>

              {/* Total */}
              <div className="flex items-center justify-between border-t border-dashed border-night-600 pt-5">
                <span className="text-lg font-bold text-gray-300">
                  الإجمالي
                </span>

                <span className="text-3xl font-extrabold text-mint-light">
                  {total} ج.م
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex shrink-0 gap-3 border-t border-night-600 p-4 sm:p-6">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="flex-1 rounded-xl border border-night-600 bg-night-700 py-3 font-bold text-gray-300 transition hover:bg-night-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                إلغاء
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="flex-1 rounded-xl bg-mint py-3 font-extrabold text-night-900 transition hover:bg-mint-light disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "جاري إنشاء الطلب..."
                  : "تأكيد الطلب"}
              </button>
            </div>
          </form>
        )}
      </div>
      </div>
    </div>
  );
}