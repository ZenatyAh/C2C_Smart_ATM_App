import TransactionTable from "@/components/TransactionTable";
import { useAccount } from "@/context/AccountContext";
import type { Transaction } from "@/utils/types";
import { useState, useEffect } from "react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function History() {
  const { user } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [typeFilter, setTypeFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [page, setPage] = useState(1);
  const limit = 5;


  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}transactions`);
        const data: Transaction[] = await res.json();

        const userTxs = user?.userId ? data.filter(tx => tx.userId === user?.userId) : data;

        setTransactions(userTxs);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();


  }, [user?.userId]);

  const filteredTransactions = transactions
    .filter((tx) => {
      if (typeFilter && tx.type !== typeFilter) return false;


      const txDate = new Date(tx.date);
      if (dateFrom && txDate < new Date(dateFrom + "T00:00:00Z")) return false;
      if (dateTo && txDate > new Date(dateTo + "T23:59:59Z")) return false;

      return true;
    });

  const paginatedTransactions = filteredTransactions.slice(
    (page - 1) * limit,
    page * limit
  );

  const computedTotalPages = Math.max(Math.ceil(filteredTransactions.length / limit), 1);

  useEffect(() => {
    setPage(1);
  }, [typeFilter, dateFrom, dateTo]);

  return (<div className="bg-background text-foreground min-h-screen p-6"> <h1 className="text-2xl font-bold mb-4">Transaction History</h1>

    <div className="flex flex-wrap gap-4 mb-4">
      <select
        className="border border-border rounded px-2 py-1 bg-card text-foreground"
        value={typeFilter}
        onChange={(e) => setTypeFilter(e.target.value)}
      >
        <option value="">All Types</option>
        <option value="Deposit">Deposit</option>
        <option value="Withdraw">Withdraw</option>
        <option value="Transfer">Transfer</option>
      </select>

      <div className="flex gap-2">
        <input
          type="date"
          className="border border-border rounded px-2 py-1 bg-card text-foreground"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          placeholder="From"
        />
        <input
          type="date"
          className="border border-border rounded px-2 py-1 bg-card text-foreground"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          placeholder="To"
        />
      </div>
    </div>

    {loading ? (
      <p className="text-accent">Loading transactions...</p>
    ) : paginatedTransactions.length === 0 ? (
      <p className="text-muted-foreground">No transactions found.</p>
    ) : (
      <TransactionTable paginatedTransactions={paginatedTransactions} />
    )}

    <div className="flex justify-between items-center mt-4">
      <button
        className="px-4 py-2 rounded bg-primary text-primary-foreground disabled:opacity-50 cursor-pointer"
        onClick={() => setPage((p) => Math.max(p - 1, 1))}
        disabled={page === 1}
      >
        Previous
      </button>
      <span>
        Page {page} of {computedTotalPages}
      </span>
      <button
        className="px-4 py-2 rounded bg-primary text-primary-foreground disabled:opacity-50 cursor-pointer"
        onClick={() => setPage((p) => Math.min(p + 1, computedTotalPages))}
        disabled={page === computedTotalPages}
      >
        Next
      </button>
    </div>
  </div>


  );
}
