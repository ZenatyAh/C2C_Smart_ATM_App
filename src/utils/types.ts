export interface Transaction {
  id: number;
  userId: number;
  type: "Deposit" | "Withdraw" | "Transfer";
  amount: number;
  currency: string;
  date: string;
  targetUser?: string;
}

export type User = {
  userId: number;
  user_name: string;
  first_name: string;
  last_name: string;
  profile_img: string;
  pin: string;
  balance: number;
  birthday: string;
};

export type Action =
  | { type: "LOAD_START" }
  | { type: "LOAD_SUCCESS"; payload: { user: User } }
  | { type: "LOAD_ERROR"; payload: string }
  | { type: "DEPOSIT"; payload: number }
  | { type: "WITHDRAW"; payload: number };

export interface AccountState {
  user: User | null;
  balance: number;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
}

export interface AccountContextType {
  user: User | null;
  balance: number;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  loadUser: (u: User) => Promise<void> | void;
  deposit: (amount: number) => Promise<void> | void;
  withdraw: (amount: number) => Promise<void> | void;
}

export type AuthContextType = {
  isLoggedIn: boolean;
  login: (found : User) => void;
  logout: () => void;
};

export type ToastType = "success" | "error" | "info";

export type Toast = {
  id: number;
  message: string;
  type: ToastType;
};

export type CurrencyCode = "USD" | "EUR" | "JOD";

export interface Currency {
  code: CurrencyCode;
  rate: number;
}

export interface WatchlistContextValue {
  currencies: Currency[];
  watchlist: CurrencyCode[]; 
  toggleWatchlist: (code: CurrencyCode) => void;
  isInWatchlist: (code: CurrencyCode) => boolean;
}
