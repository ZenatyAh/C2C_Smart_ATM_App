import { createContext, useContext, useReducer, useEffect } from "react";
import type { User, Transaction } from "../utils/types";

interface AccountState {
  user: User | null;
  balance: number;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
}

type Action =
  | { type: "LOAD_START" }
  | { type: "LOAD_SUCCESS"; payload: { user: User } }
  | { type: "LOAD_ERROR"; payload: string }
  | { type: "DEPOSIT"; payload: number }
  | { type: "WITHDRAW"; payload: number };

const AccountContext = createContext<{
  user: User | null;
  balance: number;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  loadUser: (u: User) => Promise<void>;
  deposit: (amount: number) => void;
  withdraw: (amount: number) => void;
} | null>(null);

const initialState: AccountState = {
  user: null,
  balance: 0,
  transactions: [],
  isLoading: false,
  error: null,
};

function reducer(state: AccountState, action: Action): AccountState {
  switch (action.type) {
    case "LOAD_START":
      return { ...state, isLoading: true, error: null };

    case "LOAD_SUCCESS":
      return {
        ...state,
        isLoading: false,
        user: action.payload.user,
        balance: action.payload.user.balance,
        transactions: [],
      };

    case "LOAD_ERROR":
      return { ...state, isLoading: false, error: action.payload };

    case "DEPOSIT": {
      const amount = action.payload;
      if (amount <= 0) return state;

      const newTx: Transaction = {
        id: Date.now(),
        userId: state.user?.userId || 0,
        type: "Deposit",
        amount,
        currency: "ILS",
        date: new Date().toISOString(),
      };

      return {
        ...state,
        balance: state.balance + amount,
        transactions: [newTx, ...state.transactions],
      };
    }

    case "WITHDRAW": {
      const amount = action.payload;

      if (amount <= 0 || amount > state.balance) return state;

      const newTx: Transaction = {
        id: Date.now(),
        userId: state.user?.userId || 0,
        type: "Withdraw",
        amount,
        currency: "ILS",
        date: new Date().toISOString(),
      };

      return {
        ...state,
        balance: state.balance - amount,
        transactions: [newTx, ...state.transactions],
      };
    }

    default:
      return state;
  }
}

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  ///
  useEffect(() => {
    if (state.user) {
      const updatedUser: User = {
        ...state.user,
        balance: state.balance,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  }, [state.user, state.balance]);
  ///
  async function loadUser(u: User) {
    dispatch({ type: "LOAD_START" });

    try {
      await new Promise((r) => setTimeout(r, 300)); // simulate delay
      dispatch({ type: "LOAD_SUCCESS", payload: { user: u } });
    } catch (err) {
      dispatch({ type: "LOAD_ERROR", payload: "Failed to load user" });
    }
  }

  const deposit = (amount: number) =>
    dispatch({ type: "DEPOSIT", payload: amount });

  const withdraw = (amount: number) =>
    dispatch({ type: "WITHDRAW", payload: amount });

  return (
    <AccountContext.Provider
      value={{
        ...state,
        loadUser,
        deposit,
        withdraw,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error("useAccount must be used within AccountProvider");
  return ctx;
}
