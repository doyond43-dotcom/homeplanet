import { useParams } from "react-router-dom";

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
  services: string[];
  heroPhoto: string;
  wallPhotos: string[];
  vibe?: string;
};

function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return digits ? `+${digits}` : "";
}

export default function StarterGeneratedLivePage() {
  const { slug } = useParams();
  const saved = slug ? localStorage.getItem(`hp:starter-live-page:${slug}`) : null;
  const data = saved ? (JSON.parse(saved) as StarterPageData) : null;

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#060b14] p-6 text-white">
        <div className="max-w-md rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 text-center">
          <h1 className="text-2xl font-black">Live page not found.</h1>
          <p className="mt-3 text-sm text-slate-400">Go back to Creator and launch the page again.</p>
        </div>
      </main>
    );
  }

  const smsPhone = normalizePhone(data.phone);
  const phoneLabel = data.phone || smsPhone;
  const requestBody = encodeURIComponent(
    `Hey, I saw ${data.name}'s live page and wanted to request work. I can send a photo now.`
  );

  return (
    <main className="min-h-screen bg-[#05070d] text-white">
      <section className="mx-auto flex min-h-screen max-w-md flex-col px-4 py-5">
        <div className="mb-4 rounded-[2rem] border border-blue-500/20 bg-white/5 p-4 shadow-2xl shadow-blue-950/40">
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
            <a
              href={`sms:${smsPhone}?&body=${requestBody}`}
              className="flex items-center justify-center rounded-2xl bg-blue-500 px-4 py-4 text-sm font-black text-white"
            >
              Message
            </a>

            <a
              href={`tel:${smsPhone}`}
              className="flex items-center justify-center rounded-2xl bg-white/[0.08] px-4 py-4 text-sm font-black text-white"
            >
              Call
            </a>
          </div>

          <a href={`tel:${smsPhone}`} className="mt-3 block text-center text-xs text-slate-400">
            Text or call: {phoneLabel}
          </a>
        </div>

        <div className="space-y-3">
          <section className="rounded-[1.6rem] border border-white/10 bg-white/[0.06] p-5">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">Who We Are</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">{data.whoWeAre}</p>
          </section>

          <section className="rounded-[1.6rem] border border-blue-400/20 bg-blue-500/10 p-5">
            <p className="text-sm font-black text-blue-100">{data.pricingTitle}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-200">{data.pricingText}</p>
          </section>

          <section className="grid grid-cols-2 gap-3">
            {data.services.map((item) => (
              <div
                key={item}
                className="rounded-[1.4rem] border border-blue-400/20 bg-blue-500/10 p-4 shadow-[0_0_24px_rgba(59,130,246,0.08)]"
              >
                <p className="font-black text-blue-50">{item}</p>
                <p className="mt-1 text-xs text-slate-400">Simple local work.</p>
              </div>
            ))}
          </section>

          <section className="space-y-3">
            <p className="px-1 text-sm font-black uppercase tracking-wide text-blue-200">Live Photo Wall</p>
            <div className="grid grid-cols-2 gap-3">
              {data.wallPhotos.map((image) => (
                <div key={image} className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-black">
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

          <a
            href={`sms:${smsPhone}?&body=${requestBody}`}
            className="flex items-center justify-between rounded-[1.5rem] bg-white px-5 py-5 text-base font-black text-black"
          >
            Request Work
            <span>→</span>
          </a>

          <div className="mt-12 border-t border-white/10 pt-6 text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Fueled by HomePlanet</p>
            <a
              href="/planet/creator/starter"
              className="mt-3 inline-flex items-center rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-300"
            >
              Launch your own live page.
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
