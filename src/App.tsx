import { lazy, Suspense, type ReactNode, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useStore } from 'zustand';
import { clearSession, getSessionToken, sessionStore } from '@/api/session';

const Login = lazy(() => import('@/pages/Login').then((module) => ({ default: module.Login })));
const Market = lazy(() => import('@/pages/Market').then((module) => ({ default: module.Market })));
const Otp = lazy(() => import('@/pages/Otp').then((module) => ({ default: module.Otp })));

function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = useStore(sessionStore, (state) => state.token);
  const expiresAt = useStore(sessionStore, (state) => state.expiresAt);

  useEffect(() => {
    if (!token || !expiresAt) {
      return;
    }

    const timeUntilExpiry = expiresAt - Date.now();

    if (timeUntilExpiry <= 0) {
      clearSession();
      return;
    }

    const timeoutId = window.setTimeout(clearSession, timeUntilExpiry);

    return () => window.clearTimeout(timeoutId);
  }, [expiresAt, token]);

  if (!getSessionToken()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<Otp />} />
        <Route
          path="/market"
          element={
            <ProtectedRoute>
              <Market />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}
