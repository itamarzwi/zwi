export type ThemePreference = "system" | "light" | "dark";

const STORAGE_KEY = "learning-german:theme";

export const readThemePreference = (): ThemePreference => {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" ? value : "system";
  } catch {
    return "system";
  }
};

export const applyTheme = (preference: ThemePreference) => {
  const dark =
    preference === "dark" || (preference === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
};

export const saveThemePreference = (preference: ThemePreference) => {
  try {
    if (preference === "system") localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, preference);
  } catch {
    // Storage unavailable (private mode); the preference just won't persist.
  }
  applyTheme(preference);
};
