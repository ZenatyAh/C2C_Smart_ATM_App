export default function BalanceCard({ balance }: { balance: number }) {
  const positive = balance > 0;

  return (
    <div className="rounded-[var(--radius)] border border-border bg-card p-4 shadow-sm">
      <div className="text-xs text-muted-foreground">Current Balance</div>

      <div
        className={`mt-1 text-3xl font-semibold ${
          positive ? "text-emerald-600" : "text-destructive"
        }`}
      >
        {balance} ILS
      </div>

      <div className="mt-2 text-xs text-muted-foreground">
        {positive ? "In good standing" : " Low balance"}
      </div>
    </div>
  );
}
