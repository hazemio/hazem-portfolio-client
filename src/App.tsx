import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Suspense, lazy, useEffect } from 'react';
import { useThemeStore } from './store';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import SocialSidebar from './components/layout/SocialSidebar';
import RamadanBanner from './components/layout/RamadanBanner';
import PortfolioPage from './pages/Portfolio';
import AdminLogin from './pages/admin/Login';
import AdminLayout from './pages/admin/Layout';
import ProtectedRoute from './components/admin/ProtectedRoute';
import { AdminSocialLinks, AdminSkills, AdminExperience, AdminEducation } from './pages/admin/AdminEntities';

const ProjectDetailsPage = lazy(() => import('./pages/ProjectDetails'));
const PrivacyPage = lazy(() => import('./pages/Privacy'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminProfile = lazy(() => import('./pages/admin/AdminProfile'));
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects'));
const AdminCertificates = lazy(() => import('./pages/admin/AdminCertificates'));
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages'));
const AdminLinkedIn = lazy(() => import('./pages/admin/AdminLinkedIn'));

const Spin = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-10 h-10 rounded-full border-3 border-brand-500 border-t-transparent animate-spin" />
  </div>
);

function PublicLayout() {
  return (
    <>
      <RamadanBanner />
      <Navbar />
      <SocialSidebar />
      <Outlet />
      <Footer />
    </>
  );
}

export default function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: 'var(--bg-raised)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            fontSize: '14px',
          },
        }}
      />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<PortfolioPage />} />
          <Route
            path="/projects/:id"
            element={
              <Suspense fallback={<Spin />}>
                <ProjectDetailsPage />
              </Suspense>
            }
          />
          <Route
            path="/privacy"
            element={
              <Suspense fallback={<Spin />}>
                <PrivacyPage />
              </Suspense>
            }
          />
        </Route>
        <Route path="/tech/mode1/dash/hg/admin/login" element={<AdminLogin />} />
        <Route
          path="/tech/mode1/dash/hg/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <Suspense fallback={<Spin />}>
                <AdminDashboard />
              </Suspense>
            }
          />
          <Route
            path="profile"
            element={
              <Suspense fallback={<Spin />}>
                <AdminProfile />
              </Suspense>
            }
          />
          <Route
            path="projects"
            element={
              <Suspense fallback={<Spin />}>
                <AdminProjects />
              </Suspense>
            }
          />
          <Route
            path="certificates"
            element={
              <Suspense fallback={<Spin />}>
                <AdminCertificates />
              </Suspense>
            }
          />
          <Route
            path="social-links"
            element={
              <Suspense fallback={<Spin />}>
                <AdminSocialLinks />
              </Suspense>
            }
          />
          <Route
            path="skills"
            element={
              <Suspense fallback={<Spin />}>
                <AdminSkills />
              </Suspense>
            }
          />
          <Route
            path="experience"
            element={
              <Suspense fallback={<Spin />}>
                <AdminExperience />
              </Suspense>
            }
          />
          <Route
            path="education"
            element={
              <Suspense fallback={<Spin />}>
                <AdminEducation />
              </Suspense>
            }
          />
          <Route
            path="linkedin"
            element={
              <Suspense fallback={<Spin />}>
                <AdminLinkedIn />
              </Suspense>
            }
          />
          <Route
            path="messages"
            element={
              <Suspense fallback={<Spin />}>
                <AdminMessages />
              </Suspense>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
