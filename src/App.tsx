import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Login } from '@/pages/Login';
import { Otp } from '@/pages/Otp';

export function App() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/login" element={<Login onLoginSuccess={() => navigate('/otp')} />} />
      <Route path="/otp" element={<Otp />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
