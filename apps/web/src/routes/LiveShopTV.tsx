// LiveShopTV.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getSupabase } from "../lib/supabase";

/**
 * LiveShopTV
 * - Default: reads + listens to public_intake_submissions filtered by slug
 * - Special case: slug === "awnit" reads + listens to public.awnit_leads (no slug column)
 * - UI micro-upgrade:
 *   - Live presence strip
 *   - Ask the Room bar
 *   - Subtle pulse on fresh activity
 * - Layout fix:
 *   - Recent section scrolls inside the board
 *   - Footer stays visible
 * - Persistence fix:
 *   - Ask the Room now writes to Supabase instead of only local state
 */

type IntakeRow = {
  id: string;
  created_at: string;
  slug: string;
  payload: any;
  converted_service_id: string | null;
};

type AwnitLeadRow = {
  id: string;
  created_at: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  project_type: string | null;
  best_time: string | null;
  notes: string | null;
  status: string | null;
  photo_urls: string[] | null;
};

type Row = {
  id: string;
  created_at: string;
  payload: any;
};

type PresenceUser = {
  id: string;
  label: string;
  status: "active" | "idle";
};

function safeText(x: unknown, max = 90): string {
  const s = (typeof x === "string" ? x : JSON.stringify(x ?? "")).replace(/\s+/g, " ").trim();
  if (!s) return "";
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

function extractSummary(payload: any) {
  const p = payload ?? {};
  const isRoom = p.status === "room" || p.best_time === "room";

  return {
    name: safeText(p.name || p.customer_name || p.first_name || p.full_name || "", 28) || "New customer",
    vehicle: isRoom
      ? "Room"
      : safeText(
          p.vehicle ||
            p.car ||
            p.make_model ||
            p.vehicle_info ||
            p.vehicleText ||
            p.project_type ||
            p.projectType ||
            "",
          42
        ) || "Vehicle not specified",
    message: safeText(p.message || p.notes || p.problem || p.issue || "", 160) || "No message provided",
  };
}

function formatTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function ageShort(iso: string) {
  const d = new Date(iso);
  const ms = Date.now() - d.getTime();
  if (!Number.isFinite(ms) || ms < 0) return "";
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const days = Math.floor(h / 24);
  return `${days}d`;
}

function sortDescByCreatedAt(a: Row, b: Row) {
  return (b.created_at || "").localeCompare(a.created_at || "");
}

function mergeUpsert(prev: Row[], incoming: Row, limit = 30) {
  const map = new Map<string, Row>();
  for (const r of prev) map.set(r.id, r);
  map.set(incoming.id, { ...(map.get(incoming.id) ?? ({} as any)), ...incoming });
  return Array.from(map.values()).sort(sortDescByCreatedAt).slice(0, limit);
}

function mergeDelete(prev: Row[], id: string, limit = 30) {
  return prev.filter((r) => r.id !== id).slice(0, limit);
}

function normalizeAwnitLead(r: AwnitLeadRow): Row {
  const payload = {
    name: r.name ?? "",
    phone: r.phone ?? "",
    email: r.email ?? "",
    address: r.address ?? "",
    project_type: r.project_type ?? "",
    best_time: r.best_time ?? "",
    notes: r.notes ?? "",
    message: r.notes ?? "",
    status: r.status ?? "",
  };

  return {
    id: r.id,
    created_at: r.created_at,
    payload,
  };
}

function normalizeIntakeRow(r: IntakeRow): Row {
  return {
    id: r.id,
    created_at: r.created_at,
    payload: r.payload ?? {},
  };
}

function PulseDot({ active }: { active: boolean }) {
  return (
    <span
      className={[
        "ml-2 inline-block h-2.5 w-2.5 rounded-full transition-all duration-500",
        active ? "bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,.85)]" : "bg-transparent shadow-none",
      ].join(" ")}
      aria-hidden="true"
    />
  );
}

function PresenceChip({ user }: { user: PresenceUser }) {
  const isActive = user.status === "active";

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1.5 text-sm font-semibold text-slate-100">
      <span>{user.label}</span>
      <span
        className={[
          "inline-block h-2.5 w-2.5 rounded-full",
          isActive ? "bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,.85)]" : "bg-slate-500",
        ].join(" ")}
      />
    </div>
  );
}

function AskRoomBar({
  value,
  onChange,
  onSend,
  sending,
}: {
  value: string;
  onChange: (next: string) => void;
  onSend: () => void;
  sending: boolean;
}) {
  return (
    <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/30 p-4">
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Ask the room</div>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSend();
          }}
          placeholder="Anyone see the small prybar?"
          className="h-11 flex-1 rounded-xl border border-slate-700 bg-slate-950/70 px-4 text-sm text-slate-100 outline-none placeholder:text-slate-500 disabled:opacity-60"
          disabled={sending}
        />
        <button
          type="button"
          onClick={onSend}
          disabled={sending}
          className="h-11 rounded-xl border border-blue-500/30 bg-blue-500/15 px-4 text-sm font-semibold text-blue-100 hover:bg-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sending ? "Sending…" : "Send"}
        </button>
      </div>
    </div>
  );
}

export default function LiveShopTV() {
  const { slug } = useParams();
  const shopSlug = (slug ?? "").trim();

  const isAwnit = shopSlug.toLowerCase() === "awnit";

  const [rows, setRows] = useState<Row[]>([]);
  const [status, setStatus] = useState("Starting…");
  const [connected, setConnected] = useState(false);
  const [lastErr, setLastErr] = useState<string | null>(null);
  const [pulseIds, setPulseIds] = useState<Record<string, boolean>>({});
  const [askRoomValue, setAskRoomValue] = useState("");
  const [sendingRoom, setSendingRoom] = useState(false);

  const inFlightLoadRef = useRef(false);
  const lastFullSyncAtRef = useRef<number>(0);
  const pulseTimersRef = useRef<Record<string, number>>({});
  const [, bump] = useState(0);

  const supabase = getSupabase();

  const presenceUsers = useMemo<PresenceUser[]>(
    () => [
      { id: "1", label: "D&D", status: connected ? "active" : "idle" },
      { id: "2", label: "Tech2244", status: connected ? "active" : "idle" },
      { id: "3", label: "MikeA", status: rows.length > 0 ? "active" : "idle" },
      { id: "4", label: "LuisR", status: rows.length > 2 ? "active" : "idle" },
    ],
    [connected, rows.length]
  );

  function flashPulse(id: string) {
    setPulseIds((prev) => ({ ...prev, [id]: true }));

    const existing = pulseTimersRef.current[id];
    if (existing) {
      window.clearTimeout(existing);
    }

    pulseTimersRef.current[id] = window.setTimeout(() => {
      setPulseIds((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      delete pulseTimersRef.current[id];
    }, 1800);
  }

  async function handleAskRoomSend() {
    const msg = askRoomValue.trim();
    if (!msg || sendingRoom) return;

    setSendingRoom(true);
    setLastErr(null);

    try {
      if (isAwnit) {
        const { data, error } = await supabase
          .from("awnit_leads")
          .insert([
            {
              name: "Tech2244",
              project_type: "Repair",
              best_time: "room",
              notes: msg,
            },
          ])
          .select("id, created_at, name, phone, email, address, project_type, best_time, notes, status, photo_urls")
          .single();

        if (error) throw error;

        const normalized = normalizeAwnitLead(data as AwnitLeadRow);
        setRows((prev) => mergeUpsert(prev, normalized, 30));
        flashPulse(normalized.id);
      } else {
        const payload = {
          name: "Tech2244",
          project_type: "Room",
          message: msg,
          notes: msg,
          status: "room",
        };

        const { data, error } = await supabase
          .from("public_intake_submissions")
          .insert([
            {
              slug: shopSlug,
              payload,
              converted_service_id: null,
            },
          ])
          .select("id, created_at, slug, payload, converted_service_id")
          .single();

        if (error) throw error;

        const normalized = normalizeIntakeRow(data as IntakeRow);
        setRows((prev) => mergeUpsert(prev, normalized, 30));
        flashPulse(normalized.id);
      }

      setStatus("Room update");
      window.setTimeout(() => setStatus("Listening…"), 1200);
      setAskRoomValue("");
      lastFullSyncAtRef.current = Date.now();
    } catch (err: any) {
      const msgText = err?.message || String(err);
      setLastErr(msgText);
      setStatus("Room send failed");
      window.setTimeout(() => setStatus("Listening…"), 1800);
    } finally {
      setSendingRoom(false);
    }
  }

  useEffect(() => {
    const doc = document.documentElement;
    const body = document.body;

    const prevDocOverflow = doc.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevDocOverscroll = (doc.style as any).overscrollBehavior;
    const prevBodyOverscroll = (body.style as any).overscrollBehavior;

    doc.style.overflow = "hidden";
    body.style.overflow = "hidden";
    (doc.style as any).overscrollBehavior = "none";
    (body.style as any).overscrollBehavior = "none";

    const stopWheel = (e: WheelEvent) => e.preventDefault();
    const stopTouch = (e: TouchEvent) => e.preventDefault();
    const stopKeys = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();

      const isTypingField =
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        !!target?.isContentEditable;

      if (isTypingField) return;

      const k = e.key;
      if (
        k === "ArrowUp" ||
        k === "ArrowDown" ||
        k === "PageUp" ||
        k === "PageDown" ||
        k === "Home" ||
        k === "End" ||
        k === " " ||
        k === "Spacebar"
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", stopWheel, { passive: false });
    window.addEventListener("touchmove", stopTouch, { passive: false });
    window.addEventListener("keydown", stopKeys, { passive: false });

    return () => {
      window.removeEventListener("wheel", stopWheel as any);
      window.removeEventListener("touchmove", stopTouch as any);
      window.removeEventListener("keydown", stopKeys as any);

      doc.style.overflow = prevDocOverflow;
      body.style.overflow = prevBodyOverflow;
      (doc.style as any).overscrollBehavior = prevDocOverscroll ?? "";
      (body.style as any).overscrollBehavior = prevBodyOverscroll ?? "";

      for (const key of Object.keys(pulseTimersRef.current)) {
        window.clearTimeout(pulseTimersRef.current[key]);
      }
    };
  }, []);

  async function loadLatest(reason: string) {
    if (!shopSlug) {
      setStatus("Missing slug in URL");
      setConnected(false);
      return;
    }
    if (inFlightLoadRef.current) return;
    inFlightLoadRef.current = true;

    setStatus(reason);
    setLastErr(null);

    if (isAwnit) {
      const { data, error } = await supabase
        .from("awnit_leads")
        .select("id, created_at, name, phone, email, address, project_type, best_time, notes, status, photo_urls")
        .order("created_at", { ascending: false })
        .limit(30);

      inFlightLoadRef.current = false;

      if (error) {
        setLastErr(error.message || String(error));
        setStatus("Load failed");
        setConnected(false);
        return;
      }

      const normalized = (data ?? []).map((r: any) => normalizeAwnitLead(r as AwnitLeadRow));
      setRows(() => normalized.slice().sort(sortDescByCreatedAt).slice(0, 30));
      lastFullSyncAtRef.current = Date.now();
      setConnected(true);
      setStatus("Listening…");
      return;
    }

    const { data, error } = await supabase
      .from("public_intake_submissions")
      .select("id, created_at, slug, payload, converted_service_id")
      .eq("slug", shopSlug)
      .order("created_at", { ascending: false })
      .limit(30);

    inFlightLoadRef.current = false;

    if (error) {
      setLastErr(error.message || String(error));
      setStatus("Load failed");
      setConnected(false);
      return;
    }

    const normalized = (data ?? []).map((r: any) => normalizeIntakeRow(r as IntakeRow));
    setRows(() => normalized.slice().sort(sortDescByCreatedAt).slice(0, 30));
    lastFullSyncAtRef.current = Date.now();
    setConnected(true);
    setStatus("Listening…");
  }

  async function driftCheck() {
    if (!shopSlug) return;

    const localNewest = rows[0]?.created_at ?? null;

    if (isAwnit) {
      const { data, error } = await supabase
        .from("awnit_leads")
        .select("created_at")
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        setConnected(false);
        return;
      }

      const dbNewest = (data?.[0] as any)?.created_at ?? null;
      if (dbNewest && localNewest && dbNewest !== localNewest) loadLatest("Resyncing…");
      if (dbNewest && !localNewest) loadLatest("Loading…");
      return;
    }

    const { data, error } = await supabase
      .from("public_intake_submissions")
      .select("created_at")
      .eq("slug", shopSlug)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      setConnected(false);
      return;
    }

    const dbNewest = (data?.[0] as any)?.created_at ?? null;
    if (dbNewest && localNewest && dbNewest !== localNewest) loadLatest("Resyncing…");
    if (dbNewest && !localNewest) loadLatest("Loading…");
  }

  useEffect(() => {
    setRows([]);
    setConnected(false);
    setLastErr(null);
    loadLatest("Loading…");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopSlug]);

  useEffect(() => {
    if (!shopSlug) return;

    setStatus("Listening…");
    setConnected(true);
    setLastErr(null);

    const channelName = `intake-tv:${shopSlug}`;

    try {
      const chans: any[] = (supabase as any).getChannels?.() ?? [];
      for (const ch of chans) {
        if (ch?.topic === `realtime:${channelName}`) {
          try {
            supabase.removeChannel(ch);
          } catch {}
        }
      }
    } catch {}

    const tableName = isAwnit ? "awnit_leads" : "public_intake_submissions";
    const changeBase: any = { schema: "public", table: tableName };

    const insertSpec = isAwnit
      ? { event: "INSERT", ...changeBase }
      : { event: "INSERT", ...changeBase, filter: `slug=eq.${shopSlug}` };

    const updateSpec = isAwnit
      ? { event: "UPDATE", ...changeBase }
      : { event: "UPDATE", ...changeBase, filter: `slug=eq.${shopSlug}` };

    const deleteSpec = isAwnit
      ? { event: "DELETE", ...changeBase }
      : { event: "DELETE", ...changeBase, filter: `slug=eq.${shopSlug}` };

    const channel = supabase
      .channel(channelName)
      .on("postgres_changes", insertSpec, (evt) => {
        const rowAny = evt.new as any;
        const normalized = isAwnit ? normalizeAwnitLead(rowAny as AwnitLeadRow) : normalizeIntakeRow(rowAny as IntakeRow);
        setRows((prev) => mergeUpsert(prev, normalized, 30));
        flashPulse(normalized.id);
        setStatus("New arrival");
        setTimeout(() => setStatus("Listening…"), 1200);
      })
      .on("postgres_changes", updateSpec, (evt) => {
        const rowAny = evt.new as any;
        const normalized = isAwnit ? normalizeAwnitLead(rowAny as AwnitLeadRow) : normalizeIntakeRow(rowAny as IntakeRow);
        setRows((prev) => mergeUpsert(prev, normalized, 30));
        flashPulse(normalized.id);
      })
      .on("postgres_changes", deleteSpec, (evt) => {
        const oldRow = evt.old as any;
        if (oldRow?.id) {
          setRows((prev) => mergeDelete(prev, oldRow.id as string, 30));
        }
      })
      .subscribe((s) => {
        if (s === "SUBSCRIBED") loadLatest("Syncing…");
        if (s === "TIMED_OUT" || s === "CHANNEL_ERROR") {
          setConnected(false);
          setStatus("Reconnecting…");
          loadLatest("Resyncing…");
        }
      });

    const heartbeat = window.setInterval(() => {
      const age = Date.now() - lastFullSyncAtRef.current;
      if (age > 10_000) driftCheck();
    }, 20_000);

    const ticker = window.setInterval(() => bump((x) => (x + 1) % 10_000), 15_000);

    return () => {
      window.clearInterval(heartbeat);
      window.clearInterval(ticker);
      try {
        supabase.removeChannel(channel);
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopSlug]);

  const newest = rows[0] ?? null;
  const recentRows = newest ? rows.slice(1, 8) : rows.slice(0, 8);

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-950 p-6 text-slate-100">
      <div className="mx-auto h-full w-full max-w-none">
        <div
          className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/40 p-6"
          style={{
            boxShadow:
              "0 0 0 1px rgba(148,163,184,.25), 0 0 40px rgba(59,130,246,.10), 0 0 90px rgba(16,185,129,.06)",
          }}
        >
          <div className="shrink-0">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-xl font-bold">
                {connected ? status : "Reconnecting…"}{" "}
                <span className="text-xs font-semibold text-slate-400">/{shopSlug || "no-slug"}</span>
                {isAwnit ? <span className="ml-2 text-xs font-semibold text-emerald-300">(awnit_leads)</span> : null}
              </div>
              <div className="text-xs text-slate-400">
                Rows: <span className="font-semibold text-slate-200">{rows.length}</span>
              </div>
            </div>

            {lastErr ? (
              <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {lastErr}
              </div>
            ) : null}

            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/20 p-4">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Live now</div>
              <div className="flex flex-wrap gap-2">
                {presenceUsers.map((user) => (
                  <PresenceChip key={user.id} user={user} />
                ))}
              </div>

              <AskRoomBar
                value={askRoomValue}
                onChange={setAskRoomValue}
                onSend={handleAskRoomSend}
                sending={sendingRoom}
              />
            </div>
          </div>

          <div className="mt-6 flex min-h-0 flex-1 flex-col overflow-hidden">
            {!newest ? (
              <div className="text-lg text-slate-400">No arrivals yet.</div>
            ) : (
              <>
                <div className="shrink-0">
                  <div className="text-xs font-semibold text-slate-400">Newest arrival</div>

                  <div
                    className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900/30 p-6"
                    style={{ boxShadow: "0 0 0 1px rgba(148,163,184,.20), 0 0 30px rgba(59,130,246,.14)" }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 text-4xl font-extrabold">
                        {extractSummary(newest.payload).vehicle}
                        <PulseDot active={!!pulseIds[newest.id]} />
                      </div>
                      <div className="shrink-0 rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1 text-sm font-semibold text-slate-200">
                        {ageShort(newest.created_at)}
                      </div>
                    </div>

                    <div className="mt-2 text-xl text-slate-200">{extractSummary(newest.payload).message}</div>
                    <div className="mt-3 text-base text-slate-400">
                      {extractSummary(newest.payload).name} • {formatTime(newest.created_at)}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex min-h-0 flex-1 flex-col overflow-hidden">
                  <div className="shrink-0 text-xs font-semibold text-slate-400">Recent</div>

                  <div className="mt-2 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
                    {recentRows.map((r) => {
                      const s = extractSummary(r.payload);
                      return (
                        <div key={r.id} className="rounded-xl border border-slate-800 bg-slate-950/30 px-4 py-3">
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className="truncate text-base font-semibold text-slate-100">
                                {s.vehicle}
                                <PulseDot active={!!pulseIds[r.id]} />
                                <span className="font-normal text-slate-400"> — {s.name}</span>
                              </div>
                              <div className="mt-1 truncate text-sm text-slate-300">{s.message}</div>
                            </div>
                            <div className="shrink-0 text-sm text-slate-400">
                              <span className="mr-2">{ageShort(r.created_at)}</span>
                              {formatTime(r.created_at)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {recentRows.length === 0 ? <div className="mt-2 text-sm text-slate-500">No rows yet.</div> : null}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="mt-4 shrink-0 text-xs text-slate-500">
            TV view: read-only. Staff uses <span className="text-slate-300">/live/{shopSlug}/board</span>.
          </div>
        </div>
      </div>
    </div>
  );
}