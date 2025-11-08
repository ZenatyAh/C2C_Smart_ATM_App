import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAccount } from "../context/AccountContext";
import BalanceCard from "../components/BalanceCard";
import QuickActions from "../components/QuickActions";
import BirthdayModal from "../components/BirthdayModal";

export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { user, balance, loadUser, fetchTransactions, transactions } = useAccount();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        const stored = localStorage.getItem("user");
        if (!stored) {
          navigate("/");
          return;
        }
        await loadUser(JSON.parse(stored));
      }
      if (user?.userId) {
        await fetchTransactions(user.userId);
      }
    };
    fetchData();
  }, [user, loadUser, fetchTransactions, navigate]);

  return (
    <div className="min-h-[calc(100dvh-0px)] bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            {user?.profile_img && (
              <img
                src={user.profile_img}
                alt={user.first_name}
                className="h-12 w-12 rounded-full object-cover"
              />
            )}
            <div>
              <div className="text-xs text-muted-foreground">Welcome back</div>
              <h1 className="text-2xl font-semibold">
                {user ? `Hi, ${user.first_name} 👋` : "Dashboard"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => navigate("/settings")}
              className="p-2 rounded-[var(--radius)] border border-border bg-card shadow-sm hover:bg-accent transition"
              title="Settings"
            >
              ⚙️
            </button>

            <button
              className="px-3 py-2 rounded-[var(--radius)] border border-border bg-card shadow-sm text-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>


        <BalanceCard balance={balance} />

        <hr className="border-border/60" />


        <QuickActions />


        {user && <BirthdayModal name={user.first_name} birthday={user.birthday} />}
      </div>
    </div>
  );
}
