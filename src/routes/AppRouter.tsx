import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Deposit from '@/pages/Deposit';
import Withdraw from '@/pages/Withdraw';
import History from '@/pages/History';
import Watchlist from '@/pages/Watchlist';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import { AuthProvider } from '../context/AuthContext.tsx';
import ProtectedRoute from './ProtectedRoute.tsx';
import ThemeToggle from "@/components/ThemeToggle.tsx";

function App() {

  return (
    <BrowserRouter>
    <AuthProvider>
      <ThemeToggle />
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/deposit"
          element={
            <ProtectedRoute>
              <Deposit/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/withdraw"
          element={
            <ProtectedRoute>
              <Withdraw />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
        <Route
          path="/watchlist"
          element={
            <ProtectedRoute>
              <Watchlist /> 
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings /> 
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
