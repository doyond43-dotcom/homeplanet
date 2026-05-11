import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSupabase } from "../lib/supabase";

type CreatorMomentData = {
  title?: string;
  subtitle?: string;
  businessName?: string;
  businessType?: string;
  city?: string;
  currentWorkflow?: string;
  biggestFriction?: string;
  customerQuestions?: string;
  wantsBuilt?: string;
  holyShiftMoment?: string;
  boardSlug?: string;
  liveBoardRoute?: string;
  createdAt?: string;
};

function readQuerySlug() {
  return new URLSearchParams(window.location.search).get("boardSlug") || "";
}

function formatMomentTime(value?: string) {
  if (!value) return "Just now";

  try {
    return new Date(value).toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "Just now";
  }
}

export default function CreatorMomentPage() {
  const navigate = useNavigate();
  const params = useParams();
  const slug = params.slug || readQuerySlug() || "starter-board";

  const [loading, setLoading] = useState(true);
  const [moment, setMoment] = useState<CreatorMomentData | null>(null);

  useEffect(() => {
    let alive = true;

    async function loadMoment() {
      setLoading(true);

      let localMoment: CreatorMomentData | null = null;

      try {
        const raw = localStorage.getItem(`creator-studio:${slug}:moment`);
        if (raw) localMoment = JSON.parse(raw) as CreatorMomentData;
      } catch {}

      try {
        const { data, error } = await getSupabase()
          .from("creator_moments")
          .select("slug,title,subtitle,data,created_at,updated_at")
          .eq("slug", slug)
          .maybeSingle();

        if (!alive) return;

        if (!error && data) {
          const serverData = (data.data || {}) as CreatorMomentData;
          setMoment({
            ...serverData,
            title: data.title || serverData.title,
            subtitle: data.subtitle || serverData.subtitle,
            boardSlug: data.slug || serverData.boardSlug,
            createdAt: serverData.createdAt || data.created_at,
          });
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error("Creator moment load error:", error);
      }

      if (!alive) return;

      setMoment(localMoment);
      setLoading(false);
    }

    loadMoment();

    return () => {
      alive = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#07111f] px-5 py-10 text-white">
        <section className="mx-auto max-w-3xl rounded-[32px] border border-white/10 bg-white/5 p-6">
          <h1 className="text-4xl font-black">Creator Moment</h1>
          <p className="mt-3 text-white/65">Loading saved moment...</p>
        </section>
      </main>
    );
  }

  if (!moment) {
    return (
      <main className="min-h-screen bg-[#07111f] px-5 py-10 text-white">
        <section className="mx-auto max-w-3xl rounded-[32px] border border-white/10 bg-white/5 p-6">
          <h1 className="text-4xl font-black">Creator Moment</h1>
          <p className="mt-3 text-white/65">No saved moment found for this slug yet.</p>

          <button
            type="button"
            onClick={() => navigate("/planet/creator/studio")}
            className="mt-5 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white"
          >
            Back to Creator Studio
          </button>
        </section>
      </main>
    );
  }

  const title = moment.title || moment.businessName || "Creator Moment";
  const subtitle = moment.subtitle || moment.businessType || "Creator City build";
  const liveBoardRoute = moment.liveBoardRoute || `/planet/live/${moment.boardSlug || slug}`;
  const operationalSystem = (moment as any).operationalSystem;
  const operationalStages = Array.isArray(operationalSystem?.stages) ? operationalSystem.stages : [];
  const operationalFeatures = [
    operationalSystem?.customerFrontDoor ? "Customer front door" : null,
    operationalSystem?.liveBoard ? "Live board" : null,
    operationalSystem?.staffBoard ? "Staff board" : null,
    operationalSystem?.requestFlow ? "Request flow" : null,
    operationalSystem?.jobDrawer ? "Job drawer" : null,
    operationalSystem?.messages ? "Messages" : null,
    operationalSystem?.scheduling ? "Scheduling" : null,
    operationalSystem?.photoProof ? "Photo proof" : null,
    operationalSystem?.paymentQr ? "QR payment" : null,
    operationalSystem?.proofTimeline ? "Proof timeline" : null,
  ].filter(Boolean);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_12%_10%,rgba(56,189,248,0.16),transparent_30%),radial-gradient(circle_at_86%_8%,rgba(34,197,94,0.10),transparent_28%),#07111f] px-5 py-8 text-white">
      <section className="mx-auto max-w-4xl rounded-[34px] border border-cyan-300/15 bg-white/5 p-6 shadow-2xl">
        <div className="inline-flex rounded-full border border-cyan-300/25 bg-cyan-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-100">
          Creator Moment Saved
        </div>

        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">{title}</h1>
        <p className="mt-3 text-lg font-semibold text-cyan-100">{subtitle}</p>

        
        {operationalSystem ? (
          <section className="mt-6 rounded-[28px] border border-emerald-300/20 bg-emerald-400/[0.07] p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.22em] text-emerald-100/80">
                  Operational System Generated
                </div>
                <h2 className="mt-2 text-2xl font-black text-white">
                  {operationalSystem.label || "HomePlanet Live System"}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
                  This business now carries real workflow DNA: customer intake, live board, staff view, job details, proof, payment, and completion tracking.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate(liveBoardRoute)}
                className="rounded-2xl border border-emerald-200/25 bg-emerald-300/15 px-5 py-3 text-sm font-black text-emerald-50"
              >
                Open Live Board
              </button>
            </div>

            {operationalFeatures.length ? (
              <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                {operationalFeatures.map((feature) => (
                  <div key={String(feature)} className="rounded-2xl border border-white/10 bg-black/25 px-3 py-3 text-xs font-bold text-white/80">
                    {feature}
                  </div>
                ))}
              </div>
            ) : null}

            {operationalStages.length ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {operationalStages.map((stage: any, index: number) => (
                  <div key={stage.id || stage.label || index} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                    <div className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-100/60">
                      Step {index + 1}
                    </div>
                    <div className="mt-1 text-sm font-black text-white">{stage.label}</div>
                    <p className="mt-1 text-sm leading-5 text-white/60">{stage.description}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </section>
        ) : null}

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-white/40">City</div>
            <div className="mt-1 font-bold">{moment.city || "Not listed"}</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-white/40">Build Type</div>
            <div className="mt-1 font-bold">{moment.wantsBuilt || "Business system"}</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-white/40">Saved</div>
            <div className="mt-1 font-bold">{formatMomentTime(moment.createdAt)}</div>
          </div>
        </div>

        <div className="mt-5 rounded-3xl border border-white/10 bg-black/25 p-5">
          <div className="text-xs font-bold uppercase tracking-[0.22em] text-white/40">
            Workflow Snapshot
          </div>

          <div className="mt-4 grid gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
              <div className="text-sm font-bold text-white">Current workflow</div>
              <p className="mt-1 text-sm leading-6 text-white/65">
                {moment.currentWorkflow || "No workflow entered."}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
              <div className="text-sm font-bold text-white">Biggest friction</div>
              <p className="mt-1 text-sm leading-6 text-white/65">
                {moment.biggestFriction || "No friction entered."}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
              <div className="text-sm font-bold text-white">Holy shift moment</div>
              <p className="mt-1 text-sm leading-6 text-white/65">
                {moment.holyShiftMoment || "No moment entered."}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={liveBoardRoute}
            className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-black"
          >
            Open Live Board
          </a>

          <a
            href={`/planet/demo/events?board=creator-city`}
            className="rounded-2xl border border-cyan-300/25 bg-cyan-400/10 px-5 py-3 text-sm font-black text-cyan-100"
          >
            Live Reporting
          </a>

          <button
            type="button"
            onClick={() => navigate("/planet/creator")}
            className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white/80"
          >
            Back to Creator City
          </button>
        </div>
      </section>
    </main>
  );
}


