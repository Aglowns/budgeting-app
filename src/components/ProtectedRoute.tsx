import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '@/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireLinked?: boolean;
}

export const ProtectedRoute = ({ children, requireLinked = false }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireLinked && user && !user.hasLinked) {
    return <Navigate to="/link" replace />;
  }

  return <>{children}</>;
};
