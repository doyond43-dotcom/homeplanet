import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import CreatorServices from "./CreatorServices";
import IntakeViewerPanel from "../components/IntakeViewerPanel";
import { useProjectStore } from "../state/projectStore";
import { supabase } from "../lib/supabase";

type StudioMode = {
  key: string;
  title: string;
  desc: string;
  badge?: string;
};

type CreatorMomentPayload = {
  businessName: string;
  businessType: string;
  city: string;
  boardSlug: string;
  presenceId: string;
  creatorStudio: boolean;
  creatorMoment: {
    title: string;
    subtitle: string;
    story: string;
    statusLine: string;
    clipCount: number;
    launchedAt: string;
    note: string;
    momentType: string;
  };
  clips: DropClip[];
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

function getCreatorMomentWriteKey(slug: string): string {
  const key = `creator-studio:${slug}:write-key`;

  try {
    const existing = localStorage.getItem(key);
    if (existing) return existing;
  } catch {}

  const created =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  try {
    localStorage.setItem(key, created);
  } catch {}

  return created;
}

async function saveCreatorMomentToSupabase(slug: string, payload: CreatorMomentPayload) {
  const cleanSlug = slug.trim();
  if (!cleanSlug) return false;

  const writeKey = getCreatorMomentWriteKey(cleanSlug);
  const moment = payload.creatorMoment;

  try {
    const { error } = await supabase.rpc("save_creator_moment", {
      p_slug: cleanSlug,
      p_write_key: writeKey,
      p_title: moment.title,
      p_subtitle: moment.subtitle,
      p_status: moment.statusLine,
      p_next_step: "Open connected creator system",
      p_clips: payload.clips,
      p_payload: payload,
    });

    if (!error) return true;

    console.warn("[creator_moments] rpc save failed, trying direct upsert:", error.message);
  } catch (error: any) {
    console.warn("[creator_moments] rpc save exception, trying direct upsert:", error?.message ?? error);
  }

  try {
    const { error } = await supabase.from("creator_moments").upsert(
      {
        slug: cleanSlug,
        write_key: writeKey,
        title: moment.title,
        subtitle: moment.subtitle,
        status: moment.statusLine,
        next_step: "Open connected creator system",
        clips: payload.clips,
        payload,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "slug" }
    );

    if (error) {
      console.warn("[creator_moments] direct upsert failed:", error.message);
      return false;
    }

    return true;
  } catch (error: any) {
    console.warn("[creator_moments] direct upsert exception:", error?.message ?? error);
    return false;
  }
}

function QRCodeImg({ value, size = 240 }: { value: string; size?: number }) {
  const src =
    "https://api.qrserver.com/v1/create-qr-code/?size=" +
    `${size}x${size}` +
    "&data=" +
    encodeURIComponent(value);

  return <img src={src} width={size} height={size} style={{ borderRadius: 14, display: "block" }} alt="QR code" />;
}

function HomePlanetFooter() {
  const footerWrap: React.CSSProperties = {
    marginTop: 34,
    paddingTop: 18,
    borderTop: "1px solid rgba(148,163,184,0.16)",
    textAlign: "center",
  };

  const footerPrimary: React.CSSProperties = {
    fontSize: 13,
    color: "#94a3b8",
    fontWeight: 700,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    flexWrap: "wrap",
  };

  const footerSecondary: React.CSSProperties = {
    marginTop: 6,
    fontSize: 12,
    color: "rgba(148,163,184,0.72)",
  };

  const footerPlanetMark: React.CSSProperties = {
    position: "relative",
    width: 16,
    height: 16,
    display: "inline-block",
    borderRadius: "50%",
    background: "radial-gradient(circle at 35% 35%, #7dd3fc 0%, #38bdf8 45%, #1d4ed8 100%)",
    boxShadow: "0 0 10px rgba(56,189,248,0.45)",
    flexShrink: 0,
  };

  const footerPlanetRing: React.CSSProperties = {
    position: "absolute",
    left: -3,
    top: 6,
    width: 22,
    height: 7,
    border: "1.5px solid rgba(186,230,253,0.92)",
    borderRadius: "50%",
    transform: "rotate(-18deg)",
    opacity: 0.95,
    boxShadow: "0 0 6px rgba(125,211,252,0.25)",
    pointerEvents: "none",
  };

  return (
    <div style={footerWrap}>
      <div style={footerPrimary}>
        <span style={footerPlanetMark}>
          <span style={footerPlanetRing} />
        </span>
        HomePlanet © 2026. All rights reserved.
      </div>
      <div style={footerSecondary}>Presence-first systems and workflows protected.</div>
    </div>
  );
}

function StudioSurface({ mode, onBack, onBuild }: { mode: string; onBack: () => void; onBuild: () => void }) {
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

  const PRINT_CSS = `
@media print {
  body { background: #fff !important; color: #000 !important; }
  * { box-shadow: none !important; text-shadow: none !important; }
  a, a:visited { color: #000 !important; text-decoration: none !important; }

  body * { visibility: hidden !important; }
  #print-surface, #print-surface * { visibility: visible !important; }

  #print-surface {
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 8.5in !important;
    max-width: 8.5in !important;
    padding: 0.5in !important;
    background: #fff !important;
    color: #000 !important;
    display: block !important;
  }

  #print-surface > * { break-inside: avoid !important; }

  input, textarea, select {
    background: #fff !important;
    color: #000 !important;
    border: 1px solid #000 !important;
  }

  [style*="background"] { background: transparent !important; }
  [style*="border"] { border-color: #000 !important; }

  @page { size: Letter; margin: 0.5in; }
}
`;

  const normalizeStringsDeep = (v: any): any => {
    if (typeof v === "string") return v.trim();
    if (Array.isArray(v)) return v.map(normalizeStringsDeep);
    if (v && typeof v === "object") {
      const out: any = {};
      for (const k of Object.keys(v)) out[k] = normalizeStringsDeep((v as any)[k]);
      return out;
    }
    return v;
  };

  const [intakeDraft, setIntakeDraft] = useState({
    full_name: "",
    phone: "",
    email: "",
    preferred_contact: "",
    help_request: "",
    address: "",
    best_time: "",
  });

  const [intakeSaving, setIntakeSaving] = useState(false);
  const [intakeError, setIntakeError] = useState<string | null>(null);
  const [intakeSuccess, setIntakeSuccess] = useState<string | null>(null);

  const submitIntake = async () => {
    if (!slug) {
      setIntakeError("Slug is not ready yet. Wait one second and try again.");
      return;
    }

    setIntakeSaving(true);
    setIntakeError(null);
    setIntakeSuccess(null);

    const minimalOk =
      intakeDraft.full_name.trim() ||
      intakeDraft.phone.trim() ||
      intakeDraft.email.trim() ||
      intakeDraft.help_request.trim();

    if (!minimalOk) {
      setIntakeSaving(false);
      setIntakeError("Add at least a name/phone/email or a short description, then submit.");
      return;
    }

    try {
      const response = await fetch("/api/creator-intake", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug,
          payload: normalizeStringsDeep(intakeDraft),
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Failed to submit intake.");
      }

      setIntakeSaving(false);
      setIntakeSuccess("Submitted successfully.");

      setIntakeDraft({
        full_name: "",
        phone: "",
        email: "",
        preferred_contact: "",
        help_request: "",
        address: "",
        best_time: "",
      });
    } catch (error: any) {
      setIntakeSaving(false);
      setIntakeError(error?.message || "Failed to submit intake.");
    }
  };

  return (
    <div style={shell}>
      <style>{PRINT_CSS}</style>

      <div style={{ marginBottom: 14, color: "white" }}>
        <div style={{ margin: 0, fontSize: 18, fontWeight: 950 }}>
          {isIntake ? "Scan to Submit Intake" : `Creator Studio - ${mode}`}
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
              <div style={{ fontWeight: 950, color: "white" }}>Scan to Submit Intake</div>
              <div style={{ fontSize: 11, opacity: 0.8, color: "rgba(255,255,255,0.85)" }}>replace fields per industry</div>
            </div>

            <hr style={hr} />

            <div style={row2}>
              <div>
                <div style={label}>Full name</div>
                <input
                  style={input}
                  placeholder="Customer name"
                  value={intakeDraft.full_name}
                  onChange={(e) => setIntakeDraft((d) => ({ ...d, full_name: e.target.value }))}
                />
              </div>
              <div>
                <div style={label}>Phone</div>
                <input
                  style={input}
                  placeholder="(555) 555-5555"
                  value={intakeDraft.phone}
                  onChange={(e) => setIntakeDraft((d) => ({ ...d, phone: e.target.value }))}
                />
              </div>
            </div>

            <div style={{ height: 12 }} />

            <div style={row2}>
              <div>
                <div style={label}>Email</div>
                <input
                  style={input}
                  placeholder="email@example.com"
                  value={intakeDraft.email}
                  onChange={(e) => setIntakeDraft((d) => ({ ...d, email: e.target.value }))}
                />
              </div>
              <div>
                <div style={label}>Preferred contact</div>
                <input
                  style={input}
                  placeholder="Text / Call / Email"
                  value={intakeDraft.preferred_contact}
                  onChange={(e) => setIntakeDraft((d) => ({ ...d, preferred_contact: e.target.value }))}
                />
              </div>
            </div>

            <div style={{ height: 12 }} />

            <div>
              <div style={label}>What do you need help with?</div>
              <textarea
                style={textarea}
                placeholder="Describe the issue / request..."
                value={intakeDraft.help_request}
                onChange={(e) => setIntakeDraft((d) => ({ ...d, help_request: e.target.value }))}
              />
            </div>

            <div style={{ height: 12 }} />

            <div style={row2}>
              <div>
                <div style={label}>Address (optional)</div>
                <input
                  style={input}
                  placeholder="City, State"
                  value={intakeDraft.address}
                  onChange={(e) => setIntakeDraft((d) => ({ ...d, address: e.target.value }))}
                />
              </div>
              <div>
                <div style={label}>Best time</div>
                <input
                  style={input}
                  placeholder="Morning / Afternoon / Evening"
                  value={intakeDraft.best_time}
                  onChange={(e) => setIntakeDraft((d) => ({ ...d, best_time: e.target.value }))}
                />
              </div>
            </div>

            <hr style={hr} />

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button type="button" style={primary} onClick={submitIntake} disabled={intakeSaving}>
                {intakeSaving ? "Submitting..." : "Submit Intake"}
              </button>

              {intakeError ? (
                <div style={{ fontSize: 12, color: "#fca5a5", fontWeight: 700 }}>{intakeError}</div>
              ) : null}

              {intakeSuccess ? (
                <div style={{ fontSize: 12, color: "#86efac", fontWeight: 700 }}>{intakeSuccess}</div>
              ) : null}
            </div>
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
                    <QRCodeImg value={publicUrl} size={240} />
                    <div style={{ marginTop: 8, fontSize: 11, color: "black", textAlign: "center", wordBreak: "break-all" }}>
                      Scan or visit:
                      <br />
                      <strong>{publicUrl}</strong>
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

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button type="button" style={pill} onClick={copyUrl}>
                Copy link
              </button>

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

            <div style={{ height: 12 }} />

            <IntakeViewerPanel projectId={activeProjectId} slug={slug} />
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

      <HomePlanetFooter />
    </div>
  );
}


type DropClip = {
  id: string;
  name: string;
  type: string;
  order: number;
  createdAt: string;
};

function creatorSlugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export default function CreatorStudio() {
  const nav = useNavigate();
  const [hoverKey, setHoverKey] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dropBusinessName, setDropBusinessName] = useState("Test Shop");
  const [dropNote, setDropNote] = useState("");
  const [dropClips, setDropClips] = useState<DropClip[]>([]);
  const [dropSlug, setDropSlug] = useState("test-shop");
  const [dropPresenceId, setDropPresenceId] = useState("");
  const [momentType, setMomentType] = useState("Customer Drop-Off");
  const [creatorSaveState, setCreatorSaveState] = useState<"idle" | "saving" | "saved" | "local-only">("idle");

  function handleDropFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const created = files.map((file, index) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`,
      name: file.name,
      type: file.type.startsWith("video/") ? "video" : "image",
      order: dropClips.length + index + 1,
      createdAt: new Date().toISOString(),
    }));

    setDropClips((current) => [...current, ...created]);
    event.target.value = "";
  }

  async function buildConnectedCreatorSystem() {
    const cleanSlug = creatorSlugify(dropSlug || dropBusinessName || "creator-system");
    const presence = dropPresenceId.trim() || crypto.randomUUID();

    const momentPayload: CreatorMomentPayload = {
      businessName: dropBusinessName.trim() || cleanSlug,
      businessType: "Creator System",
      city: "",
      boardSlug: cleanSlug,
      presenceId: presence,
      creatorStudio: true,
      creatorMoment: {
        title: dropNote.trim() || `${dropBusinessName || cleanSlug} Creator Moment`,
        subtitle: `${dropClips.length} ${dropClips.length === 1 ? "clip" : "clips"} dropped into HomePlanet`,
        story:
          dropNote.trim() ||
          "This moment was built from the day and connected to the live board, staff board, and lobby board.",
        statusLine: "Connected creator system is ready.",
        clipCount: dropClips.length,
        launchedAt: new Date().toISOString(),
        note: dropNote.trim(),
        momentType,
      },
      clips: dropClips,
    };

    const systemPayload = {
      boardSlug: cleanSlug,
      presenceId: presence,
      businessName: dropBusinessName.trim() || cleanSlug,
      createdAt: new Date().toISOString(),
      systemFlags: {
        publicPage: true,
        liveBoard: true,
        staffBoard: true,
        lobbyBoard: true,
        momentPage: true,
      },
    };

    localStorage.setItem(`creator-studio:${cleanSlug}:moment`, JSON.stringify(momentPayload));
    localStorage.setItem(`hp-system:${cleanSlug}`, JSON.stringify(systemPayload));

    setDropSlug(cleanSlug);
    setDropPresenceId(presence);
    setCreatorSaveState("saving");

    const savedToSupabase = await saveCreatorMomentToSupabase(cleanSlug, momentPayload);
    setCreatorSaveState(savedToSupabase ? "saved" : "local-only");

    nav(`/planet/creator/building?boardSlug=${encodeURIComponent(cleanSlug)}&businessName=${encodeURIComponent(dropBusinessName.trim() || cleanSlug)}&businessType=${encodeURIComponent("Creator System")}&city=${encodeURIComponent("")}&primaryGoal=${encodeURIComponent("Create business system")}`, {
      state: {
        redirectTo: `/planet/system/${cleanSlug}`,
        boardSlug: cleanSlug,
        presenceId: presence,
      },
    });
  }

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
              <button type="button" style={hpPill} onClick={() => window.print()} title="Print / Save PDF">
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>

        <StudioSurface
          mode={mode}
          onBack={() => nav("/planet/creator/studio")}
          onBuild={() => nav("/planet/creator/build")}
        />
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
        </div>
      </div>

      <div
        style={{
          padding: 16,
          borderRadius: 18,
          border: "1px solid rgba(0,255,150,0.18)",
          background: "linear-gradient(180deg, rgba(0,255,150,0.07), rgba(0,0,0,0.42))",
          boxShadow: "0 10px 30px rgba(0,0,0,0.28)",
          marginBottom: 14,
          color: "white",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 950, textTransform: "uppercase", color: "rgba(220,255,245,0.78)" }}>
              Create Business System
            </div>
            <h2 style={{ margin: "6px 0 6px", fontSize: 22, lineHeight: 1.1 }}>
              Set up your business once. Everything runs from here.
            </h2>
            <div style={{ opacity: 0.75, fontSize: 12, lineHeight: 1.45 }}>
              This creates your live board, staff board, and lobby board. Daily clips and updates attach later - they do not create new systems.
            </div>
          </div>

          <button type="button" style={hpPill} onClick={() => fileInputRef.current?.click()}>
            Drop Clips
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleDropFiles}
          style={{ display: "none" }}
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginTop: 14 }}>
          <input
            style={{
              width: "100%",
              height: 40,
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(0,0,0,0.34)",
              color: "white",
              padding: "0 12px",
              outline: "none",
              boxSizing: "border-box",
            }}
            value={dropBusinessName}
            onChange={(e) => {
              setDropBusinessName(e.target.value);
              setDropSlug(creatorSlugify(e.target.value));
            }}
            placeholder="Business name"
          />

          <input
            style={{
              width: "100%",
              height: 40,
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(0,0,0,0.34)",
              color: "white",
              padding: "0 12px",
              outline: "none",
              boxSizing: "border-box",
            }}
            value={dropSlug}
            onChange={(e) => setDropSlug(creatorSlugify(e.target.value))}
            placeholder="board-slug"
          />
        </div>

        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 950, opacity: 0.78, marginBottom: 6 }}>
            Moment Type
          </div>

          <select
            value={momentType}
            onChange={(e) => setMomentType(e.target.value)}
            style={{
              width: "100%",
              height: 40,
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(0,0,0,0.34)",
              color: "white",
              padding: "0 12px",
              outline: "none",
              boxSizing: "border-box",
              fontWeight: 800,
            }}
          >
            <option>Customer Drop-Off</option>
            <option>Diagnosis / Inspection</option>
            <option>Repair In Progress</option>
            <option>Waiting Approval</option>
            <option>Ready For Pickup</option>
            <option>Customer Pick-Up</option>
            <option>Maintenance Complete</option>
          </select>
        </div>
        <textarea
          style={{
            width: "100%",
            minHeight: 76,
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.14)",
            background: "rgba(0,0,0,0.34)",
            color: "white",
            padding: 12,
            outline: "none",
            resize: "vertical",
            boxSizing: "border-box",
            marginTop: 12,
          }}
          value={dropNote}
          onChange={(e) => setDropNote(e.target.value)}
          placeholder="Describe your business or first job. Example: Full-service auto repair shop handling inspections, brake jobs, and diagnostics."
        />

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginTop: 12 }}>
          <button type="button" style={hpPill} onClick={buildConnectedCreatorSystem} disabled={creatorSaveState === "saving"}>
            {creatorSaveState === "saving" ? "Saving..." : "Create Business System"}
          </button>

          <div style={{ fontSize: 12, opacity: 0.78, fontWeight: 800 }}>
            {dropClips.length} {dropClips.length === 1 ? "clip" : "clips"} loaded
          </div>

          {creatorSaveState === "saved" ? (
            <div style={{ fontSize: 12, color: "#86efac", fontWeight: 900 }}>Saved to Supabase</div>
          ) : null}

          {creatorSaveState === "local-only" ? (
            <div style={{ fontSize: 12, color: "#fde68a", fontWeight: 900 }}>Saved locally; Supabase skipped</div>
          ) : null}

          {dropClips.length > 0 ? (
            <button type="button" style={hpPill} onClick={() => setDropClips([])}>
              Clear clips
            </button>
          ) : null}
        </div>

        {dropClips.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10, marginTop: 12 }}>
            {dropClips.map((clip) => (
              <div
                key={clip.id}
                style={{
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(255,255,255,0.05)",
                  padding: 10,
                  minWidth: 0,
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 950, opacity: 0.68 }}>
                  Clip #{clip.order} - {clip.type}
                </div>
                <div style={{ marginTop: 6, fontSize: 12, fontWeight: 800, overflowWrap: "anywhere" }}>
                  {clip.name}
                </div>
              </div>
            ))}
          </div>
        ) : null}
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

      <HomePlanetFooter />
    </div>
  );
}






