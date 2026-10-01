import { create } from "zustand";
import { persist } from "zustand/middleware";
import { seedOrders } from "../data/seed";

export const useOrdersStore = create(
  persist(
    (set) => ({
      orders: seedOrders,

      createOrder: (orderData) => {
        const order = {
          ...orderData,
          id: Date.now(),
          status: "pending",
          date: new Date().toISOString().slice(0, 10),
        };

        set((state) => ({ orders: [order, ...state.orders] }));
        return order;
      },

      updateStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, status } : order
          ),
        })),

      deliverOrder: (orderId, delivery) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status: "delivered",
                  deliveredUrl: delivery.url || "",
                  deliveredMedia: delivery.media || [],
                  deliveredAt: new Date().toISOString().slice(0, 10),
                }
              : order
          ),
        })),
    }),
    { name: "ugc-orders" }
  )
);