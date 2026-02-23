// apps/web/src/service/quickText.ts
// Invisible "greasy gloves" shorthand expansion.
// Use onKeyDown (Tab) to expand the *last token* at the caret (end of input).

export type QuickTextDict = Record<string, string>;

// Keep this small at first. Add only what you actually use.
export const QUICK_TEXT: QuickTextDict = {
  // sides / position
  ds: "driver side",
  drv: "driver side",
  driver: "driver side",

  ps: "passenger side",
  pass: "passenger side",
  passenger: "passenger side",

  fr: "front",
  front: "front",
  rr: "rear",
  rear: "rear",

  l: "left",
  left: "left",
  r: "right",
  right: "right",

  // common parts / jobs
  hl: "headlamp",
  headlamp: "headlamp",
  headlight: "headlamp",

  alt: "alternator",
  alternator: "alternator",

  batt: "battery",
  battery: "battery",

  wm: "window motor",
  window: "window",
  "window-motor": "window motor",

  sw: "switch",
  switch: "switch",

  plug: "tire plug",
  "tire-plug": "tire plug",

  rot: "rotation",
  rotate: "rotation",
  rotation: "rotation",

  // verbs
  rep: "replace",
  repl: "replace",
  replace: "replace",

  test: "test",
  diag: "diagnostic",
  diagnostic: "diagnostic",

  inst: "install",
  install: "install",
};

function normalizeToken(t: string) {
  return t.trim().toLowerCase();
}

/**
 * Expand the last token if it matches the dictionary.
 * Only expands when caret is at the end (simple + safe).
 */
export function expandOnTab(
  e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  dict: QuickTextDict = QUICK_TEXT
) {
  if (e.key !== "Tab") return;

  const el = e.currentTarget;
  const value = el.value ?? "";
  const caret = el.selectionStart ?? value.length;

  // Safety: only expand when caret is at end (prevents weird mid-string edits)
  if (caret !== value.length) return;

  // Get last token (split on whitespace)
  const parts = value.split(/\s+/);
  const last = parts[parts.length - 1] ?? "";
  const key = normalizeToken(last);

  const replacement = dict[key];
  if (!replacement) return;

  // Prevent focus change (Tab normally moves to next field)
  e.preventDefault();

  parts[parts.length - 1] = replacement;
  const next = parts.join(" ").replace(/\s+/g, " ").trimStart();

  el.value = next;

  // Fire an input event so React state updates
  el.dispatchEvent(new Event("input", { bubbles: true }));
}