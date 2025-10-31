import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { ReactNode } from 'react';

type protectedRouteProps = {
  children : ReactNode
}

export default function ProtectedRoute ({children} : protectedRouteProps) {
  const {isLoggedIn} = useAuth();

  if(!isLoggedIn) {
    return <Navigate to='/' replace/>
  }

  return children;
}