import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark";
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-5 right-5 z-50 px-3 py-1.5 rounded-[var(--radius)] bg-secondary text-secondary-foreground border border-border hover:bg-accent hover:text-accent-foreground transition-all shadow-sm"
    >
      {darkMode ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}
