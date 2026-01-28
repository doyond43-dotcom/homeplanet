import type { DemoOverlayEvent } from "./types";

type Listener = (e: DemoOverlayEvent) => void;

const listeners = new Set<Listener>();

function makeId(prefix = "evt") {
  const c: any = typeof globalThis !== "undefined" ? (globalThis as any).crypto : undefined;
  return c?.randomUUID?.() ?? `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function emitDemoOverlay(partial: Omit<DemoOverlayEvent, "id" | "ts"> & { ts?: number }) {
  const evt: DemoOverlayEvent = {
    id: makeId("demo"),
    ts: partial.ts ?? Date.now(),
    kind: partial.kind,
    label: partial.label,
    meta: partial.meta ?? {},
  };

  // local in-memory listeners
  listeners.forEach((fn) => fn(evt));

  // optional cross-tab / future-proof (no harm if unused)
  try {
    window.dispatchEvent(new CustomEvent("hp:demoOverlay", { detail: evt }));
  } catch {}
}

export function subscribeDemoOverlay(fn: Listener) {
  listeners.add(fn);

  // also listen to window events (so it works even if emitted elsewhere)
  const onWin = (e: any) => {
    const evt = e?.detail as DemoOverlayEvent | undefined;
    if (evt?.id && evt?.kind && evt?.label) fn(evt);
  };

  try {
    window.addEventListener("hp:demoOverlay", onWin as any);
  } catch {}

  return () => {
    listeners.delete(fn);
    try {
      window.removeEventListener("hp:demoOverlay", onWin as any);
    } catch {}
  };
}
