import { useEffect, useState } from "react";
import { getMySignals, type PresenceSignalRow } from "./signalsApi";

export function useSignals(pollMs: number = 4000, limit: number = 10) {
  const [rows, setRows] = useState<PresenceSignalRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    let timer: any = null;

    async function tick() {
      try {
        setErr(null);
        const r = await getMySignals(limit);
        if (!alive) return;
        setRows(r);
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message ?? "Failed to load signals");
      } finally {
        if (alive) setLoading(false);
      }
    }

    tick();
    timer = setInterval(tick, pollMs);

    return () => {
      alive = false;
      if (timer) clearInterval(timer);
    };
  }, [pollMs, limit]);

  return { rows, loading, err };
}
