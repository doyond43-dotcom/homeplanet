import { ArrowLeft, ArrowRight, Phone } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import ShareMetadata from "../components/ShareMetadata";

const BASE_URL = "https://www.homeplanet.city/planet/marshall-rosenbach";

const practiceAreas: Record<
  string,
  {
    title: string;
    metaTitle: string;
    description: string;
    eyebrow: string;
    intro: string;
    points: string[];
  }
> = {
  "car-accident": {
    title: "Injured in a car accident?",
    metaTitle: "Car Accident Attorney | Marshall E. Rosenbach",
    description:
      "Talk directly with personal injury attorney Marshall E. Rosenbach about a car accident injury and your available next steps.",
    eyebrow: "Car Accident",
    intro:
      "If you were hurt in a crash, the first step is understanding what happened, what information matters, and what options may be available to you.",
    points: [
      "Vehicle collisions and roadway crashes",
      "Insurance claim questions",
      "Injury and medical-treatment concerns",
    ],
  },

  "truck-accident": {
    title: "Hurt in a truck accident?",
    metaTitle: "Truck Accident Attorney | Marshall E. Rosenbach",
    description:
      "Request a direct review with personal injury attorney Marshall E. Rosenbach after a commercial truck accident.",
    eyebrow: "Truck Accident",
    intro:
      "Commercial truck crashes can involve multiple parties, insurance policies, and important evidence. Start by telling Marshall what happened.",
    points: [
      "Commercial truck collisions",
      "Serious injury claims",
      "Insurance and responsibility questions",
    ],
  },

  "motorcycle-accident": {
    title: "Injured in a motorcycle accident?",
    metaTitle: "Motorcycle Accident Attorney | Marshall E. Rosenbach",
    description:
      "Speak with personal injury attorney Marshall E. Rosenbach about injuries and insurance questions after a motorcycle accident.",
    eyebrow: "Motorcycle Accident",
    intro:
      "Motorcycle crashes can result in serious injuries and complicated insurance questions. Marshall can review what happened and discuss your next steps.",
    points: [
      "Motorcycle collisions",
      "Driver-fault questions",
      "Injury and insurance claims",
    ],
  },

  "train-collision": {
    title: "Injured in a train collision?",
    metaTitle: "Train Collision Attorney | Marshall E. Rosenbach",
    description:
      "Ask personal injury attorney Marshall E. Rosenbach to review the facts surrounding a train or rail collision injury.",
    eyebrow: "Train Collision",
    intro:
      "Train-related injury cases can involve unique facts and multiple responsible parties. Start with a direct review of what happened.",
    points: [
      "Train and rail collisions",
      "Crossing-related incidents",
      "Serious injury evaluation",
    ],
  },

  "bicycle-accident": {
    title: "Injured while riding a bicycle?",
    metaTitle: "Bicycle Accident Attorney | Marshall E. Rosenbach",
    description:
      "Talk with personal injury attorney Marshall E. Rosenbach about a bicycle collision, roadway injury, or insurance question.",
    eyebrow: "Bicycle Accident",
    intro:
      "If a driver or roadway incident caused your bicycle injury, Marshall can review the circumstances and help you understand your options.",
    points: [
      "Vehicle-versus-bicycle collisions",
      "Roadway injury claims",
      "Insurance questions",
    ],
  },

  "pedestrian-accident": {
    title: "Injured as a pedestrian?",
    metaTitle: "Pedestrian Accident Attorney | Marshall E. Rosenbach",
    description:
      "Request a direct case review with personal injury attorney Marshall E. Rosenbach after a pedestrian accident injury.",
    eyebrow: "Pedestrian Accident",
    intro:
      "Pedestrian crashes often involve serious injuries. Start by explaining what happened so Marshall can review the situation directly.",
    points: [
      "Vehicle-versus-pedestrian crashes",
      "Crosswalk and roadway incidents",
      "Serious injury claims",
    ],
  },
};

export default function MarshallRosenbachPracticeAreaPage() {
  const location = useLocation();

  const slug = location.pathname.split("/").filter(Boolean).pop() || "";
  const area = practiceAreas[slug];

  if (!area) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#0c0d0f] text-white">
      <ShareMetadata
        title={area.metaTitle}
        description={area.description}
        image="https://www.homeplanet.city/homeplanet-favicon.svg"
        url={`${BASE_URL}/${slug}`}
        canonical={`${BASE_URL}/${slug}`}
        robots="index,follow"
        twitterCard="summary"
      />
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-5xl px-5 pb-16 pt-6 sm:px-8 sm:pb-20">
          <Link
            to="/planet/marshall-rosenbach"
            className="inline-flex items-center gap-2 text-sm font-bold text-white/55 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Marshall E. Rosenbach
          </Link>

          <div className="mt-16 max-w-3xl">
            <div className="text-xs font-black uppercase tracking-[0.22em] text-[#d3a552]">
              {area.eyebrow}
            </div>

            <h1 className="mt-4 text-5xl font-black leading-[1.02] tracking-[-0.045em] sm:text-6xl">
              {area.title}
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/65">
              {area.intro}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to={`/planet/marshall-rosenbach/case-review?type=${encodeURIComponent(
                  slug
                )}`}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[#c99a45] px-7 py-4 text-sm font-black uppercase tracking-[0.12em] text-black transition hover:bg-[#ddb15f]"
              >
                Start My Case Review
                <ArrowRight size={18} />
              </Link>

              <a
                href="tel:+15616278990"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border border-white/18 px-7 py-4 text-sm font-black uppercase tracking-[0.12em] text-white"
              >
                <Phone size={18} />
                Call Marshall
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f2eb] px-5 py-14 text-[#111214] sm:px-8 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-black tracking-[-0.03em]">
            Start with the facts.
          </h2>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {area.points.map((point) => (
              <div
                key={point}
                className="rounded-2xl border border-black/10 bg-white p-5 text-base font-bold leading-6 shadow-sm"
              >
                {point}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
