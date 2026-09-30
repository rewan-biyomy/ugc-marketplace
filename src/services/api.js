
import {
  creators,
  orders as mockOrders,
  conversations as mockConversations,
} from "../data/seed";

// ⚠️ مفتاح التبديل بين البيانات التجريبية والـ Backend الحقيقي
const USE_MOCK = true;
const API_BASE_URL = "https://api.example.com"; // رابط الـ Backend الحقيقي

// مهلة اصطناعية لمحاكاة زمن الاستجابة (لإظهار حالات التحميل)
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  /* ─────── صناع المحتوى ─────── */
  creators: {
    /** جلب كل صناع المحتوى */
    async getAll() {
      if (USE_MOCK) {
        await delay();
        return creators;
      }
      const res = await fetch(`${API_BASE_URL}/creators`);
      return res.json();
    },

    /** جلب صانع محتوى بالمعرف */
    async getById(id) {
      if (USE_MOCK) {
        await delay();
        return creators.find((c) => c.id === Number(id));
      }
      const res = await fetch(`${API_BASE_URL}/creators/${id}`);
      return res.json();
    },
  },

  /* ─────── الطلبات ─────── */
  orders: {
    /** إنشاء طلب جديد (يُستدعى من المودال / النموذج) */
    async create(orderData) {
      if (USE_MOCK) {
        await delay(800);
        console.log("📦 طلب جديد (Mock):", orderData);
        return { success: true, id: Date.now(), ...orderData };
      }
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      return res.json();
    },

    /** طلبات عميل معين */
    async getByClient(clientId) {
      if (USE_MOCK) {
        await delay();
        return mockOrders.filter((o) => o.clientId === clientId);
      }
      const res = await fetch(`${API_BASE_URL}/orders?clientId=${clientId}`);
      return res.json();
    },

    /** طلبات صانع المحتوى الواردة */
    async getByCreator(creatorId) {
      if (USE_MOCK) {
        await delay();
        return mockOrders.filter((o) => o.creatorId === creatorId);
      }
      const res = await fetch(`${API_BASE_URL}/orders?creatorId=${creatorId}`);
      return res.json();
    },

    /** تحديث حالة الطلب (قبول / رفض / إكمال) */
    async updateStatus(orderId, status) {
      if (USE_MOCK) {
        await delay();
        const order = mockOrders.find((o) => o.id === orderId);
        if (order) order.status = status;
        return { success: true };
      }
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      return res.json();
    },
  },

  /* ─────── المحادثات ─────── */
  messages: {
    /** جلب محادثات المستخدم */
    async getConversations() {
      if (USE_MOCK) {
        await delay();
        return mockConversations;
      }
      const res = await fetch(`${API_BASE_URL}/conversations`);
      return res.json();
    },

    /** إرسال رسالة */
    async send(conversationId, text) {
      if (USE_MOCK) {
        await delay(300);
        const conv = mockConversations.find((c) => c.id === conversationId);
        conv.messages.push({ id: Date.now(), sender: "me", text, time: "الآن" });
        // رد تلقائي تجريبي من الطرف الآخر بعد ثانيتين
        setTimeout(() => {
          conv.messages.push({
            id: Date.now() + 1,
            sender: "them",
            text: "تمام، هرد عليك بالتفاصيل قريب 👌",
            time: "الآن",
          });
        }, 2000);
        return { success: true };
      }
      const res = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      return res.json();
    },
  },
};