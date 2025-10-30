// src/routes/AppRouter.tsx
import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Lazy-loaded pages
const Login = lazy(() => import('@/pages/Login'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Deposit = lazy(() => import('@/pages/Deposit'));
const Withdraw = lazy(() => import('@/pages/Withdraw'));
const History = lazy(() => import('@/pages/History'));
const Watchlist = lazy(() => import('@/pages/Watchlist'));
const Settings = lazy(() => import('@/pages/Settings'));
const NotFound = lazy(() => import('@/pages/NotFound'));

function Loader() {
  return <div style={{ padding: 24 }}>Loading…</div>;
}

export default function AppRouter() {
  return (
    <BrowserRouter /* basename={import.meta.env.BASE_URL} */>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Login />} />

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/deposit" element={<Deposit />} />
            <Route path="/withdraw" element={<Withdraw />} />
            <Route path="/history" element={<History />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
