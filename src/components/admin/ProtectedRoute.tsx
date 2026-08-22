import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/tech/mode1/dash/hg/admin/login" replace />;
  return <>{children}</>;
}
