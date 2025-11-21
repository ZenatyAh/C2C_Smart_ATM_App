import { createContext, useContext, useState, useCallback } from "react";
import type {ToastType , Toast} from '../utils/types'

const ToastContext = createContext<{
  toasts: Toast[];
  showToast: (message: string, type?: ToastType) => void;
}>({
  toasts: [],
  showToast: () => {}
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2000);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
