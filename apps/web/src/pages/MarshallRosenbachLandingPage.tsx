import {
  ArrowRight,
  Bike,
  Car,
  CheckCircle2,
  Phone,
  ShieldCheck,
  TrainFront,
  Truck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import MarshallRosenbachFooter from "../components/MarshallRosenbachFooter";
import ShareMetadata from "../components/ShareMetadata";

const PAGE_TITLE =
  "Marshall E. Rosenbach | Personal Injury Attorney | North Palm Beach, FL";
const PAGE_DESCRIPTION =
  "Speak directly with personal injury attorney Marshall E. Rosenbach. Serving clients in Florida and California with free initial case reviews.";

const caseTypes = [
  { label: "Car Accident", slug: "car-accident", icon: Car },
  { label: "Truck Accident", slug: "truck-accident", icon: Truck },
  { label: "Motorcycle Accident", slug: "motorcycle-accident", icon: Bike },
  { label: "Train Collision", slug: "train-collision", icon: TrainFront },
  { label: "Bicycle Accident", slug: "bicycle-accident", icon: Bike },
  { label: "Pedestrian Accident", slug: "pedestrian-accident", icon: ShieldCheck },
];

export default function MarshallRosenbachLandingPage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#0c0d0f] text-white">
      <ShareMetadata
        title={PAGE_TITLE}
        description={PAGE_DESCRIPTION}
        image="https://www.homeplanet.city/homeplanet-favicon.svg"
        url="https://www.homeplanet.city/planet/marshall-rosenbach"
      />
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(190,143,61,0.18),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent_30%)]" />

        <div className="relative mx-auto flex min-h-[720px] max-w-6xl flex-col px-5 pb-14 pt-6 sm:px-8 lg:px-10">
          <header className="flex items-center justify-between border-b border-white/10 pb-5">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#c99a45]">
                Law Offices of
              </div>
              <div className="mt-1 text-lg font-bold tracking-[0.08em]">
                MARSHALL E. ROSENBACH
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/planet/marshall-rosenbach/case-review")}
              className="hidden rounded-full border border-[#c99a45]/60 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-[#e2bd79] transition hover:bg-[#c99a45] hover:text-black sm:block"
            >
              Free Case Review
            </button>
          </header>

          <div className="flex flex-1 items-center">
            <div className="max-w-4xl py-16 sm:py-20">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#c99a45]/30 bg-[#c99a45]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#e1ba74]">
                Florida + California Personal Injury
              </div>

              <h1 className="max-w-4xl text-5xl font-black leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                Injured?
                <br />
                Talk directly with Marshall.
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-white/68 sm:text-xl">
                Get answers, understand your options, and speak directly with
                the attorney handling your case.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => navigate("/planet/marshall-rosenbach/case-review")}
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[#c99a45] px-7 py-4 text-sm font-black uppercase tracking-[0.12em] text-black transition hover:bg-[#ddb15f]"
                >
                  Start My Case Review
                  <ArrowRight size={18} />
                </button>

                <a
                  href="tel:+18886799090"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border border-white/18 bg-white/[0.04] px-7 py-4 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-white/[0.08]"
                >
                  <Phone size={18} />
                  Call Marshall
                </a>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/55">
                <span>Free Case Evaluation</span>
                <span className="hidden text-[#c99a45] sm:inline">•</span>
                <span>No Obligation</span>
                <span className="hidden text-[#c99a45] sm:inline">•</span>
                <span>Direct Attorney Access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f2eb] px-5 py-16 text-[#111214] sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <div className="text-xs font-black uppercase tracking-[0.22em] text-[#9a6d24]">
              Start Here
            </div>

            <h2 className="mt-3 text-4xl font-black tracking-[-0.035em] sm:text-5xl">
              What happened?
            </h2>

            <p className="mt-4 text-lg leading-7 text-black/60">
              Choose the situation that best matches what happened.
            </p>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {caseTypes.map(({ label, slug, icon: Icon }) => (
              <button
                key={slug}
                type="button"
                onClick={() =>
                  navigate(`/planet/marshall-rosenbach/${slug}`)
                }
                className="group flex min-h-28 items-center justify-between rounded-2xl border border-black/10 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#b98530]/50 hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#111214] text-[#d3a552]">
                    <Icon size={22} />
                  </div>

                  <span className="text-base font-black">{label}</span>
                </div>

                <ArrowRight
                  size={19}
                  className="text-black/30 transition group-hover:translate-x-1 group-hover:text-[#9a6d24]"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#111214] px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.22em] text-[#d3a552]">
                Why Marshall
              </div>

              <h2 className="mt-3 max-w-xl text-4xl font-black tracking-[-0.035em] sm:text-5xl">
                You should know who is actually handling your case.
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-white/60">
                Marshall’s approach is built around direct attorney access.
                When you have questions about your case, you should be able to
                speak with the attorney responsible for it.
              </p>

              <button
                type="button"
                onClick={() => navigate("/planet/marshall-rosenbach/case-review")}
                className="mt-8 inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[#c99a45] px-7 py-4 text-sm font-black uppercase tracking-[0.12em] text-black transition hover:bg-[#ddb15f]"
              >
                Start My Case Review
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="grid gap-3">
              {[
                "Speak directly with the attorney handling your case",
                "Free initial case evaluation",
                "Personal injury representation in Florida and California",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5"
                >
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#c99a45]/12 text-[#d3a552]">
                    <CheckCircle2 size={19} />
                  </div>
                  <div className="pt-1 text-base font-bold leading-6 text-white/85">
                    {item}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f2eb] px-5 py-16 text-[#111214] sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <div className="text-xs font-black uppercase tracking-[0.22em] text-[#9a6d24]">
              How It Works
            </div>

            <h2 className="mt-3 text-4xl font-black tracking-[-0.035em] sm:text-5xl">
              Three simple steps.
            </h2>

            <p className="mt-4 text-lg leading-7 text-black/60">
              Start with what happened. Marshall reviews the details and the
              conversation moves forward from there.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Tell Marshall what happened",
                body: "Start the private case review and give Marshall the basic facts about what happened.",
              },
              {
                number: "02",
                title: "Marshall reviews your case",
                body: "Your information goes directly into the case system so the important details stay together.",
              },
              {
                number: "03",
                title: "Speak directly with Marshall",
                body: "If the matter is something Marshall can help with, the next conversation is clear and direct.",
              },
            ].map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm"
              >
                <div className="text-sm font-black tracking-[0.14em] text-[#9a6d24]">
                  {step.number}
                </div>

                <h3 className="mt-5 text-xl font-black tracking-[-0.02em]">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-black/58">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0c0d0f] px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-5xl text-center">
          <div className="text-xs font-black uppercase tracking-[0.22em] text-[#c99a45]">
            Start Here
          </div>

          <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-black tracking-[-0.04em] sm:text-5xl">
            Tell Marshall what happened.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/60">
            Start with a few details. There is no obligation, and your case
            review goes directly into Marshall's private case workflow.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() =>
                navigate("/planet/marshall-rosenbach/case-review")
              }
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[#c99a45] px-7 py-4 text-sm font-black uppercase tracking-[0.12em] text-black transition hover:bg-[#ddb15f]"
            >
              Start My Case Review
              <ArrowRight size={18} />
            </button>

            <a
              href="tel:+18886799090"
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border border-white/18 bg-white/[0.04] px-7 py-4 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-white/[0.08]"
            >
              <Phone size={18} />
              Call Marshall
            </a>
          </div>
        </div>
      </section>

      <MarshallRosenbachFooter />
    </main>
  );
}
