import { useMemo, useRef, useState, type ChangeEvent } from "react";
import {
  Camera,
  CheckCircle2,
  Clock3,
  Droplets,
  Dumbbell,
  HeartPulse,
  Pill,
  Plus,
  Scissors,
  ShieldCheck,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";

type CareEventType =
  | "fed"
  | "water"
  | "walk"
  | "potty"
  | "medication"
  | "grooming"
  | "vet"
  | "note";

type CareEvent = {
  id: string;
  type: CareEventType;
  label: string;
  note: string;
  timestamp: string;
  photoName?: string;
  photoDataUrl?: string;
};

const QUICK_ACTIONS: Array<{
  type: CareEventType;
  label: string;
  hint: string;
  icon: typeof UtensilsCrossed;
}> = [
  { type: "fed", label: "Fed", hint: "Meal recorded", icon: UtensilsCrossed },
  { type: "water", label: "Water", hint: "Refilled / checked", icon: Droplets },
  { type: "walk", label: "Walked", hint: "Exercise recorded", icon: Dumbbell },
  { type: "potty", label: "Potty", hint: "Bathroom break logged", icon: CheckCircle2 },
  { type: "medication", label: "Medication", hint: "Dose confirmed", icon: Pill },
  { type: "grooming", label: "Groomed", hint: "Brush / bath / trim", icon: Scissors },
  { type: "vet", label: "Vet Visit", hint: "Appointment / checkup", icon: HeartPulse },
  { type: "note", label: "Quick Note", hint: "General observation", icon: ShieldCheck },
];

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function makeId() {
  try {
    const c = (globalThis as any)?.crypto;
    if (c?.randomUUID) return c.randomUUID();
  } catch {}
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function formatNow(date = new Date()) {
  return date.toLocaleString([], {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatShortTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function formatShortDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString([], { month: "numeric", day: "numeric" });
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

async function fileToJpegDataUrl(file: File, maxW = 1400, maxH = 1400, quality = 0.84) {
  if (!/^image\//i.test(file.type)) {
    throw new Error("Please choose an image file.");
  }

  const url = URL.createObjectURL(file);

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error("Failed to load image."));
      i.src = url;
    });

    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;

    const wr = maxW / Math.max(1, w);
    const hr = maxH / Math.max(1, h);
    const ratio = Math.min(1, wr, hr);

    const nw = Math.max(1, Math.round(w * ratio));
    const nh = Math.max(1, Math.round(h * ratio));

    const canvas = document.createElement("canvas");
    canvas.width = nw;
    canvas.height = nh;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not available.");

    ctx.drawImage(img, 0, 0, nw, nh);
    return canvas.toDataURL("image/jpeg", quality);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function approxBytesFromDataUrl(dataUrl: string) {
  const idx = dataUrl.indexOf(",");
  if (idx < 0) return dataUrl.length;
  const b64 = dataUrl.slice(idx + 1);
  const pad = b64.endsWith("==") ? 2 : b64.endsWith("=") ? 1 : 0;
  return Math.max(0, Math.floor((b64.length * 3) / 4) - pad);
}

function typeTone(type: CareEventType) {
  switch (type) {
    case "fed":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-200";
    case "water":
      return "border-cyan-500/30 bg-cyan-500/10 text-cyan-200";
    case "walk":
      return "border-blue-500/30 bg-blue-500/10 text-blue-200";
    case "potty":
      return "border-lime-500/30 bg-lime-500/10 text-lime-200";
    case "medication":
      return "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-200";
    case "grooming":
      return "border-amber-500/30 bg-amber-500/10 text-amber-200";
    case "vet":
      return "border-red-500/30 bg-red-500/10 text-red-200";
    default:
      return "border-slate-500/30 bg-slate-500/10 text-slate-200";
  }
}

function hoursSinceLast(events: CareEvent[], type: CareEventType) {
  const found = events.find((e) => e.type === type);
  if (!found) return null;
  const then = new Date(found.timestamp).getTime();
  if (Number.isNaN(then)) return null;
  const diffHours = (Date.now() - then) / (1000 * 60 * 60);
  return diffHours;
}

export default function PetCareTimelinePanel() {
  const [events, setEvents] = useState<CareEvent[]>([]);
  const [selectedType, setSelectedType] = useState<CareEventType>("fed");
  const [noteDraft, setNoteDraft] = useState("");
  const [photoName, setPhotoName] = useState<string>("");
  const [photoDataUrl, setPhotoDataUrl] = useState<string>("");
  const [photoError, setPhotoError] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const selectedAction = useMemo(() => {
    return QUICK_ACTIONS.find((a) => a.type === selectedType) || QUICK_ACTIONS[0];
  }, [selectedType]);

  const todayEvents = useMemo(() => {
    const start = startOfToday();
    return events.filter((e) => {
      const t = new Date(e.timestamp).getTime();
      return !Number.isNaN(t) && t >= start;
    });
  }, [events]);

  const summary = useMemo(() => {
    return {
      fed: todayEvents.filter((e) => e.type === "fed").length,
      water: todayEvents.filter((e) => e.type === "water").length,
      walk: todayEvents.filter((e) => e.type === "walk").length,
      potty: todayEvents.filter((e) => e.type === "potty").length,
      medication: todayEvents.filter((e) => e.type === "medication").length,
    };
  }, [todayEvents]);

  const attentionFlags = useMemo(() => {
    const flags: string[] = [];

    const lastWater = hoursSinceLast(events, "water");
    const lastFed = hoursSinceLast(events, "fed");
    const lastWalk = hoursSinceLast(events, "walk");

    if (lastFed === null) flags.push("No feeding logged yet.");
    if (lastWater === null) flags.push("No water refill/check logged yet.");
    if (lastWalk === null) flags.push("No walk logged yet.");

    if (lastWater !== null && lastWater >= 8) {
      flags.push("Water has not been logged in 8+ hours.");
    }
    if (lastFed !== null && lastFed >= 10) {
      flags.push("Feeding has not been logged in 10+ hours.");
    }
    if (lastWalk !== null && lastWalk >= 12) {
      flags.push("No walk logged in 12+ hours.");
    }

    return flags;
  }, [events]);

  async function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const next = event.target.files?.[0] ?? null;
    if (!next) return;

    setPhotoError("");

    try {
      const dataUrl = await fileToJpegDataUrl(next, 1400, 1400, 0.84);
      const bytes = approxBytesFromDataUrl(dataUrl);
      if (bytes > 900_000) {
        throw new Error("Photo too large. Try a smaller image.");
      }

      setPhotoName(next.name);
      setPhotoDataUrl(dataUrl);
    } catch (err) {
      setPhotoName("");
      setPhotoDataUrl("");
      setPhotoError(err instanceof Error ? err.message : "Failed to attach photo.");
    } finally {
      event.target.value = "";
    }
  }

  function addEvent() {
    const label = selectedAction.label;
    const cleanNote = noteDraft.trim();

    const next: CareEvent = {
      id: makeId(),
      type: selectedType,
      label,
      note: cleanNote,
      timestamp: new Date().toISOString(),
      photoName: photoName || undefined,
      photoDataUrl: photoDataUrl || undefined,
    };

    setEvents((prev) => [next, ...prev]);
    setNoteDraft("");
    setPhotoName("");
    setPhotoDataUrl("");
    setPhotoError("");
  }

  function quickAdd(type: CareEventType) {
    const action = QUICK_ACTIONS.find((a) => a.type === type);
    if (!action) return;

    const next: CareEvent = {
      id: makeId(),
      type,
      label: action.label,
      note: "",
      timestamp: new Date().toISOString(),
    };

    setEvents((prev) => [next, ...prev]);
  }

  function removeEvent(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <section className="rounded-[28px] border border-[#2d415a] bg-[#0d1826] p-4 text-white shadow-[0_18px_50px_rgba(0,0,0,0.32)] sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#3b546f] bg-[#102033] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#dbe7f6]">
            Pet Care Timeline
          </div>
          <h2 className="mt-4 text-[26px] font-semibold text-white sm:text-[30px]">
            Presence-first pet care log
          </h2>
          <p className="mt-2 max-w-3xl text-[15px] leading-6 text-[#c6d3e3]">
            Tap what happened. Time-stamp it. Add proof if needed. Build a trustworthy daily
            timeline without hardware first.
          </p>
        </div>

        <div className="rounded-full border border-[#4d6886] bg-[#11263d] px-4 py-2 text-sm font-semibold text-[#dbe7f6]">
          Timeline-ready
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.type}
              type="button"
              onClick={() => quickAdd(action.type)}
              className="flex min-h-[94px] flex-col items-start justify-center rounded-[22px] border border-[#43586f] bg-[#122132] px-4 py-4 text-left transition hover:border-[#63a8ff] hover:bg-[#12283d]"
            >
              <Icon className="h-6 w-6 text-[#9fd4ff]" />
              <div className="mt-3 text-[18px] font-semibold text-white">{action.label}</div>
              <div className="mt-1 text-[13px] text-[#c5d2e2]">{action.hint}</div>
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="rounded-[24px] border border-[#324559] bg-[#0f1d2d] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[14px] font-semibold uppercase tracking-[0.16em] text-[#8fa6c0]">
                Add detailed event
              </div>
              <div className="mt-1 text-[18px] font-semibold text-white">
                {selectedAction.label}
              </div>
            </div>

            <div className="rounded-full border border-[#405770] bg-[#11253a] px-3 py-1 text-[12px] font-semibold text-[#dbe7f6]">
              <Clock3 className="mr-2 inline h-4 w-4" />
              Stamped instantly
            </div>
          </div>

          <div className="mt-4 grid gap-4">
            <div>
              <div className="mb-2 text-[14px] font-semibold text-white">Event type</div>
              <div className="flex flex-wrap gap-2">
                {QUICK_ACTIONS.map((action) => {
                  const active = selectedType === action.type;
                  return (
                    <button
                      key={action.type}
                      type="button"
                      onClick={() => setSelectedType(action.type)}
                      className={cx(
                        "rounded-full border px-3 py-2 text-[13px] font-semibold transition",
                        active
                          ? "border-[#63a8ff] bg-[#122e4a] text-white"
                          : "border-[#43586f] bg-[#122132] text-[#c5d2e2]",
                      )}
                    >
                      {action.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="mb-2 text-[14px] font-semibold text-white">Note</div>
              <textarea
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                placeholder="Optional note... ate half bowl, long walk, soft stool, medication dose, seemed tired, etc."
                className="min-h-[120px] w-full rounded-[18px] border border-[#4a6178] bg-[#122132] p-4 text-[15px] text-white outline-none placeholder:text-[#8ea3ba]"
              />
            </div>

            <div className="rounded-[20px] border border-dashed border-[#4a647e] bg-[#101d2c] p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[17px] font-semibold text-white">
                    <Camera className="h-5 w-5" />
                    Add proof photo
                  </div>
                  <p className="mt-1 text-[14px] text-[#c6d3e3]">
                    Optional. Bowl, leash, meds, note from vet, accident area, or anything worth
                    documenting.
                  </p>
                  {photoName ? (
                    <div className="mt-2 text-[14px] font-medium text-[#9fe8c1]">
                      Attached: {photoName}
                    </div>
                  ) : null}
                  {photoError ? (
                    <div className="mt-2 text-[14px] font-medium text-[#ffd1d1]">{photoError}</div>
                  ) : null}
                </div>

                <label className="inline-flex min-h-[52px] cursor-pointer items-center justify-center gap-2 rounded-full border border-[#7f95ad] bg-[#13263a] px-5 py-3 text-[15px] font-semibold text-white">
                  <Camera className="h-5 w-5" />
                  {photoName ? "Replace photo" : "Upload"}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </label>
              </div>
            </div>

            <button
              type="button"
              onClick={addEvent}
              className="min-h-[58px] w-full rounded-[18px] bg-gradient-to-r from-[#12a9ff] to-[#10e66a] px-5 text-[18px] font-semibold text-[#082033] shadow-[0_14px_28px_rgba(0,0,0,0.22)]"
            >
              <Plus className="mr-2 inline h-5 w-5" />
              Add to Timeline
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[24px] border border-[#324559] bg-[#0f1d2d] p-4">
            <div className="text-[14px] font-semibold uppercase tracking-[0.16em] text-[#8fa6c0]">
              Today at a glance
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <MiniStat label="Fed" value={summary.fed} />
              <MiniStat label="Water" value={summary.water} />
              <MiniStat label="Walks" value={summary.walk} />
              <MiniStat label="Potty" value={summary.potty} />
              <MiniStat label="Meds" value={summary.medication} />
              <MiniStat label="Events" value={todayEvents.length} />
            </div>
          </div>

          <div className="rounded-[24px] border border-[#324559] bg-[#0f1d2d] p-4">
            <div className="text-[14px] font-semibold uppercase tracking-[0.16em] text-[#8fa6c0]">
              Needs attention
            </div>

            <div className="mt-3 space-y-2">
              {attentionFlags.length ? (
                attentionFlags.map((flag, idx) => (
                  <div
                    key={`${flag}-${idx}`}
                    className="rounded-[16px] border border-[#7a5e1f] bg-[#2b220d] px-3 py-3 text-[14px] text-[#ffe8b3]"
                  >
                    {flag}
                  </div>
                ))
              ) : (
                <div className="rounded-[16px] border border-[#355844] bg-[#13291e] px-3 py-3 text-[14px] text-[#d8efe2]">
                  Everything looks covered right now.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-[24px] border border-[#324559] bg-[#0f1d2d] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[14px] font-semibold uppercase tracking-[0.16em] text-[#8fa6c0]">
              Timeline
            </div>
            <div className="mt-1 text-[20px] font-semibold text-white">Recent care events</div>
          </div>

          <div className="rounded-full border border-[#3b546f] bg-[#102033] px-3 py-1 text-[12px] font-semibold text-[#dbe7f6]">
            {events.length} total
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {events.length ? (
            events.map((event) => (
              <div
                key={event.id}
                className="rounded-[20px] border border-[#43586f] bg-[#122132] p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <div
                        className={cx(
                          "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]",
                          typeTone(event.type),
                        )}
                      >
                        {event.label}
                      </div>
                      <div className="text-[13px] text-[#9eb3ca]">
                        {formatShortDate(event.timestamp)} • {formatShortTime(event.timestamp)}
                      </div>
                    </div>

                    {event.note ? (
                      <div className="mt-3 text-[15px] leading-6 text-[#e4edf8]">{event.note}</div>
                    ) : (
                      <div className="mt-3 text-[14px] text-[#8ea3ba]">No extra note added.</div>
                    )}

                    {event.photoDataUrl ? (
                      <div className="mt-3 flex items-start gap-3">
                        <img
                          src={event.photoDataUrl}
                          alt={event.photoName || event.label}
                          className="h-24 w-24 rounded-[14px] border border-[#3d5368] object-cover"
                        />
                        <div className="min-w-0">
                          <div className="text-[13px] font-semibold text-[#9fe8c1]">Proof photo</div>
                          <div className="mt-1 truncate text-[13px] text-[#c6d3e3]">
                            {event.photoName || "Attached image"}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeEvent(event.id)}
                    className="inline-flex items-center gap-2 rounded-full border border-[#5b3f46] bg-[#21161a] px-3 py-2 text-[13px] font-semibold text-[#ffd1d1]"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[20px] border border-dashed border-[#4a647e] bg-[#101d2c] p-6 text-[15px] text-[#9eb3ca]">
              No care events yet. Tap a quick action or add a detailed event to begin the timeline.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[18px] border border-[#3d5368] bg-[#122132] p-4">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#8ea5c0]">
        {label}
      </div>
      <div className="mt-2 text-[28px] font-semibold text-white">{value}</div>
    </div>
  );
}