import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  CheckCircle2,
  Copy,
  HeartPulse,
  MapPin,
  Phone,
  Shield,
  Smartphone,
} from "lucide-react";
import type { GuardianSession, GuardianVariant } from "../../lib/guardianService";
import {
  buildGuardianSharePacket,
  confirmGuardianSafe,
  endGuardianSession,
  requestGuardianHelp,
  startGuardianSession,
} from "../../lib/guardianService";

function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

export default function GuardianPanel({
  initialSession,
  variant = "compact",
}: {
  initialSession: GuardianSession;
  variant?: GuardianVariant;
}) {
  const [session, setSession] = useState<GuardianSession>(initialSession);
  const [actionNote, setActionNote] = useState("Guardian ready.");
  const compact = variant === "compact";

  const startLabel =
    session.mode === "child"
      ? "Ride to School active"
      : session.mode === "elder"
        ? "Elder Walk active"
        : "Medical Watch active";

  function handleStart() {
    setSession((prev) => startGuardianSession(prev, startLabel));
    setActionNote("Guardian session started.");
  }

  function handleEnd() {
    setSession((prev) => endGuardianSession(prev));
    setActionNote("Guardian session ended.");
  }

  function handleImOkay() {
    setSession((prev) => confirmGuardianSafe(prev));
    setActionNote("Safe confirmation captured.");
  }

  function handleNeedHelp() {
    setSession((prev) => requestGuardianHelp(prev));
    setActionNote("Help request captured.");
  }

  function handleCall() {
    setActionNote("Opening dialer for linked contact.");
    window.location.href = `tel:${session.contactPhone}`;
  }

  function handleText() {
    const body = `Planet Guardian: ${session.wearerName} status is "${session.status}" at ${session.location}.`;
    setActionNote("Opening text relay.");
    window.location.href = `sms:${session.contactPhone}?body=${encodeURIComponent(body)}`;
  }

  async function handleShare() {
    const packet = buildGuardianSharePacket(session);

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Planet Guardian",
          text: packet,
        });
        setActionNote("Guardian packet shared.");
        return;
      }

      await navigator.clipboard.writeText(packet);
      setActionNote("Guardian packet copied.");
    } catch {
      setActionNote("Share failed or cancelled.");
    }
  }

  async function handleCopyNumber() {
    try {
      await navigator.clipboard.writeText(session.contactPhone);
      setActionNote("Primary contact number copied.");
    } catch {
      setActionNote("Copy failed.");
    }
  }

  return (
    <div className="rounded-2xl border border-blue-400/20 bg-blue-950/40 p-4 text-white">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-300" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-200/80">
              Guardian
            </h3>
          </div>
          <div className="mt-2 text-base font-semibold">{session.wearerName}</div>
          <div className="text-sm text-blue-200/80">{session.status}</div>
        </div>

        <div className="rounded-full border border-purple-400/20 bg-purple-900/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-purple-200">
          {session.mode}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <InfoRow icon={MapPin} label="Location" value={session.location} />
        <InfoRow icon={Phone} label="Wearer" value={formatPhone(session.wearerPhone)} />
        <InfoRow
          icon={Smartphone}
          label={session.contactRelation}
          value={`${session.contactName} · ${formatPhone(session.contactPhone)}`}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {!session.isActive ? (
          <ActionButton icon={CheckCircle2} label="Start Session" onClick={handleStart} />
        ) : (
          <ActionButton icon={Bell} label="End Session" onClick={handleEnd} />
        )}

        <ActionButton icon={HeartPulse} label="I'm OK" onClick={handleImOkay} />
        <ActionButton icon={Bell} label="Need Help" onClick={handleNeedHelp} />
        <ActionButton icon={Phone} label="Call" onClick={handleCall} />
        <ActionButton icon={Bell} label="Text" onClick={handleText} />
        <ActionButton icon={MapPin} label="Share" onClick={handleShare} />
        <ActionButton icon={Copy} label="Copy Contact" onClick={handleCopyNumber} />
      </div>

      <div className="mt-4 rounded-xl border border-purple-400/10 bg-purple-900/20 p-3">
        <div className="text-xs uppercase tracking-wider text-purple-200/70">
          Guardian Response
        </div>
        <div className="mt-2 text-sm text-purple-100/90">{actionNote}</div>
      </div>

      {!compact && (
        <div className="mt-4 rounded-xl border border-blue-400/10 bg-black/20 p-3">
          <div className="text-xs uppercase tracking-wider text-blue-200/70">
            Recent Events
          </div>
          <div className="mt-3 space-y-2">
            {session.events.length === 0 ? (
              <div className="text-sm text-gray-300">No guardian events yet.</div>
            ) : (
              session.events.slice(0, 5).map((event) => (
                <div key={event.id} className="rounded-lg border border-blue-400/10 bg-black/20 p-2">
                  <div className="text-xs text-blue-300">{event.time}</div>
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm text-gray-300">{event.detail}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-blue-400/10 bg-black/20 p-2">
      <Icon className="h-4 w-4 text-blue-300" />
      <div>
        <div className="text-xs text-blue-200/70">{label}</div>
        <div className="text-sm">{value}</div>
      </div>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 rounded-xl border border-blue-400/20 bg-blue-900/20 px-3 py-2 text-sm hover:bg-blue-800/30"
    >
      <Icon className="h-4 w-4 text-blue-300" />
      <span>{label}</span>
    </button>
  );
}