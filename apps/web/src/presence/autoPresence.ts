// src/presence/autoPresence.ts
// Level 1 auto presence: load + unload only

type RecordFn = (kind: "present_start" | "present_exit", source: string) => void;

export function enableAutoPresence(record: RecordFn) {
  // Fire once on load
  record("present_start", "auto_load");

  // Fire on exit (best-effort)
  const onUnload = () => {
    record("present_exit", "auto_unload");
  };

  window.addEventListener("beforeunload", onUnload);
  window.addEventListener("pagehide", onUnload); // important for iOS

  return () => {
    window.removeEventListener("beforeunload", onUnload);
    window.removeEventListener("pagehide", onUnload);
  };
}
