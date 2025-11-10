import { useWatchlist } from "@/context/WatchlistContext";
import { useNavigate } from "react-router-dom";

export default function WatchlistPage() {
  const { currencies, watchlist, toggleWatchlist, isInWatchlist } = useWatchlist();
  const navigate = useNavigate();

  const watchlistCurrencies = currencies.filter((c) =>
    watchlist.includes(c.code)
  );

  return (
    <div className="min-h-[calc(100dvh-0px)] bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-3 py-2 rounded-[var(--radius)] border border-border bg-card shadow-sm text-sm hover:bg-accent transition"
          >
            ← Back
          </button>

          <h1 className="text-2xl font-semibold text-center flex-1">
            Currency Watchlist
          </h1>

          <div className="w-[80px]" />
        </header>

        <section className="rounded-[var(--radius)] border border-border bg-card p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold">All Currencies</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Tap the star ⭐ to add or remove a currency from your watchlist.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {currencies.map((currency) => {
              const active = isInWatchlist(currency.code);

              return (
                <button
                  key={currency.code}
                  onClick={() => toggleWatchlist(currency.code)}
                  className="
                    group flex flex-col items-start justify-between
                    rounded-[var(--radius)] border border-border bg-background/60
                    px-3 py-3 text-left shadow-sm
                    hover:bg-accent hover:border-[var(--color-primary)]/40
                    transition
                  "
                >
                  <div className="flex w-full items-center justify-between gap-2">
                    <span className="text-sm font-semibold tracking-wide">
                      {currency.code}
                    </span>
                    <span
                      className={`
                        text-lg
                        ${active ? "text-[var(--color-primary)]" : "text-muted-foreground"}
                      `}
                    >
                      {active ? "⭐" : "☆"}
                    </span>
                  </div>

                  <div className="mt-1 text-xs sm:text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {currency.rate}
                    </span>{" "}
                    <span className="text-muted-foreground">ILS</span>
                  </div>

                  {active && (
                    <span className="mt-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[0.7rem] font-medium text-primary">
                      In your watchlist
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-[var(--radius)] border border-border bg-card p-4 shadow-sm space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            Your Watchlist
            <span className="text-base">⭐</span>
          </h2>

          {watchlistCurrencies.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              You haven&apos;t added any currencies yet. Choose one from the list
              above by clicking on the star ⭐.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-3">
              {watchlistCurrencies.map((currency) => (
                <div
                  key={currency.code}
                  className="
                    rounded-[var(--radius)] border border-border bg-background/70
                    px-3 py-3 shadow-sm flex flex-col justify-between
                  "
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm tracking-wide">
                      {currency.code}
                    </span>
                    <span className="text-base">⭐</span>
                  </div>

                  <div className="mt-1 text-xs sm:text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {currency.rate}
                    </span>{" "}
                    <span className="text-muted-foreground">ILS</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
