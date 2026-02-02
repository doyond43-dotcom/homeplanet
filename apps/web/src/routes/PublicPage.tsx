import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

type PublicPageRow = {
  project_id: string;
  mode: string;
  slug: string;
};

type IntakePayload = {
  full_name: string;
  phone: string;
  email: string;
  preferred_contact: string;
  need_help_with: string;
  address: string;
  best_time: string;
};

function FieldLabel({ children }: { children: any }) {
  return <div style={{ fontSize: 12, fontWeight: 850, marginBottom: 6, color: "rgba(255,255,255,0.9)" }}>{children}</div>;
}

function TextInput(props: any) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        padding: "12px 12px",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.14)",
        background: "rgba(255,255,255,0.06)",
        color: "white",
        outline: "none",
      }}
    />
  );
}

function TextArea(props: any) {
  return (
    <textarea
      {...props}
      style={{
        width: "100%",
        minHeight: 110,
        padding: "12px 12px",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.14)",
        background: "rgba(255,255,255,0.06)",
        color: "white",
        outline: "none",
        resize: "vertical",
      }}
    />
  );
}

function PillButton(props: any) {
  return (
    <button
      {...props}
      style={{
        borderRadius: 999,
        padding: "10px 14px",
        background: "rgba(255,255,255,0.10)",
        border: "1px solid rgba(255,255,255,0.14)",
        color: "white",
        fontWeight: 900,
        cursor: "pointer",
      }}
    />
  );
}

function IntakePublicRenderer({ projectId, slug }: { projectId: string; slug: string }) {
  const [payload, setPayload] = useState<IntakePayload>({
    full_name: "",
    phone: "",
    email: "",
    preferred_contact: "Text",
    need_help_with: "",
    address: "",
    best_time: "Morning",
  });

  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    setSubmitting(true);
    setErr(null);
    setOk(null);

    try {
      const { error } = await supabase.from("public_intake_submissions").insert([
        {
          slug,
          project_id: projectId,
          payload,
        },
      ]);

      if (error) {
        setErr(error.message);
      } else {
        setOk("Submitted ✅");
        setPayload((p) => ({ ...p, need_help_with: "" }));
      }
    } catch (e: any) {
      setErr(e?.message ?? String(e));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff" }}>
      <div style={{ padding: 16, maxWidth: 860, margin: "0 auto" }}>
        <div style={{ fontSize: 22, fontWeight: 980, marginBottom: 6 }}>Public Intake</div>
        <div style={{ opacity: 0.85, marginBottom: 18 }}>
          Project: <span style={{ fontFamily: "monospace" }}>{projectId}</span>
        </div>

        <div
          style={{
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 16,
            padding: 16,
            background: "rgba(255,255,255,0.04)",
          }}
        >
          <div style={{ fontWeight: 950, marginBottom: 6 }}>Intake Form (starter)</div>
          <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 14 }}>This is the MVP public renderer.</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <FieldLabel>Full name</FieldLabel>
              <TextInput
                value={payload.full_name}
                placeholder="Customer name"
                onChange={(e: any) => setPayload({ ...payload, full_name: e.target.value })}
              />
            </div>

            <div>
              <FieldLabel>Phone</FieldLabel>
              <TextInput
                value={payload.phone}
                placeholder="(555) 555-5555"
                onChange={(e: any) => setPayload({ ...payload, phone: e.target.value })}
              />
            </div>

            <div>
              <FieldLabel>Email</FieldLabel>
              <TextInput
                value={payload.email}
                placeholder="email@example.com"
                onChange={(e: any) => setPayload({ ...payload, email: e.target.value })}
              />
            </div>

            <div>
              <FieldLabel>Preferred contact</FieldLabel>
              <TextInput
                value={payload.preferred_contact}
                placeholder="Text / Call / Email"
                onChange={(e: any) => setPayload({ ...payload, preferred_contact: e.target.value })}
              />
            </div>
          </div>

          <div style={{ height: 12 }} />

          <div>
            <FieldLabel>What do you need help with?</FieldLabel>
            <TextArea
              value={payload.need_help_with}
              placeholder="Describe the issue / request..."
              onChange={(e: any) => setPayload({ ...payload, need_help_with: e.target.value })}
            />
          </div>

          <div style={{ height: 12 }} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <FieldLabel>Address (optional)</FieldLabel>
              <TextInput
                value={payload.address}
                placeholder="City, State"
                onChange={(e: any) => setPayload({ ...payload, address: e.target.value })}
              />
            </div>

            <div>
              <FieldLabel>Best time</FieldLabel>
              <TextInput
                value={payload.best_time}
                placeholder="Morning / Afternoon / Evening"
                onChange={(e: any) => setPayload({ ...payload, best_time: e.target.value })}
              />
            </div>
          </div>

          <div style={{ height: 14 }} />

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <PillButton disabled={submitting} onClick={submit}>
              {submitting ? "Submitting…" : "Submit Intake"}
            </PillButton>

            {ok ? <div style={{ fontWeight: 900, opacity: 0.95 }}>{ok}</div> : null}
            {err ? <div style={{ color: "tomato", fontWeight: 900 }}>Error: {err}</div> : null}
          </div>

          <div style={{ marginTop: 14, fontSize: 11, opacity: 0.7 }}>
            debug: slug=<span style={{ fontFamily: "monospace" }}>{slug}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PublicPage() {
  const { slug } = useParams();
  const [row, setRow] = useState<PublicPageRow | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const safeSlug = useMemo(() => (slug ?? "").trim(), [slug]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setErr(null);
      setRow(null);

      if (!safeSlug) {
        setErr("Missing slug.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("public_pages")
        .select("project_id, mode, slug")
        .eq("slug", safeSlug)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        setErr(error.message);
      } else if (!data) {
        setErr("Not found.");
      } else {
        setRow(data as PublicPageRow);
      }
      setLoading(false);
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [safeSlug]);

  if (loading) return <div style={{ padding: 16, minHeight: "100vh", background: "#000", color: "#fff" }}>Loading…</div>;
  if (err) return <div style={{ padding: 16, minHeight: "100vh", background: "#000", color: "#fff" }}>Public link error: {err}</div>;

  return <IntakePublicRenderer projectId={row!.project_id} slug={row!.slug} />;
}
