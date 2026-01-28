import { useEffect, useState } from "react";
import { getMyPresenceState, type PresenceStateRow } from "./presenceApi";
import { supabase } from "./supabase";

export function usePresenceState(pollMs: number = 5000) {
  const [row, setRow] = useState<PresenceStateRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    let t: any;

    async function tick() {
      try {
        setLoading(true);

        const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
        if (sessionErr) throw sessionErr;

        const userId = sessionData.session?.user?.id;
        if (!userId) {
          // Not signed in yet (or session still loading). Not an error.
          if (!alive) return;
          setRow(null);
          setErr(null);
          setLoading(false);
          return;
        }

        const r = await getMyPresenceState(userId);

        if (!alive) return;

        if (!r.ok) {
          setErr(r.error);
          setRow(null);
        } else {
          // ok=true + data=null is normal ("no presence row yet")
          setErr(null);
          setRow(r.data);
        }

        setLoading(false);
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message ?? "Failed to load presence_state");
        setRow(null);
        setLoading(false);
      }
    }

    tick();
    t = setInterval(tick, pollMs);

    return () => {
      alive = false;
      if (t) clearInterval(t);
    };
  }, [pollMs]);

  return { row, loading, err };
}

