import { useState } from "react";
import { CalendarCheck, Camera, Home, Heart, Sparkles } from "lucide-react";

export default function OnlyTheEssentialsRequestPage() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#07080d] text-white">
        <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-6">
          <div className="w-full rounded-[2rem] border border-pink-300/20 bg-pink-950/20 p-8 text-center">
            <Heart className="mx-auto mb-4 text-pink-300" size={42} />
            <h1 className="text-4xl font-black">Request Received ❤️</h1>
            <p className="mt-4 text-zinc-300">
              Thank you for reaching out.
            </p>
            <p className="mt-2 text-sm text-zinc-400">
              Kaitlin will review your request and contact you soon.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07080d] text-white">
      <div className="mx-auto max-w-3xl px-5 py-10">

        <div className="mb-10 text-center">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-pink-300">
            Only The Essentials Cleaning
          </p>

          <h1 className="mt-4 text-5xl font-black">
            Request Cleaning
          </h1>

          <p className="mt-4 text-zinc-300">
            Tell us a little about your home and what you need help with.
          </p>
        </div>

        <div className="space-y-6">

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles size={18} />
              <h2 className="font-black">Service Needed</h2>
            </div>

            <select className="w-full rounded-xl border border-white/10 bg-black/30 p-3">
              <option>Standard Cleaning</option>
              <option>Deep Cleaning</option>
              <option>Move-In / Move-Out</option>
              <option>Vacation Rental Reset</option>
              <option>Weekly / Biweekly</option>
              <option>Home Organization</option>
              <option>Other</option>
            </select>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <div className="mb-4 flex items-center gap-2">
              <Home size={18} />
              <h2 className="font-black">Property Details</h2>
            </div>

            <div className="grid gap-3">
              <input placeholder="Property Address" className="rounded-xl border border-white/10 bg-black/30 p-3" />
              <input placeholder="Bedrooms" className="rounded-xl border border-white/10 bg-black/30 p-3" />
              <input placeholder="Bathrooms" className="rounded-xl border border-white/10 bg-black/30 p-3" />
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h2 className="mb-4 font-black">Condition</h2>

            <select className="w-full rounded-xl border border-white/10 bg-black/30 p-3">
              <option>Light</option>
              <option>Average</option>
              <option>Heavy</option>
              <option>Not Sure</option>
            </select>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <div className="mb-4 flex items-center gap-2">
              <CalendarCheck size={18} />
              <h2 className="font-black">Timing</h2>
            </div>

            <select className="w-full rounded-xl border border-white/10 bg-black/30 p-3">
              <option>ASAP</option>
              <option>This Week</option>
              <option>Next Week</option>
              <option>Flexible</option>
            </select>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <div className="mb-4 flex items-center gap-2">
              <Camera size={18} />
              <h2 className="font-black">Photos</h2>
            </div>

            <input
              type="file"
              multiple
              className="w-full rounded-xl border border-white/10 bg-black/30 p-3"
            />

            <p className="mt-2 text-sm text-zinc-400">
              Photos help provide a more accurate estimate.
            </p>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h2 className="mb-4 font-black">Contact Information</h2>

            <div className="grid gap-3">
              <input placeholder="Name" className="rounded-xl border border-white/10 bg-black/30 p-3" />
              <input placeholder="Phone" className="rounded-xl border border-white/10 bg-black/30 p-3" />
              <input placeholder="Email (Optional)" className="rounded-xl border border-white/10 bg-black/30 p-3" />
            </div>
          </section>

          <section className="rounded-[2rem] border border-pink-300/20 bg-pink-950/20 p-6">
            <p className="font-semibold text-pink-200">
              Most cleanings start at $40/hour.
            </p>

            <p className="mt-2 text-sm text-zinc-300">
              Final pricing depends on size, condition, and requested services.
            </p>
          </section>

          <button
            onClick={() => setSubmitted(true)}
            className="w-full rounded-2xl bg-pink-400 py-4 font-black text-black"
          >
            Submit Request
          </button>

        </div>
      </div>
    </main>
  );
}
