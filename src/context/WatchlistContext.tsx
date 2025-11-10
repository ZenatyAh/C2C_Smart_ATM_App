import { createContext, useContext, useState, type ReactNode } from "react";

type CurrencyCode = "USD" | "EUR" | "JOD";

interface Currency {
  code: CurrencyCode;
  rate: number;
}

const CURRENCY_DATA: Currency[] = [
  { code: "USD", rate: 3.7 },
  { code: "EUR", rate: 4.1 },
  { code: "JOD", rate: 5.2 },
];

interface WatchlistContextValue {
  currencies: Currency[];
  watchlist: CurrencyCode[]; 
  toggleWatchlist: (code: CurrencyCode) => void;
  isInWatchlist: (code: CurrencyCode) => boolean;
}

const WatchlistContext = createContext<WatchlistContextValue | null>(null);

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [watchlist, setWatchlist] = useState<CurrencyCode[]>([]);

  const toggleWatchlist = (code: CurrencyCode) => {
    setWatchlist((prev) =>
      prev.includes(code)
        ? prev.filter((c) => c !== code)
        : [...prev, code] 
    );
  };

  const isInWatchlist = (code: CurrencyCode) => watchlist.includes(code);

  return (
    <WatchlistContext.Provider
      value={{
        currencies: CURRENCY_DATA,
        watchlist,
        toggleWatchlist,
        isInWatchlist,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext);
  if (!ctx) {
    throw new Error("useWatchlist must be used within WatchlistProvider");
  }
  return ctx;
}
