import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "@/utils/types";
import { useToast } from "@/context/ToastContext";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

function readStoredUserRaw(): any | null {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function coerceUser(u: any): User | null {
  if (!u) return null;
  const idLike =
    typeof u?.userId === "number"
      ? u.userId
      : typeof u?.userId === "string"
      ? Number(u.userId)
      : typeof u?.id === "number"
      ? u.id
      : typeof u?.id === "string"
      ? Number(u.id)
      : undefined;

  if (Number.isFinite(idLike)) {
    return { ...u, userId: Number(idLike) } as User;
  }
  return (u?.user_name ? (u as User) : null);
}

export default function Settings() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [busy, setBusy] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [loading, setLoading] = useState(true);

  const saveAndSetUser = (u: any) => {
    const normalized: User = {
      ...u,
      userId: typeof u?.userId === "number" ? u.userId : u?.id,
    };
    localStorage.setItem("user", JSON.stringify(normalized));
    setUser(normalized);
  };

  const fetchUserById = useCallback(async (uid: number) => {
    const res = await fetch(`${BASE_URL}users/${uid}`);
    if (!res.ok) throw new Error("Failed to load user by id");
    return res.json();
  }, []);

  const fetchUserByUsername = useCallback(async (username: string) => {
    const res = await fetch(`${BASE_URL}users?user_name=${encodeURIComponent(username)}`);
    if (!res.ok) throw new Error("Failed to load user by username");
    const list = await res.json();
    if (!list?.[0]) throw new Error("User not found");
    return list[0];
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const raw = readStoredUserRaw();
        const coarse = coerceUser(raw);

        if (!raw) {
          setLoading(false);
          return;
        }

        if (coarse?.userId) {
          const u = await fetchUserById(coarse.userId);
          saveAndSetUser(u);
          setLoading(false);
          return;
        }

        if ((raw as any)?.user_name) {
          const u = await fetchUserByUsername((raw as any).user_name);
          saveAndSetUser(u);
          setLoading(false);
          return;
        }

        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    })();
  }, [fetchUserById, fetchUserByUsername]);

  async function resetAccount(userId: number) {
    const txRes = await fetch(`${BASE_URL}transactions?userId=${userId}`);
    if (!txRes.ok) throw new Error("Failed to fetch transactions");
    const txList: Array<{ id: number }> = await txRes.json();

    for (const tx of txList) {
      const del = await fetch(`${BASE_URL}transactions/${tx.id}`, { method: "DELETE" });
      if (!del.ok) throw new Error("Failed to delete transaction");
    }

    const userRes = await fetch(`${BASE_URL}users/${userId}`);
    if (!userRes.ok) throw new Error("Failed to load user before reset");
    const current = await userRes.json();

    const patch = await fetch(`${BASE_URL}users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...current, balance: 0 }),
    });
    if (!patch.ok) throw new Error("Failed to reset balance");

    const updated = await patch.json();
    saveAndSetUser(updated);
  }

  async function onConfirmReset() {
    if (!user?.userId) {
      showToast("No user session. Please login again.", "error");
      return;
    }
    setBusy(true);
    try {
      await resetAccount(user.userId);
      showToast("Account reset successfully.", "success");
      setOpenConfirm(false);
    } catch (e: any) {
      showToast(e?.message ?? "Failed to reset account.", "error");
    } finally {
      setBusy(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    showToast("Logged out.", "info");
    navigate("/", { replace: true });
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100dvh-0px)] bg-background text-foreground">
        <div className="max-w-3xl mx-auto p-4">
          <div className="h-24 rounded-[var(--radius)] bg-input animate-pulse" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[calc(100dvh-0px)] bg-background text-foreground">
        <div className="max-w-3xl mx-auto p-4 space-y-3">
          <h1 className="text-xl font-semibold">Settings</h1>
          <p className="text-sm text-muted-foreground">No user session found.</p>
          <button
            onClick={() => navigate("/login", { replace: true })}
            className="px-3 py-2 rounded-[var(--radius)] border border-border bg-card shadow-sm text-sm"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100dvh-0px)] bg-background text-foreground">
      <div className="max-w-3xl mx-auto p-4 space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Settings</h1>
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-[var(--radius)] border border-border bg-card shadow-sm text-sm"
          >
            Logout
          </button>
        </header>

        <section className="rounded-[var(--radius)] border border-border bg-card p-4 shadow-sm space-y-3">
          <div className="text-sm text-muted-foreground">
            <div><span className="font-medium text-foreground">User:</span> {user.first_name} {user.last_name}</div>
            <div><span className="font-medium text-foreground">Username:</span> {user.user_name}</div>
            <div><span className="font-medium text-foreground">Current balance:</span> {user.balance} ILS</div>
          </div>

          <hr className="border-border/60" />

          <button
            onClick={() => setOpenConfirm(true)}
            className="px-4 py-2 rounded-[var(--radius)] bg-destructive/10 border border-[var(--color-destructive)]/40 text-[var(--color-destructive)] hover:bg-destructive/15 transition disabled:opacity-50"
            disabled={busy}
          >
            {busy ? "Resetting..." : "Reset Account"}
          </button>
        </section>
      </div>

      {openConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-[var(--radius)] border border-border bg-card p-5 shadow-lg">
            <h2 className="text-lg font-semibold">Confirm Reset</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Are you sure you want to reset your account? This will set your balance to 0 and delete all transactions.
            </p>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setOpenConfirm(false)}
                className="px-3 py-2 rounded-[var(--radius)] border border-border bg-card"
                disabled={busy}
              >
                Cancel
              </button>
              <button
                onClick={onConfirmReset}
                className="px-3 py-2 rounded-[var(--radius)] bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
                disabled={busy}
              >
                {busy ? "Working…" : "Yes, Reset"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
