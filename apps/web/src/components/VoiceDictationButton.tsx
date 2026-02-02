import React, { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  onFinal?: (final: string) => void;
  disabled?: boolean;
  lang?: string; // default: en-US
};

type SR = any;

function getSR(): SR | null {
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

function norm(s: string) {
  return String(s || "")
    .replace(/\s+/g, " ")
    .replace(/\u00A0/g, " ")
    .trim();
}

export default function VoiceDictationButton(props: Props) {
  const { onFinal, disabled, lang = "en-US" } = props;

  const [state, setState] = useState<"idle" | "starting" | "listening">("idle");
  const [error, setError] = useState<string | null>(null);
  const [interim, setInterim] = useState<string>("");

  const recRef = useRef<SR | null>(null);
  const wantListeningRef = useRef(false);
  const restartTimerRef = useRef<number | null>(null);

  // Strong dedupe: same text within N ms is ignored
  const lastEmitRef = useRef<{ t: string; ts: number }>({ t: "", ts: 0 });
  const recentMapRef = useRef<Map<string, number>>(new Map());

  const clearTimers = () => {
    if (restartTimerRef.current) window.clearTimeout(restartTimerRef.current);
    restartTimerRef.current = null;
  };

  const safeStop = () => {
    wantListeningRef.current = false;
    clearTimers();
    setState("idle");
    setInterim("");
    try {
      // stop() lets it finalize; abort() kills immediately (useful if it’s stuck)
      recRef.current?.stop?.();
    } catch {}
  };

  const hardResetRec = () => {
    // If Chrome gets “sticky”, recreating the instance is the cleanest reset.
    try {
      recRef.current?.abort?.();
    } catch {}
    recRef.current = null;
  };

  const shouldEmitFinal = (raw: string) => {
    const t = norm(raw);
    if (!t) return false;

    const now = Date.now();

    // 1) exact same as last emit within 2500ms → ignore
    if (t === lastEmitRef.current.t && now - lastEmitRef.current.ts < 2500) {
      return false;
    }

    // 2) seen in recent map within 4000ms → ignore
    const seenAt = recentMapRef.current.get(t);
    if (seenAt && now - seenAt < 4000) return false;

    // remember
    lastEmitRef.current = { t, ts: now };
    recentMapRef.current.set(t, now);

    // prune map to keep it small
    for (const [k, ts] of recentMapRef.current.entries()) {
      if (now - ts > 10000) recentMapRef.current.delete(k);
    }

    return true;
  };

  const ensureRec = (): SR => {
    if (recRef.current) return recRef.current;

    const Ctor = getSR();
    if (!Ctor) throw new Error("SpeechRecognition not supported in this browser");

    const rec = new Ctor();

    /**
     * Key behavior:
     * - interimResults=true => instant feedback (feels “crisp”)
     * - continuous=false   => Chrome finalizes smaller chunks more reliably
     */
    rec.continuous = false;
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.lang = lang;

    rec.onstart = () => {
      setError(null);
      setInterim("");
      setState("listening");
    };

    // Force quicker finalization when the user stops speaking (reduces “10s lag” feel)
    rec.onspeechend = () => {
      try {
        rec.stop();
      } catch {}
    };

    rec.onerror = (e: any) => {
      const msg = e?.error ? String(e.error) : "speech error";
      setError(msg);

      // Hard stop on permission problems
      if (msg === "not-allowed" || msg === "service-not-allowed") {
        wantListeningRef.current = false;
        setState("idle");
        setInterim("");
        return;
      }

      // For transient errors, restart if the user still wants listening
      if (wantListeningRef.current) {
        clearTimers();
        restartTimerRef.current = window.setTimeout(() => {
          try {
            rec.start();
            setState("starting");
          } catch {}
        }, 180);
      } else {
        setState("idle");
      }
    };

    rec.onresult = (ev: any) => {
      try {
        let latestInterim = "";

        for (let i = ev.resultIndex; i < ev.results.length; i++) {
          const res = ev.results[i];
          const t = norm(res?.[0]?.transcript || "");
          if (!t) continue;

          if (res.isFinal) {
            setInterim("");
            if (shouldEmitFinal(t)) onFinal?.(t);
          } else {
            latestInterim = t;
          }
        }

        // show interim immediately (this is what makes it feel responsive)
        if (latestInterim) setInterim(latestInterim);
      } catch {}
    };

    rec.onend = () => {
      // Browser ends on pauses; if user wants it, restart quickly.
      if (wantListeningRef.current) {
        clearTimers();
        restartTimerRef.current = window.setTimeout(() => {
          try {
            rec.start();
            setState("starting");
          } catch {
            // If restart fails, hard reset recognition instance
            hardResetRec();
            try {
              const next = ensureRec();
              next.start();
              setState("starting");
            } catch {}
          }
        }, 120);
      } else {
        setState("idle");
      }
    };

    recRef.current = rec;
    return rec;
  };

  const start = () => {
    setError(null);
    setInterim("");
    wantListeningRef.current = true;
    setState("starting");

    // reset dedupe window for a new “session”
    lastEmitRef.current = { t: "", ts: 0 };
    recentMapRef.current = new Map();

    // Sometimes calling start() while it’s half-alive throws.
    // Abort + tiny delay gives Chrome a clean edge.
    try {
      recRef.current?.abort?.();
    } catch {}

    try {
      const rec = ensureRec();
      window.setTimeout(() => {
        try {
          rec.start();
        } catch (e: any) {
          const msg = String(e?.message || e);
          if (!/start/i.test(msg)) setError(msg);
        }
      }, 40);
    } catch (e: any) {
      setError(String(e?.message || e));
      setState("idle");
    }
  };

  const toggle = () => {
    if (disabled) return;
    if (wantListeningRef.current) safeStop();
    else start();
  };

  useEffect(() => {
    return () => {
      try {
        wantListeningRef.current = false;
        safeStop();
        hardResetRec();
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isOn = state === "listening" || state === "starting";

  const styles = useMemo(() => {
    return {
      wrap: {
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
      } as React.CSSProperties,

      // HomePlanet “handle” pill — playful, not SMS
      btn: {
        height: 38,
        padding: "0 14px",
        borderRadius: 12,
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        border: isOn
          ? "1px solid rgba(0,255,150,0.55)"
          : "1px solid rgba(255,255,255,0.16)",
        background: isOn ? "rgba(0,255,150,0.10)" : "rgba(0,0,0,0.22)",
        boxShadow: isOn
          ? "0 0 0 3px rgba(0,255,150,0.16), 0 14px 36px rgba(0,0,0,0.45)"
          : "none",
        cursor: disabled ? "not-allowed" : "pointer",
        userSelect: "none",
        transition: "all 160ms ease",
        color: "rgba(255,255,255,0.92)",
        fontWeight: 900,
        letterSpacing: 0.2,
      } as React.CSSProperties,

      icon: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      } as React.CSSProperties,

      status: {
        fontSize: 12,
        opacity: 0.78,
        color: "rgba(255,255,255,0.82)",
        fontWeight: 700,
        maxWidth: 260,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      } as React.CSSProperties,

      err: { fontSize: 12, opacity: 0.85 } as React.CSSProperties,
    };
  }, [disabled, isOn]);

  return (
    <div style={styles.wrap}>
      <button
        type="button"
        onClick={toggle}
        disabled={!!disabled}
        aria-pressed={isOn}
        title={isOn ? "Stop dictation" : "Start dictation"}
        style={styles.btn}
      >
        <span style={styles.icon} aria-hidden="true">
          {/* fuller “tool mic” icon (gray idle, green live) */}
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              fill={isOn ? "rgba(0,255,150,0.95)" : "rgba(210,210,210,0.90)"}
              d="M12 14.25a3.25 3.25 0 0 0 3.25-3.25V6.5A3.25 3.25 0 0 0 12 3.25 3.25 3.25 0 0 0 8.75 6.5V11A3.25 3.25 0 0 0 12 14.25Zm6-3.25a.75.75 0 0 0-1.5 0 4.5 4.5 0 0 1-9 0A.75.75 0 0 0 6 11a6 6 0 0 0 5.25 5.96V20H9a.75.75 0 0 0 0 1.5h6A.75.75 0 0 0 15 20h-2.25v-3.04A6 6 0 0 0 18 11Z"
            />
          </svg>
        </span>

        {/* keep the label – this is what gave it that “creator tool” feel */}
        {isOn ? "Listening" : "Speak"}
      </button>

      {/* tiny live feedback so it feels fast */}
      <div style={styles.status}>
        {error ? <span style={styles.err}>Mic: {error}</span> : null}
        {!error && isOn ? (interim ? interim : state === "starting" ? "…" : "") : null}
      </div>
    </div>
  );
}



