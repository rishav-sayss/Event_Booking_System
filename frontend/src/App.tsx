import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from '@/components/Layout';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/components/Toast';
import LandingPage from '@/pages/LandingPage';
import EventListPage from '@/pages/EventListPage';
import EventDetailPage from '@/pages/EventDetailPage';
import BookingSuccessPage from '@/pages/BookingSuccessPage';
import BookingFailurePage from '@/pages/BookingFailurePage';
import AdminLoginPage from '@/pages/AdminLoginPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import UserAuthPage from '@/pages/UserAuthPage';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/events" element={<EventListPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/booking/success/:id" element={<BookingSuccessPage />} />
            <Route path="/booking/failure" element={<BookingFailurePage />} />
            <Route path="/login" element={<UserAuthPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}
