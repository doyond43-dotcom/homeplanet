import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getSupabase } from "../lib/supabase";

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
  const wallPhotos = data.wallPhotos?.length >= 3 ? data.wallPhotos : fallbackPhotos;
  const requestBody = encodeURIComponent(
  `Hey, I saw ${data.name}'s live page and wanted to request work. I can send a photo now.`
);

function serviceLink(service: string) {
  return `sms:${smsPhone}?body=${encodeURIComponent(
    `Hey ${data.name}, I’m interested in ${service.toLowerCase()}.`
  )}`;
}

  return (
    <main className="min-h-screen bg-[#05070d] text-white">
      <section className="mx-auto flex min-h-screen max-w-md flex-col px-4 py-5">
        <div className="rounded-[2rem] border border-blue-500/20 bg-white/5 p-4 shadow-2xl shadow-blue-950/40">
          <div className="mb-3 flex items-center justify-between">
            <div className="rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-200">
              {data.city}
            </div>
            <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold text-slate-200">
              Live Page
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-black">
            <img src={data.heroPhoto} alt={data.name} className="h-80 w-full object-cover object-top" />
          </div>

          <div className="pt-5">
            <h1 className="text-4xl font-black leading-none tracking-tight">{data.name}</h1>
            <p className="mt-3 text-base leading-relaxed text-slate-300">{data.service}</p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <a href={`sms:${smsPhone}?&body=${requestBody}`} className="flex h-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-gradient-to-b from-blue-400 to-blue-600 text-sm font-black text-white shadow-[0_0_30px_rgba(59,130,246,0.28)]">
              Message
            </a>
            <a href={`tel:${smsPhone}`} className="flex h-14 items-center justify-center rounded-2xl bg-white/[0.08] text-sm font-black text-white">
              Call
            </a>
          </div>

          <a href={`tel:${smsPhone}`} className="mt-3 block text-center text-xs text-slate-400">
            Text or call: {phoneLabel}
          </a>
        </div>

        <div className="mt-4 space-y-3">
          <section className="rounded-[1.6rem] border border-white/10 bg-white/[0.06] p-5">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">Who We Are</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">{data.whoWeAre}</p>
          </section>

          <section className="rounded-[1.6rem] border border-blue-400/20 bg-blue-500/10 p-5">
            <p className="text-sm font-black text-blue-100">{data.pricingTitle}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-200">{data.pricingText}</p>
          </section>

          <section className="grid grid-cols-2 gap-3">
            {services.map((item) => (
              <a
  key={item}
  href={serviceLink(item)}
  className="rounded-[1.4rem] border border-blue-400/20 bg-blue-500/10 p-4 shadow-[0_0_24px_rgba(59,130,246,0.08)] transition hover:bg-blue-500/15"
>
  <p className="font-black text-blue-50">{item}</p>
  <p className="mt-1 text-xs text-slate-400">Simple local work.</p>
</a>
            ))}
          </section>

          <section className="space-y-3">
            <p className="px-1 text-sm font-black uppercase tracking-wide text-blue-200">Live Photo Wall</p>
            <div className="grid grid-cols-2 gap-3">
              {wallPhotos.map((image, index) => (
                <div key={`${image}-${index}`} className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-black">
                  <img src={image} alt="Live work" className="h-56 w-full object-cover object-top" />
                </div>
              ))}
            </div>
          </section>

          {data.localNoteText && (
            <section className="rounded-[1.6rem] border border-blue-400/20 bg-blue-500/10 p-5">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-200">
                {data.localNoteTitle || "Local Note"}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-200">{data.localNoteText}</p>
            </section>
          )}

          <section className="rounded-[1.8rem] border border-blue-400/20 bg-gradient-to-b from-blue-500/10 to-black/40 p-5 shadow-[0_0_40px_rgba(59,130,246,0.12)]">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-200">Live Actions</p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <a href={`sms:${smsPhone}?&body=${requestBody}`} className="flex h-14 items-center justify-center rounded-2xl bg-white text-sm font-black text-black">
                Request Work
              </a>

              {data.paymentUrl ? (
                <a href={data.paymentUrl} target="_blank" rel="noreferrer" className="flex h-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-gradient-to-b from-blue-400 to-blue-600 text-sm font-black text-white shadow-[0_0_30px_rgba(59,130,246,0.28)]">
                  Pay Invoice
                </a>
              ) : (
                <a
  href={`sms:${smsPhone}?body=${encodeURIComponent(
    `Hey ${data.name}, can you send me the payment or invoice link?`
  )}`}
  className="flex h-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-gradient-to-b from-blue-400 to-blue-600 text-sm font-black text-white shadow-[0_0_30px_rgba(59,130,246,0.28)]"
>
  Pay Invoice
</a>
              )}

              <a href={`sms:${smsPhone}?body=${encodeURIComponent(`Hey ${data.name}, I wanted to leave a review for your work.`)}`} className="flex h-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-sm font-black text-blue-50 shadow-[0_0_24px_rgba(59,130,246,0.08)]">
                Leave Review
              </a>

              <a href={`sms:${smsPhone}?body=${encodeURIComponent(`Hey ${data.name}, I wanted to book a visit.`)}`} className="flex h-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-sm font-black text-blue-50 shadow-[0_0_24px_rgba(59,130,246,0.08)]">
                Book Visit
              </a>
            </div>
          </section>
          <section className="space-y-3 rounded-[2rem] border border-blue-400/20 bg-blue-500/10 p-6 shadow-[0_0_30px_rgba(59,130,246,0.08)]">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-blue-200">
              Recent Local Feedback
            </p>

            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm font-black tracking-wide text-blue-100">
                  5 STAR REVIEW
                </p>
                <p className="mt-2 text-sm text-slate-200">
                  "Super respectful and worked hard."
                </p>
                <p className="mt-2 text-xs uppercase tracking-wide text-slate-500">
                  Local homeowner
                </p>
              </div>
            </div>
          </section>
<div className="mt-12 border-t border-white/10 pt-6 text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Fueled by HomePlanet</p>
<p className="mt-3 text-[11px] text-slate-600">
  Live page updated recently.
</p>
            <a href="/planet/creator/starter" className="mt-3 inline-flex items-center rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-300">
              Launch your own live page.
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}










