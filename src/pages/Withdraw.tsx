import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "../context/AccountContext";
import { useToast } from "../context/ToastContext";

export default function Withdraw() {
  const { user, balance, withdraw, loadUser, isLoading } = useAccount();
  const { showToast } = useToast();

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) {
        const stored = localStorage.getItem("user");
        if (!stored) {
          navigate("/"); 
          return;
        }
        await loadUser(JSON.parse(stored));
      }
    };
    fetchUser();
  }, [user, loadUser, navigate]);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();

    const value = parseFloat(amount);

    if (isNaN(value) || value <= 0) {
      showToast("Please enter a valid positive amount", "error");
      return;
    }

    if (value > balance) {
      showToast("❌ Insufficient balance", "error");
      return;
    }

    try {
      setLoading(true);

    
      await withdraw(value);

      showToast(`✅ Withdrawn ${value} ILS successfully!`, "success");
      setAmount("");
    } catch (err) {
      showToast("❌ Withdrawal failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="bg-card border border-border rounded-[var(--radius)] shadow-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center text-foreground mb-6">
          💸 Withdraw Money
        </h1>
        <form onSubmit={handleWithdraw} className="space-y-5">
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-muted-foreground mb-2"
            >
              Enter Amount (ILS)
            </label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 100"
              className="w-full px-4 py-2 border border-border rounded-[var(--radius)] bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading || isLoading}
            className="w-full py-2 bg-primary text-primary-foreground font-semibold rounded-[var(--radius)] hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {loading ? "Processing..." : "Withdraw"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="w-full py-2 bg-secondary text-secondary-foreground rounded-[var(--radius)] border border-border hover:bg-accent transition-colors"
          >
            Cancel
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Current Balance:{" "}
          <span className="font-semibold text-emerald-600">{balance} ILS</span>
        </div>
      </div>
    </div>
  );
}
