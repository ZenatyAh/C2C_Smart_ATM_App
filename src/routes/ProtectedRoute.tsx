// src/routes/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';

export default function ProtectedRoute() {
  const isAuthenticated = useAppSelector((s) => (s as any).auth?.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    // redirect to login and keep where the user wanted to go
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  return <Outlet />;
}
