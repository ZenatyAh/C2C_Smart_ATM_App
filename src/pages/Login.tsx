import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login(); // ← غيّر حالة المستخدم
    navigate('/dashboard'); // ← حوّل المستخدم بعد تسجيل الدخول
  };

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
