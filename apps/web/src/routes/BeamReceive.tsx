import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

function getOrCreateDeviceId(): string {
  const key = "hp_device_id";
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const id = crypto.randomUUID();
  localStorage.setItem(key, id);
  return id;
}

type ClaimResp = {
  claim_id?: string;
  open_url?: string | null;
  title?: string | null;
  card_type?: string | null;
  card_template_id?: string | null;
  card_payload?: any;
  session_id?: string | null;
  code?: string | null;
};

function normalizeClaim(data: any): ClaimResp | null {
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) return null;
  return row as ClaimResp;
}

function resolveTarget(row: ClaimResp, beamCode: string): string {
  const cardType = String(row.card_type ?? "").trim().toLowerCase();
  const openUrl = String(row.open_url ?? "").trim() || "/cards/measurement";
  const title = String(row.title ?? "").trim() || "Door Measurement Card";

  if (cardType === "measurement") {
    const params = new URLSearchParams();
    params.set("panel", "measurement");
    params.set("beam", "1");
    params.set("card_type", row.card_type || "measurement");
    params.set("title", title);
    params.set("open_url", openUrl);

    if (row.session_id) {
      params.set("session_id", row.session_id);
    } else if (row.claim_id) {
      params.set("session_id", row.claim_id);
    }

    if (row.code) {
      params.set("code", row.code);
    } else if (beamCode) {
      params.set("code", beamCode);
    }

    return `/planet/vehicles/awnit-demo?${params.toString()}`;
  }

  if (openUrl) return openUrl;

  return "/";
}

export default function BeamReceive() {
  const { sessionId } = useParams<{ sessionId: string }>();

  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [msg, setMsg] = useState("Claiming Beam...");
  const [debug, setDebug] = useState("");
  const [targetUrl, setTargetUrl] = useState("");

  const startedRef = useRef(false);
  const deviceId = useMemo(() => getOrCreateDeviceId(), []);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    let cancelled = false;

    async function run() {
      try {
        const code = (sessionId ?? "").trim();
        if (!code) throw new Error("Missing beam code");

        setStatus("loading");
        setMsg("Claiming Beam...");
        setDebug(`sessionId=${code}`);

        const { data, error } = await supabase.rpc("hp_beam_claim_session", {
          p_code: code,
          p_recipient_device_id: deviceId,
          p_recipient_presence_id: null,
        });

        if (error) throw error;

        const row = normalizeClaim(data);
        if (!row) throw new Error("No response from claim");

        const target = resolveTarget(row, code);
        const absoluteTarget = new URL(target, window.location.origin).toString();

        console.log("BEAM CLAIM OK", row);
        console.log("BEAM TARGET", target);
        console.log("BEAM ABSOLUTE TARGET", absoluteTarget);

        if (cancelled) return;

        setStatus("ok");
        setMsg("Beam claimed. Open the workspace.");
        setDebug(JSON.stringify(row, null, 2));
        setTargetUrl(absoluteTarget);
      } catch (e: any) {
        if (cancelled) return;

        const text = e?.message ?? String(e);
        console.error("BEAM CLAIM ERROR", e);

        setStatus("error");
        setMsg("Beam failed");
        setDebug(text);
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [sessionId, deviceId]);

  function openNow() {
    if (!targetUrl) return;
    window.location.assign(targetUrl);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex items-center justify-center">
      <div className="max-w-md w-full rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="text-lg font-semibold">HomePlanet Beam</div>
        <div className="mt-2 text-slate-300">{msg}</div>

        {status === "loading" && (
          <div className="mt-3 text-xs text-slate-400 whitespace-pre-wrap break-all">
            {debug}
          </div>
        )}

        {status === "error" && (
          <div className="mt-3 text-sm text-red-200 rounded-xl border border-red-700 bg-red-950/40 p-3">
            Beam failed.
            <div className="mt-2 text-xs text-red-200/80 whitespace-pre-wrap break-all">
              {debug}
            </div>
          </div>
        )}

        {status === "ok" && (
          <div className="mt-3 rounded-xl border border-emerald-700 bg-emerald-950/30 p-3">
            <div className="text-sm text-emerald-200">Claim succeeded.</div>

            <div className="mt-2 text-xs text-emerald-100/90 whitespace-pre-wrap break-all">
              {debug}
            </div>

            <div className="mt-3 text-xs text-slate-300">Target:</div>
            <a
              href={targetUrl || "/"}
              className="mt-1 block break-all text-sky-300 underline text-sm"
            >
              {targetUrl || "/"}
            </a>

            <button
              type="button"
              onClick={openNow}
              className="mt-4 w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-extrabold text-black hover:bg-emerald-400"
            >
              Open Workspace Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}