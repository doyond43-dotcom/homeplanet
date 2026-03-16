import { useMemo, useState } from "react";
import {
  Shield,
  Smartphone,
  Link2,
  CheckCircle2,
  AlertTriangle,
  Phone,
  Bell,
} from "lucide-react";

function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    const ten = digits.slice(1);
    return `+1 (${ten.slice(0, 3)}) ${ten.slice(3, 6)}-${ten.slice(6)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

function nowStamp() {
  return new Date().toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function GuardianJoinDesk() {
  const [pairCode, setPairCode] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [statusNote, setStatusNote] = useState(
    "Enter the Guardian pair code from Dad’s dashboard.",
  );
  const [joinedAt, setJoinedAt] = useState<string | null>(null);

  const deviceLabel = useMemo(() => {
    const ua = navigator.userAgent;
    if (/iPhone/i.test(ua)) return "iPhone";
    if (/iPad/i.test(ua)) return "iPad";
    if (/Android/i.test(ua)) return "Android Phone";
    return "Browser Device";
  }, []);

  function handleJoinGuardian() {
    const clean = pairCode.trim().toUpperCase();

    if (!clean || clean.length < 4) {
      setStatusNote("Enter a valid pair code first.");
      return;
    }

    setIsJoined(true);
    setJoinedAt(nowStamp());
    setStatusNote(`Guardian linked on this device with code ${clean}.`);
  }

  function handleImOkay() {
    setStatusNote("I’m OK response ready. Dad can be notified instantly.");
  }

  function handleNeedHelp() {
    setStatusNote("Need Help response ready. Dad can be notified instantly.");
  }

  function handleCallDad() {
    window.location.href = "tel:8635320683";
  }

  function handleTextDad() {
    const body = `Guardian Join update: Haley is on ${deviceLabel}. ${
      isJoined ? `Joined with code ${pairCode.trim().toUpperCase()}.` : "Not joined yet."
    }`;
    window.location.href = `sms:8635320683?body=${encodeURIComponent(body)}`;
  }

  return (
    <div className="min-h-screen bg-[#0b1020] text-white">
      <div className="mx-auto max-w-[760px] px-6 py-8">
        <header className="mb-6 rounded-3xl border border-blue-400/20 bg-gradient-to-r from-blue-900/40 to-purple-900/40 p-6 shadow-[0_0_0_1px_rgba(96,165,250,0.06),0_12px_40px_rgba(0,0,0,0.25)]">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-blue-300" />
            <h1 className="text-xl font-semibold tracking-wide">Guardian Join</h1>
          </div>

          <p className="mt-2 text-sm text-blue-200/80">
            Link this device to Planet Guardian so motion, stops, and impact checks can run from the wearer side.
          </p>
        </header>

        <section className="rounded-3xl border border-blue-400/20 bg-blue-950/30 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.24)]">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-blue-400/15 bg-black/20 p-4">
              <div className="flex items-center gap-2 text-sm uppercase tracking-wider text-blue-200/80">
                <Smartphone className="h-4 w-4 text-blue-300" />
                Device
              </div>
              <div className="mt-2 text-base font-semibold">{deviceLabel}</div>
              <div className="mt-1 text-sm text-blue-100/70">
                Wearer device for Haley Guardian testing
              </div>
            </div>

            <div className="rounded-2xl border border-blue-400/15 bg-black/20 p-4">
              <div className="flex items-center gap-2 text-sm uppercase tracking-wider text-blue-200/80">
                <Link2 className="h-4 w-4 text-blue-300" />
                Parent Guardian
              </div>
              <div className="mt-2 text-base font-semibold">Daniel Doyon</div>
              <div className="mt-1 text-sm text-blue-100/70">
                {formatPhone("8635320683")}
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-900/10 p-4">
            <div className="text-sm uppercase tracking-wider text-cyan-200/80">
              Pair Code
            </div>

            <input
              value={pairCode}
              onChange={(e) => setPairCode(e.target.value.toUpperCase())}
              placeholder="Enter code from Dad's Guardian screen"
              className="mt-3 w-full rounded-2xl border border-blue-400/20 bg-[#0c1730] px-4 py-3 text-base text-white outline-none placeholder:text-blue-200/35"
            />

            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <ActionButton
                icon={Link2}
                label={isJoined ? "Guardian Linked" : "Join Guardian"}
                onClick={handleJoinGuardian}
                tone={isJoined ? "green" : "blue"}
              />
              <ActionButton
                icon={CheckCircle2}
                label="I'm OK"
                onClick={handleImOkay}
                tone="green"
              />
              <ActionButton
                icon={AlertTriangle}
                label="Need Help"
                onClick={handleNeedHelp}
                tone="orange"
              />
              <ActionButton
                icon={Phone}
                label="Call Dad"
                onClick={handleCallDad}
                tone="blue"
              />
              <ActionButton
                icon={Bell}
                label="Text Dad"
                onClick={handleTextDad}
                tone="purple"
              />
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-purple-400/20 bg-purple-900/15 p-4">
            <div className="text-sm uppercase tracking-wider text-purple-200/80">
              Join Status
            </div>
            <div className="mt-2 text-base font-semibold">
              {isJoined ? "Linked to Guardian" : "Waiting to join"}
            </div>
            <div className="mt-1 text-sm text-purple-100/75">{statusNote}</div>
            {joinedAt && (
              <div className="mt-2 text-xs text-purple-200/70">
                Joined at {joinedAt}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  tone = "blue",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
  tone?: "blue" | "green" | "purple" | "orange";
}) {
  const toneClasses =
    tone === "green"
      ? "border-emerald-400/35 bg-emerald-900/20 hover:bg-emerald-800/30 text-emerald-50"
      : tone === "purple"
        ? "border-purple-400/35 bg-purple-900/20 hover:bg-purple-800/30 text-purple-50"
        : tone === "orange"
          ? "border-amber-400/35 bg-amber-900/20 hover:bg-amber-800/30 text-amber-50"
          : "border-blue-400/35 bg-blue-900/20 hover:bg-blue-800/30 text-blue-50";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition shadow-[0_8px_22px_rgba(0,0,0,0.22)] ${toneClasses}`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}