import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type {protectedRouteProps} from '../utils/types'

export default function ProtectedRoute ({children} : protectedRouteProps) {
  const {isLoggedIn} = useAuth();

  if(!isLoggedIn) {
    return <Navigate to='/' replace/>
  }

  return children;
}