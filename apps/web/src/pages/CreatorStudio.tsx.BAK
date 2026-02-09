import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import CreatorServices from "./CreatorServices";
import { useProjectStore } from "../state/projectStore";
import { supabase } from "../lib/supabase";

import { BackPill } from "../components/BackPill";
type StudioMode = {
  key: string;
  title: string;
  desc: string;
  badge?: string;
};

function getBaseUrl(): string {
  const envBase =
    (import.meta as any)?.env?.VITE_PUBLIC_BASE_URL ??
    (import.meta as any)?.env?.VITE_PUBLIC_BASE_URL?.toString?.();

  if (typeof envBase === "string" && envBase.trim()) return envBase.trim();

  try {
    return window.location.origin;
  } catch {
    return "http://localhost:5174";
  }
}

function genSlug(len: number): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < bytes.length; i++) out += alphabet[bytes[i] % alphabet.length];
  return out;
}

type IntakeRow = {
  id: string;
  created_at: string;
  slug: string | null;
  project_id: string;
  payload: any;
};

function prettyTime(ts?: string) {
  if (!ts) return "";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return ts;
  return d.toLocaleString();
}

function safeStr(v: any) {
  if (v === null || v === undefined) return "";
  return String(v);
}

function IntakeViewerPanel({ projectId, slug }: { projectId: string | null | undefined; slug?: string | null }) {
  const [rows, setRows] = React.useState<IntakeRow[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const seenIdsRef = React.useRef<Set<string>>(new Set());

  React.useEffect(() => {
    if (!projectId && !slug) return;
    const channel = supabase
      .channel("intake-submissions:" + String(projectId ?? slug ?? "none"))
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "public_intake_submissions",
          filter: slug ? ("slug=eq." + slug) : ("project_id=eq." + projectId),
        },
        (payload) => {
          const row = payload.new as any;
          const id = String(row?.id ?? "");
          if (id && seenIdsRef.current.has(id)) return;
          if (id) seenIdsRef.current.add(id);

          setRows((prev) => {
            if (id && prev?.some((x) => String((x as any)?.id ?? "") === id)) return prev;
            return [row as any, ...(prev ?? [])];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, slug]);

  const load = React.useCallback(async () => {
    if (!projectId && !slug) return;
    setLoading(true);
    setErr(null);
    try {
      const base = supabase
        .from("public_intake_submissions")
        .select("id,created_at,slug,project_id,payload")
        .order("created_at", { ascending: false })
        .limit(50);

      const { data, error } = slug
        ? await base.eq("slug", slug)
        : await base.eq("project_id", projectId);

      if (error) throw error;
      setRows((data as any) ?? []);
    } catch (e: any) {
      setErr(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }, [projectId, slug]);

  React.useEffect(() => {
    load();
  }, [load]);

  const headerNote = slug ? `slug: ${slug}` : "";

  return (
    <div
      style={{
        marginTop: 14,
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 14,
        padding: 14,
        background: "rgba(255,255,255,0.03)",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: "white" }}>Intake</div>
        <div style={{ opacity: 0.65, fontSize: 12, color: "rgba(255,255,255,0.85)" }}>
          {rows.length} {rows.length === 1 ? "submission" : "submissions"} {headerNote ? `- ${headerNote}` : ""}
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button
            onClick={load}
            style={{
              padding: "6px 10px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.04)",
              cursor: "pointer",
              color: "white",
              fontWeight: 800,
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      {loading && (
        <div style={{ marginTop: 10, opacity: 0.75, fontSize: 13, color: "rgba(255,255,255,0.85)" }}>
          Loading...
        </div>
      )}

      {err && (
        <div
          style={{
            marginTop: 10,
            padding: 10,
            borderRadius: 10,
            border: "1px solid rgba(255,80,80,0.35)",
            background: "rgba(255,80,80,0.08)",
            color: "rgba(255,200,200,0.95)",
            fontSize: 13,
          }}
        >
          Intake load failed: {err}
        </div>
      )}

      {!loading && !err && rows.length === 0 && (
        <div style={{ marginTop: 10, opacity: 0.7, fontSize: 13, color: "rgba(255,255,255,0.85)" }}>
          No submissions yet. Open the public link in incognito and submit a test, then hit Refresh.
        </div>
      )}

      <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
        {rows.map((r) => {
          const p = r.payload || {};
          const name = safeStr(p.name || p.full_name || p.fullName);
          const email = safeStr(p.email);
          const phone = safeStr(p.phone);
          const contact = safeStr(p.preferred_contact || p.preferredContact);
          const address = safeStr(p.address);
          const message = safeStr(p.message || p.issue || p.request);

          const isOpen = expandedId === r.id;

          return (
            <div
              key={r.id}
              style={{
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: 12,
                padding: 12,
                background: "rgba(0,0,0,0.15)",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              <div style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
                <div style={{ fontWeight: 800 }}>{name || email || phone || "Submission"}</div>
                <div style={{ opacity: 0.65, fontSize: 12 }}>{prettyTime(r.created_at)}</div>
                <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                  <button
                    onClick={() => setExpandedId(isOpen ? null : r.id)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 10,
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(255,255,255,0.04)",
                      cursor: "pointer",
                      color: "white",
                      fontWeight: 800,
                    }}
                  >
                    {isOpen ? "Hide" : "View"}
                  </button>

                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(JSON.stringify(r.payload ?? {}, null, 2));
                        alert("Payload copied");
                      } catch {}
                    }}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 10,
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(255,255,255,0.04)",
                      cursor: "pointer",
                      color: "white",
                      fontWeight: 800,
                    }}
                  >
                    Copy JSON
                  </button>
                </div>
              </div>

              <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{ fontSize: 13 }}>
                  <div style={{ opacity: 0.6, fontSize: 12 }}>Email</div>
                  <div>{email || "-"}</div>
                </div>
                <div style={{ fontSize: 13 }}>
                  <div style={{ opacity: 0.6, fontSize: 12 }}>Phone</div>
                  <div>{phone || "-"}</div>
                </div>
                <div style={{ fontSize: 13 }}>
                  <div style={{ opacity: 0.6, fontSize: 12 }}>Preferred</div>
                  <div>{contact || "-"}</div>
                </div>
                <div style={{ fontSize: 13 }}>
                  <div style={{ opacity: 0.6, fontSize: 12 }}>Address</div>
                  <div>{address || "-"}</div>
                </div>
              </div>

              {message && (
                <div style={{ marginTop: 10, fontSize: 13 }}>
                  <div style={{ opacity: 0.6, fontSize: 12 }}>Request</div>
                  <div style={{ whiteSpace: "pre-wrap" }}>{message}</div>
                </div>
              )}

              {isOpen && (
                <pre
                  style={{
                    marginTop: 10,
                    padding: 10,
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: "rgba(255,255,255,0.03)",
                    overflowX: "auto",
                    fontSize: 12,
                    lineHeight: 1.35,
                  }}
                >
{JSON.stringify(
  { id: r.id, created_at: r.created_at, slug: r.slug, project_id: r.project_id, payload: r.payload },
  null,
  2
)}
                </pre>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function QRCode({ value, size = 260 }: { value: string; size?: number }) {
  const src =
    "https://api.qrserver.com/v1/create-qr-code/?size=" +
    `${size}x${size}` +
    "&data=" +
    encodeURIComponent(value);

  return <img src={src} width={size} height={size} style={{ borderRadius: 14, display: "block" }} alt="QR code" />;
}

function StudioSurface({ mode, onBack, onBuild }: { mode: string; onBack?: () => void; onBuild?: () => void }) {
  const store: any = useProjectStore();
  const activeProjectId: string | null = store?.activeProjectId ?? null;

  const projects: any[] =
    (Array.isArray(store?.projects) ? store.projects : null) ??
    (Array.isArray(store?.projectList) ? store.projectList : null) ??
    (Array.isArray(store?.items) ? store.items : null) ??
    [];

  const setActiveProjectId: ((id: string) => void) | null =
    store?.setActiveProjectId ?? store?.setActiveProject ?? store?.setActive ?? store?.setActiveId ?? null;

  useEffect(() => {
    if (activeProjectId) return;
    if (!setActiveProjectId) return;

    const keys = ["hp_active_project_id", "hp_active_project", "activeProjectId", "homeplanet_active_project_id"];
    for (const k of keys) {
      try {
        const v = localStorage.getItem(k);
        if (v && typeof v === "string" && v.length > 5) {
          setActiveProjectId(v);
          return;
        }
      } catch {}
    }

    const first = projects?.[0];
    const pid = (first?.id ?? first?.project_id ?? first?.projectId ?? null) as string | null;
    if (pid) {
      setActiveProjectId(pid);
      try {
        localStorage.setItem("hp_active_project_id", pid);
      } catch {}
    }
  }, [activeProjectId, setActiveProjectId, projects]);

  const [slug, setSlug] = useState<string | null>(null);
  const [slugPhase, setSlugPhase] = useState<string>("idle");
  const [slugErr, setSlugErr] = useState<string | null>(null);

  const shell: any = {
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.35)",
    boxShadow: "0 18px 60px rgba(0,0,0,0.45)",
    padding: 18,
  };

  const pill: any = {
    height: 40,
    padding: "0 14px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.06)",
    color: "white",
    cursor: "pointer",
    fontWeight: 900,
    fontSize: 12,
    letterSpacing: 0.2,
    whiteSpace: "nowrap",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const primary: any = {
    height: 42,
    padding: "0 14px",
    borderRadius: 999,
    border: "1px solid rgba(0,255,150,0.35)",
    background: "rgba(0,255,150,0.10)",
    color: "rgba(220,255,245,0.95)",
    cursor: "pointer",
    fontWeight: 950,
    fontSize: 12,
    letterSpacing: 0.2,
  };

  const panel: any = {
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.05)",
    padding: 16,
    minWidth: 0,
  };

  const label: any = { fontSize: 11, opacity: 0.8, marginBottom: 6, fontWeight: 900, letterSpacing: 0.2, color: "rgba(255,255,255,0.9)" };
  const input: any = {
    width: "100%",
    height: 40,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(0,0,0,0.35)",
    color: "white",
    padding: "0 12px",
    outline: "none",
  };

  const textarea: any = {
    width: "100%",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(0,0,0,0.35)",
    color: "white",
    padding: 12,
    outline: "none",
    minHeight: 90,
    resize: "vertical",
  };

  const row2: any = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 };
  const hr: any = { height: 1, background: "rgba(255,255,255,0.08)", border: 0, margin: "14px 0" };

  const linkBox: any = {
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.35)",
    padding: 12,
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
    overflowWrap: "anywhere",
  };

  const qrBox: any = {
    width: "100%",
    aspectRatio: "1 / 1",
    borderRadius: 18,
    border: "2px dashed rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.03)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "rgba(255,255,255,0.75)",
    fontWeight: 900,
  };

  const isIntake = mode === "intake";
  const isServices = mode === "services";

  if (isServices) return <CreatorServices />;

  const baseUrl = getBaseUrl();

  useEffect(() => {
    let cancelled = false;

    async function ensureSlug() {
      setSlugErr(null);
      if (!activeProjectId) {
        setSlugPhase("no-project");
        setSlugErr("activeProjectId is missing");
        setSlug(null);
        return;
      }

      const cacheKey = `hp_public_slug_${activeProjectId}_${mode}`;
      const cached = (() => {
        try {
          return localStorage.getItem(cacheKey);
        } catch {
          return null;
        }
      })();

      if (cached) {
        setSlugPhase("cached");
        setSlug(cached);
        return;
      }

      setSlugPhase("fetching");

      const { data: found, error: fetchErr } = await supabase
        .from("public_pages")
        .select("slug")
        .eq("project_id", activeProjectId)
        .eq("mode", mode)
        .limit(1)
        .maybeSingle();

      if (fetchErr) {
        setSlugPhase("fetch-error");
        setSlugErr(fetchErr.message ?? String(fetchErr));
      }

      if (!cancelled && found?.slug) {
        try {
          localStorage.setItem(cacheKey, found.slug);
        } catch {}
        setSlugPhase("found");
        setSlug(found.slug);
        return;
      }

      for (let attempt = 0; attempt < 3; attempt++) {
        const newSlug = genSlug(attempt === 0 ? 10 : 12);

        const { data: created, error } = await supabase
          .from("public_pages")
          .upsert([{ project_id: activeProjectId, mode, slug: newSlug }], { onConflict: "project_id,mode" })
          .select("slug")
          .single();

        if (!cancelled && created?.slug) {
          try {
            localStorage.setItem(cacheKey, created.slug);
          } catch {}
          setSlugPhase("created");
          setSlug(created.slug);
          return;
        }

        if (error && !String(error.message || "").toLowerCase().includes("duplicate")) {
          setSlugPhase("insert-error");
          setSlugErr(error?.message ?? String(error));
          break;
        }
      }

      if (!cancelled) setSlug(null);
    }

    ensureSlug();
    return () => {
      cancelled = true;
    };
  }, [activeProjectId, mode]);

  const publicUrl = useMemo(() => {
    if (!slug) return "";
    return `${baseUrl}/c/${slug}`;
  }, [baseUrl, slug]);

  useEffect(() => {
    const pid = activeProjectId;
    const s = slug;
    if (!pid || !s) return;

    let cancelled = false;
    (async () => {
      try {
        const { error } = await supabase.from("public_pages").upsert(
          { project_id: pid, mode, slug: s },
          { onConflict: "project_id,mode" }
        );
        if (!cancelled && error) console.warn("[public_pages] upsert error:", error.message);
      } catch (e: any) {
        if (!cancelled) console.warn("[public_pages] upsert exception:", e?.message ?? e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug, mode, activeProjectId]);

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(publicUrl);
      alert("Copied!");
    } catch {}
  }

  return (
    <div style={shell}>
      <div style={{ marginBottom: 14, color: "white" }}>
        <div style={{ margin: 0, fontSize: 18, fontWeight: 950 }}>
          {isIntake ? "Online Intake (QR) - MVP Surface" : `Creator Studio - ${mode}`}
        </div>
        <div style={{ marginTop: 6, fontSize: 12, opacity: 0.85 }}>
          Project: <span style={{ fontWeight: 900 }}>{activeProjectId ? activeProjectId.slice(0, 8) : "none"}</span>
          {"  |  "}
          Slug: <span style={{ fontWeight: 900 }}>{slug ? slug : activeProjectId ? "generating..." : "none"}</span>
        </div>
      </div>

      {isIntake ? (
        <div id="print-surface" style={{ display: "grid", gridTemplateColumns: "1.35fr 0.9fr", gap: 16, alignItems: "stretch" }}>
          <div style={panel}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <div style={{ fontWeight: 950, color: "white" }}>Intake Form (starter)</div>
              <div style={{ fontSize: 11, opacity: 0.8, color: "rgba(255,255,255,0.85)" }}>replace fields per industry</div>
            </div>

            <hr style={hr} />

            <div style={row2}>
              <div>
                <div style={label}>Full name</div>
                <input style={input} placeholder="Customer name" />
              </div>
              <div>
                <div style={label}>Phone</div>
                <input style={input} placeholder="(555) 555-5555" />
              </div>
            </div>

            <div style={{ height: 12 }} />

            <div style={row2}>
              <div>
                <div style={label}>Email</div>
                <input style={input} placeholder="email@example.com" />
              </div>
              <div>
                <div style={label}>Preferred contact</div>
                <input style={input} placeholder="Text / Call / Email" />
              </div>
            </div>

            <div style={{ height: 12 }} />

            <div>
              <div style={label}>What do you need help with?</div>
              <textarea style={textarea} placeholder="Describe the issue / request..." />
            </div>

            <div style={{ height: 12 }} />

            <div style={row2}>
              <div>
                <div style={label}>Address (optional)</div>
                <input style={input} placeholder="City, State" />
              </div>
              <div>
                <div style={label}>Best time</div>
                <input style={input} placeholder="Morning / Afternoon / Evening" />
              </div>
            </div>

            <hr style={hr} />

            <button type="button" style={primary} onClick={() => alert("Submit wiring next")}>
              Submit Intake (wire next)
            </button>
          </div>

          <div style={panel}>
            <div style={{ fontWeight: 950, color: "white" }}>Share (QR + Link)</div>
            <div style={{ fontSize: 12, opacity: 0.85, marginTop: 6, color: "rgba(255,255,255,0.85)" }}>
              Customers scan this and submit.
              <div style={{ marginTop: 6, fontSize: 11, opacity: 0.85 }}>
                debug: project={String(activeProjectId ?? "none")} | phase={slugPhase} | slug={String(slug ?? "null")}
                {slugErr ? ` | err=${slugErr}` : ""}
              </div>
            </div>

            <div style={{ height: 12 }} />

            <div style={qrBox}>
              <div style={{ background: "white", padding: 14, borderRadius: 14, display: "inline-flex" }}>
                {publicUrl ? (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    <QRCode value={publicUrl} size={240} />
    <div style={{ marginTop: 8, fontSize: 11, color: "black", textAlign: "center", wordBreak: "break-all" }}>
      Scan or visit:<br /><strong>{publicUrl}</strong>
    </div>
  </div>
) : (
  <div style={{ color: "rgba(0,0,0,0.7)", fontSize: 12, padding: 12 }}>Generating link...</div>
)}
              </div>
            </div>

            <div style={{ height: 12 }} />

            <div style={label}>Public link</div>
            <div style={linkBox}>{publicUrl ? publicUrl : "Generating link..."}</div>

            <div style={{ height: 12 }} />

            <button type="button" style={pill} onClick={copyUrl}>
              Copy link
            </button>

            <IntakeViewerPanel projectId={activeProjectId} slug={slug} />

            <div style={{ height: 12 }} />

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button type="button" style={pill} onClick={onBack} title="Back to Studio">
                Studio
              </button>
              <button type="button" style={pill} onClick={onBuild} title="Back to Build">
                Build
              </button>
              <button type="button" style={primary} onClick={() => window.print()} title="Print / Save PDF">
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div style={panel}>
          <div style={{ fontWeight: 950, color: "white" }}>Mode placeholder</div>
          <div style={{ marginTop: 6, fontSize: 12, opacity: 0.85, color: "rgba(255,255,255,0.85)" }}>
            We will build this mode after Intake is solid.
          </div>
        </div>
      )}
    </div>
  );
}

export default function CreatorStudio() {
  const nav = useNavigate();
  const [hoverKey, setHoverKey] = useState<string | null>(null);
const { mode } = useParams<{ mode?: string }>();

  const modes = useMemo<StudioMode[]>(
    () => [
      { key: "intake", title: "Online Intake (QR)", desc: "One-page intake + QR customers can scan and submit.", badge: "recommended" },
      { key: "card", title: "Business Card", desc: "Print-ready card layout. Export and upload anywhere." },
      { key: "hanger", title: "Door Hanger", desc: "Door hanger layout + print export." },
      { key: "flyer", title: "Flyer / One-pager", desc: "Promo flyer with sections and call-to-action." },
      { key: "sign", title: "Sign / Banner", desc: "Large format layout preset for shops and print." },
      { key: "services", title: "Services + Products", desc: "Edit services/products list used in preview." },
    ],
    []
  );

  const wrap: any = { padding: 18, maxWidth: 1200, margin: "0 auto" };
  const headerCard: any = {
    padding: 16,
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.25)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
    marginBottom: 14,
    color: "white",
  };

  const hpPill: any = {
    height: 40,
    padding: "0 12px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.06)",
    color: "white",
    cursor: "pointer",
    fontWeight: 900,
    fontSize: 12,
    letterSpacing: 0.2,
    whiteSpace: "nowrap",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const grid: any = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 14,
    alignItems: "stretch",
  };

  const card: any = {
  padding: 16,
  borderRadius: 18,
  border: "1px solid rgba(90,160,255,0.18)",
  background: "linear-gradient(180deg, rgba(40,80,140,0.06), rgba(0,0,0,0.45))",
  cursor: "pointer",
  transition: "transform .22s ease, box-shadow .22s ease, border-color .22s ease, background .22s ease",
  boxShadow: "0 8px 22px rgba(0,0,0,0.45)",
};

  const PRINT_CSS = `
@media print {
  body { background: #fff !important; color: #000 !important; }
  * { box-shadow: none !important; text-shadow: none !important; }
  a, a:visited { color: #000 !important; text-decoration: none !important; }

  /* Hide everything by default */
  body * { visibility: hidden !important; }

  /* Only show our print surface */
  #print-surface, #print-surface * { visibility: visible !important; }

  /* Position print surface at top-left */
  #print-surface {
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 8.5in !important;
    max-width: 8.5in !important;
    padding: 0.5in !important;
    background: #fff !important;
    color: #000 !important;
  }

  /* Force print surface to be a normal document flow */
  #print-surface {
    display: block !important;
  }
  #print-surface > * {
    break-inside: avoid !important;
  }

  /* Make inputs/fields printable */
  input, textarea, select {
    background: #fff !important;
    color: #000 !important;
    border: 1px solid #000 !important;
  }

  /* Kill dark gradients/borders inside print */
  [style*="background"] { background: transparent !important; }
  [style*="border"] { border-color: #000 !important; }

  @page { size: Letter; margin: 0.5in; }
}
`


const cardHover: any = {
  transform: "translateY(-2px)",
  boxShadow: "0 14px 34px rgba(0,0,0,0.65)",
  border: "1px solid rgba(120,190,255,0.32)",
  background: "linear-gradient(180deg, rgba(55,105,190,0.10), rgba(0,0,0,0.55))",
};


  const title: any = { fontSize: 16, fontWeight: 950, margin: 0, letterSpacing: 0.2, color: "rgba(255,255,255,0.96)" };
  const desc: any = { fontSize: 12, opacity: 0.84, marginTop: 8, lineHeight: 1.35, color: "rgba(255,255,255,0.84)" };

  if (mode) {
    const modeMeta = modes.find((m) => m.key === mode);
    const modeTitle = modeMeta?.title ?? `Creator Studio: ${mode}`;

    return (
      <div style={wrap}>
        <div style={headerCard}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <h1 style={{ fontSize: 22, margin: 0 }}>{modeTitle}</h1>
              <div style={{ opacity: 0.7, fontSize: 12, marginTop: 4 }}>Print-ready surface - export anytime.</div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <BackPill onClick={() => nav("/planet/creator/studio")} label="Studio" variant="primary" />
              <BackPill onClick={() => nav("/planet/creator/build")} label="Build" showArrow={false} variant="build" />
              <button type="button" style={hpPill} onClick={() => window.print()} title="Print / Save PDF">
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>

        <StudioSurface mode={mode} onBack={() => nav("/planet/creator/studio")} onBuild={() => nav("/planet/creator/build")} />
      </div>
    );
  }

  return (
    <div style={wrap}>
      <div style={headerCard}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontSize: 22, margin: 0 }}>Creator Studio</h1>
            <div style={{ opacity: 0.7, fontSize: 12, marginTop: 4 }}>Choose what you are making, then customize and export print-ready.</div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <BackPill onClick={() => nav(-1)} label="Back" variant="primary" />
            <BackPill onClick={() => nav("/planet/creator/build")} label="Build" showArrow={false} variant="build" />
          </div>
        </div>
      </div>

      <div style={grid}>
        {modes.map((m) => (
          <div
            key={m.key}
style={hoverKey === m.key ? { ...card, ...cardHover } : card}
            onMouseEnter={() => setHoverKey(m.key)}
            onMouseLeave={() => setHoverKey(null)}
            onFocus={() => setHoverKey(m.key)}
            onBlur={() => setHoverKey(null)}
            onClick={() => nav(`/planet/creator/studio/${m.key}`)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") nav(`/planet/creator/studio/${m.key}`);
            }}
            role="button"
            tabIndex={0}
            title={m.title}
          >
            <h3 style={title}>
              {m.title} {m.badge ? <span style={{ opacity: 0.7, marginLeft: 8 }}>(recommended)</span> : null}
            </h3>
            <div style={desc}>{m.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}



























