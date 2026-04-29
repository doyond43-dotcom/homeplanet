import React, { useEffect, useState } from "react";

const PIN_KEY = "hp:board:pin";
const RECOVERY_KEY = "hp:board:recovery";
const RECOVERY_EXPIRES_KEY = "hp:board:recovery_expires";
const RECOVERY_TTL_MS = 15 * 60 * 1000;

export default function BoardLockGate({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState("");
  const [storedPin, setStoredPin] = useState<string | null>(null);
  const [mode, setMode] = useState<"create" | "unlock" | "reset">("create");
  const [error, setError] = useState("");
  const [recoveryLink, setRecoveryLink] = useState("");
  const [recoveryMessage, setRecoveryMessage] = useState("");

  useEffect(() => {
    const existing = localStorage.getItem(PIN_KEY);
    const recovery = localStorage.getItem(RECOVERY_KEY);
    const recoveryExpires = localStorage.getItem(RECOVERY_EXPIRES_KEY);

    const params = new URLSearchParams(window.location.search);
    const token = params.get("recover");

    if (token) {
      const expiresAt = recoveryExpires ? Number(recoveryExpires) : 0;
      const isValid =
        recovery &&
        token === recovery &&
        expiresAt > Date.now();

      if (isValid) {
        setMode("reset");
        return;
      }

      localStorage.removeItem(RECOVERY_KEY);
      localStorage.removeItem(RECOVERY_EXPIRES_KEY);
      setRecoveryMessage("Recovery link expired. Generate a new recovery link.");
    }

    if (existing) {
      setStoredPin(existing);
      setMode("unlock");
    }
  }, []);

  function handlePress(n: string) {
    if (pin.length >= 6) return;

    const next = pin + n;
    setPin(next);

    if (next.length === 6) {
      if (mode === "create" || mode === "reset") {
        localStorage.setItem(PIN_KEY, next);
        localStorage.removeItem(RECOVERY_KEY);
        localStorage.removeItem(RECOVERY_EXPIRES_KEY);
        setTimeout(() => onUnlock(), 200);
      } else {
        if (next === storedPin) {
          setTimeout(() => onUnlock(), 150);
        } else {
          setError("Incorrect code");
          setTimeout(() => {
            setPin("");
            setError("");
          }, 800);
        }
      }
    }
  }

  function handleDelete() {
    setPin(pin.slice(0, -1));
  }

  function generateRecovery() {
    const token =
      Math.random().toString(36).substring(2) +
      Math.random().toString(36).substring(2);

    const expiresAt = Date.now() + RECOVERY_TTL_MS;

    localStorage.setItem(RECOVERY_KEY, token);
    localStorage.setItem(RECOVERY_EXPIRES_KEY, String(expiresAt));

    const link = `${window.location.origin}${window.location.pathname}?recover=${token}`;

    setRecoveryLink(link);
    setRecoveryMessage("Recovery link created. It expires in 15 minutes.");
  }

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#020617] text-white">
      <div className="w-full max-w-sm px-6">
        <div className="mb-10 text-center">
          <div className="text-lg font-black">
            {mode === "create"
              ? "Create Access Code"
              : mode === "reset"
              ? "Reset Access Code"
              : "Locked Private Board"}
          </div>

          <div className="mt-2 text-sm text-white/70">
            {mode === "create"
              ? "Set your 6-digit private access code."
              : mode === "reset"
              ? "Create a new access code."
              : "Enter your private access code to unlock."}
          </div>

          <div className="mt-1 text-xs text-white/50">
            Only you control access. Not even HomePlanet can view your data.
          </div>
        </div>

        <div className="mb-8 flex justify-center gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`h-3 w-3 rounded-full border ${
                i < pin.length ? "bg-white border-white" : "border-white/30"
              }`}
            />
          ))}
        </div>

        {error && (
          <div className="mb-4 text-center text-xs text-red-400">
            {error}
          </div>
        )}

        {recoveryMessage && (
          <div className="mb-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-xs text-white/70">
            {recoveryMessage}
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          {["1","2","3","4","5","6","7","8","9","","0","⌫"].map((key, i) => {
            if (key === "") return <div key={i} />;
            return (
              <button
                key={i}
                onClick={() =>
                  key === "⌫" ? handleDelete() : handlePress(key)
                }
                className="h-14 rounded-xl bg-white/10 text-lg font-bold"
              >
                {key}
              </button>
            );
          })}
        </div>

        {mode === "unlock" && (
          <div className="mt-6 text-center">
            <button
              onClick={generateRecovery}
              className="text-xs text-white/60 underline"
            >
              Forgot code?
            </button>
          </div>
        )}

        {recoveryLink && (
          <div className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-center text-xs text-emerald-200">
            <div className="font-bold">Recovery Link</div>
            <div className="mt-1 break-all">{recoveryLink}</div>
            <div className="mt-2 text-emerald-100/70">
              Expires in 15 minutes.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
