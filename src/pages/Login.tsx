import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import '../index.css'
const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

type User = {
  userId: number;
  user_name: string;
  first_name: string;
  last_name: string;
  profile_img: string;
  pin: string;
  balance: number;
  birthday: string;
};

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [pin, setPin] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const trimmedUser = username.trim();
    const trimmedPin = pin.trim();
    if (!trimmedUser || !trimmedPin) {
      setError("Please fill in all required fields.");
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
        setError("Invalid username or PIN.");
        return;
      }

      login(found);
      navigate("/dashboard");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
   <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black dark:from-black dark:via-gray-900 dark:to-gray-800 transition-colors duration-500">
  <section className="w-full max-w-sm rounded-2xl shadow-2xl p-8 bg-white/10 backdrop-blur-md border border-white/20 dark:bg-gray-900/60 dark:border-gray-700">
    <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
      Smart ATM Login
    </h1>

    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="username"
          className="block mb-1 text-gray-200 font-semibold tracking-wide"
        >
          Username
        </label>
        <input
          id="username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-gray-500 transition-all"
          placeholder="e.g. sarah-abuzeneh"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label
          htmlFor="pin"
          className="block mb-1 text-gray-200 font-semibold tracking-wide"
        >
          PIN
        </label>
        <input
          id="pin"
          type="password"
          autoComplete="current-password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-gray-500 transition-all"
          placeholder="e.g. Sa1234"
          required
          disabled={loading}
          pattern="[A-Za-z0-9]{2,20}"
          title="Use letters and numbers (2-20 characters)"
        />
      </div>

      {error && (
        <p className="text-red-400 text-sm text-center font-medium">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="w-full py-2 font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md hover:shadow-cyan-500/30 transition-all disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Checking..." : "Login"}
      </button>
    </form>

    <p className="text-gray-400 text-xs text-center mt-6">
      © 2025 Smart ATM — All Rights Reserved
    </p>
  </section>
</main>

  );
}
