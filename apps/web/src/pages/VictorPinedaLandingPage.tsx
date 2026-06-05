import { Phone, Mail, Wrench, Shield, Clock, Award } from "lucide-react";

export default function VictorPinedaLandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div>
            <div>
              <div className="mb-4 mx-auto inline-flex rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-2 text-xs font-semibold tracking-widest text-sky-300">
                FLORIDA COOLING - SERVICE IN HOURS, NOT DAYS
              </div>

              <h1 className="mx-auto max-w-4xl text-center text-5xl font-black leading-tight md:text-7xl">
                Okeechobee's Trusted
                <span className="block text-sky-400">AC Service Specialist</span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-zinc-400">
                Real service. Real diagnostics. Real community impact.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <a
                  href="tel:8635321632"
                  className="rounded-xl bg-sky-500 px-6 py-4 font-semibold text-black"
                >
                  Call Victor
                </a>

                <a
                  href="sms:8635326671"
                  className="rounded-xl border border-white/20 px-6 py-4 font-semibold"
                >
                  Text Victor
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMMUNITY STORY */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-3xl border border-white/10 bg-zinc-950 p-8 md:p-12">
                    <h2 className="text-4xl font-black">More Than AC Repair</h2>

          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-zinc-300">
            What started as a normal service call became something much bigger.
            When the issue turned out to be worse than expected, Victor stepped
            up and helped make sure a local mother and her children had cool air
            again.
          </p>

          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-zinc-300">
            That's the kind of service people remember.
          </p>
        </div>
      </section>

      {/* FIELD PROOF */}
      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-zinc-950 p-8">
          <div className="grid items-center gap-5 md:grid-cols-[420px_1fr]">
            <video
              className="aspect-video w-full rounded-2xl border border-white/10 object-cover"
              controls
              playsInline
              preload="metadata"
            >
              <source src="/videos/victor-pineda-at-work.mp4" type="video/mp4" />
            </video>

            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-sky-400">
                Field Proof
              </div>

              <h2 className="mt-2 text-3xl font-black">
                Real HVAC Work
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                A quick field clip showing real diagnostics and repair work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="mb-8 text-4xl font-black">Why Okeechobee Calls Victor</h2>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10">
              <Wrench className="h-6 w-6 text-sky-400" />
            </div>
            <h3 className="text-xl font-bold">Diagnostics & Repairs</h3>
            <p className="mt-3 text-zinc-400">Diagnose first. Guess never.</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10">
              <Clock className="h-6 w-6 text-sky-400" />
            </div>
            <h3 className="text-xl font-bold">Emergency Service</h3>
            <p className="mt-3 text-zinc-400">Fast response when cooling matters most.</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10">
              <Shield className="h-6 w-6 text-sky-400" />
            </div>
            <h3 className="text-xl font-bold">Trusted Local Service</h3>
            <p className="mt-3 text-zinc-400">Built through reputation, not advertising.</p>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-3xl border border-white/10 bg-zinc-950 p-8">
          <h2 className="mb-8 text-4xl font-black">Built Through Experience</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3">
              <Award className="h-5 w-5 text-sky-400" />
              <span>11 Years HVAC Experience</span>
            </div>

            <div className="flex items-center gap-3">
              <Award className="h-5 w-5 text-sky-400" />
              <span>Lincoln College Of Technology</span>
            </div>

            <div className="flex items-center gap-3">
              <Award className="h-5 w-5 text-sky-400" />
              <span>Residential HVAC Specialist</span>
            </div>

            <div className="flex items-center gap-3">
              <Award className="h-5 w-5 text-sky-400" />
              <span>System Replacement And Repair</span>
            </div>
          </div>
        </div>
      </section>

      {/* COMMUNITY TIMELINE */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="mb-8 text-4xl font-black">Community Impact Timeline</h2>

        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
            Family AC Restored
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
            Community Recognition
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
            Emergency Service Response
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
            Future Customer Stories
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="border-t border-white/10 bg-zinc-950">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h2 className="text-5xl font-black">Need AC Help Today?</h2>

          <div className="mt-10 space-y-4 text-lg">
            <div className="flex items-center justify-center gap-3">
              <Phone className="h-5 w-5 text-sky-400" />
              <span>(863) 532-1632</span>
            </div>

            <div className="flex items-center justify-center gap-3">
              <Phone className="h-5 w-5 text-sky-400" />
              <span>(863) 532-6671</span>
            </div>

            <div className="flex items-center justify-center gap-3">
              <Mail className="h-5 w-5 text-sky-400" />
              <span>floridacoolingdesign@gmail.com</span>
            </div>
          </div>

          <div className="mt-10">
            <a
              href="tel:8635321632"
              className="inline-flex rounded-xl bg-sky-500 px-8 py-4 font-bold text-black"
            >
              Call Victor Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}








