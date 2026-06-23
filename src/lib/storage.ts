import { getSeedState } from "@/lib/mock/seed";
import type { AppState } from "@/lib/types";

export const SESSION_KEY = "cme-cop-session";
export const STATE_KEY = "cme-cop-state";

export function loadAppState(): AppState {
  if (typeof window === "undefined") {
    return getSeedState();
  }

  const stored = localStorage.getItem(STATE_KEY);
  if (!stored) {
    return getSeedState();
  }

  try {
    return JSON.parse(stored) as AppState;
  } catch {
    return getSeedState();
  }
}

export function saveAppState(state: AppState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

export function resetAppState(): AppState {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STATE_KEY);
  }
  return getSeedState();
}

export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
