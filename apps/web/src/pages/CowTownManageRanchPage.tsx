import {
  ArrowLeft,
  Loader2,
  Save,
  ShieldCheck,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "./CowTownTags.css";

type RanchBoardData = {
  found: boolean;
  ranch?: {
    id: string;
    ranch_name: string;
    primary_contact_name: string;
    primary_phone: string;
    primary_email: string;
    recovery_phone: string | null;
    status: string;
  };
};

const fieldStyle = {
  width: "100%",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,.16)",
  background: "rgba(255,255,255,.04)",
  color: "inherit",
  padding: "12px 14px",
  font: "inherit",
} as const;

const labelStyle = {
  display: "grid",
  gap: 7,
  fontWeight: 700,
} as const;

export default function CowTownManageRanchPage() {
  const { managementToken = "" } = useParams();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [ranchName, setRanchName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [recoveryPhone, setRecoveryPhone] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadRanch() {
      setLoading(true);
      setLoadError("");

      const { data, error } = await supabase.rpc(
        "get_cow_town_ranch_board",
        {
          requested_management_token: managementToken,
        },
      );

      if (cancelled) return;

      const result = data as RanchBoardData | null;

      if (error || !result?.found || !result.ranch) {
        setLoadError("This ranch could not be opened with this private link.");
        setLoading(false);
        return;
      }

      setRanchName(result.ranch.ranch_name || "");
      setContactName(result.ranch.primary_contact_name || "");
      setPhone(result.ranch.primary_phone || "");
      setEmail(result.ranch.primary_email || "");
      setRecoveryPhone(result.ranch.recovery_phone || "");
      setLoading(false);
    }

    void loadRanch();

    return () => {
      cancelled = true;
    };
  }, [managementToken]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setSaveError("");
    setSaved(false);

    const { data, error } = await supabase.rpc(
      "update_cow_town_ranch_info",
      {
        requested_management_token: managementToken,
        requested_ranch_name: ranchName.trim(),
        requested_primary_contact_name: contactName.trim(),
        requested_primary_phone: phone.trim(),
        requested_primary_email: email.trim(),
        requested_recovery_phone: recoveryPhone.trim() || null,
      },
    );

    if (error || !data?.success) {
      setSaveError(error?.message || "Ranch information could not be saved.");
      setSaving(false);
      return;
    }

    setSaved(true);
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="cowtown-page">
        <main className="cowtown-shell" style={{ paddingTop: 48, paddingBottom: 80 }}>
          <div className="cowtown-kicker">Private ranch management</div>
          <h1>Loading ranch information...</h1>
        </main>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="cowtown-page">
        <main className="cowtown-shell" style={{ paddingTop: 48, paddingBottom: 80 }}>
          <div className="cowtown-kicker">Private ranch management</div>
          <h1>Ranch unavailable.</h1>
          <p>{loadError}</p>

          <Link
            className="cowtown-button cowtown-button-secondary"
            to={`/planet/cow-town-tags/ranch/${managementToken}`}
          >
            <ArrowLeft size={17} aria-hidden="true" />
            Back to Ranch Board
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="cowtown-page">
      <header className="cowtown-header">
        <div className="cowtown-shell cowtown-header-inner">
          <Link
            className="cowtown-brand"
            to={`/planet/cow-town-tags/ranch/${managementToken}`}
          >
            <span className="cowtown-brand-mark">CT</span>
            <span className="cowtown-brand-copy">
              <strong>Cow Town Tags</strong>
              <small>Manage Ranch Info</small>
            </span>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ShieldCheck size={17} aria-hidden="true" />
            <span>Private Access</span>
          </div>
        </div>
      </header>

      <main
        className="cowtown-shell"
        style={{ paddingTop: 36, paddingBottom: 80, maxWidth: 760 }}
      >
        <Link
          to={`/planet/cow-town-tags/ranch/${managementToken}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            color: "inherit",
            marginBottom: 26,
          }}
        >
          <ArrowLeft size={17} aria-hidden="true" />
          Ranch Board
        </Link>

        <section style={{ marginBottom: 28 }}>
          <div className="cowtown-kicker">Private ranch management</div>
          <h1 style={{ marginBottom: 8 }}>Manage Ranch Info</h1>
          <p style={{ marginTop: 0, opacity: 0.76 }}>
            Update the contact information used for your Cow Town ranch.
          </p>
        </section>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gap: 18 }}>
            <label style={labelStyle}>
              Ranch Name
              <input
                style={fieldStyle}
                autoComplete="organization"
                value={ranchName}
                onChange={(event) => setRanchName(event.target.value)}
                required
              />
            </label>

            <label style={labelStyle}>
              Contact Name
              <input
                style={fieldStyle}
                autoComplete="name"
                value={contactName}
                onChange={(event) => setContactName(event.target.value)}
                required
              />
            </label>

            <label style={labelStyle}>
              Phone
              <input
                style={fieldStyle}
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
              />
            </label>

            <label style={labelStyle}>
              Email
              <input
                style={fieldStyle}
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>

            <label style={labelStyle}>
              Recovery Phone
              <input
                style={fieldStyle}
                type="tel"
                autoComplete="tel"
                value={recoveryPhone}
                onChange={(event) => setRecoveryPhone(event.target.value)}
              />
            </label>
          </div>

          {saveError && (
            <div role="alert" style={{ marginTop: 18 }}>
              {saveError}
            </div>
          )}

          {saved && (
            <div role="status" aria-live="polite" style={{ marginTop: 18 }}>
              Ranch information saved.
            </div>
          )}

          <button
            className="cowtown-button cowtown-button-primary"
            type="submit"
            disabled={saving}
            style={{ marginTop: 24 }}
          >
            {saving ? <Loader2 size={18} aria-hidden="true" /> : <Save size={18} aria-hidden="true" />}
            {saving ? "Saving..." : "Save Ranch Info"}
          </button>
        </form>
      </main>
    </div>
  );
}



