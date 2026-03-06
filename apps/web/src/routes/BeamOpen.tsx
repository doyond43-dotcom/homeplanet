import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function BeamOpen() {
  const { claimId } = useParams<{ claimId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const code = (claimId || "").trim();
    if (!code) return;

    navigate(`/beam/${encodeURIComponent(code)}`, { replace: true });
  }, [claimId, navigate]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex items-center justify-center">
      <div className="max-w-lg w-full mx-auto rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="text-xl font-semibold">Opening Beam…</div>
        <div className="mt-2 text-slate-300">
          Redirecting claim: <span className="font-mono">{claimId || "—"}</span>
        </div>

        <div className="mt-4 rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-slate-300">
          Sending this Beam to the live receive flow.
        </div>
      </div>
    </div>
  );
}