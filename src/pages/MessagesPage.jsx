// src/pages/MessagesPage.jsx
import ProtectedRoute from "../components/ProtectedRoute";
import MessagingUI from "../components/MessagingUI";

function MessagesContent() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-extrabold">الرسائل</h1>
      <MessagingUI />
    </main>
  );
}
export default function MessagesPage() {
  return <ProtectedRoute><MessagesContent /></ProtectedRoute>;
}