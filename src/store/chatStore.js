// src/store/chatStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { seedConversations } from "../data/seed";

/** مخزن المحادثات — رسائل فورية مع رد تلقائي تجريبي */
export const useChatStore = create(
  persist(
    (set) => ({
      conversations: seedConversations,

      /** إرسال رسالة + رد تلقائي من الطرف الآخر بعد ثانيتين */
      sendMessage: (convId, text) => {
        const msg = { id: Date.now(), from: "me", text, time: "الآن" };
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === convId ? { ...c, messages: [...c.messages, msg] } : c
          ),
        }));
        // رد تجريبي (لاحقاً: استبدله بـ WebSocket/SSE من الـ Backend)
        setTimeout(() => {
          set((s) => ({
            conversations: s.conversations.map((c) =>
              c.id === convId
                ? { ...c, messages: [...c.messages, {
                    id: Date.now() + 1, from: "them",
                    text: "تم استلام رسالتك، سأرد عليك بالتفاصيل خلال دقائق",
                    time: "الآن" }] }
                : c
            ),
          }));
        }, 2000);
      },
    }),
    { name: "ugc-chat" }
  )
);