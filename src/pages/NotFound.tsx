import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground transition-colors duration-500">
      <div className="text-center px-6">
        <h1 className="text-[6rem] font-extrabold text-primary leading-none mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold mb-3 text-muted-foreground">
          Oops! Page not found
        </h2>
        <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-2 rounded-[var(--radius)] bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all shadow-md"
        >
          ⬅ Go back to Dashboard
        </button>
      </div>
    </main>
  );
}
