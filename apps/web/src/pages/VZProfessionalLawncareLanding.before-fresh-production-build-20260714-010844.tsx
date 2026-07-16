import { MessageCircle, Phone } from "lucide-react";

export default function VZProfessionalLawncareLanding() {
  const phone = "8635328123";

  return (
    <main className="min-h-screen bg-[#0b0c0b] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
          <a href="/vz" className="text-white no-underline">
            <p className="text-lg font-black leading-none">
              V&amp;Z Professional Lawncare LLC
            </p>
          </a>

          <div className="flex items-center gap-2">
            <a
              href={`sms:${phone}`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 px-4 text-xs font-black uppercase tracking-[0.14em] text-white"
            >
              <MessageCircle size={15} />
              Text Eric
            </a>

            <a
              href={`tel:${phone}`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 text-xs font-black uppercase tracking-[0.14em] text-black"
            >
              <Phone size={15} />
              Call
            </a>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12">
        <p className="text-sm text-zinc-500">
          Header approved first. Hero comes next.
        </p>
      </section>
    </main>
  );
}