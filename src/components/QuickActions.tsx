import { useNavigate } from "react-router-dom";

export default function QuickActions() {
  const navigate = useNavigate();

  const btn =
    "px-4 py-2 rounded-[var(--radius)] border border-border bg-card shadow-sm text-sm";

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <button className={btn} onClick={() => navigate("/deposit")}>Deposit</button>
      <button className={btn} onClick={() => navigate("/withdraw")}>Withdraw</button>
      <button className={btn} onClick={() => navigate("/history")}>History</button>
      <button className={btn} onClick={() => navigate("/watchlist")}>Watchlist</button>
    </div>
  );
}
