import { useEffect, useMemo, useState, type ChangeEvent, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import {
  Camera,
  CarFront,
  CheckCircle2,
  Circle,
  Clock3,
  Loader2,
  ShieldCheck,
  Wrench,
} from "lucide-react";

import { supabase } from "../lib/supabase";
import NotFound from "../pages/NotFound";

type PublicPageRow = {
  id: string;
  slug: string;
};

type ServiceChoice = "safety-check" | "tires" | "brakes" | "not-sure" | null;
type CheckInMode = "waiting" | "dropoff" | null;
type SubmissionState = "idle" | "submitting" | "success" | "error";

type ReceiptPayload = {
  receiptId: string;
  submittedAt: string;
  customerName: string;
  vehicle: string;
  phone: string;
  service: Exclude<ServiceChoice, null>;
  mode: Exclude<CheckInMode, null>;
  photoName?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function trimOrEmpty(v: unknown) {
  try {
    return String(v ?? "").trim();
  } catch {
    return "";
  }
}

function safeNowIso() {
  try {
    return new Date().toISOString();
  } catch {
    return "";
  }
}

function formatNow(date = new Date()) {
  return date.toLocaleString([], {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function fixMojibakeOnce(input: string): string {
  if (!input) return input;
  const looksCorrupted = /Ã.|â€¢|â€™|â€œ|â€|â€“|â€”|Â /u.test(input);
  if (!looksCorrupted) return input;

  try {
    const bytes = Uint8Array.from(input, (c) => c.charCodeAt(0) & 0xff);
    const decoded = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
    return decoded || input;
  } catch {
    return input;
  }
}

function normalizeStringsDeep<T>(value: T): T {
  const seen = new WeakMap<object, unknown>();

  const walk = (v: unknown): unknown => {
    if (typeof v === "string") return fixMojibakeOnce(v);
    if (v === null || v === undefined) return v;
    if (typeof v !== "object") return v;

    if (seen.has(v as object)) return seen.get(v as object);

    if (Array.isArray(v)) {
      const arr: unknown[] = [];
      seen.set(v, arr);
      for (const item of v) arr.push(walk(item));
      return arr;
    }

    const obj: Record<string, unknown> = {};
    seen.set(v as object, obj);
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
      obj[k] = walk(val);
    }
    return obj;
  };

  return walk(value) as T;
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      return true;
    } catch {
      return false;
    }
  }
}

function serviceLabel(service: ServiceChoice) {
  switch (service) {
    case "safety-check":
      return "$25 Safety Check";
    case "tires":
      return "Tires";
    case "brakes":
      return "Brakes";
    case "not-sure":
      return "Not Sure";
    default:
      return "Not selected";
  }
}

function modeLabel(mode: CheckInMode) {
  switch (mode) {
    case "waiting":
      return "Waiting Here";
    case "dropoff":
      return "Dropping Off";
    default:
      return "Not selected";
  }
}

function buildRequestLine(service: ServiceChoice, mode: CheckInMode, vehicle: string) {
  const pieces = [
    service ? serviceLabel(service) : "Service not selected",
    mode ? modeLabel(mode) : "Check-in mode not selected",
    trimOrEmpty(vehicle) || "Vehicle not provided",
  ];
  return pieces.join(" • ");
}

function buildPreferenceLine(mode: CheckInMode) {
  if (mode === "waiting") return "Customer is waiting on-site";
  if (mode === "dropoff") return "Customer is dropping off";
  return "Check-in mode not selected";
}

async function fileToJpegDataUrl(file: File, maxW = 1280, maxH = 1280, quality = 0.82) {
  const typeOk = /^image\//i.test(file.type);
  if (!typeOk) throw new Error("Please choose an image file.");

  const url = URL.createObjectURL(file);

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error("Failed to load image."));
      i.src = url;
    });

    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;

    const wr = maxW / Math.max(1, w);
    const hr = maxH / Math.max(1, h);
    const r = Math.min(1, wr, hr);

    const nw = Math.max(1, Math.round(w * r));
    const nh = Math.max(1, Math.round(h * r));

    const canvas = document.createElement("canvas");
    canvas.width = nw;
    canvas.height = nh;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not available.");

    ctx.drawImage(img, 0, 0, nw, nh);
    return canvas.toDataURL("image/jpeg", quality);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function approxBytesFromDataUrl(dataUrl: string) {
  const idx = dataUrl.indexOf(",");
  if (idx < 0) return dataUrl.length;
  const b64 = dataUrl.slice(idx + 1);
  const pad = b64.endsWith("==") ? 2 : b64.endsWith("=") ? 1 : 0;
  return Math.max(0, Math.floor((b64.length * 3) / 4) - pad);
}

export default function PublicPage() {
  const params = useParams();
  const slug =
    (params as { slug?: string; id?: string })?.slug ||
    (params as { slug?: string; id?: string })?.id ||
    "";

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [page, setPage] = useState<PublicPageRow | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [service, setService] = useState<ServiceChoice>(null);
  const [mode, setMode] = useState<CheckInMode>(null);

  const [fullName, setFullName] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [phone, setPhone] = useState("");

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);

  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [receipt, setReceipt] = useState<ReceiptPayload | null>(null);
  const [lastPayloadJson, setLastPayloadJson] = useState<string | null>(null);

  const normalizedSlug = useMemo(() => {
    return String(slug || "")
      .trim()
      .replace(/^c\//i, "")
      .replace(/^\/+/, "")
      .replace(/\/+$/, "")
      .toLowerCase();
  }, [slug]);

  useEffect(() => {
    let alive = true;

    async function run() {
      setLoading(true);
      setPageError(null);
      setNotFound(false);
      setPage(null);

      if (!normalizedSlug) {
        setLoading(false);
        setNotFound(true);
        return;
      }

      const { data, error } = await supabase
        .from("public_pages")
        .select("id, slug")
        .eq("slug", normalizedSlug)
        .maybeSingle();

      if (!alive) return;

      if (error) {
        setLoading(false);
        setPageError(error.message || "Failed to load public page.");
        return;
      }

      if (!data) {
        setLoading(false);
        setNotFound(true);
        return;
      }

      setPage(normalizeStringsDeep(data) as PublicPageRow);
      setLoading(false);
    }

    run();

    return () => {
      alive = false;
    };
  }, [normalizedSlug]);

  const canContinueStep2 = !!service;
  const canContinueStep3 = !!service && !!mode;

  const fullNameOk = fullName.trim().length >= 2;
  const phoneOk = phone.trim().length >= 7;
  const readyToSubmit = !!service && !!mode && fullNameOk && phoneOk;

  const livePreview = useMemo(() => {
    return {
      title: fullName.trim() || "New customer",
      detail: buildRequestLine(service, mode, vehicle),
      preference: buildPreferenceLine(mode),
    };
  }, [fullName, service, mode, vehicle]);

  function resetForm() {
    setService(null);
    setMode(null);
    setFullName("");
    setVehicle("");
    setPhone("");
    setPhoto(null);
    setPhotoDataUrl(null);
    setPhotoName(null);
    setReceipt(null);
    setSubmissionState("idle");
    setErrorMessage("");
    setLastPayloadJson(null);
  }

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const next = event.target.files?.[0] ?? null;
    void (async () => {
      if (!next) return;

      setErrorMessage("");

      try {
        const dataUrl = await fileToJpegDataUrl(next, 1280, 1280, 0.82);
        const bytes = approxBytesFromDataUrl(dataUrl);
        if (bytes > 650_000) {
          throw new Error("Image too large. Try a smaller photo.");
        }

        setPhoto(next);
        setPhotoName(next.name);
        setPhotoDataUrl(dataUrl);
      } catch (err: unknown) {
        setPhoto(null);
        setPhotoName(null);
        setPhotoDataUrl(null);
        setErrorMessage(err instanceof Error ? err.message : "Failed to attach photo.");
      } finally {
        event.target.value = "";
      }
    })();
  }

  async function handleSubmit() {
    if (!page || !service || !mode || !readyToSubmit) return;

    try {
      setSubmissionState("submitting");
      setErrorMessage("");
      setReceipt(null);
      setLastPayloadJson(null);

      const seededCustomerReported = trimOrEmpty(livePreview.detail);

      const payload = normalizeStringsDeep({
        name: trimOrEmpty(fullName),
        vehicle: trimOrEmpty(vehicle),
        phone: trimOrEmpty(phone),
        preferred_contact: mode === "waiting" ? "Text" : "Call",
        message: seededCustomerReported,
        customer_reported: seededCustomerReported,
        service_choice: serviceLabel(service),
        checkin_mode: modeLabel(mode),
        client_ts: safeNowIso(),
        source: "qr_public",
        photo: photoDataUrl
          ? {
              name: photoName || "upload.jpg",
              mime: "image/jpeg",
              data_url: photoDataUrl,
            }
          : undefined,
      });

      const insertBase = {
        slug: page.slug,
        payload,
      };

      const clientReceipt =
        (globalThis as { crypto?: Crypto }).crypto?.randomUUID?.() ||
        `rcpt_${Date.now()}_${Math.random().toString(16).slice(2)}`;

      try {
        const { error } = await supabase
          .from("public_intake_submissions")
          .insert({
            ...insertBase,
            receipt_id: clientReceipt,
          } as never);

        if (error) throw error;
      } catch (firstErr) {
        const { error } = await supabase
          .from("public_intake_submissions")
          .insert(insertBase as never);

        if (error) throw error;

        void firstErr;
      }

      try {
        setLastPayloadJson(JSON.stringify(payload, null, 2));
      } catch {
        setLastPayloadJson(null);
      }

      try {
        window.localStorage.setItem("last_receipt_id", String(clientReceipt));
      } catch {}

      setReceipt({
        receiptId: String(clientReceipt),
        submittedAt: formatNow(),
        customerName: fullName.trim(),
        vehicle: vehicle.trim(),
        phone: phone.trim(),
        service,
        mode,
        photoName: photoName || undefined,
      });

      setSubmissionState("success");
    } catch (err: unknown) {
      setSubmissionState("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong saving the request. Please try again.",
      );
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08111d] text-white">
        <div className="mx-auto w-full max-w-[920px] px-4 py-5 sm:px-5 sm:py-6">
          <div className="rounded-[28px] border border-[#2d415a] bg-[#0d1826] p-5 text-[15px] font-semibold text-white shadow-[0_18px_50px_rgba(0,0,0,0.32)]">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return <NotFound />;
  }

  if (pageError || !page) {
    return (
      <div className="min-h-screen bg-[#08111d] text-white">
        <div className="mx-auto w-full max-w-[920px] px-4 py-5 sm:px-5 sm:py-6">
          <div className="rounded-[28px] border border-[#2d415a] bg-[#0d1826] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.32)]">
            <div className="text-[20px] font-semibold text-white">Public Intake</div>
            <div className="mt-3 text-[15px] font-medium text-[#ffd1d1]">
              {pageError || "Failed to load public page."}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08111d] text-white">
      <div className="mx-auto w-full max-w-[920px] px-4 py-5 sm:px-5 sm:py-6">
        <header className="rounded-[28px] border border-[#2d415a] bg-[#0d1826] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.32)] sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <div className="rounded-full border border-[#3b546f] bg-[#102033] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#dbe7f6]">
                  HomePlanet
                </div>
                <div className="rounded-full border border-[#3b546f] bg-[#102033] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#dbe7f6]">
                  Public Intake • {page.slug}
                </div>
              </div>

              <h1 className="mt-4 text-[28px] font-semibold leading-tight text-white sm:text-[34px]">
                Request logged. Proof-ready.
              </h1>
              <p className="mt-2 max-w-2xl text-[16px] leading-6 text-[#c6d3e3]">
                Scan. Tap. Pull in. Your request is time-stamped and visible the moment it lands.
              </p>
            </div>

            <div className="rounded-full border border-[#4d6886] bg-[#11263d] px-4 py-2 text-sm font-semibold text-[#dbe7f6]">
              Receipt-ready
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <InfoPill icon={CheckCircle2} text="Instant receipt" />
            <InfoPill icon={Clock3} text="Time-stamped" />
            <InfoPill icon={ShieldCheck} text="Verified intake" />
          </div>

          <div className="mt-4 rounded-[22px] border border-[#425770] bg-[#0f1d2d] p-4">
            <div className="text-[18px] font-semibold text-white">What happens next</div>
            <div className="mt-3 space-y-2 text-[16px] text-[#d3deeb]">
              <BulletLine text="Your request is saved immediately with a receipt ID." />
              <BulletLine text="A reviewer can see it the moment it lands." />
              <BulletLine text="No lost texts. No we never got it. Everything is logged." />
            </div>
          </div>
        </header>

        {submissionState === "success" && receipt ? (
          <section className="mt-5 rounded-[28px] border border-[#2b7a55] bg-[#10261c] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.32)]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#3f8f69] bg-[#123122] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d6f6e5]">
                  <CheckCircle2 className="h-4 w-4" />
                  Receipt Ready
                </div>

                <h2 className="mt-4 text-[28px] font-semibold text-white">You're checked in.</h2>
                <p className="mt-2 text-[16px] text-[#d3ebdf]">
                  Show this receipt if needed or wait for Taylor Creek to review your request.
                </p>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-[#4c6b58] bg-[#173425] px-4 py-2 text-sm font-semibold text-white"
              >
                New intake
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <ReceiptCard label="Receipt ID" value={receipt.receiptId} />
              <ReceiptCard label="Submitted" value={receipt.submittedAt} />
              <ReceiptCard label="Customer" value={receipt.customerName} />
              <ReceiptCard label="Vehicle" value={receipt.vehicle || "Not provided"} />
              <ReceiptCard label="Service" value={serviceLabel(receipt.service)} />
              <ReceiptCard label="Check-in" value={modeLabel(receipt.mode)} />
              <ReceiptCard label="Phone" value={receipt.phone} />
              <ReceiptCard label="Photo" value={receipt.photoName || "No photo attached"} />
            </div>

            <div className="mt-5 rounded-[20px] border border-[#355844] bg-[#13291e] p-4 text-[16px] leading-7 text-[#d8efe2]">
              Pull into the lot or see the front desk if directed. Your request is already in the system.
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={async () => {
                  const ok = await copyText(receipt.receiptId);
                  if (ok) alert("Receipt copied");
                }}
                className="rounded-full border border-[#4c6b58] bg-[#173425] px-4 py-2 text-sm font-semibold text-white"
              >
                Copy Receipt
              </button>

              <button
                type="button"
                onClick={async () => {
                  const summary =
                    `Receipt: ${receipt.receiptId}\n` +
                    `Slug: ${page.slug}\n` +
                    `Submitted: ${receipt.submittedAt}\n` +
                    `Customer: ${receipt.customerName}\n` +
                    `Vehicle: ${receipt.vehicle}\n` +
                    `Phone: ${receipt.phone}\n` +
                    `Service: ${serviceLabel(receipt.service)}\n` +
                    `Check-in: ${modeLabel(receipt.mode)}` +
                    (receipt.photoName ? `\nPhoto: ${receipt.photoName}` : "");
                  const ok = await copyText(summary);
                  if (ok) alert("Summary copied");
                }}
                className="rounded-full border border-[#4c6b58] bg-[#173425] px-4 py-2 text-sm font-semibold text-white"
              >
                Copy Summary
              </button>

              <button
                type="button"
                onClick={async () => {
                  if (!lastPayloadJson) return;
                  const ok = await copyText(lastPayloadJson);
                  if (ok) alert("JSON copied");
                }}
                disabled={!lastPayloadJson}
                className={cx(
                  "rounded-full border px-4 py-2 text-sm font-semibold",
                  lastPayloadJson
                    ? "border-[#4c6b58] bg-[#173425] text-white"
                    : "cursor-not-allowed border-[#355844] bg-[#13291e] text-[#82a08d]",
                )}
              >
                Copy JSON
              </button>
            </div>
          </section>
        ) : (
          <section className="mt-5 rounded-[28px] border border-[#2d415a] bg-[#0d1826] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.32)] sm:p-5">
            <div className="mb-4">
              <h2 className="text-[24px] font-semibold text-white sm:text-[28px]">3-Step Intake</h2>
              <p className="mt-1 text-[15px] text-[#c6d3e3]">
                Big buttons. Fast check-in. Minimal typing.
              </p>
            </div>

            <div className="space-y-4">
              <StepCard step="Step 1" title="What do you need?" active complete={!!service}>
                <div className="grid gap-3 sm:grid-cols-2">
                  <ServiceButton
                    icon={ShieldCheck}
                    label="$25 Safety Check"
                    sublabel="Fast check • great hook"
                    active={service === "safety-check"}
                    onClick={() => setService("safety-check")}
                  />
                  <ServiceButton
                    icon={CarFront}
                    label="Tires"
                    sublabel="Flat, wear, replacement"
                    active={service === "tires"}
                    onClick={() => setService("tires")}
                  />
                  <ServiceButton
                    icon={Wrench}
                    label="Brakes"
                    sublabel="Noise, grinding, inspection"
                    active={service === "brakes"}
                    onClick={() => setService("brakes")}
                  />
                  <ServiceButton
                    icon={Wrench}
                    label="Not Sure"
                    sublabel="Need help figuring it out"
                    active={service === "not-sure"}
                    onClick={() => setService("not-sure")}
                  />
                </div>
              </StepCard>

              <StepCard
                step="Step 2"
                title="How are you checking in?"
                active={canContinueStep2}
                complete={!!mode}
                muted={!canContinueStep2}
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <ModeButton
                    label="Waiting Here"
                    sublabel="I'm on-site now"
                    active={mode === "waiting"}
                    disabled={!canContinueStep2}
                    onClick={() => setMode("waiting")}
                  />
                  <ModeButton
                    label="Dropping Off"
                    sublabel="Leaving vehicle with shop"
                    active={mode === "dropoff"}
                    disabled={!canContinueStep2}
                    onClick={() => setMode("dropoff")}
                  />
                </div>
              </StepCard>

              <StepCard
                step="Step 3"
                title="Quick info"
                active={canContinueStep3}
                complete={readyToSubmit}
                muted={!canContinueStep3}
              >
                <div className="grid gap-4">
                  <div className="rounded-[20px] border border-[#324559] bg-[#0f1d2d] p-4">
                    <div className="text-[14px] font-semibold uppercase tracking-[0.16em] text-[#8fa6c0]">
                      Live preview
                    </div>
                    <div className="mt-3 text-[22px] font-semibold text-white">
                      {livePreview.title}
                    </div>
                    <div className="mt-2 text-[16px] leading-7 text-[#d0dceb]">
                      {livePreview.detail}
                    </div>
                    <div className="mt-2 text-[15px] text-[#9eb3ca]">
                      {livePreview.preference}
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <Field
                      label="Full name"
                      placeholder="Customer name"
                      value={fullName}
                      onChange={setFullName}
                      disabled={!canContinueStep3}
                      large
                    />
                    <Field
                      label="Vehicle"
                      placeholder="Year / Make / Model"
                      value={vehicle}
                      onChange={setVehicle}
                      disabled={!canContinueStep3}
                      large
                    />
                    <Field
                      label="Phone"
                      placeholder="(555) 555-5555"
                      value={phone}
                      onChange={setPhone}
                      disabled={!canContinueStep3}
                      large
                    />
                  </div>

                  <div className="rounded-[20px] border border-dashed border-[#4a647e] bg-[#101d2c] p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-[18px] font-semibold text-white">
                          <Camera className="h-5 w-5" />
                          Add a photo
                        </div>
                        <p className="mt-1 text-[15px] text-[#c6d3e3]">
                          Optional. Helpful for tire, brake, or visible issue proof.
                        </p>
                        {photoName ? (
                          <div className="mt-2 text-[15px] font-medium text-[#9fe8c1]">
                            Attached: {photoName}
                          </div>
                        ) : null}
                      </div>

                      <label
                        className={cx(
                          "inline-flex min-h-[56px] cursor-pointer items-center justify-center gap-2 rounded-full border px-5 py-3 text-[16px] font-semibold",
                          canContinueStep3
                            ? "border-[#7f95ad] bg-[#13263a] text-white"
                            : "cursor-not-allowed border-[#3a4c61] bg-[#101922] text-[#73869d]",
                        )}
                      >
                        <Camera className="h-5 w-5" />
                        {photoName ? "Replace photo" : "Upload"}
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                          onChange={handlePhotoChange}
                          disabled={!canContinueStep3}
                        />
                      </label>
                    </div>
                  </div>

                  {errorMessage ? (
                    <div className="rounded-[18px] border border-[#7a3434] bg-[#2a1414] px-4 py-3 text-[15px] text-[#ffd1d1]">
                      {errorMessage}
                    </div>
                  ) : null}

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!readyToSubmit || submissionState === "submitting" || !page}
                    className={cx(
                      "min-h-[64px] w-full rounded-[20px] px-6 text-[20px] font-semibold shadow-[0_14px_28px_rgba(0,0,0,0.22)] transition",
                      readyToSubmit && submissionState !== "submitting"
                        ? "bg-gradient-to-r from-[#12a9ff] to-[#10e66a] text-[#082033]"
                        : "cursor-not-allowed bg-[#243341] text-[#8da3bb]",
                    )}
                  >
                    {submissionState === "submitting" ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Saving request...
                      </span>
                    ) : (
                      "Confirm & Get Receipt"
                    )}
                  </button>
                </div>
              </StepCard>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function InfoPill({
  icon: Icon,
  text,
}: {
  icon: typeof CheckCircle2;
  text: string;
}) {
  return (
    <div className="inline-flex min-h-[54px] items-center gap-2 rounded-full border border-[#3b546f] bg-[#102033] px-4 py-3 text-[15px] font-semibold text-[#e4edf8]">
      <Icon className="h-5 w-5 text-[#7fe8b5]" />
      {text}
    </div>
  );
}

function BulletLine({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 h-3 w-3 rounded-full bg-[#20e06e]" />
      <div>{text}</div>
    </div>
  );
}

function StepCard({
  step,
  title,
  children,
  active,
  complete,
  muted = false,
}: {
  step: string;
  title: string;
  children: ReactNode;
  active: boolean;
  complete: boolean;
  muted?: boolean;
}) {
  return (
    <section
      className={cx(
        "rounded-[24px] border p-4 sm:p-5",
        muted
          ? "border-[#2d3d4e] bg-[#0b1520] opacity-70"
          : active
            ? "border-[#40617c] bg-[#0f1d2d]"
            : "border-[#324559] bg-[#0d1826]",
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#8ea5c0]">
            {step}
          </div>
          <h3 className="mt-1 text-[24px] font-semibold text-white">{title}</h3>
        </div>

        <div
          className={cx(
            "flex h-10 w-10 items-center justify-center rounded-full border",
            complete
              ? "border-[#3c8e67] bg-[#153225] text-[#9fe8c1]"
              : active
                ? "border-[#516a85] bg-[#12253a] text-[#d3e2f4]"
                : "border-[#33475a] bg-[#101a24] text-[#70839a]",
          )}
        >
          {complete ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-4 w-4" />}
        </div>
      </div>

      {children}
    </section>
  );
}

function ServiceButton({
  icon: Icon,
  label,
  sublabel,
  active,
  onClick,
}: {
  icon: typeof ShieldCheck;
  label: string;
  sublabel: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "flex min-h-[112px] w-full flex-col items-start justify-center rounded-[24px] border px-5 py-4 text-left transition",
        active
          ? "border-[#63a8ff] bg-[#122e4a] shadow-[0_0_0_1px_rgba(34,224,110,0.34),0_0_12px_rgba(34,224,110,0.16),0_0_22px_rgba(34,224,110,0.08),0_0_0_1px_rgba(99,168,255,0.25)]"
          : "border-[#43586f] bg-[#122132] shadow-[0_0_0_1px_rgba(34,224,110,0.12),0_0_10px_rgba(34,224,110,0.05)] hover:shadow-[0_0_0_1px_rgba(34,224,110,0.22),0_0_12px_rgba(34,224,110,0.08)]",
      )}
    >
      <Icon className={cx("h-7 w-7", active ? "text-[#82c7ff]" : "text-[#b9cbe0]")} />
      <div className="mt-3 text-[22px] font-semibold text-white">{label}</div>
      <div className="mt-1 text-[15px] text-[#c5d2e2]">{sublabel}</div>
    </button>
  );
}

function ModeButton({
  label,
  sublabel,
  active,
  disabled,
  onClick,
}: {
  label: string;
  sublabel: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cx(
        "flex min-h-[104px] w-full flex-col items-start justify-center rounded-[24px] border px-5 py-4 text-left transition",
        disabled
          ? "cursor-not-allowed border-[#33475a] bg-[#0f1823] text-[#71859b]"
          : active
            ? "border-[#63a8ff] bg-[#122e4a] shadow-[0_0_0_1px_rgba(34,224,110,0.34),0_0_12px_rgba(34,224,110,0.16),0_0_22px_rgba(34,224,110,0.08)]"
            : "border-[#43586f] bg-[#122132] shadow-[0_0_0_1px_rgba(34,224,110,0.12),0_0_10px_rgba(34,224,110,0.05)] hover:shadow-[0_0_0_1px_rgba(34,224,110,0.22),0_0_12px_rgba(34,224,110,0.08)]",
      )}
    >
      <div className={cx("text-[22px] font-semibold", disabled ? "text-[#71859b]" : "text-white")}>
        {label}
      </div>
      <div className={cx("mt-1 text-[15px]", disabled ? "text-[#6c8096]" : "text-[#c5d2e2]")}>
        {sublabel}
      </div>
    </button>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  disabled,
  large = false,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  large?: boolean;
}) {
  return (
    <label className="block">
      <div className="mb-2 text-[16px] font-semibold text-white">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className={cx(
          "w-full rounded-[20px] border bg-[#122132] px-5 text-white outline-none placeholder:text-[#8ea3ba] transition",
          large ? "min-h-[64px] text-[20px]" : "min-h-[56px] text-[18px]",
          disabled
            ? "cursor-not-allowed border-[#33475a] text-[#6f8399]"
            : "border-[#4a6178] shadow-[0_0_0_1px_rgba(34,224,110,0.12),0_0_10px_rgba(34,224,110,0.05)] focus:border-[#63a8ff] focus:shadow-[0_0_0_1px_rgba(34,224,110,0.34),0_0_12px_rgba(34,224,110,0.14),0_0_22px_rgba(34,224,110,0.07)]",
        )}
      />
    </label>
  );
}

function ReceiptCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-[#355844] bg-[#13291e] p-4">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#93c9ac]">
        {label}
      </div>
      <div className="mt-2 text-[18px] font-semibold text-white">{value}</div>
    </div>
  );
}