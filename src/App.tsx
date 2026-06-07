import { type ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { getSessionToken } from '@/api/session';
import { Home } from '@/pages/Home';
import { Login } from '@/pages/Login';
import { Otp } from '@/pages/Otp';

function ProtectedRoute({ children }: { children: ReactNode }) {
  if (!getSessionToken()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/otp" element={<Otp />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
