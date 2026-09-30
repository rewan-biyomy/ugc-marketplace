import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SearchPage from "./pages/SearchPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EditProfilePage from "./pages/EditProfilePage";
import RequestForm from "./pages/RequestForm";
import ClientDashboard from "./pages/ClientDashboard";
import CreatorDashboard from "./pages/CreatorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import MessagesPage from "./pages/MessagesPage";

export default function App() {
  return (
    <div dir="rtl" className="min-h-screen bg-navy-800 font-cairo text-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile/edit" element={<EditProfilePage />} />
        <Route path="/request" element={<RequestForm />} />
        <Route path="/dashboard/client" element={<ClientDashboard />} />
        <Route path="/dashboard/creator" element={<CreatorDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/messages" element={<MessagesPage />} />
      </Routes>
    </div>
  );
}