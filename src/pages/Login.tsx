import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type { User } from "../utils/types";
import { useToast } from "@/context/ToastContext";
import { useAccount } from "@/context/AccountContext";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [pin, setPin] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { login } = useAuth();                 
  const { loadUser } = useAccount();          
  const { showToast } = useToast();
  const navigate = useNavigate();

  // لو في session محفوظة، ادخل مباشرة للداشبورد
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) navigate("/dashboard", { replace: true });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const trimmedUser = username.trim();
    const trimmedPin = pin.trim();
    if (!trimmedUser || !trimmedPin) {
      const msg = "Please fill in all required fields.";
      setError(msg);
      showToast(msg, "error");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}users`);
      if (!res.ok) throw new Error("Failed to connect to the server.");

      const users: User[] = await res.json();

      const found = users.find(
        (u) => u.user_name === trimmedUser && u.pin === trimmedPin
      );

      if (!found) {
        const msg = "Invalid username or PIN.";
        setError(msg);
        showToast(msg, "error");
        return;
      }

      const normalized: User = {
        ...found,
        userId: (found as any).userId ?? (found as any).id,
      };

      localStorage.setItem("user", JSON.stringify(normalized));

      login(found); 

      //  (مهم!)
      await loadUser(normalized);

      showToast(`Welcome back, ${normalized.first_name}!`, "success");
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground transition-colors duration-500 relative">
      <section className="w-full max-w-sm rounded-[var(--radius)] shadow-lg p-8 bg-card border border-border">
        <h1 className="text-3xl font-bold mb-8 text-center text-primary">
          Smart ATM Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block mb-1 font-semibold tracking-wide text-muted-foreground"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-[var(--radius)] bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder-muted-foreground transition-all"
              placeholder="e.g. sarah-abuzeneh"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="pin"
              className="block mb-1 font-semibold tracking-wide text-muted-foreground"
            >
              PIN
            </label>
            <input
              id="pin"
              type="password"
              autoComplete="current-password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full px-4 py-2 rounded-[var(--radius)] bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder-muted-foreground transition-all"
              placeholder="e.g. Sa1234"
              required
              disabled={loading}
              pattern="[A-Za-z0-9]{2,20}"
              title="Use letters and numbers (2-20 characters)"
            />
          </div>

          {error && (
            <p className="text-destructive text-sm text-center font-medium">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-2 font-semibold rounded-[var(--radius)] bg-primary text-primary-foreground hover:opacity-90 shadow-md transition-all disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Checking..." : "Login"}
          </button>
        </form>

        <p className="text-muted-foreground text-xs text-center mt-6">
          © 2025 Smart ATM — All Rights Reserved
        </p>
      </section>
    </main>
  );
}
