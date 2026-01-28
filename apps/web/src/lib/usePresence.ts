import { useEffect } from "react";
import { emitCoreTruth } from "./coreTruth";

/**
 * usePresence
 * Lightweight auto-presence heartbeat.
 * This MUST exist because CoreTruthView imports it.
 */
export function usePresence(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    let timer: ReturnType<typeof setInterval>;

    async function heartbeat() {
      try {
        await emitCoreTruth("presence_auto", {
          note: "auto heartbeat",
        });
      } catch {
        // silent — presence should never crash UI
      }
    }

    heartbeat();
    timer = setInterval(heartbeat, 30_000);

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [enabled]);
}


