//كل هذا فقط لتجربة ال toast + يجب اضافة ال toast عند التعديل !!!!!
import { useState } from "react";
import { useToast } from "@/context/ToastContext";
import { useAccount } from "@/context/AccountContext";

export default function Withdraw() {
  const [amount, setAmount] = useState<number>(0);
  const { showToast } = useToast();
  const { withdraw, balance } = useAccount();

  function handleWithdraw(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || amount <= 0) {
      showToast("Invalid amount.", "error");
      return;
    }
    if (amount > balance) {
      showToast("Insufficient balance.", "error");
      return;
    }
    withdraw(amount);
    showToast(`Withdrew ${amount} ILS`, "success");
    setAmount(0);
  }

  return (
    <form onSubmit={handleWithdraw} className="p-4 space-y-3">
      <input
        type="number"
        value={amount || ""}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="w-full px-4 py-2 rounded-[var(--radius)] bg-input border border-border"
        placeholder="Amount"
      />
      <button className="px-4 py-2 rounded-[var(--radius)] bg-primary text-primary-foreground">
        Withdraw
      </button>
    </form>
  );
}
