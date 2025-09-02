"use client";

export default function ThemeToggle() {
  return (
    <button
      type="button"
      className="rounded-full border border-border px-3 py-1 text-sm hover:bg-accent/40"
      onClick={() => {
        const html = document.documentElement;
        html.classList.toggle('dark');
      }}
      aria-label="Toggle theme"
    >
      Theme
    </button>
  );
}

