import { useEffect, useMemo, useRef, useState } from "react";

export type OrbitReason =
  | "idle"
  | "invalid_create"
  | "nav_thrash"
  | "unknown";

export type OrbitState = {
  open: boolean;
  reason: OrbitReason;
  lastTriggeredAt: number | null;
};

export type UseOrbitLockOptions = {
  /** ms of inactivity before triggering */
  idleMs?: number;
  /** if true, Orbit Lock can trigger */
  enabled?: boolean;
  /**
   * optional condition gate: only trigger when this returns true
   * (ex: on Creator Projects, only when name empty and no projects)
   */
  canTrigger?: () => boolean;
};

type ActivityEvent = "mousemove" | "mousedown" | "keydown" | "touchstart" | "scroll";

function now() {
  return Date.now();
}

export function useOrbitLock(opts: UseOrbitLockOptions = {}) {
  const idleMs = opts.idleMs ?? 12000;
  const enabled = opts.enabled ?? true;
  const canTrigger = opts.canTrigger ?? (() => true);

  const [state, setState] = useState<OrbitState>({
    open: false,
    reason: "unknown",
    lastTriggeredAt: null,
  });

  const lastActivityRef = useRef<number>(now());
  const invalidCreateHitsRef = useRef<number[]>([]);
  const navThrashHitsRef = useRef<number[]>([]);

  const open = state.open;

  function recordActivity() {
    lastActivityRef.current = now();
  }

  function trigger(reason: OrbitReason) {
    if (!enabled) return;
    if (!canTrigger()) return;

    setState({
      open: true,
      reason,
      lastTriggeredAt: now(),
    });
  }

  function dismiss() {
    setState((s) => ({ ...s, open: false }));
  }

  function poke(reason: OrbitReason) {
    // "friction events" from the page (ex: invalid create attempts)
    if (!enabled) return;

    const t = now();
    if (reason === "invalid_create") {
      invalidCreateHitsRef.current = [...invalidCreateHitsRef.current, t].filter((x) => t - x < 10000);
      if (invalidCreateHitsRef.current.length >= 2) trigger("invalid_create");
      return;
    }

    if (reason === "nav_thrash") {
      navThrashHitsRef.current = [...navThrashHitsRef.current, t].filter((x) => t - x < 12000);
      if (navThrashHitsRef.current.length >= 3) trigger("nav_thrash");
      return;
    }

    trigger(reason);
  }

  useEffect(() => {
    if (!enabled) return;

    const events: ActivityEvent[] = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
    const onAny = () => recordActivity();
    events.forEach((e) => window.addEventListener(e, onAny, { passive: true }));

    const interval = window.setInterval(() => {
      if (open) return;
      if (!canTrigger()) return;

      const t = now();
      const idleFor = t - lastActivityRef.current;
      if (idleFor >= idleMs) trigger("idle");
    }, 500);

    return () => {
      events.forEach((e) => window.removeEventListener(e, onAny as any));
      window.clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, idleMs, open]);

  const label = useMemo(() => {
    switch (state.reason) {
      case "idle":
        return "Looks like you paused. Want me to guide you to the next step?";
      case "invalid_create":
        return "I can guide you to the next step so you can complete this cleanly.";
      case "nav_thrash":
        return "Want Orbit Lock? I can stabilize the path and get you to completion.";
      default:
        return "Want a guided path to completion?";
    }
  }, [state.reason]);

  return {
    state,
    open,
    label,
    trigger,
    dismiss,
    poke,
    recordActivity,
  };
}
