import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

/** بوابة حماية: تتطلب تسجيل الدخول + دوراً محدداً */
export default function ProtectedRoute({ children, roles }) {
  const user = useAuthStore((s) => s.user);

  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}