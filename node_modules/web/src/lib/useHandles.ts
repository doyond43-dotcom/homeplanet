import { useCallback, useEffect, useMemo, useState } from "react";

/**
 * Handles Truth Engine — Calm Core
 *
 * Now includes: suggestFromText(text)
 * - Extracts candidate phrases (simple heuristic)
 * - Dedupe vs existing handles
 * - Adds as "suggested" (never auto-confirms)
 */

export type HandleStatus = "suggested" | "confirmed" | "ignored";

export type Handle = {
  id: string;
  label: string;
  status: HandleStatus;
  createdAt: number;
  source?: "seed" | "manual" | "text";
};

type UseHandlesOptions = {
  storageKey: string;
  seed?: string[];
};

function normalizeLabel(s: string) {
  return s.trim().replace(/\s+/g, " ").toLowerCase();
}

function pickPhrases(text: string): string[] {
  // Calm heuristic extraction:
  // - Uses the last ~1200 chars (recent context)
  // - Splits on punctuation/newlines
  // - Keeps short phrases that look like “claims/definitions”
  const t = (text ?? "").trim();
  if (!t) return [];

  const tail = t.slice(Math.max(0, t.length - 1200));
  const parts = tail
    .split(/[\n\r]+|[.?!:;]+/g)
    .map((p) => p.trim())
    .filter(Boolean);

  const phrases: string[] = [];
  for (const p of parts) {
    // Remove leading bullets / numbering
    const cleaned = p.replace(/^[-*•\d)+\]]+\s*/g, "").trim();
    if (!cleaned) continue;

    // Prefer “sentence-like” or “definition-like” fragments
    const wordCount = cleaned.split(/\s+/).filter(Boolean).length;
    if (wordCount < 4 || wordCount > 12) continue;

    // Avoid super generic filler
    const lower = cleaned.toLowerCase();
    if (
      lower.startsWith("i think") ||
      lower.startsWith("maybe") ||
      lower.startsWith("like ") ||
      lower === "thanks"
    ) {
      continue;
    }

    // Title-case-ish quick pass is too aggressive; keep natural
    phrases.push(cleaned);
  }

  // Return up to 6 strongest (most recent first)
  return phrases.slice(-6);
}

export function useHandles({ storageKey, seed = [] }: UseHandlesOptions) {
  const [handles, setHandles] = useState<Handle[]>([]);

  // Load once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as Handle[];
        if (Array.isArray(parsed)) {
          setHandles(parsed);
          return;
        }
      }
    } catch {
      // ignore corruption
    }

    // Seed first run
    if (seed.length) {
      const now = Date.now();
      const seeded: Handle[] = seed.map((label, i) => ({
        id: `h_seed_${i}_${now}`,
        label,
        status: "suggested",
        createdAt: now + i,
        source: "seed",
      }));
      setHandles(seeded);
    }
  }, [storageKey, seed]);

  // Persist
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(handles));
  }, [handles, storageKey]);

  const confirmHandle = useCallback((id: string) => {
    setHandles((prev) =>
      prev.map((h) => (h.id === id ? { ...h, status: "confirmed" } : h))
    );
  }, []);

  const ignoreHandle = useCallback((id: string) => {
    setHandles((prev) =>
      prev.map((h) => (h.id === id ? { ...h, status: "ignored" } : h))
    );
  }, []);

  const addHandle = useCallback((label: string) => {
    const clean = label.trim().replace(/\s+/g, " ");
    if (!clean) return;

    setHandles((prev) => {
      const existing = new Set(prev.map((h) => normalizeLabel(h.label)));
      if (existing.has(normalizeLabel(clean))) return prev;

      return [
        ...prev,
        {
          id: `h_manual_${Date.now()}`,
          label: clean,
          status: "suggested",
          createdAt: Date.now(),
          source: "manual",
        },
      ];
    });
  }, []);

  // NEW: Suggest handles from text (never confirms; never overwrites)
  const suggestFromText = useCallback((text: string) => {
    const candidates = pickPhrases(text);
    if (!candidates.length) return;

    setHandles((prev) => {
      const existing = new Set(prev.map((h) => normalizeLabel(h.label)));
      const toAdd = candidates
        .map((c) => c.trim().replace(/\s+/g, " "))
        .filter((c) => c && !existing.has(normalizeLabel(c)));

      if (!toAdd.length) return prev;

      const now = Date.now();
      const newOnes: Handle[] = toAdd.map((label, idx) => ({
        id: `h_text_${now}_${idx}`,
        label,
        status: "suggested",
        createdAt: now + idx,
        source: "text",
      }));

      return [...prev, ...newOnes];
    });
  }, []);

  const suggested = useMemo(
    () => handles.filter((h) => h.status === "suggested"),
    [handles]
  );
  const confirmed = useMemo(
    () => handles.filter((h) => h.status === "confirmed"),
    [handles]
  );
  const ignored = useMemo(
    () => handles.filter((h) => h.status === "ignored"),
    [handles]
  );

  return {
    handles,
    suggested,
    confirmed,
    ignored,
    confirmHandle,
    ignoreHandle,
    addHandle,
    suggestFromText,
  };
}


