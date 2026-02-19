import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams } from "react-router-dom";

type Row = {
  id: string;
  created_at: string;
  slug: string;
  payload: any;
  converted_service_id: string | null;
};

type TicketKind = "quick" | "long";
type TicketStatus = "new" | "started" | "done";

type LogEntry = { at: string; text: string };
type PartProof = { id: string; name: string; oldUrl?: string; newUrl?: string; at: string };

function safeText(x: unknown, max = 90): string {
  const s = (typeof x === "string" ? x : JSON.stringify(x ?? "")).replace(/\s+/g, " ").trim();
  if (!s) return "";
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

function extractSummary(payload: any) {
  const p = payload ?? {};
  return {
    name: safeText(p.name || p.customer_name || p.first_name || p.full_name || "", 28) || "New customer",
    vehicle:
      safeText(p.vehicle || p.car || p.make_model || p.vehicle_info || p.vehicleText || "", 42) ||
      "Vehicle not specified",
    message: safeText(p.message || p.notes || p.problem || p.issue || "", 160) || "No message provided",
    phone: safeText(p.phone || p.phone_number || "", 28),
    email: safeText(p.email || "", 48),
    location: safeText(p.location || p.address || p.city || "", 48),
  };
}

function formatTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString([], { year: "numeric", month: "2-digit", day: "2-digit", hour: "numeric", minute: "2-digit" });
}

function msToAge(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  const mm = m % 60;
  const hh = h % 24;

  if (d > 0) return `${d}d ${hh}h`;
  if (h > 0) return `${h}h ${mm}m`;
  return `${m}m`;
}

// --- deterministic merge helpers (ops-safe) ---
function sortDescByCreatedAt(a: Row, b: Row) {
  return (b.created_at || "").localeCompare(a.created_at || "");
}

function mergeUpsert(prev: Row[], incoming: Row, limit = 25) {
  const map = new Map<string, Row>();
  for (const r of prev) map.set(r.id, r);
  map.set(incoming.id, { ...(map.get(incoming.id) ?? ({} as any)), ...incoming });
  return Array.from(map.values()).sort(sortDescByCreatedAt).slice(0, limit);
}

function mergeDelete(prev: Row[], id: string, limit = 25) {
  return prev.filter((r) => r.id !== id).slice(0, limit);
}

// --- local persistence (no schema changes) ---
function lsKey(prefix: string, id: string) {
  return `hp_${prefix}_${id}`;
}
function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
function writeJSON(key: string, value: any) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function pillClass(active: boolean) {
  return active
    ? "px-2 py-1 rounded-full border border-emerald-400/40 bg-emerald-500/10 text-emerald-200 text-xs font-semibold"
    : "px-2 py-1 rounded-full border border-slate-700 bg-slate-950/30 text-slate-300 text-xs font-semibold hover:border-slate-500";
}

function subtleButton() {
  return "px-3 py-2 rounded-xl border border-slate-800 bg-slate-950/30 hover:bg-slate-900/30 text-slate-100 text-sm font-semibold";
}

function dangerButton() {
  return "px-3 py-2 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/15 text-red-100 text-sm font-semibold";
}

function primaryButton() {
  return "px-3 py-2 rounded-xl border border-emerald-400/30 bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-100 text-sm font-semibold";
}

function inputClass() {
  return "w-full rounded-xl border border-slate-800 bg-slate-950/30 px-3 py-2 text-slate-100 placeholder:text-slate-500 outline-none focus:border-slate-600";
}

function sectionTitle() {
  return "text-xs text-slate-400 font-semibold tracking-wide";
}

// --- PRINT RECEIPT ---
function openPrintWindow(opts: {
  shopSlug: string;
  row: Row;
  kind: TicketKind;
  status: TicketStatus;
  paid: boolean;
  logs: LogEntry[];
  parts: PartProof[];
}) {
  const { shopSlug, row, kind, status, paid, logs, parts } = opts;
  const s = extractSummary(row.payload);

  const esc = (x: string) =>
    (x ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const html = `
<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Receipt — ${esc(shopSlug)}</title>
<style>
  body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; margin: 24px; color: #0f172a; }
  .card { border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px; margin-bottom: 14px; }
  .h1 { font-size: 20px; font-weight: 800; margin: 0 0 6px; }
  .muted { color: #475569; font-size: 12px; }
  .row { display: flex; gap: 10px; flex-wrap: wrap; }
  .pill { border: 1px solid #cbd5e1; border-radius: 999px; padding: 4px 10px; font-size: 12px; color: #334155; }
  .k { color: #334155; font-size: 12px; font-weight: 700; margin-top: 10px; }
  ul { margin: 8px 0 0 18px; }
  li { margin: 6px 0; }
  .parts { display: grid; grid-template-columns: 1fr; gap: 10px; }
  .part { border: 1px dashed #cbd5e1; border-radius: 12px; padding: 10px; }
  .imgrow { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 8px; }
  img { max-width: 320px; border-radius: 10px; border: 1px solid #e2e8f0; }
  @media print {
    body { margin: 0; }
    .card { border: 1px solid #cbd5e1; }
  }
</style>
</head>
<body>
  <div class="card">
    <div class="h1">HomePlanet — Ticket Receipt</div>
    <div class="muted">Shop: ${esc(shopSlug)} • Ticket ID: ${esc(row.id)} • Intake: ${esc(formatDateTime(row.created_at))}</div>
    <div class="row" style="margin-top:10px">
      <div class="pill">Type: ${esc(kind.toUpperCase())}</div>
      <div class="pill">Status: ${esc(status.toUpperCase())}</div>
      <div class="pill">Paid: ${paid ? "YES" : "NO"}</div>
    </div>
  </div>

  <div class="card">
    <div class="k">Customer / Vehicle</div>
    <div style="margin-top:6px"><b>${esc(s.vehicle)}</b></div>
    <div class="muted" style="margin-top:2px">${esc(s.name)}${s.phone ? " • " + esc(s.phone) : ""}${s.email ? " • " + esc(s.email) : ""}</div>
    <div style="margin-top:10px">${esc(s.message)}</div>
  </div>

  <div class="card">
    <div class="k">Work Notes</div>
    ${
      logs.length
        ? `<ul>${logs
            .map((l) => `<li><span class="muted">${esc(formatDateTime(l.at))}</span> — ${esc(l.text)}</li>`)
            .join("")}</ul>`
        : `<div class="muted" style="margin-top:6px">No notes.</div>`
    }
  </div>

  <div class="card">
    <div class="k">Parts Proof</div>
    ${
      parts.length
        ? `<div class="parts">${parts
            .map((p) => {
              const oldImg = p.oldUrl ? `<img src="${esc(p.oldUrl)}" alt="Old part" />` : "";
              const newImg = p.newUrl ? `<img src="${esc(p.newUrl)}" alt="New part" />` : "";
              return `
                <div class="part">
                  <div><b>${esc(p.name || "Part")}</b> <span class="muted">• ${esc(formatDateTime(p.at))}</span></div>
                  <div class="imgrow">${oldImg}${newImg}</div>
                </div>
              `;
            })
            .join("")}</div>`
        : `<div class="muted" style="margin-top:6px">No parts recorded.</div>`
    }
  </div>

  <script>
    window.onload = () => { setTimeout(() => window.print(), 250); };
  </script>
</body>
</html>
`;

  const w = window.open("", "_blank", "noopener,noreferrer,width=900,height=900");
  if (!w) return;
  w.document.open();
  w.document.write(html);
  w.document.close();
}

export default function LiveIntakeBoard() {
  const { slug } = useParams();
  const shopSlug = (slug ?? "").trim();

  const [rows, setRows] = useState<Row[]>([]);
  const [status, setStatus] = useState("Starting…");
  const [connected, setConnected] = useState(false);
  const [lastErr, setLastErr] = useState<string | null>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const lastBeepRef = useRef<number>(0);
  const inFlightLoadRef = useRef(false);
  const lastFullSyncAtRef = useRef<number>(0);

  const [nowTick, setNowTick] = useState<number>(Date.now());

  const supabase = useMemo(() => {
    const url = (import.meta as any).env?.VITE_SUPABASE_URL;
    const key = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;
    if (!url || !key) return null;

    return createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      realtime: { params: { eventsPerSecond: 10 } },
    });
  }, []);

  // keep the “age” counters alive
  useEffect(() => {
    const t = window.setInterval(() => setNowTick(Date.now()), 30_000);
    return () => window.clearInterval(t);
  }, []);

  function softBeep() {
    const now = Date.now();
    if (now - lastBeepRef.current < 2500) return;
    lastBeepRef.current = now;
    try {
      const ctx = new ((window as any).AudioContext || (window as any).webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = 880;
      g.gain.value = 0.02;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      setTimeout(() => {
        o.stop();
        ctx.close();
      }, 120);
    } catch {}
  }

  async function loadLatest(reason: string) {
    if (!supabase) {
      setStatus("Waiting for env…");
      setConnected(false);
      return;
    }
    if (!shopSlug) {
      setStatus("Missing slug in URL");
      setConnected(false);
      return;
    }

    if (inFlightLoadRef.current) return;
    inFlightLoadRef.current = true;

    setStatus(reason);
    setLastErr(null);

    const { data, error } = await supabase
      .from("public_intake_submissions")
      .select("id, created_at, slug, payload, converted_service_id")
      .eq("slug", shopSlug)
      .order("created_at", { ascending: false })
      .limit(25);

    inFlightLoadRef.current = false;

    if (error) {
      setLastErr(error.message || String(error));
      setStatus("Load failed");
      setConnected(false);
      return;
    }

    setRows((prev) => {
      const merged = new Map<string, Row>();
      for (const r of prev) merged.set(r.id, r);
      for (const r of data ?? []) merged.set(r.id, r);
      return Array.from(merged.values()).sort(sortDescByCreatedAt).slice(0, 25);
    });

    lastFullSyncAtRef.current = Date.now();
    setConnected(true);
    setStatus("Listening…");
  }

  async function driftCheck() {
    if (!supabase || !shopSlug) return;

    const localNewest = rows[0]?.created_at ?? null;

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
    if (dbNewest && localNewest && dbNewest !== localNewest) {
      loadLatest("Resyncing…");
    }
    if (dbNewest && !localNewest) {
      loadLatest("Loading…");
    }
  }

  useEffect(() => {
    setRows([]);
    setConnected(false);
    setLastErr(null);
    setSelectedId(null);
    loadLatest("Loading…");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopSlug]);

  useEffect(() => {
    if (!supabase || !shopSlug) return;

    setStatus("Listening…");
    setConnected(true);
    setLastErr(null);

    const channel = supabase
      .channel(`intake:${shopSlug}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "public_intake_submissions",
          filter: `slug=eq.${shopSlug}`,
        },
        (evt) => {
          const row = evt.new as Row;
          setRows((prev) => mergeUpsert(prev, row, 25));
          setStatus("New arrival");
          softBeep();
          setTimeout(() => setStatus("Listening…"), 1200);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "public_intake_submissions",
          filter: `slug=eq.${shopSlug}`,
        },
        (evt) => {
          const row = evt.new as Row;
          setRows((prev) => mergeUpsert(prev, row, 25));
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "public_intake_submissions",
          filter: `slug=eq.${shopSlug}`,
        },
        (evt) => {
          const oldRow = evt.old as Partial<Row>;
          if (oldRow?.id) setRows((prev) => mergeDelete(prev, oldRow.id as string, 25));
        }
      )
      .subscribe((s) => {
        if (s === "SUBSCRIBED") {
          setConnected(true);
          setLastErr(null);
          loadLatest("Syncing…");
        }
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

    return () => {
      window.clearInterval(heartbeat);
      try {
        supabase.removeChannel(channel);
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopSlug, supabase, rows.length]);

  const newest = rows[0];
  const selectedRow = selectedId ? rows.find((r) => r.id === selectedId) ?? null : null;

  // drawer state (persisted per ticket)
  const kind: TicketKind = selectedId ? readJSON(lsKey("kind", selectedId), "quick") : "quick";
  const tstatus: TicketStatus = selectedId ? readJSON(lsKey("status", selectedId), "new") : "new";
  const paid: boolean = selectedId ? readJSON(lsKey("paid", selectedId), false) : false;
  const logs: LogEntry[] = selectedId ? readJSON(lsKey("logs", selectedId), []) : [];
  const parts: PartProof[] = selectedId ? readJSON(lsKey("parts", selectedId), []) : [];

  const [noteText, setNoteText] = useState("");
  const [partName, setPartName] = useState("");
  const [partOldUrl, setPartOldUrl] = useState("");
  const [partNewUrl, setPartNewUrl] = useState("");

  // keep inputs sane when switching tickets
  useEffect(() => {
    setNoteText("");
    setPartName("");
    setPartOldUrl("");
    setPartNewUrl("");
  }, [selectedId]);

  function setTicketKind(id: string, v: TicketKind) {
    writeJSON(lsKey("kind", id), v);
    setNowTick(Date.now());
  }
  function setTicketStatus(id: string, v: TicketStatus) {
    writeJSON(lsKey("status", id), v);
    setNowTick(Date.now());
  }
  function setTicketPaid(id: string, v: boolean) {
    writeJSON(lsKey("paid", id), v);
    setNowTick(Date.now());
  }

  function addLog(id: string) {
    const txt = safeText(noteText, 220);
    if (!txt) return;
    const next = [{ at: new Date().toISOString(), text: txt }, ...readJSON<LogEntry[]>(lsKey("logs", id), [])].slice(0, 200);
    writeJSON(lsKey("logs", id), next);
    setNoteText("");
    setNowTick(Date.now());
  }

  function clearLogs(id: string) {
    writeJSON(lsKey("logs", id), []);
    setNowTick(Date.now());
  }

  function addPart(id: string) {
    const name = safeText(partName, 64) || "Part";
    const oldUrl = safeText(partOldUrl, 400);
    const newUrl = safeText(partNewUrl, 400);
    const nextItem: PartProof = { id: crypto.randomUUID(), name, oldUrl: oldUrl || undefined, newUrl: newUrl || undefined, at: new Date().toISOString() };
    const next = [nextItem, ...readJSON<PartProof[]>(lsKey("parts", id), [])].slice(0, 200);
    writeJSON(lsKey("parts", id), next);
    setPartName("");
    setPartOldUrl("");
    setPartNewUrl("");
    setNowTick(Date.now());
  }

  function removePart(id: string, partId: string) {
    const next = readJSON<PartProof[]>(lsKey("parts", id), []).filter((p) => p.id !== partId);
    writeJSON(lsKey("parts", id), next);
    setNowTick(Date.now());
  }

  const cardGlow =
    "shadow-[0_0_0_1px_rgba(148,163,184,0.08),0_0_38px_rgba(59,130,246,0.12),0_0_70px_rgba(16,185,129,0.08)]";

  const itemGlow =
    "shadow-[0_0_0_1px_rgba(148,163,184,0.10),0_0_18px_rgba(59,130,246,0.10)]";

  function ageFor(iso: string) {
    const t = new Date(iso).getTime();
    if (Number.isNaN(t)) return "";
    return msToAge(nowTick - t);
  }

  return (
    // Full-screen TV-friendly, and hard-disable page scrolling
    <div className="h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 p-4 md:p-6">
      <div className="w-full h-full max-w-none mx-auto">
        <div className={`h-full rounded-2xl border border-slate-800 bg-slate-950/40 p-5 md:p-6 ${cardGlow}`}>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="text-lg font-bold">
              {connected ? status : "Reconnecting…"}{" "}
              <span className="text-xs text-slate-400 font-semibold">/{shopSlug || "no-slug"}</span>
            </div>
            <div className="text-xs text-slate-400">
              Rows: <span className="text-slate-200 font-semibold">{rows.length}</span>
            </div>
          </div>

          {lastErr ? (
            <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {lastErr}
            </div>
          ) : null}

          {!newest ? (
            <div className="text-slate-400 mt-4">No arrivals yet.</div>
          ) : (
            <div className="mt-5">
              <div className="text-xs text-slate-400 font-semibold">Newest arrival</div>

              <button
                onClick={() => setSelectedId(newest.id)}
                className={`mt-2 w-full text-left rounded-2xl border border-slate-800 bg-slate-900/30 p-4 hover:border-slate-600 ${itemGlow}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-2xl md:text-3xl font-bold">
                      {extractSummary(newest.payload).vehicle}
                    </div>
                    <div className="text-slate-200 mt-1">{extractSummary(newest.payload).message}</div>
                    <div className="text-sm text-slate-400 mt-2">
                      {extractSummary(newest.payload).name} • {formatTime(newest.created_at)}
                      <span className="ml-2 text-slate-500">({ageFor(newest.created_at)})</span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <span className="px-2 py-1 rounded-full border border-slate-700 bg-slate-950/30 text-slate-300 text-xs font-semibold">
                      Open
                    </span>
                  </div>
                </div>
              </button>

              <div className="mt-4 text-xs text-slate-400 font-semibold">Recent</div>

              <div className="mt-2 space-y-2 max-h-[55vh] overflow-hidden">
                <div className="space-y-2 overflow-hidden">
                  {rows.slice(0, 8).map((r) => {
                    const s = extractSummary(r.payload);
                    return (
                      <button
                        key={r.id}
                        onClick={() => setSelectedId(r.id)}
                        className={`w-full text-left rounded-xl border border-slate-800 bg-slate-950/30 px-3 py-2 hover:border-slate-600 ${itemGlow}`}
                      >
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <div className="text-sm font-semibold text-slate-100">
                            {s.vehicle}{" "}
                            <span className="text-slate-400 font-normal">— {s.name}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="text-xs text-slate-500">{formatTime(r.created_at)}</div>
                            <div className="text-xs text-slate-600">•</div>
                            <div className="text-xs text-slate-400">{ageFor(r.created_at)}</div>
                          </div>
                        </div>
                        <div className="text-xs text-slate-300 mt-1">{s.message}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="text-xs text-slate-500 mt-4">
            Tip: keep this tab open. Submit from{" "}
            <span className="text-slate-300">/c/{shopSlug}</span> and you should see the row appear
            within 1–5 seconds.
          </div>
        </div>
      </div>

      {/* ======================= TICKET DETAIL DRAWER ======================= */}
      {selectedRow ? (
        <div className="fixed inset-0 z-50">
          {/* backdrop */}
          <button
            aria-label="Close ticket"
            className="absolute inset-0 bg-black/60"
            onClick={() => setSelectedId(null)}
          />

          {/* panel */}
          <div className="absolute right-0 top-0 h-full w-full md:w-[560px] p-4 md:p-6">
            <div className={`h-full rounded-2xl border border-slate-800 bg-slate-950/60 backdrop-blur p-4 md:p-5 ${cardGlow} overflow-hidden`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-extrabold">Ticket</div>
                  <div className="text-xs text-slate-400 mt-1">
                    {selectedRow.id.slice(0, 8)}… • Intake {formatDateTime(selectedRow.created_at)} • Age{" "}
                    <span className="text-slate-200 font-semibold">{ageFor(selectedRow.created_at)}</span>
                  </div>
                </div>

                <button className={dangerButton()} onClick={() => setSelectedId(null)}>
                  Close
                </button>
              </div>

              {/* Header / type / status */}
              <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/30 p-4">
                <div className="text-xl font-bold">{extractSummary(selectedRow.payload).vehicle}</div>
                <div className="text-slate-300 mt-1">{extractSummary(selectedRow.payload).message}</div>
                <div className="text-sm text-slate-400 mt-2">
                  {extractSummary(selectedRow.payload).name}
                  {extractSummary(selectedRow.payload).phone ? ` • ${extractSummary(selectedRow.payload).phone}` : ""}
                  {extractSummary(selectedRow.payload).email ? ` • ${extractSummary(selectedRow.payload).email}` : ""}
                </div>

                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <div className={sectionTitle()}>Type</div>
                  <button className={pillClass(kind === "quick")} onClick={() => setTicketKind(selectedRow.id, "quick")}>
                    Quick
                  </button>
                  <button className={pillClass(kind === "long")} onClick={() => setTicketKind(selectedRow.id, "long")}>
                    Long
                  </button>

                  <div className="w-4" />

                  <div className={sectionTitle()}>Status</div>
                  <button className={pillClass(tstatus === "new")} onClick={() => setTicketStatus(selectedRow.id, "new")}>
                    New
                  </button>
                  <button className={pillClass(tstatus === "started")} onClick={() => setTicketStatus(selectedRow.id, "started")}>
                    Started
                  </button>
                  <button className={pillClass(tstatus === "done")} onClick={() => setTicketStatus(selectedRow.id, "done")}>
                    Done
                  </button>
                </div>
              </div>

              {/* Scrollable body */}
              <div className="mt-4 h-[calc(100%-260px)] overflow-auto pr-1">
                {/* Work notes */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950/30 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold">Work Notes</div>
                      <div className="text-xs text-slate-400">Append-only. Keep it short.</div>
                    </div>
                    <button className={dangerButton()} onClick={() => clearLogs(selectedRow.id)}>
                      Clear
                    </button>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <input
                      className={inputClass()}
                      placeholder='e.g. "Battery tested — failed"'
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") addLog(selectedRow.id);
                      }}
                    />
                    <button className={primaryButton()} onClick={() => addLog(selectedRow.id)}>
                      Add
                    </button>
                  </div>

                  <div className="mt-3 space-y-2">
                    {logs.length ? (
                      logs.slice(0, 30).map((l, idx) => (
                        <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2">
                          <div className="text-xs text-slate-500">{formatDateTime(l.at)}</div>
                          <div className="text-sm text-slate-100 mt-1">{l.text}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-slate-400 mt-2">No notes yet.</div>
                    )}
                  </div>
                </div>

                {/* Parts proof */}
                <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/30 p-4">
                  <div className="text-sm font-bold">Parts Proof</div>
                  <div className="text-xs text-slate-400 mt-1">
                    For now: paste links to photos (old/new). Next step: upload to Storage.
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-2">
                    <input className={inputClass()} placeholder="Part name (e.g. Alternator)" value={partName} onChange={(e) => setPartName(e.target.value)} />
                    <input className={inputClass()} placeholder="Old part photo URL (optional)" value={partOldUrl} onChange={(e) => setPartOldUrl(e.target.value)} />
                    <input className={inputClass()} placeholder="New part photo URL (optional)" value={partNewUrl} onChange={(e) => setPartNewUrl(e.target.value)} />
                    <button className={primaryButton()} onClick={() => addPart(selectedRow.id)}>
                      Add Part Proof
                    </button>
                  </div>

                  <div className="mt-3 space-y-2">
                    {parts.length ? (
                      parts.slice(0, 30).map((p) => (
                        <div key={p.id} className="rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <div className="text-sm font-semibold">{p.name}</div>
                              <div className="text-xs text-slate-500">{formatDateTime(p.at)}</div>
                            </div>
                            <button className={dangerButton()} onClick={() => removePart(selectedRow.id, p.id)}>
                              Remove
                            </button>
                          </div>

                          {(p.oldUrl || p.newUrl) ? (
                            <div className="mt-2 grid grid-cols-1 gap-2">
                              {p.oldUrl ? (
                                <a className="text-xs text-sky-300 underline break-all" href={p.oldUrl} target="_blank" rel="noreferrer">
                                  Old photo
                                </a>
                              ) : null}
                              {p.newUrl ? (
                                <a className="text-xs text-emerald-300 underline break-all" href={p.newUrl} target="_blank" rel="noreferrer">
                                  New photo
                                </a>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-slate-400 mt-2">No parts recorded.</div>
                    )}
                  </div>
                </div>

                {/* Vehicle info (optional) */}
                <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/30 p-4">
                  <div className="text-sm font-bold">Vehicle Info (optional)</div>
                  <div className="text-xs text-slate-400 mt-1">
                    We are not forcing this. Only if needed.
                  </div>

                  <div className="mt-2 text-sm text-slate-300">
                    Location: <span className="text-slate-100">{extractSummary(selectedRow.payload).location || "—"}</span>
                  </div>
                </div>

                {/* Closeout */}
                <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/30 p-4">
                  <div className="text-sm font-bold">Closeout</div>
                  <div className="mt-2 flex items-center justify-between gap-3 flex-wrap">
                    <label className="flex items-center gap-2 text-sm text-slate-200">
                      <input
                        type="checkbox"
                        checked={paid}
                        onChange={(e) => setTicketPaid(selectedRow.id, e.target.checked)}
                      />
                      Payment received
                    </label>

                    <button
                      className={primaryButton()}
                      onClick={() =>
                        openPrintWindow({
                          shopSlug,
                          row: selectedRow,
                          kind,
                          status: tstatus,
                          paid,
                          logs,
                          parts,
                        })
                      }
                    >
                      Print Receipt
                    </button>
                  </div>

                  <div className="text-xs text-slate-500 mt-2">
                    Receipt includes intake time, notes, parts proof, and paid status.
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-3 flex items-center justify-between gap-3">
                <button className={subtleButton()} onClick={() => loadLatest("Syncing…")}>
                  Refresh from DB
                </button>
                <div className="text-xs text-slate-500">
                  Local save: notes/parts/status are stored on this device for now.
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}