import { useEffect, useState } from "react";

export default function BirthdayModal({
  name,
  birthday,
}: {
  name: string;
  birthday: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const today = new Date();
    const b = new Date(birthday);

    const isBirthday =
      today.getMonth() === b.getMonth() && today.getDate() === b.getDate();

    const key = `birthday:${name}:${today.toDateString()}`;
    const shown = sessionStorage.getItem(key);

    if (isBirthday && !shown) {
      setOpen(true);
      sessionStorage.setItem(key, "1");
    }
  }, [name, birthday]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-card rounded-[var(--radius)] border border-border p-6 max-w-sm w-full shadow">
        <h2 className="text-xl font-semibold">🎉 Happy Birthday, {name}!</h2>

        <p className="text-sm text-muted-foreground mt-2">
          Happy Birthday, Wishing you a wonderful day !🎂💖
        </p>

        <button
          className="mt-4 px-4 py-2 rounded-[var(--radius)] border border-border bg-card shadow-sm"
          onClick={() => setOpen(false)}
        >
          Close
        </button>
      </div>
    </div>
  );
}
