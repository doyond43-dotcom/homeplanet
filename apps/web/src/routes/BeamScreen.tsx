import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { supabase } from "../lib/supabase";

type CreateResp = {
  session_id?: string;
  id?: string;
  code: string;
  expires_at?: string | null;
};

function secondsUntil(expiresAt?: string | null) {
  if (!expiresAt) return null;
  const t = new Date(expiresAt).getTime();
  if (!Number.isFinite(t)) return null;
  return Math.max(0, Math.floor((t - Date.now()) / 1000));
}

function buildBeamUrl(code: string) {
  const base = import.meta.env.VITE_BEAM_PUBLIC_ORIGIN || window.location.origin;
  return `${String(base).replace(/\/$/, "")}/beam/${code}`;
}

function buildDirectWorkspaceUrl(opts: {
  code: string;
  title: string;
  cardType: string;
  sessionId?: string | null;
}) {
  const params = new URLSearchParams();
  params.set("panel", "measurement");
  params.set("beam", "1");
  params.set("card_type", opts.cardType || "measurement");
  params.set("title", opts.title || "Door Measurement Card");
  params.set("open_url", "/cards/measurement");
  if (opts.sessionId) params.set("session_id", opts.sessionId);
  if (opts.code) params.set("code", opts.code);

  return `/planet/vehicles/awnit-demo?${params.toString()}`;
}

/**
 * Supabase RPC can return shapes like:
 *  - { code, expires_at, ... }
 *  - { hp_beam_create_session: { code, ... } }
 *  - { result: { code, ... } }
 *  - [ { ... } ]
 */
function unwrapSession(data: any): any {
  const d0 = Array.isArray(data) ? data[0] : data;
  if (!d0) return null;
  if (d0.hp_beam_create_session) return d0.hp_beam_create_session;
  if (d0.result) return d0.result;
  if (d0.data) return d0.data;
  return d0;
}

export default function BeamScreen() {
  const [title, setTitle] = useState("Door Measurement Card");
  const [cardType, setCardType] = useState("measurement");
  const [ttl, setTtl] = useState(120);

  const [creating, setCreating] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [resp, setResp] = useState<CreateResp | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const beamUrl = useMemo(() => {
    if (!resp?.code) return "";
    return buildBeamUrl(resp.code);
  }, [resp]);

  const directWorkspaceUrl = useMemo(() => {
    if (!resp?.code) return "";
    return buildDirectWorkspaceUrl({
      code: resp.code,
      title,
      cardType,
      sessionId: resp.session_id ?? resp.id ?? null,
    });
  }, [resp, title, cardType]);

  const secondsRemaining = useMemo(() => {
    void tick;
    return secondsUntil(resp?.expires_at);
  }, [resp, tick]);

  async function createBeam() {
    setErr(null);
    setCreating(true);
    setResp(null);
    setQrDataUrl(null);

    try {
      const { data, error } = await supabase.rpc("hp_beam_create_session_api", {
        p_title: title,
        p_card_type: cardType,
        p_ttl_seconds: ttl,
        p_max_claims: 1,
        p_business_id: null,
        p_node_id: null,
        p_card_template_id: null,
        p_card_payload: null,
      });

      if (error) throw error;

      const session = unwrapSession(data);

      const code = session?.code ?? session?.p_code ?? session?.beam_code ?? session?.session_code;
      if (!code) {
        console.log("Beam RPC raw data:", data);
        console.log("Beam RPC unwrapped session:", session);
        throw new Error("Beam create session returned no code");
      }

      const expires_at =
        session?.expires_at ??
        session?.p_expires_at ??
        session?.expires ??
        session?.expiresAt ??
        null;

      const normalized: CreateResp = {
        session_id: session?.session_id ?? session?.id ?? session?.session_uuid,
        id: session?.id ?? session?.session_id,
        code: String(code),
        expires_at: expires_at ? String(expires_at) : null,
      };

      setResp(normalized);

      const url = buildBeamUrl(String(code));
      const qr = await QRCode.toDataURL(url, { margin: 1, scale: 8 });
      setQrDataUrl(qr);
    } catch (e: any) {
      setErr(e?.message ?? String(e));
    } finally {
      setCreating(false);
    }
  }

  useEffect(() => {
    createBeam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 250);
    return () => clearInterval(id);
  }, []);

  const expired = secondsRemaining !== null ? secondsRemaining <= 0 : false;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-2xl font-semibold">Beam</h1>
          <button
            onClick={createBeam}
            disabled={creating}
            className="rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-2 text-sm disabled:opacity-50"
          >
            New Beam
          </button>
        </div>

        <div className="mt-3 rounded-xl bg-slate-900/60 border border-slate-800 p-3">
          <div className="text-sm text-slate-300">Beaming:</div>
          <div className="text-lg font-semibold">{title}</div>

          <div className="mt-3 grid grid-cols-1 gap-2">
            <label className="text-sm text-slate-300">
              Title
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2"
              />
            </label>

            <label className="text-sm text-slate-300">
              Card Type
              <input
                value={cardType}
                onChange={(e) => setCardType(e.target.value)}
                className="mt-1 w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2"
              />
            </label>

            <label className="text-sm text-slate-300">
              TTL seconds
              <input
                type="number"
                value={ttl}
                onChange={(e) => setTtl(parseInt(e.target.value || "120", 10))}
                className="mt-1 w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2"
                min={15}
                max={600}
              />
            </label>
          </div>
        </div>

        {err && (
          <div className="mt-3 rounded-xl border border-red-700 bg-red-950/40 p-3 text-red-200">
            {err}
          </div>
        )}

        {resp && (
          <div className="mt-3 rounded-xl bg-slate-900/60 border border-slate-800 p-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-300">
                Expires in{" "}
                <span className={expired ? "text-red-300" : "text-emerald-300"}>
                  {secondsRemaining === null ? "—" : `${secondsRemaining}s`}
                </span>
              </div>
              <div className="text-sm text-slate-300">
                Code: <span className="font-mono text-slate-100">{resp.code}</span>
              </div>
            </div>

            <div className="mt-3 flex flex-col items-center gap-3">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Beam QR"
                  className="rounded-xl border border-slate-800 bg-white p-2"
                />
              ) : (
                <div className="text-slate-400 text-sm">Generating QR…</div>
              )}

              <div className="w-full rounded-lg bg-slate-950 border border-slate-800 p-3">
                <div className="text-xs text-slate-400">Beam claim link:</div>

                {beamUrl ? (
                  <a
                    href={beamUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="break-all text-sm text-sky-300 underline"
                  >
                    {beamUrl}
                  </a>
                ) : (
                  <div className="break-all text-sm text-slate-300">—</div>
                )}
              </div>

              <div className="w-full rounded-lg border border-emerald-700 bg-emerald-950/20 p-3">
                <div className="text-xs text-emerald-300">Direct workspace link:</div>

                {directWorkspaceUrl ? (
                  <>
                    <a
                      href={directWorkspaceUrl}
                      className="mt-1 block break-all text-sm text-emerald-200 underline"
                    >
                      {directWorkspaceUrl}
                    </a>

                    <button
                      type="button"
                      onClick={() => window.location.assign(directWorkspaceUrl)}
                      className="mt-3 w-full rounded-lg bg-emerald-500 px-3 py-2 text-sm font-extrabold text-black hover:bg-emerald-400"
                    >
                      Open Workspace Direct Now
                    </button>
                  </>
                ) : (
                  <div className="break-all text-sm text-slate-300">—</div>
                )}
              </div>

              <div className="w-full rounded-lg bg-slate-950/40 border border-slate-800 p-3 text-xs text-slate-400">
                For now, use <span className="font-semibold text-slate-200">Open Workspace Direct Now</span> to
                validate the board + panel + card route. After that, we can come back and make Beam auto-open cleanly.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
