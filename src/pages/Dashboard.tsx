import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
      <h1>Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
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
