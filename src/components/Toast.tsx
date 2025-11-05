import { useToast } from "@/context/ToastContext";

export default function Toast() {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  const typeColor = (t: string) =>
    t === "success"
      ? "border border-green-500 text-green-600"
      : t === "error"
      ? "border border-red-500 text-red-500"
      : "border border-blue-400 text-blue-400";

  return (
    <div className="fixed top-4 left-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`bg-card shadow-lg rounded-[var(--radius)] px-4 py-3 text-sm ${typeColor(
            toast.type
          )}`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
