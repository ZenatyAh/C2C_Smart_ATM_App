// src/pages/NotFound.tsx
import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <div style={{ padding: 24 }}>
      <h1>404 — Page Not Found</h1>
      <p>Go back to <Link to="/dashboard">Dashboard</Link> or <Link to="/">Login</Link>.</p>
    </div>
  );
}
