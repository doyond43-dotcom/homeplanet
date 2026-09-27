import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getSupabase } from "../lib/supabase";

type BackgroundKey = "black" | "charcoal" | "white" | "gray" | "cream";

type BlockType =
  | "whoWeAre"
  | "contactInfo"
  | "pricingNote"
  | "servicePills"
  | "requestForm"
  | "livePhotoWall"
  | "localNote"
  | "paymentBlock"
  | "bookNow";

type LiveBlock = {
  id: string;
  type: BlockType;
  label: string;
};
type StarterPageData = {
  name: string;
  city: string;
  service: string;
  phone: string;
  whoWeAre: string;
  pricingTitle: string;
  pricingText: string;
  localNoteTitle?: string;
  localNoteText?: string;
  paymentTitle?: string;
  paymentPrice?: string;
  paymentNote?: string;
  paymentUrl?: string;
  services: string[];
  heroPhoto: string;
  wallPhotos: string[];
  whoWeAreImage?: string;
  servicesImage?: string;
  logoImage?: string;
  footerLogoImage?: string;
  tagline?: string;
  headerButtonText?: string;
  footerMessage?: string;
  pageBackground?: BackgroundKey;
  whoWeAreLabel?: string;
  whoWeAreHeadline?: string;
  servicesLabel?: string;
  servicesHeadline?: string;
  servicesIntro?: string;
  galleryLabel?: string;
  galleryHeadline?: string;
  galleryText?: string;
  whyLabel?: string;
  whyHeadline?: string;
  ctaLabel?: string;
  ctaHeadline?: string;
  ctaText?: string;
  ctaButtonText?: string;
  blocks?: LiveBlock[];
  vibe?: "blue" | "emerald" | "sunset" | "midnight";
};

function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return digits ? `+${digits}` : "";
}

const fallbackPhotos = [
  "/images/sebastian-softwash-action-1.jpg",
  "/images/sebastian-softwash-action-2.jpg",
  "/images/sebastian-softwash-action-3.jpg",
  "/images/sebastian-softwash-action-4.jpg",
];

export default function StarterGeneratedLivePage() {
  const { slug } = useParams();
  const supabase = useMemo(() => getSupabase(), []);
  const [data, setData] = useState<StarterPageData | null>(null);
  const [loading, setLoading] = useState(true);

  const [requestName, setRequestName] = useState("");
  const [requestPhone, setRequestPhone] = useState("");
  const [requestService, setRequestService] = useState("");
  const [requestAddress, setRequestAddress] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [requestStatus, setRequestStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");

  useEffect(() => {
    let cancelled = false;

    async function loadPage() {
      if (!slug) {
        setLoading(false);
        return;
      }

      const { data: row, error } = await supabase
        .from("starter_live_pages")
        .select("page_data")
        .eq("slug", slug)
        .maybeSingle();

      if (!cancelled) {
        if (error) console.error("[starter_live_pages] load error:", error);
        setData((row?.page_data as StarterPageData) || null);
        setLoading(false);
      }
    }

    loadPage();

    return () => {
      cancelled = true;
    };
  }, [slug, supabase]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#05070d] p-6 text-white">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 text-center">
          <h1 className="text-2xl font-black">Loading live page...</h1>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#05070d] p-6 text-white">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 text-center">
          <h1 className="text-2xl font-black">Live page not found.</h1>
        </div>
      </main>
    );
  }

  const smsPhone = normalizePhone(data.phone);
  const phoneLabel = data.phone || smsPhone;
  const services = data.services?.length ? data.services : ["Driveways", "Patios", "Sidewalks", "Outdoor Cleanup"];
  const wallPhotos = Array.isArray(data.wallPhotos) ? data.wallPhotos : [];

  const defaultBlocks: LiveBlock[] = [
    { id: "whoWeAre", type: "whoWeAre", label: "Who We Are" },
    { id: "contactInfo", type: "contactInfo", label: "Contact Info" },
    { id: "pricingNote", type: "pricingNote", label: "Pricing Note" },
    { id: "servicePills", type: "servicePills", label: "Services" },
    { id: "requestForm", type: "requestForm", label: "Request Form" },
    { id: "livePhotoWall", type: "livePhotoWall", label: "Work Feed" },
    { id: "localNote", type: "localNote", label: "Local Note" },
    { id: "paymentBlock", type: "paymentBlock", label: "Payment Link" },
  ];

  const pageBlocks =
    (Array.isArray(data.blocks) && data.blocks.length > 0
      ? data.blocks
      : defaultBlocks
    ).filter(
      (block) =>
        block.type !== "bookNow" &&
        block.type !== "contactInfo" &&
        block.type !== "pricingNote" &&
        block.type !== "paymentBlock"
    );
  const themeKey = data.vibe || "blue";
  const theme = {
    blue: {
      border: "border-blue-500/20",
      softBorder: "border-blue-400/20",
      softBg: "bg-blue-500/10",
      text: "text-blue-200",
      textLight: "text-blue-700",
      textStrong: "text-blue-50",
      button: "from-blue-400 to-blue-600",
      shadow: "shadow-blue-950/40",
    },
    emerald: {
      border: "border-emerald-500/20",
      softBorder: "border-emerald-400/20",
      softBg: "bg-emerald-500/10",
      text: "text-emerald-200",
      textLight: "text-emerald-700",
      textStrong: "text-emerald-50",
      button: "from-emerald-400 to-emerald-600",
      shadow: "shadow-emerald-950/40",
    },
    sunset: {
      border: "border-rose-500/20",
      softBorder: "border-rose-400/20",
      softBg: "bg-rose-500/10",
      text: "text-rose-200",
      textLight: "text-rose-700",
      textStrong: "text-rose-50",
      button: "from-rose-400 to-orange-500",
      shadow: "shadow-rose-950/40",
    },
    midnight: {
      border: "border-slate-500/20",
      softBorder: "border-slate-400/20",
      softBg: "bg-slate-500/10",
      text: "text-slate-300",
      textStrong: "text-slate-100",
      button: "from-slate-600 to-slate-800",
      shadow: "shadow-black/50",
    },
  }[themeKey];
  const requestBody = encodeURIComponent(
  `Hey, I saw ${data.name}'s live page and wanted to request work. I can send a photo now.`
);

function serviceLink(service: string) {
  return `sms:${smsPhone}?body=${encodeURIComponent(
    `Hey ${data.name}, I'm interested in ${service.toLowerCase()}.`
  )}`;
}

  const pageBackgrounds: Record<BackgroundKey, {
    page: string;
    text: string;
    secondary: string;
    muted: string;
    faint: string;
    border: string;
    borderStrong: string;
    card: string;
    section: string;
    serviceCard: string;
    serviceHover: string;
    secondaryButton: string;
    noteBorder: string;
    isLight: boolean;
  }> = {
    black: {
      page: "bg-[#05070d]",
      text: "text-white",
      secondary: "text-slate-300",
      muted: "text-slate-400",
      faint: "text-slate-500",
      border: "border-white/10",
      borderStrong: "border-white/20",
      card: "bg-white/[0.05]",
      section: "bg-white/[0.035]",
      serviceCard: "bg-black/20",
      serviceHover: "hover:bg-white/[0.06]",
      secondaryButton: "border-white/10 bg-white/[0.08] text-white",
      noteBorder: "border-white/15",
      isLight: false,
    },
    charcoal: {
      page: "bg-[#15171c]",
      text: "text-white",
      secondary: "text-slate-300",
      muted: "text-slate-400",
      faint: "text-slate-500",
      border: "border-white/10",
      borderStrong: "border-white/20",
      card: "bg-white/[0.05]",
      section: "bg-white/[0.04]",
      serviceCard: "bg-black/20",
      serviceHover: "hover:bg-white/[0.07]",
      secondaryButton: "border-white/10 bg-white/[0.08] text-white",
      noteBorder: "border-white/15",
      isLight: false,
    },
    white: {
      page: "bg-white",
      text: "text-slate-950",
      secondary: "text-slate-700",
      muted: "text-slate-600",
      faint: "text-slate-500",
      border: "border-slate-200",
      borderStrong: "border-slate-300",
      card: "bg-slate-50",
      section: "bg-slate-50",
      serviceCard: "bg-white",
      serviceHover: "hover:bg-slate-100",
      secondaryButton: "border-slate-200 bg-slate-100 text-slate-950",
      noteBorder: "border-slate-300",
      isLight: true,
    },
    gray: {
      page: "bg-[#f1f3f5]",
      text: "text-slate-950",
      secondary: "text-slate-700",
      muted: "text-slate-600",
      faint: "text-slate-500",
      border: "border-slate-300/80",
      borderStrong: "border-slate-400/70",
      card: "bg-white",
      section: "bg-white",
      serviceCard: "bg-slate-50",
      serviceHover: "hover:bg-white",
      secondaryButton: "border-slate-300 bg-white text-slate-950",
      noteBorder: "border-slate-300",
      isLight: true,
    },
    cream: {
      page: "bg-[#f4eddf]",
      text: "text-stone-950",
      secondary: "text-stone-700",
      muted: "text-stone-600",
      faint: "text-stone-500",
      border: "border-stone-300/80",
      borderStrong: "border-stone-400/70",
      card: "bg-white/60",
      section: "bg-white/55",
      serviceCard: "bg-white/65",
      serviceHover: "hover:bg-white",
      secondaryButton: "border-stone-300 bg-white/70 text-stone-950",
      noteBorder: "border-stone-400/60",
      isLight: true,
    },
  };

  const backgroundKey = data.pageBackground || "black";
  const surface = pageBackgrounds[backgroundKey] || pageBackgrounds.black;
  const accentText = surface.isLight ? theme.textLight : theme.text;
  async function submitStarterRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!slug || !requestName.trim() || !requestPhone.trim()) return;

    setRequestStatus("sending");

    const { error } = await supabase.from("starter_requests").insert({
      live_page_slug: slug,
      business_name: data.name,
      customer_name: requestName.trim(),
      phone: requestPhone.trim(),
      service: requestService.trim(),
      address: requestAddress.trim(),
      message: requestMessage.trim(),
      status: "new",
    });

    if (error) {
      console.error("[starter_requests] insert error:", error);
      setRequestStatus("error");
      return;
    }

    const { error: emailError } = await supabase.functions.invoke(
      "send-starter-request-email",
      {
        body: {
          businessName: data.name,
          customerName: requestName.trim(),
          phone: requestPhone.trim(),
          service: requestService.trim(),
          address: requestAddress.trim(),
          message: requestMessage.trim(),
          livePageSlug: slug,
          boardUrl: `${window.location.origin}/planet/system/${encodeURIComponent(slug)}`,
        },
      }
    );

    if (emailError) {
      console.error(
        "[starter_requests] email notification error:",
        emailError
      );
    }

    setRequestStatus("sent");
    setRequestName("");
    setRequestPhone("");
    setRequestService("");
    setRequestAddress("");
    setRequestMessage("");
  }
  function renderPageBlock(block: LiveBlock) {
    if (block.type === "whoWeAre") {
      if (!data.whoWeAre?.trim() && !data.whoWeAreImage) return null;

      return (
        <section
          key={block.id}
          className="grid items-center gap-8 lg:grid-cols-[.95fr_1.05fr] lg:gap-14"
        >
          {data.whoWeAreImage && (
            <div className="relative overflow-hidden rounded-[2rem]">
              <img
                src={data.whoWeAreImage}
                alt={`${data.name} team`}
                className="h-80 w-full object-cover sm:h-[420px] lg:h-[500px]"
              />

              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />

              <div
                className={`absolute bottom-5 left-5 rounded-full border ${theme.softBorder} ${theme.softBg} px-4 py-2 text-xs font-black uppercase tracking-[0.2em] ${theme.text}`}
              >
                {data.city}
              </div>
            </div>
          )}

          <div className="lg:pr-6">
            <p
              className={`text-xs font-black uppercase tracking-[0.28em] ${accentText}`}
            >
              {data.whoWeAreLabel?.trim() || "Who We Are"}
            </p>

            <h2
              className={`mt-4 max-w-2xl text-4xl font-black leading-[0.98] tracking-tight sm:text-5xl ${surface.text}`}
            >
              {data.whoWeAreHeadline?.trim() ||
                "People want to know who they're hiring."}
            </h2>

            <p
              className={`mt-6 max-w-xl text-base leading-8 ${surface.secondary}`}
            >
              {data.whoWeAre}
            </p>

            <div
              className={`mt-7 h-1 w-20 rounded-full bg-gradient-to-r ${theme.button}`}
            />
          </div>
        </section>
      );
    }

    if (block.type === "contactInfo") {
      if (!smsPhone) return null;

      return (
        <section
          key={block.id}
          className={`rounded-[2rem] border ${surface.border} ${surface.section} p-7 sm:p-9`}
        >
          <p
            className={`text-xs font-black uppercase tracking-[0.28em] ${accentText}`}
          >
            Contact
          </p>

          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2
                className={`text-3xl font-black tracking-tight sm:text-4xl ${surface.text}`}
              >
                Ready when you are.
              </h2>

              <p className={`mt-3 text-base ${surface.muted}`}>
                Call or send a message and tell us what you need.
              </p>

              <a
                href={`tel:${smsPhone}`}
                className={`mt-4 inline-block text-lg font-black ${surface.text}`}
              >
                {phoneLabel}
              </a>
            </div>

            <div className="grid gap-2 sm:min-w-[280px] sm:grid-cols-2">
              <a
                href={`sms:${smsPhone}?&body=${requestBody}`}
                className={`flex h-12 items-center justify-center rounded-xl bg-gradient-to-b ${theme.button} px-5 text-sm font-black text-white`}
              >
                Message
              </a>

              <a
                href={`tel:${smsPhone}`}
                className={`flex h-12 items-center justify-center rounded-xl border px-5 text-sm font-black ${surface.secondaryButton}`}
              >
                Call
              </a>
            </div>
          </div>
        </section>
      );
    }

    if (block.type === "pricingNote") {
      if (!data.pricingTitle?.trim() && !data.pricingText?.trim()) return null;

      return (
        <section
          key={block.id}
          className={`rounded-[2rem] border ${theme.softBorder} ${theme.softBg} p-7 sm:p-9`}
        >
          <p
            className={`text-xs font-black uppercase tracking-[0.28em] ${accentText}`}
          >
            Pricing
          </p>

          {data.pricingTitle?.trim() && (
            <h2
              className={`mt-3 text-3xl font-black tracking-tight ${surface.text}`}
            >
              {data.pricingTitle}
            </h2>
          )}

          {data.pricingText?.trim() && (
            <p
              className={`mt-4 max-w-3xl text-base leading-7 ${surface.secondary}`}
            >
              {data.pricingText}
            </p>
          )}
        </section>
      );
    }

    if (block.type === "servicePills") {
      return (
        <section
          key={block.id}
          className={`overflow-hidden rounded-[2.2rem] border ${surface.border} ${surface.section}`}
        >
          <div className="grid lg:grid-cols-[.9fr_1.1fr]">
            <div className="p-7 sm:p-9 lg:p-12">
              <p
                className={`text-xs font-black uppercase tracking-[0.28em] ${accentText}`}
              >
                {data.servicesLabel?.trim() || "Services"}
              </p>

              <h2
                className={`mt-3 text-4xl font-black leading-none tracking-tight sm:text-5xl ${surface.text}`}
              >
                {data.servicesHeadline?.trim() || "What can we help with?"}
              </h2>

              <p
                className={`mt-4 max-w-lg text-base leading-7 ${surface.muted}`}
              >
                {data.servicesIntro?.trim() ||
                  "Choose what you need and get in touch."}
              </p>

              <div className="mt-8 grid gap-2 sm:grid-cols-2">
                {services.map((item, index) => (
                  <a
                    key={item}
                    href={serviceLink(item)}
                    className={`group flex min-h-[110px] flex-col justify-between rounded-[1.25rem] border ${theme.softBorder} ${surface.serviceCard} p-5 transition hover:-translate-y-0.5 ${surface.serviceHover}`}
                  >
                    <span className={`text-xs font-black ${accentText}`}>
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div>
                      <p
                        className={`text-lg font-black leading-tight ${surface.text}`}
                      >
                        {item}
                      </p>

                      <p className={`mt-2 text-xs ${surface.faint}`}>
                        Tap to ask about it -&gt;
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {data.servicesImage && (
              <div className="min-h-[360px] overflow-hidden bg-black lg:min-h-full">
                <img
                  src={data.servicesImage}
                  alt={`${data.name} services`}
                  className="h-full min-h-[360px] w-full object-cover object-[center_12%] lg:min-h-[620px]"
                />
              </div>
            )}
          </div>
        </section>
      );
    }

    if (block.type === "requestForm") {
      return (
        <section
          key={block.id}
          className={`overflow-hidden rounded-[2.2rem] border ${surface.border} ${surface.section}`}
        >
          <div className="grid gap-0 lg:grid-cols-[.8fr_1.2fr]">
            <div className="p-7 sm:p-9 lg:p-12">
              <p className={`text-xs font-black uppercase tracking-[0.28em] ${accentText}`}>
                Request Work
              </p>

              <h2 className={`mt-3 text-4xl font-black leading-none tracking-tight sm:text-5xl ${surface.text}`}>
                Tell us what you need.
              </h2>

              <p className={`mt-4 max-w-md text-base leading-7 ${surface.muted}`}>
                Send the details here and we'll have what we need to follow up with you.
              </p>

              <div className={`mt-8 border-t pt-6 ${surface.border}`}>
                <p className={`text-sm font-black ${surface.text}`}>
                  {data.name}
                </p>

                <p className={`mt-2 text-sm ${surface.muted}`}>
                  {data.city}
                </p>
              </div>
            </div>

            <form
              onSubmit={submitStarterRequest}
              className={`border-t p-7 sm:p-9 lg:border-l lg:border-t-0 lg:p-12 ${surface.border}`}
            >
              {requestStatus === "sent" ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-full ${theme.softBg} text-2xl`}>
                    ✓
                  </div>

                  <h3 className={`mt-5 text-2xl font-black ${surface.text}`}>
                    Request sent.
                  </h3>

                  <p className={`mt-3 max-w-sm text-sm leading-6 ${surface.muted}`}>
                    Your information was sent to {data.name}. They can follow up with you directly.
                  </p>

                  <button
                    type="button"
                    onClick={() => setRequestStatus("idle")}
                    className={`mt-6 text-sm font-black ${accentText}`}
                  >
                    Send another request
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      required
                      value={requestName}
                      onChange={(event) => setRequestName(event.target.value)}
                      placeholder="Your name"
                      className={`h-14 w-full rounded-2xl border px-4 text-sm outline-none ${surface.border} ${surface.card} ${surface.text}`}
                    />

                    <input
                      required
                      type="tel"
                      value={requestPhone}
                      onChange={(event) => setRequestPhone(event.target.value)}
                      placeholder="Phone number"
                      className={`h-14 w-full rounded-2xl border px-4 text-sm outline-none ${surface.border} ${surface.card} ${surface.text}`}
                    />
                  </div>

                  <select
                    value={requestService}
                    onChange={(event) => setRequestService(event.target.value)}
                    className={`h-14 w-full rounded-2xl border px-4 text-sm outline-none ${surface.border} ${surface.card} ${surface.text}`}
                  >
                    <option value="" style={{ color: "#64748b", backgroundColor: "#ffffff" }}>What do you need?</option>

                    {services.map((item) => (
                      <option key={item} value={item} style={{ color: "#0f172a", backgroundColor: "#ffffff" }}>
                        {item}
                      </option>
                    ))}

                    <option value="Other" style={{ color: "#0f172a", backgroundColor: "#ffffff" }}>Other</option>
                  </select>

                  <input
                    value={requestAddress}
                    onChange={(event) => setRequestAddress(event.target.value)}
                    placeholder="Service address or location"
                    className={`h-14 w-full rounded-2xl border px-4 text-sm outline-none ${surface.border} ${surface.card} ${surface.text}`}
                  />

                  <textarea
                    value={requestMessage}
                    onChange={(event) => setRequestMessage(event.target.value)}
                    rows={5}
                    placeholder="Tell us what you need..."
                    className={`w-full rounded-2xl border p-4 text-sm outline-none ${surface.border} ${surface.card} ${surface.text}`}
                  />

                  {requestStatus === "error" && (
                    <p className="text-sm font-bold text-rose-400">
                      Something went wrong. Please try again.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={requestStatus === "sending"}
                    className={`flex h-14 w-full items-center justify-center rounded-2xl bg-gradient-to-b ${theme.button} px-6 text-sm font-black text-white shadow-xl disabled:opacity-60`}
                  >
                    {requestStatus === "sending" ? "Sending..." : "Send Request"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </section>
      );
    }
    if (block.type === "livePhotoWall") {
      if (wallPhotos.length === 0) return null;

      return (
        <section key={block.id}>
          <div className="mb-7 max-w-2xl">
            <p
              className={`text-xs font-black uppercase tracking-[0.28em] ${accentText}`}
            >
              {data.galleryLabel?.trim() || "Work Feed"}
            </p>

            <h2
              className={`mt-3 text-4xl font-black tracking-tight sm:text-5xl ${surface.text}`}
            >
              {data.galleryHeadline?.trim() ||
                "See what we've been working on."}
            </h2>

            <p className={`mt-4 text-base leading-7 ${surface.muted}`}>
              {data.galleryText?.trim() ||
                "Photos, before-and-afters, and project updates from the work we're doing."}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {wallPhotos.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className={`overflow-hidden rounded-[1.5rem] ${
                  index === 0 ? "lg:col-span-2 lg:row-span-2" : ""
                }`}
              >
                <img
                  src={image}
                  alt={`${data.name} work`}
                  className={`w-full object-cover ${
                    index === 0
                      ? "h-72 sm:h-96 lg:h-full lg:min-h-[520px]"
                      : "h-64 lg:h-[255px]"
                  }`}
                />
              </div>
            ))}
          </div>        </section>
      );
    }

    if (block.type === "localNote") {
      if (!data.localNoteText?.trim()) return null;

      return (
        <section
          key={block.id}
          className={`border-l-2 pl-6 sm:pl-8 ${surface.noteBorder}`}
        >
          <p
            className={`text-xs font-black uppercase tracking-[0.28em] ${accentText}`}
          >
            {data.localNoteTitle || "A Note From Us"}
          </p>

          <p
            className={`mt-4 max-w-3xl text-lg leading-8 ${surface.secondary}`}
          >
            {data.localNoteText}
          </p>
        </section>
      );
    }

    if (block.type === "paymentBlock") {
      const hasPayment =
        data.paymentTitle?.trim() ||
        data.paymentPrice?.trim() ||
        data.paymentNote?.trim() ||
        data.paymentUrl?.trim();

      if (!hasPayment) return null;

      return (
        <section
          key={block.id}
          className={`rounded-[2rem] border ${theme.softBorder} ${surface.section} p-7 sm:p-9`}
        >
          <p
            className={`text-xs font-black uppercase tracking-[0.28em] ${accentText}`}
          >
            Payment
          </p>

          <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2
                className={`text-3xl font-black tracking-tight ${surface.text}`}
              >
                {data.paymentTitle?.trim() || "Payment"}
              </h2>

              {data.paymentPrice?.trim() && (
                <p className={`mt-3 text-4xl font-black ${surface.text}`}>
                  {data.paymentPrice}
                </p>
              )}

              {data.paymentNote?.trim() && (
                <p
                  className={`mt-3 max-w-xl text-sm leading-6 ${surface.muted}`}
                >
                  {data.paymentNote}
                </p>
              )}
            </div>

            {data.paymentUrl?.trim() && (
              <a
                href={data.paymentUrl}
                target="_blank"
                rel="noreferrer"
                className={`flex h-12 items-center justify-center rounded-xl bg-gradient-to-b ${theme.button} px-7 text-sm font-black text-white`}
              >
                Pay Now
              </a>
            )}
          </div>
        </section>
      );
    }

    return null;
  }
  return (
    <main className={`min-h-screen ${surface.page} ${surface.text}`}>
      <section className="mx-auto flex min-h-screen max-w-md flex-col px-4 py-5 lg:max-w-7xl lg:px-8 lg:py-10">
        <header className={`mb-6 flex items-center justify-between gap-4 border-b ${surface.border} py-2 pb-5 lg:mb-8 lg:py-3 lg:pb-6`}>
          <div className="min-w-0">
            {data.logoImage ? (
              <div className="flex items-center gap-3">
                <img
                  src={data.logoImage}
                  alt={`${data.name} logo`}
                  className="h-10 max-w-[160px] object-contain object-left sm:h-12 sm:max-w-[210px]"
                />
                <div className="hidden min-w-0 md:block">
                  <p className={`truncate text-sm font-black ${surface.text}`}>{data.name}</p>
                  <p className={`mt-1 text-[11px] ${surface.faint}`}>{data.tagline?.trim() || data.city}</p>
                </div>
              </div>
            ) : (
              <div>
                <p className={`truncate text-xl font-black tracking-tight sm:text-2xl ${surface.text}`}>{data.name}</p>
                <p className="mt-1 text-xs text-slate-500">{data.tagline?.trim() || data.city}</p>
              </div>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <a href={`tel:${smsPhone}`} className={`hidden h-10 items-center justify-center rounded-xl border px-4 text-xs font-black sm:flex ${surface.border} ${surface.text}`}>
              Call
            </a>
            <a href={`sms:${smsPhone}?&body=${requestBody}`} className={`flex h-10 items-center justify-center rounded-xl bg-gradient-to-b ${theme.button} px-4 text-xs font-black text-white sm:px-5`}>
              {data.headerButtonText?.trim() || "Get a Quote"}
            </a>
          </div>
        </header>

        <div className={`overflow-hidden rounded-[2.4rem] border ${theme.border} ${surface.card} shadow-2xl ${theme.shadow}`}>
          <div className="flex items-center justify-start px-5 py-4 lg:px-7">
            <div className={`rounded-full border ${theme.softBorder} ${theme.softBg} px-3 py-1 text-xs font-bold ${theme.text}`}>
              {data.city}
            </div>
          </div>

          <div className="overflow-hidden border-y border-white/10 bg-black">
            <img
              src={data.heroPhoto}
              alt={data.name}
              className="h-[420px] w-full object-cover object-top sm:h-[500px] lg:h-[600px]"
            />
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <h1 className="text-4xl font-black leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">{data.name}</h1>
            <p className={`mt-4 max-w-2xl text-base leading-relaxed sm:text-lg ${surface.secondary}`}>{data.service}</p>

            <div className="mt-7 grid gap-3 sm:max-w-xl sm:grid-cols-2">
              <a href={`sms:${smsPhone}?&body=${requestBody}`} className={`flex h-14 items-center justify-center rounded-2xl border ${theme.softBorder} bg-gradient-to-b ${theme.button} text-sm font-black text-white`}>
                Message
              </a>
              <a href={`tel:${smsPhone}`} className={`flex h-14 items-center justify-center rounded-2xl border text-sm font-black ${surface.secondaryButton}`}>
                Call
              </a>
            </div>

            <a href={`tel:${smsPhone}`} className={`mt-4 inline-block text-xs ${surface.muted}`}>
              Text or call: {phoneLabel}
            </a>
          </div>
        </div>
        <div className="mt-14 space-y-16 lg:mt-20 lg:space-y-24">

          {pageBlocks.map((block) => renderPageBlock(block))}

          <section className={`overflow-hidden rounded-[2.2rem] border ${theme.softBorder} bg-gradient-to-br ${theme.softBg} from-white/[0.03] to-black/70 p-7 sm:p-10 lg:p-12`}>
            <div className="max-w-4xl">
              <p className={`text-xs font-black uppercase tracking-[0.28em] ${theme.text}`}>
                {data.whyLabel?.trim() || "Why Us?"}
              </p>

              <h2 className="mt-4 text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-5xl">
                {data.whyHeadline?.trim() ||
                  "Because you shouldn't have to chase down the person you hired."}
              </h2>
            </div>

            <div className="mt-10 grid gap-8 md:grid-cols-3">
              <div className="border-t border-white/20 pt-5">
                <p className={`text-xs font-black ${theme.text}`}>01</p>
                <p className="mt-3 text-xl font-black text-white">
                  We Actually Answer
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Call or text. Ask a question. Send a photo. We keep the conversation moving.
                </p>
              </div>

              <div className="border-t border-white/20 pt-5">
                <p className={`text-xs font-black ${theme.text}`}>02</p>
                <p className="mt-3 text-xl font-black text-white">
                  We're Right Here
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Local work, local customers, and a direct way to reach us.
                </p>
              </div>

              <div className="border-t border-white/20 pt-5">
                <p className={`text-xs font-black ${theme.text}`}>03</p>
                <p className="mt-3 text-xl font-black text-white">
                  You'll See the Difference
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  The goal is simple: good work, clear communication, and an outcome you can see.
                </p>
              </div>
            </div>
          </section>
          <section className="relative overflow-hidden rounded-[2.4rem] border border-white/10">
            <img src={data.heroPhoto} alt="" className="absolute inset-0 h-full w-full object-cover object-center opacity-35" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/45" />

            <div className="relative p-8 sm:p-10 lg:flex lg:min-h-[360px] lg:items-center lg:justify-between lg:gap-12 lg:p-14">
              <div className="max-w-2xl">
                <p className={`text-xs font-black uppercase tracking-[0.28em] ${theme.text}`}>{data.ctaLabel?.trim() || "Got Something Dirty?"}</p>
                <h2 className="mt-4 text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-5xl">{data.ctaHeadline?.trim() || "Send us a photo. We'll tell you what it needs."}</h2>
                <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">{data.ctaText?.trim() || "No long forms. No guessing. Send it over and let's get it cleaned up."}</p>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:mt-0 lg:min-w-[420px]">
                <a href={`sms:${smsPhone}?&body=${requestBody}`} className={`flex h-14 items-center justify-center rounded-2xl bg-gradient-to-b ${theme.button} px-8 text-sm font-black text-white shadow-xl`}>
                  {data.ctaButtonText?.trim() || "Text for a Quote"}
                </a>
                <a href={`tel:${smsPhone}`} className="flex h-14 items-center justify-center rounded-2xl border border-white/20 bg-black/35 px-8 text-sm font-black text-white backdrop-blur">
                  Call Okey Dokie
                </a>
              </div>
            </div>
          </section>

          <footer className={`border-t pt-9 pb-5 ${surface.border}`}>
            <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-xl">
                {(data.footerLogoImage || data.logoImage) ? (
                  <img
                    src={data.footerLogoImage || data.logoImage}
                    alt={`${data.name} logo`}
                    className="h-14 max-w-[220px] object-contain object-left"
                  />
                ) : (
                  <p className={`text-xl font-black ${surface.text}`}>{data.name}</p>
                )}

                {data.footerMessage?.trim() ? (
                  <p className={`mt-4 max-w-md text-sm leading-6 ${surface.muted}`}>{data.footerMessage}</p>
                ) : (
                  <p className={`mt-3 text-sm ${surface.muted}`}>{data.service}</p>
                )}

                <p className={`mt-2 text-sm ${surface.faint}`}>{data.city}</p>
              </div>

              <div className="sm:text-right">
                <a href={`tel:${smsPhone}`} className={`text-sm font-black ${surface.text}`}>{phoneLabel}</a>
                {data.tagline?.trim() && (
                  <p className={`mt-2 text-xs ${surface.faint}`}>{data.tagline}</p>
                )}
                <p className="mt-4 text-[10px] uppercase tracking-[0.28em] text-slate-700">Powered by HomePlanet</p>
              </div>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}











