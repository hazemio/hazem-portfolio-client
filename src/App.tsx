import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Suspense, lazy, useEffect } from 'react';
import { useThemeStore, useAuthStore } from './store';
import Navbar         from './components/layout/Navbar';
import Footer         from './components/layout/Footer';
import SocialSidebar  from './components/layout/SocialSidebar';
import PortfolioPage  from './pages/Portfolio';
import AdminLogin     from './pages/admin/Login';
import AdminLayout    from './pages/admin/Layout';
import ProtectedRoute from './components/admin/ProtectedRoute';
import { AdminSocialLinks, AdminSkills, AdminExperience } from './pages/admin/AdminEntities';
const AdminDashboard    = lazy(() => import('./pages/admin/Dashboard'));
const AdminProfile      = lazy(() => import('./pages/admin/AdminProfile'));
const AdminProjects     = lazy(() => import('./pages/admin/AdminProjects'));
const AdminCertificates = lazy(() => import('./pages/admin/AdminCertificates'));
const AdminMessages     = lazy(() => import('./pages/admin/AdminMessages'));
//import checkAuth from './api/index';
const Spin = () => (
  <div className="flex items-center justify-center h-48">
    <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
  </div>
);

function PublicLayout() {
  return (
    <>
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
  
useEffect(()=>{
 //checkAuth();
},[]);
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3500, style: { background: 'var(--bg-raised)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '14px' } }} />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<PortfolioPage />} />
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index               element={<Suspense fallback={<Spin />}><AdminDashboard /></Suspense>} />
          <Route path="profile"      element={<Suspense fallback={<Spin />}><AdminProfile /></Suspense>} />
          <Route path="projects"     element={<Suspense fallback={<Spin />}><AdminProjects /></Suspense>} />
          <Route path="certificates" element={<Suspense fallback={<Spin />}><AdminCertificates /></Suspense>} />
          <Route path="social-links" element={<Suspense fallback={<Spin />}><AdminSocialLinks /></Suspense>} />
          <Route path="skills"       element={<Suspense fallback={<Spin />}><AdminSkills /></Suspense>} />
          <Route path="experience"   element={<Suspense fallback={<Spin />}><AdminExperience /></Suspense>} />
          <Route path="messages"     element={<Suspense fallback={<Spin />}><AdminMessages /></Suspense>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
