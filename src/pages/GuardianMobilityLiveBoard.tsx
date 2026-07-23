import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Bell,
  Car,
  CheckCircle2,
  Clock3,
  Flame,
  Gauge,
  MapPin,
  Radio,
  Shield,
  Siren,
  Triangle,
  UserRound,
  Waves,
} from "lucide-react";

type Severity = "stable" | "watch" | "alert" | "critical";
type TimelineTone = "normal" | "shift" | "watch" | "critical" | "event";

type StatusCard = {
  label: string;
  value: string;
  tone: Severity;
};

type RiskRow = {
  label: string;
  value: string;
  note?: string;
  tone: Severity;
};

type TruthRow = {
  label: string;
  value: string;
};

type TimelineMoment = {
  time: string;
  state: string;
  speed?: string;
  steering?: string;
  brake?: string;
  note: string;
  tone: TimelineTone;
};

const toneClasses: Record<Severity, string> = {
  stable: "border-emerald-400/25 bg-emerald-500/10 text-emerald-100",
  watch: "border-amber-400/25 bg-amber-500/10 text-amber-100",
  alert: "border-orange-400/25 bg-orange-500/10 text-orange-100",
  critical: "border-red-400/25 bg-red-500/10 text-red-100",
};

const chipClasses: Record<Severity, string> = {
  stable: "bg-emerald-500/15 text-emerald-200 border border-emerald-400/25",
  watch: "bg-amber-500/15 text-amber-200 border border-amber-400/25",
  alert: "bg-orange-500/15 text-orange-200 border border-orange-400/25",
  critical: "bg-red-500/15 text-red-200 border border-red-400/25",
};

const timelineToneClasses: Record<TimelineTone, string> = {
  normal: "border-emerald-400/20 bg-emerald-500/8",
  shift: "border-yellow-400/20 bg-yellow-500/8",
  watch: "border-amber-400/20 bg-amber-500/8",
  critical: "border-red-400/20 bg-red-500/8",
  event: "border-white/15 bg-white/8",
};

const liveStatus: StatusCard[] = [
  { label: "Vehicle State", value: "Behavior shift detected", tone: "watch" },
  { label: "Mechanical Risk", value: "Front-right tire watch", tone: "watch" },
  { label: "Emergency State", value: "Vehicle fire detected", tone: "critical" },
  { label: "Shared Awareness", value: "Nearby vehicles alerted", tone: "alert" },
];

const riskForecast: RiskRow[] = [
  {
    label: "Tire Stability",
    value: "Watch",
    note: "Front-right tire shows instability trend over the next 40 miles.",
    tone: "watch",
  },
  { label: "Brake Response", value: "Normal", tone: "stable" },
  { label: "Steering Behavior", value: "Normal", tone: "stable" },
  {
    label: "Engine / Cooling",
    value: "Watch",
    note: "Cooling pressure is drifting under load.",
    tone: "watch",
  },
  { label: "Hitch / Trailer Link", value: "Secure", tone: "stable" },
  { label: "Battery / Electrical", value: "Normal", tone: "stable" },
];

const whatChanged: TruthRow[] = [
  { label: "Speed Pattern", value: "Increased faster than normal" },
  { label: "Idle Pattern", value: "Unstable at stop" },
  { label: "Steering Pattern", value: "More correction than usual" },
  { label: "Brake Pattern", value: "Slight response delay" },
  { label: "Vibration Pattern", value: "New abnormal vibration detected" },
];

const emergencyTruth: TruthRow[] = [
  { label: "Event Type", value: "Vehicle fire after impact" },
  { label: "Driver Response", value: "No response detected" },
  { label: "Vehicle State", value: "Stationary" },
  { label: "Location State", value: "Off-road near roadside brush" },
  { label: "Escalation", value: "Emergency alerts sent" },
  { label: "Timestamp", value: "Locked at 4:11:20 AM" },
];

const alertSequence = [
  "4:11:08 AM — Impact detected",
  "4:11:14 AM — No driver response",
  "4:11:18 AM — Fire classification triggered",
  "4:11:20 AM — Family alert sent",
  "4:11:24 AM — Dispatch packet sent",
  "4:11:31 AM — Nearby vehicles alerted",
];

const dispatchTruth: TruthRow[] = [
  { label: "Event Type", value: "Confirmed vehicle-origin fire" },
  { label: "Impact State", value: "High-impact event" },
  { label: "Driver State", value: "Unresponsive" },
  { label: "Location", value: "Exact coordinates shared" },
  { label: "Source Signal", value: "Vehicle-origin truth signal" },
  { label: "Timeline Record", value: "Available" },
];

const driverState: TruthRow[] = [
  { label: "Last Brake Input", value: "Detected" },
  { label: "Last Steering Input", value: "Sharp correction" },
  { label: "Voice Response", value: "None" },
  { label: "Door Movement", value: "None" },
  { label: "Movement After Impact", value: "None" },
];

const sharedAwareness: TruthRow[] = [
  { label: "Nearby Vehicle Alerts", value: "Connected" },
  { label: "Traffic Signal Sync", value: "Connected" },
  { label: "Hazard Broadcast", value: "Ready" },
  { label: "Infrastructure Response", value: "Available" },
  { label: "Incoming Risk Notices", value: "None" },
];

const mechanicalTruth: RiskRow[] = [
  { label: "Tire Condition", value: "Front-right instability trend", tone: "watch" },
  { label: "Hitch / Trailer Link", value: "No disconnect risk detected", tone: "stable" },
  { label: "Cooling System", value: "Pressure drop watch", tone: "watch" },
  { label: "Brake Heat", value: "Normal", tone: "stable" },
  { label: "Hose / Fluid Integrity", value: "Minor leak trend", tone: "watch" },
  { label: "Engine Stress", value: "Rising under load", tone: "alert" },
];

const proofLayer: TruthRow[] = [
  { label: "Presence ID", value: "Locked" },
  { label: "Event Record", value: "Timestamped" },
  { label: "Risk Changes", value: "Logged live" },
  { label: "Emergency Truth", value: "Stored" },
  { label: "Timeline Source", value: "Original event capture" },
];

const timelineMoments: TimelineMoment[] = [
  {
    time: "T–12s",
    state: "Normal driving",
    speed: "32 mph",
    steering: "Stable",
    brake: "Not engaged",
    note: "No irregular behavior detected.",
    tone: "normal",
  },
  {
    time: "T–8s",
    state: "Behavior shift detected",
    speed: "38 mph",
    steering: "Minor correction",
    brake: "Not engaged",
    note: "Acceleration increased beyond normal pattern.",
    tone: "shift",
  },
  {
    time: "T–5s",
    state: "Unusual driving pattern",
    speed: "47 mph",
    steering: "Sharper input",
    brake: "Not engaged",
    note: "Speed increase is inconsistent with road conditions.",
    tone: "watch",
  },
  {
    time: "T–2s",
    state: "Emergency response",
    speed: "58–60 mph",
    steering: "Rapid directional change",
    brake: "Heavy engagement",
    note: "Sudden corrective action detected.",
    tone: "critical",
  },
  {
    time: "T–0",
    state: "Impact detected",
    speed: "Peak reached",
    steering: "Locked input",
    brake: "Active",
    note: "Event triggered.",
    tone: "event",
  },
];

function SectionCard({
  title,
  eyebrow,
  action,
  children,
}: {
  title: string;
  eyebrow?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          {eyebrow ? <p className="mb-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-200/75">{eyebrow}</p> : null}
          <h2 className="text-lg font-semibold text-white sm:text-xl">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function TruthRows({ rows }: { rows: TruthRow[] }) {
  return (
    <div className="grid gap-3">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-slate-950/30 px-4 py-3"
        >
          <span className="text-sm text-slate-300">{row.label}</span>
          <span className="text-right text-sm font-medium text-white">{row.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function GuardianMobilityLiveBoard() {
  const [timelineIndex, setTimelineIndex] = useState(4);

  const activeMoment = useMemo(() => timelineMoments[timelineIndex], [timelineIndex]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_transparent_28%),linear-gradient(180deg,_#08111f_0%,_#08111f_45%,_#050b14_100%)] text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="rounded-[28px] border border-white/10 bg-white/6 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-100">
                <Shield className="h-4 w-4" />
                HomePlanet Guardian Mobility
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Vehicle Safety Live Board</h1>
                <p className="mt-2 max-w-3xl text-sm text-slate-300 sm:text-base">
                  Live risk, emergency truth, and last-moments clarity in one board.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "LIVE", tone: "alert" as Severity },
                { label: "TRUTH LOCKED", tone: "stable" as Severity },
                { label: "VEHICLE CONNECTED", tone: "stable" as Severity },
              ].map((chip) => (
                <span key={chip.label} className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${chipClasses[chip.tone]}`}>
                  {chip.label}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
          <SectionCard title="Vehicle" eyebrow="Identity">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Vehicle Name", "Family SUV"],
                ["Vehicle Type", "Personal vehicle"],
                ["Board ID", "guardian-mobility-001"],
                ["Driver Profile", "Primary driver connected"],
                ["Status", "Active and reporting"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/8 bg-slate-950/30 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
                  <p className="mt-2 text-sm font-medium text-white">{value}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-300">
              This vehicle is actively monitoring safety, condition, and emergency state.
            </p>
          </SectionCard>

          <SectionCard title="Live Status" eyebrow="Fast read">
            <div className="grid gap-3 sm:grid-cols-2">
              {liveStatus.map((item) => (
                <div key={item.label} className={`rounded-2xl border p-4 ${toneClasses[item.tone]}`}>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/70">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <SectionCard title="Risk Forecast" eyebrow="Predictive layer">
            <div className="grid gap-3">
              {riskForecast.map((row) => (
                <div key={row.label} className="rounded-2xl border border-white/8 bg-slate-950/30 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-slate-300">{row.label}</span>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${chipClasses[row.tone]}`}>
                      {row.value}
                    </span>
                  </div>
                  {row.note ? <p className="mt-3 text-sm text-slate-200">{row.note}</p> : null}
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="What Changed" eyebrow="Human-readable truth">
            <TruthRows rows={whatChanged} />
            <p className="mt-4 text-sm text-slate-300">
              The system tracks change over time, not just warning lights.
            </p>
          </SectionCard>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <SectionCard
            title="Emergency Truth Panel"
            eyebrow="Critical event"
            action={
              <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${chipClasses.critical}`}>
                Vehicle Fire Detected
              </span>
            }
          >
            <div className="mb-4 rounded-[24px] border border-red-400/20 bg-red-500/10 p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-red-500/15 p-3 text-red-200">
                  <Siren className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-100/80">Emergency Truth Panel</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">Vehicle Fire Detected</h3>
                  <p className="mt-2 max-w-2xl text-sm text-red-50/85">
                    This record was captured as it happened. Not reconstructed.
                  </p>
                </div>
              </div>
            </div>
            <TruthRows rows={emergencyTruth} />
          </SectionCard>

          <SectionCard title="Alert Sequence" eyebrow="Escalation chain">
            <div className="space-y-3">
              {alertSequence.map((item, index) => (
                <div key={item} className="flex gap-3 rounded-2xl border border-white/8 bg-slate-950/30 p-4">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/8 text-xs font-semibold text-white">
                    {index + 1}
                  </div>
                  <p className="text-sm text-slate-100">{item}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-300">Emergency truth moves faster than guesswork.</p>
          </SectionCard>
        </section>

        <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
          <SectionCard title="Message Sent" eyebrow="Family / guardian alert">
            <div className="rounded-[24px] border border-white/10 bg-slate-950/35 p-5">
              <p className="text-sm leading-7 text-slate-100">
                <span className="font-semibold text-white">URGENT:</span> Vehicle emergency detected.
                <br />
                High-impact event followed by fire detection.
                <br />
                No response detected.
                <br />
                Location locked now.
                <br />
                Emergency response has been escalated.
              </p>
            </div>
            <p className="mt-4 text-sm text-slate-300">Sent to approved emergency contacts.</p>
          </SectionCard>

          <SectionCard title="Dispatch Truth Packet" eyebrow="Operational clarity">
            <TruthRows rows={dispatchTruth} />
            <p className="mt-4 text-sm text-slate-300">
              Reduces mislabeling, delay, and uncertainty at first response.
            </p>
          </SectionCard>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <SectionCard
            title="Last Moments Timeline"
            eyebrow="Final 12 seconds"
            action={
              <div className="flex flex-wrap gap-2">
                {timelineMoments.map((moment, index) => (
                  <button
                    key={moment.time}
                    type="button"
                    onClick={() => setTimelineIndex(index)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] transition ${
                      timelineIndex === index
                        ? "border border-sky-300/30 bg-sky-500/15 text-sky-100"
                        : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    {moment.time}
                  </button>
                ))}
              </div>
            }
          >
            <div className="grid gap-3">
              {timelineMoments.map((moment, index) => (
                <button
                  key={moment.time}
                  type="button"
                  onClick={() => setTimelineIndex(index)}
                  className={`rounded-[24px] border p-4 text-left transition hover:border-sky-300/30 hover:bg-sky-500/8 ${timelineToneClasses[moment.tone]} ${
                    timelineIndex === index ? "ring-1 ring-sky-300/30" : ""
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">{moment.time}</p>
                      <h3 className="mt-2 text-base font-semibold text-white">{moment.state}</h3>
                    </div>
                    <div className="grid gap-2 text-sm text-slate-200 sm:text-right">
                      {moment.speed ? <span>Speed → {moment.speed}</span> : null}
                      {moment.steering ? <span>Steering → {moment.steering}</span> : null}
                      {moment.brake ? <span>Brake → {moment.brake}</span> : null}
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-slate-300">{moment.note}</p>
                </button>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-white/8 bg-slate-950/35 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Active moment</p>
              <p className="mt-2 text-base font-semibold text-white">
                {activeMoment.time} — {activeMoment.state}
              </p>
              <p className="mt-2 text-sm text-slate-300">{activeMoment.note}</p>
            </div>
          </SectionCard>

          <div className="grid gap-4">
            <SectionCard title="Driver State" eyebrow="Direct response">
              <TruthRows rows={driverState} />
              <p className="mt-4 text-sm text-slate-300">When the driver can’t respond, the system speaks.</p>
            </SectionCard>

            <SectionCard title="Shared Awareness" eyebrow="Connected world">
              <TruthRows rows={sharedAwareness} />
              <div className="mt-4 rounded-2xl border border-white/8 bg-slate-950/35 p-4 text-sm text-slate-200">
                Nearby instability event detected 0.4 miles ahead. Spacing adjustment recommended.
              </div>
            </SectionCard>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
          <SectionCard title="Mechanical Truth" eyebrow="Failure before breakdown">
            <div className="grid gap-3">
              {mechanicalTruth.map((row) => (
                <div key={row.label} className="rounded-2xl border border-white/8 bg-slate-950/30 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-slate-300">{row.label}</span>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${chipClasses[row.tone]}`}>
                      {row.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-300">
              The system flags failure patterns before breakdown becomes danger.
            </p>
          </SectionCard>

          <SectionCard title="Proof Layer" eyebrow="HomePlanet truth">
            <TruthRows rows={proofLayer} />
            <p className="mt-4 text-sm text-slate-300">
              Nothing on this board exists without a time-anchored origin.
            </p>
          </SectionCard>
        </section>

        <section className="rounded-[28px] border border-white/10 bg-white/6 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Action rail</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Board actions</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "View Full Timeline", icon: Clock3 },
                { label: "Open Emergency Truth", icon: Flame },
                { label: "Send Test Alert", icon: Bell },
                { label: "Review Risk History", icon: Gauge },
                { label: "Connected Contacts", icon: UserRound },
                { label: "Truth Records", icon: Shield },
              ].map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  type="button"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
