import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const userData = JSON.parse(localStorage.getItem('user'));

export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate('/'); 
  };
const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // 1️⃣ اجلب كل المستخدمين
    fetch(`${BASE_URL}users`)
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        console.log("Users:", data);
      });

    // 2️⃣ اجلب معاملات Sarah فقط
    fetch(`${BASE_URL}transactions?userId=2`)
      .then(res => res.json())
      .then(data => {
        setTransactions(data);
        console.log("Transactions:", data);
      });
  }, []);

  return (
    <>
    <div>
      ` Welcome {userData.user_name}`
      <h1>Dashboard</h1>
      <button onClick={handleLogout}
            className="fixed top-5 right-30 z-50 px-3 py-1.5 rounded-[var(--radius)] bg-secondary text-secondary-foreground border border-border hover:bg-accent hover:text-accent-foreground transition-all shadow-sm"
      >Logout</button>
    </div>
     <div style={{ padding: 20 }}>
      <h2>📊 Users:</h2>
      <pre>{JSON.stringify(users, null, 2)}</pre>

      <h2>💰 Transactions:</h2>
      <pre>{JSON.stringify(transactions, null, 2)}</pre>
    <h1 className="text-3xl font-bold underline">
    Hello world!
  </h1>
    </div>
    </>
  );
}
