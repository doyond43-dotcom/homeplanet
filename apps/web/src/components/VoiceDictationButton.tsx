import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  // Final-only output (recommended)
  onFinal?: (final: string) => void;

  // Optional: if you still want interim text later, we can add it back safely
  onText?: (chunk: string) => void;        // treated as final in this implementation
  onTranscript?: (chunk: string) => void;  // alias

  disabled?: boolean;
};

type SR = any & {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives?: number;
  start: () => void;
  stop: () => void;
  abort?: () => void;
  onresult: ((e: any) => void) | null;
  onerror: ((e: any) => void) | null;
  onend: (() => void) | null;
};

export function VoiceDictationButton({ onFinal, onText, onTranscript, disabled }: Props) {
  const [supported, setSupported] = useState(true);
  const [listening, setListening] = useState(false);
  const [err, setErr] = useState<string>("");

  const recRef = useRef<SR | null>(null);

  // Dedup + stability
  const lastFinalRef = useRef<string>("");
  const lastEmitAtRef = useRef<number>(0);

  const SpeechRecognitionCtor = useMemo(() => {
    const w = window as any;
    return w.SpeechRecognition || w.webkitSpeechRecognition || null;
  }, []);

  useEffect(() => {
    if (!SpeechRecognitionCtor) {
      setSupported(false);
      return;
    }

    const rec: SR = new SpeechRecognitionCtor();
    rec.continuous = true;        // keep running until you stop
    rec.interimResults = false;   // IMPORTANT: prevents “double typing”
    rec.lang = "en-US";
    rec.maxAlternatives = 1;

    rec.onresult = (e: any) => {
      // Build final transcript from this event
      let finalText = "";

      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        const t = String(r?.[0]?.transcript ?? "");
        if (r?.isFinal) finalText += t;
      }

      const cleaned = finalText.trim();
      if (!cleaned) return;

      // Dedupe identical repeats (Chrome sometimes repeats finals)
      const now = Date.now();
      const sameAsLast = cleaned === lastFinalRef.current;
      const tooSoon = now - lastEmitAtRef.current < 900; // ms

      if (sameAsLast && tooSoon) return;

      lastFinalRef.current = cleaned;
      lastEmitAtRef.current = now;

      const out = cleaned + " ";
      onFinal?.(out);
      onText?.(out);
      onTranscript?.(out);
    };

    rec.onerror = (e: any) => {
      setErr(e?.error ? String(e.error) : "Voice error");
      setListening(false);
    };

    rec.onend = () => {
      setListening(false);
    };

    recRef.current = rec;

    return () => {
      try { rec.stop(); } catch {}
      recRef.current = null;
    };
  }, [SpeechRecognitionCtor, onFinal, onText, onTranscript]);

  const toggle = async () => {
    setErr("");
    const rec = recRef.current;
    if (!rec) return;

    if (listening) {
      try { rec.stop(); } catch {}
      setListening(false);
      return;
    }

    // reset dedupe when starting fresh
    lastFinalRef.current = "";
    lastEmitAtRef.current = 0;

    try {
      rec.start();
      setListening(true);
    } catch (e: any) {
      setErr(e?.message || "Could not start mic");
      setListening(false);
    }
  };

  if (!supported) {
    return (
      <div style={{ fontSize: 12, opacity: 0.7 }}>
        🎤 Voice not supported in this browser (Chrome/Edge usually works).
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <button
        onClick={toggle}
        disabled={disabled}
        style={{
          height: 44,
          padding: "0 14px",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.16)",
          background: listening ? "rgba(0,255,150,0.18)" : "rgba(255,255,255,0.06)",
          cursor: disabled ? "not-allowed" : "pointer",
          fontWeight: 900,
          color: "rgba(255,255,255,0.92)",
        }}
        title="Tap to dictate"
      >
        {listening ? "🎤 Listening…" : "🎤 Speak"}
      </button>

      {err && (
        <div style={{ fontSize: 12, opacity: 0.85, color: "rgba(255,140,140,0.95)" }}>
          {err}
        </div>
      )}
    </div>
  );
}

export default VoiceDictationButton;
