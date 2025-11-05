//كل هذا فقط لتجربة ال toast + يجب اضافة ال toast عند التعديل !!!!!
import { useToast } from "@/context/ToastContext";
import { useAccount } from "@/context/AccountContext";

export default function Settings() {
  const { showToast } = useToast();
  const { /*لدوال ال reset */ } = useAccount();

  async function handleReset() {
    try {
      showToast("Account has been reset.", "success");
    } catch {
      showToast("Failed to reset account.", "error");
    }
  }

  return (
    <div className="p-4 space-y-3">
      <button
        onClick={handleReset}
        className="px-4 py-2 rounded-[var(--radius)] border border-border bg-card"
      >
        Reset Account
      </button>
    </div>
  );
}
