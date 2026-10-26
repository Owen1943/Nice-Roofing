"use client";
import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

function subscribe(callback: () => void) {
  const sync = (event: StorageEvent) => {
    if (event.key === "nice-theme") {
      document.documentElement.dataset.theme =
        event.newValue === "light" ? "light" : "dark";
      callback();
    }
  };
  window.addEventListener("nice-theme-change", callback);
  window.addEventListener("storage", sync);
  return () => {
    window.removeEventListener("nice-theme-change", callback);
    window.removeEventListener("storage", sync);
  };
}
export function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribe,
    () =>
      document.documentElement.dataset.theme === "light" ? "light" : "dark",
    () => "dark",
  );
  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("nice-theme", next);
    } catch {
      /* Preference still works when storage is unavailable. */
    }
    window.dispatchEvent(new Event("nice-theme-change"));
  }
  return (
    <button
      type="button"
      className="theme-toggle icon-button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <Sun className="theme-sun" size={19} aria-hidden="true" />
      <Moon className="theme-moon" size={19} aria-hidden="true" />
    </button>
  );
}
