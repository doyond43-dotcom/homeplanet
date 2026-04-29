import { useMemo } from "react";
import type { HomePlanetScopedKey } from "./homeplanetAccess";
import { PUBLIC_ONLY_ACCESS } from "./homeplanetAccess";

const STORAGE_KEY = "hp:access:key";

export function readScopedKey(): HomePlanetScopedKey {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return PUBLIC_ONLY_ACCESS;

    const parsed = JSON.parse(raw) as HomePlanetScopedKey;

    if (
      parsed.expiresAt &&
      new Date(parsed.expiresAt).getTime() < Date.now()
    ) {
      localStorage.removeItem(STORAGE_KEY);
      return PUBLIC_ONLY_ACCESS;
    }

    return parsed;
  } catch {
    return PUBLIC_ONLY_ACCESS;
  }
}

export function useScopedAccess() {
  const key = useMemo(() => readScopedKey(), []);

  return {
    key,
    role: key.role,
    isPublic: key.role === "public",
  };
}

export function setScopedKey(key: HomePlanetScopedKey) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(key));
}

export function clearScopedKey() {
  localStorage.removeItem(STORAGE_KEY);
}
