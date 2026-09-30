// src/components/MessagingUI.jsx — الشات (شغال بالكامل)
import { useState, useEffect, useRef } from "react";
import { Send, Circle } from "lucide-react";
import { useChatStore } from "../store/chatStore";

export default function MessagingUI() {
  const { conversations, sendMessage } = useChatStore();
  const [activeId, setActiveId] = useState(conversations[0]?.id);
  const [text, setText] = useState("");
  const endRef = useRef(null);

  const active = conversations.find((c) => c.id === activeId);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [active?.messages.length]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage(activeId, text.trim());
    setText("");
  };

  return (
    <div className="flex h-[70vh] overflow-hidden rounded-2xl border border-navy-600 bg-navy-900">
      {/* قائمة المحادثات */}
      <div className="w-1/3 border-l border-navy-600 bg-navy-950/50">
        <h3 className="border-b border-navy-600 px-4 py-4 font-bold">المحادثات</h3>
        {conversations.map((c) => (
          <button key={c.id} onClick={() => setActiveId(c.id)}
            className={`flex w-full items-center gap-3 px-4 py-3 text-right transition-colors ${
              activeId === c.id ? "border-r-2 border-sage bg-sage/10" : "hover:bg-navy-700"}`}>
            <img src={c.image} alt="" className="h-10 w-10 rounded-full object-cover" />
            <div className="min-w-0">
              <p className="font-semibold">{c.name}</p>
              <p className="truncate text-xs text-gray-400">{c.messages[c.messages.length - 1]?.text}</p>
            </div>
          </button>
        ))}
      </div>

      {/* نافذة الرسائل */}
      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-3 border-b border-navy-600 px-4 py-3">
          <img src={active?.image} alt="" className="h-9 w-9 rounded-full object-cover" />
          <span className="font-bold">{active?.name}</span>
          <span className="mr-auto flex items-center gap-1 text-xs text-sage">
            <Circle className="h-2 w-2 fill-sage text-sage" /> متصل
          </span>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {active?.messages.map((m) => (
            <div key={m.id} className={`flex ${m.from === "me" ? "justify-start" : "justify-end"}`}>
              <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${
                m.from === "me" ? "rounded-tr-sm bg-sage text-navy-800" : "rounded-tl-sm bg-navy-700"}`}>
                <p>{m.text}</p>
                <span className={`mt-1 block text-[10px] ${m.from === "me" ? "text-navy-700" : "text-gray-400"}`}>{m.time}</span>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-navy-600 p-3">
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="اكتب رسالتك..."
            className="flex-1 rounded-xl border border-navy-600 bg-navy-950 px-4 py-2.5 outline-none placeholder:text-gray-500 focus:border-sage" />
          <button type="submit" className="rounded-xl bg-sage p-2.5 text-navy-800 transition-colors hover:bg-sage-light">
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}