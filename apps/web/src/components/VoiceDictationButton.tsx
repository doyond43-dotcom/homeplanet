import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  onText?: (chunk: string) => void;        // optional
  onFinal?: (final: string) => void;       // optional
  onTranscript?: (chunk: string) => void;  // optional (alias)
  disabled?: boolean;
};

type SR = any & {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
};

export function VoiceDictationButton({ onText, onFinal, onTranscript, disabled }: Props) {
  const [supported, setSupported] = useState(true);
  const [listening, setListening] = useState(false);
  const [err, setErr] = useState<string>("");

  const recRef = useRef<SR | null>(null);

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
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onresult = (e: any) => {
      let finalText = "";

      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        const t = String(r?.[0]?.transcript ?? "");

        if (r.isFinal) {
          finalText += t;
        } else {
          // interim chunk
          const chunk = t.trim();
          if (chunk) {
            onText?.(chunk + " ");
            onTranscript?.(chunk + " ");
          }
        }
      }

      const cleanedFinal = finalText.trim();
      if (cleanedFinal) {
        onFinal?.(cleanedFinal + " ");
        onText?.(cleanedFinal + " ");
        onTranscript?.(cleanedFinal + " ");
      }
    };

    rec.onerror = (e: any) => {
      setErr(e?.error ? String(e.error) : "Voice error");
      setListening(false);
    };

    rec.onend = () => setListening(false);

    recRef.current = rec;

    return () => {
      try { rec.stop(); } catch {}
      recRef.current = null;
    };
  }, [SpeechRecognitionCtor, onText, onFinal, onTranscript]);

  const toggle = async () => {
    setErr("");
    if (!recRef.current) return;

    if (listening) {
      try { recRef.current.stop(); } catch {}
      setListening(false);
      return;
    }

    try {
      recRef.current.start();
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

