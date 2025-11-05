import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import type { User, Transaction } from "../utils/types";
import BalanceCard from "../components/BalanceCard";
import QuickActions from "../components/QuickActions";
import BirthdayModal from "../components/BirthdayModal";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const u = JSON.parse(raw);
    const userId =
      typeof u?.userId === "number" ? u.userId :
      typeof u?.id === "number" ? u.id : undefined;
    return userId ? ({ ...u, userId } as User) : (u ?? null);
  } catch {
    return null;
  }
}

export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // يحدّث الحالة وlocalStorage ويضمن وجود userId
  const applyUser = (u: any) => {
    const normalized: User = {
      ...u,
      userId: typeof u?.userId === "number" ? u.userId : u?.id,
    };
    setUser(normalized);
    setBalance(normalized.balance);
    localStorage.setItem("user", JSON.stringify(normalized));
  };

  const fetchUserByUserName = useCallback(async (username: string) => {
    if (!BASE_URL) throw new Error("Missing VITE_API_BASE_URL");
    const res = await fetch(`${BASE_URL}users?user_name=${encodeURIComponent(username)}`);
    if (!res.ok) throw new Error("Failed to load user by username");
    const list = await res.json();
    const u = list?.[0];
    if (!u) throw new Error("User not found");
    applyUser(u);
  }, []);

  const fetchUserById = useCallback(async (uid: number) => {
    if (!BASE_URL) throw new Error("Missing VITE_API_BASE_URL");
    const res = await fetch(`${BASE_URL}users/${uid}`);
    if (!res.ok) throw new Error("Failed to load user by id");
    const u = await res.json();
    applyUser(u);
  }, []);

  const fetchTransactions = useCallback(async (uid: number) => {
    if (!BASE_URL) throw new Error("Missing VITE_API_BASE_URL");
    const res = await fetch(`${BASE_URL}transactions?userId=${uid}`);
    if (!res.ok) throw new Error("Failed to load transactions");
    const data = (await res.json()) as Transaction[];
    setTransactions(data);
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const current = getStoredUser();

      if (current?.user_name) {
        await fetchUserByUserName(current.user_name);

        const uid = (() => {
          try {
            const u = JSON.parse(localStorage.getItem("user") || "{}");
            return typeof u?.userId === "number" ? u.userId : undefined;
          } catch {
            return undefined;
          }
        })();
        if (uid) await fetchTransactions(uid);

        setLoading(false);
        return;
      }

      if (typeof current?.userId === "number") {
        await Promise.all([
          fetchUserById(current.userId),
          fetchTransactions(current.userId),
        ]);
        setLoading(false);
        return;
      }

      setLoading(false);
    } catch (e: any) {
      setErrorMsg(e?.message ?? "Network error");
      setLoading(false);
    }
  }, [fetchUserByUserName, fetchUserById, fetchTransactions]);

  useEffect(() => {
    refreshAll();
  }, [location.key, refreshAll]);

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "visible") {
        refreshAll();
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [refreshAll]);

  if (loading) {
    return (
      <div className="min-h-[calc(100dvh-0px)] bg-background text-foreground">
        <div className="max-w-4xl mx-auto p-4 space-y-6">
          <div className="h-24 rounded-[var(--radius)] bg-input animate-pulse" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 rounded-[var(--radius)] bg-input animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-[calc(100dvh-0px)] bg-background text-foreground">
        <div className="max-w-4xl mx-auto p-4 space-y-2">
          <p className="text-destructive">⚠️ {errorMsg}</p>
          <button
            className="px-4 py-2 rounded-[var(--radius)] border border-border bg-card shadow-sm"
            onClick={refreshAll}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  
  return (
    <div className="min-h-[calc(100dvh-0px)] bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-3">
        {user?.profile_img ? (
          <img
            src={user.profile_img}
            alt={user.first_name}
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : null}
        <div>
          <div className="text-xs text-muted-foreground">Welcome back</div>
          <h1 className="text-2xl font-semibold">
            {user ? `Hi, ${user.first_name} 👋` : "Dashboard"}
          </h1>
        </div>
      </div>

      <button
        className="self-start sm:self-auto px-3 py-2 rounded-[var(--radius)] border border-border bg-card shadow-sm text-sm"
        onClick={handleLogout}
      >
        Logout
      </button>
    </header>


        <BalanceCard balance={balance} />

        <hr className="border-border/60" />

        <QuickActions />

        {user && <BirthdayModal name={user.first_name} birthday={user.birthday} />}
      </div>
    </div>
  );
}
