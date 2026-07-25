import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

type PetStatus = "missing" | "safe" | "traveling";

type DemoPet = {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: string;
  color: string;
  photoUrl: string;
  ownerName: string;
  callNumber: string;
  textNumber: string;
  temperament: string;
  lastSeen: string;
  rewardText: string;
  status: PetStatus;
};

type FinderSituation =
  | "safe-with-me"
  | "seen-nearby"
  | "appears-hurt"
  | "";

type FinderFormState = {
  situation: FinderSituation;
  finderName: string;
  callbackNumber: string;
  foundLocation: string;
  message: string;
};

const PET_BASE_PATH = "/planet/guardian-pet";

const BELLA: DemoPet = {
  id: "bella-demo",
  name: "Bella",
  type: "Dog",
  breed: "Golden Retriever",
  age: "3 years old",
  color: "Golden",
  photoUrl: "/images/bella-demo.jpg",
  ownerName: "Dan",
  callNumber: "863-532-0683",
  textNumber: "863-532-0683",
  temperament:
    "Friendly and gentle. May be nervous if scared. Responds to Bella. Loves treats and a calm voice.",
  lastSeen: "Near Taylor Creek / neighborhood park area",
  rewardText: "Reward available upon safe return.",
  status: "missing",
};

const VAMP: DemoPet = {
  id: "vamp",
  name: "Vamp",
  type: "Cat",
  breed: "Domestic Long Hair",
  age: "3 years old",
  color: "Black",
  photoUrl: "/images/guardian/vamp.jpg",
  ownerName: "Hayley",
  callNumber: "903-246-6394",
  textNumber: "903-246-6394",
  temperament:
    "Friendly and gentle. May be nervous if scared. Responds to Vamp. Approach slowly and calmly.",
  lastSeen: "Near Taylor Creek / neighborhood park area",
  rewardText: "Reward available upon safe return.",
  status: "missing",
};

const INITIAL_FINDER_FORM: FinderFormState = {
  situation: "",
  finderName: "",
  callbackNumber: "",
  foundLocation: "",
  message: "",
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function buildTelHref(number: string) {
  return `tel:${number.replace(/\D/g, "")}`;
}

function buildSmsHref(number: string, body: string) {
  const cleanNumber = number.replace(/\D/g, "");
  return `sms:${cleanNumber}&body=${encodeURIComponent(body)}`;
}

function PetTagShell({
  children,
  compact = false,
}: {
  children: ReactNode;
  compact?: boolean;
}) {
  return (
    <div className="min-h-screen bg-[#07111f] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-180px] top-[40px] h-[430px] w-[430px] rounded-full bg-cyan-400/[0.07] blur-3xl" />
        <div className="absolute right-[-180px] top-[42%] h-[380px] w-[380px] rounded-full bg-amber-200/[0.04] blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 sm:px-6 lg:px-8">
<main className={compact ? "flex-1 pt-6 sm:pt-8" : "flex-1"}>{children}</main>
      </div>
    </div>
  );
}
function PetModePreview({
  pet,
  mode,
}: {
  pet: DemoPet;
  mode: "normal" | "lost";
}) {
  const lost = mode === "lost";

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[28px]",
        lost
          ? "bg-[#17101a]"
          : "bg-[#0b1820]"
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={pet.photoUrl}
          alt={`${pet.name} ${lost ? "lost" : "normal"} Pet Tag example`}
          className="h-full w-full object-cover"
        />

        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t",
            lost
              ? "from-[#17101a] via-transparent to-transparent"
              : "from-[#0b1820] via-transparent to-transparent"
          )}
        />

        <div className="absolute inset-x-0 bottom-0 p-5">
          <div
            className={cn(
              "inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em]",
              lost
                ? "bg-rose-300 text-[#281017]"
                : "bg-emerald-300 text-[#062018]"
            )}
          >
            {lost ? "Missing" : "Safe"}
          </div>

          <h3 className="mt-3 text-4xl font-bold tracking-tight text-white">
            {pet.name}
          </h3>

          <p className="mt-1 text-sm text-white/72">
            {pet.breed} · {pet.color}
          </p>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {lost ? (
          <>
            <h4 className="text-xl font-bold text-white">
              {pet.name} is missing.
            </h4>

            <p className="mt-2 text-sm leading-6 text-white/65">
              Last seen near Taylor Creek. Please contact the owner or send a
              quick found update.
            </p>

            <div className="mt-5 grid gap-2">
              <div className="rounded-2xl bg-emerald-300 px-4 py-3.5 text-center text-sm font-bold text-[#07111f]">
                Call Owner
              </div>

              <div className="rounded-2xl bg-sky-300 px-4 py-3.5 text-center text-sm font-bold text-[#07111f]">
                Text Owner
              </div>


            </div>
          </>
        ) : (
          <>
            <h4 className="text-xl font-bold text-white">
              You found {pet.name}?
            </h4>

            <p className="mt-2 text-sm leading-6 text-white/65">
              Thanks for checking the tag. Contact the owner if {pet.name}
              appears to be away from home.
            </p>

            <div className="mt-5 grid gap-2">
              <div className="rounded-2xl bg-white/[0.08] px-4 py-3.5">
                <div className="text-xs font-bold uppercase tracking-[0.15em] text-white/42">
                  Owner
                </div>
                <div className="mt-1 font-semibold text-white">
                  Dan
                </div>
              </div>

              <div className="rounded-2xl bg-white/[0.08] px-4 py-3.5">
                <div className="text-xs font-bold uppercase tracking-[0.15em] text-white/42">
                  About Bella
                </div>
                <div className="mt-1 text-sm leading-6 text-white/72">
                  Friendly, gentle, and responds to Bella.
                </div>
              </div>

              <div className="rounded-2xl bg-cyan-300 px-4 py-3.5 text-center text-sm font-bold text-[#07111f]">
                Contact Bella's Family
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StepItem({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <div className="relative pt-5">
      <div className="text-xs font-black tracking-[0.2em] text-cyan-200">
        {number}
      </div>
      <h3 className="mt-4 text-2xl font-bold tracking-tight text-white">
        {title}
      </h3>
      <p className="mt-3 max-w-sm text-sm leading-7 text-white/60 sm:text-base">
        {body}
      </p>
    </div>
  );
}
function PetTagLanding() {
  return (
    <div>
      {/* =====================================================
          HERO
          ===================================================== */}
      <section className="pb-14 pt-8 text-center sm:pb-18 sm:pt-10">
        <div className="mx-auto max-w-5xl">
          <div className="flex justify-center">
            <div className="inline-flex items-center justify-center">
              <span className="relative inline-flex items-center rounded-full border border-cyan-300/30 bg-cyan-300/[0.07] py-2 pl-5 pr-4 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                <span className="absolute left-2.5 h-1.5 w-1.5 rounded-full border border-cyan-200/60" />
                Pet Tag
              </span>
            </div>
          </div>

          <h1 className="mx-auto mt-5 max-w-4xl text-6xl font-bold leading-[0.95] tracking-[-0.05em] text-white sm:text-7xl lg:text-8xl">
            Help your pet
            <span className="block text-cyan-300">
              get home faster.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/72 sm:text-xl">
            If your pet ever gets out, someone can scan the tag and know exactly
            what to do.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to={`${PET_BASE_PATH}/pet/bella-demo`}
              className="rounded-2xl bg-cyan-300 px-8 py-4 text-center text-base font-bold text-[#07111f] transition hover:bg-cyan-200"
            >
              See Bella&apos;s Live Tag
            </Link>

            <Link
              to="/planet/guardian-join?item=pet-tag&pets=1"
              className="rounded-2xl border border-white/16 bg-white/[0.035] px-8 py-4 text-center text-base font-bold text-white transition hover:bg-white/[0.07]"
            >
              Get a Pet Tag
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {[
              "No app needed",
              "Scan to help",
              "Reach the owner fast",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/[0.09] bg-white/[0.035] px-4 py-2 text-sm font-semibold text-white/68"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-[30px] bg-[#122130] shadow-[0_22px_70px_rgba(0,0,0,0.22)]">
          <div className="relative h-[390px] sm:h-[510px] lg:h-[600px]">
            <img
              src="/images/bella-demo.jpg"
              alt="Bella wearing her HomePlanet Pet Tag"
              className="h-full w-full object-cover object-center"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#07111f]/18 via-transparent to-transparent" />

            <div className="absolute bottom-5 left-5 rounded-full bg-[#07111f]/78 px-4 py-2 text-sm font-bold text-white backdrop-blur-md sm:bottom-7 sm:left-7">
              One tag. One scan. A clear way to help.
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          REAL SCAN FLOW
          ===================================================== */}
      <section
        id="see-it-work"
        className="border-t border-white/[0.07] py-16 sm:py-20"
      >
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <div className="text-sm font-bold uppercase tracking-[0.22em] text-cyan-200">
              See how it works
            </div>

            <h2 className="mx-auto mt-4 max-w-4xl text-4xl font-bold leading-[1.02] tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
              If someone finds your pet,
              <span className="block text-cyan-300">
                this is all they do.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/65">
              They see the tag, scan it with their phone, and your pet&apos;s page opens.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-[30px] border border-white/[0.08] bg-[#b8b2a7] p-5 text-[#0b1626] sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-3 lg:gap-6">

              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-700 text-sm font-bold text-white">
                    1
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">
                      They see the tag.
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      Your pet wears one simple QR tag.
                    </p>
                  </div>
                </div>

                <div className="overflow-hidden rounded-[24px] bg-slate-200">
                  <img
                    src="/images/bella-demo.jpg"
                    alt="Bella wearing her pet tag"
                    className="h-[330px] w-full object-cover object-[50%_72%]"
                  />
                </div>
              </div>

              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-700 text-sm font-bold text-white">
                    2
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">
                      They scan it.
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      They use the camera already on their phone.
                    </p>
                  </div>
                </div>

                <div className="flex h-[330px] items-center justify-center overflow-hidden rounded-[24px] bg-[#aeb9b7] p-6">
                  <div className="w-full max-w-[240px] rounded-[30px] border-[8px] border-[#101820] bg-[#101820] p-3 shadow-xl">
                    <div className="rounded-[20px] bg-[#07111f] p-3">
                      <div className="mb-3 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-200">
                        Camera
                      </div>

                      <div className="relative overflow-hidden rounded-[16px] bg-slate-700">
                        <img
                          src="/images/bella-demo.jpg"
                          alt="Phone camera aimed at Bella's pet tag"
                          className="h-[210px] w-full object-cover object-[50%_78%]"
                        />

                        <div className="absolute inset-x-[25%] bottom-[18%] top-[48%] rounded-xl border-4 border-cyan-300" />
                      </div>

                      <div className="mx-auto mt-3 h-10 w-10 rounded-full border-4 border-white/80" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-700 text-sm font-bold text-white">
                    3
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">
                      Your pet&apos;s page opens.
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      They see your pet&apos;s information and what to do next.
                    </p>
                  </div>
                </div>

                <div className="rounded-[24px] bg-[#07111f] p-5 text-white shadow-xl">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-3xl font-bold">
                          Bella
                        </h3>
                        <span className="rounded-full border border-red-400/50 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-300">
                          MISSING
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-white/60">
                        Golden Retriever · 3 years
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    <a
                      href="tel:8635320683"
                      className="block rounded-xl bg-emerald-400 px-4 py-3 text-center text-sm font-bold text-[#07111f]"
                    >
                      Call Owner
                    </a>

                    <a
                      href="sms:8635320683&body=Hi%2C%20I%20found%20Bella.%20I%20scanned%20her%20HomePlanet%20Pet%20Tag."
                      className="block rounded-xl bg-sky-400 px-4 py-3 text-center text-sm font-bold text-[#07111f]"
                    >
                      Text Owner
                    </a>


                  </div>

                  <div className="mt-5 space-y-4 text-sm">
                    <div>
                      <div className="font-bold text-cyan-300">
                        Last seen
                      </div>
                      <div className="mt-1 text-white/72">
                        Taylor Creek neighborhood area
                      </div>
                    </div>

                    <div>
                      <div className="font-bold text-cyan-300">
                        Temperament
                      </div>
                      <div className="mt-1 text-white/72">
                        Friendly and gentle. May be nervous if scared.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="mt-10 flex flex-col items-center justify-between gap-5 border-t border-slate-300 pt-7 text-center sm:flex-row sm:text-left">
              <div>
                <div className="text-xl font-bold">
                  No app. No account. Just scan and help.
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  The finder gets the information they need and a clear way to reach the owner.
                </div>
              </div>

              <Link
                to={`${PET_BASE_PATH}/pet/bella-demo`}
                className="inline-flex rounded-2xl bg-cyan-700 px-7 py-4 text-base font-bold text-white transition hover:bg-cyan-800"
              >
                Try Bella&apos;s Live Tag
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          THE ACTUAL PRODUCT
          ===================================================== */}
      <section className="border-t border-white/[0.07] py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">

            {/* PRODUCT VISUAL */}
            <div className="relative">
              <div className="overflow-hidden rounded-[30px] border border-white/[0.08] bg-[#101e2b] p-4">
                <div className="relative overflow-hidden rounded-[24px]">
                  <img
                    src="/images/bella-demo.jpg"
                    alt="Bella wearing her HomePlanet Pet Tag"
                    className="h-[440px] w-full object-cover object-center sm:h-[520px]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#07111f]/70 via-transparent to-transparent" />

                  <div className="absolute bottom-5 left-5 right-5 rounded-[20px] border border-white/10 bg-[#07111f]/88 p-4 backdrop-blur-md">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">
                          Bella&apos;s Pet Tag
                        </div>
                        <div className="mt-1 text-lg font-bold text-white">
                          Active and ready
                        </div>
                      </div>

                      <span className="rounded-full bg-emerald-400/15 px-3 py-2 text-xs font-bold text-emerald-300">
                        LIVE
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PRODUCT STORY */}
            <div>
              <div className="text-sm font-bold uppercase tracking-[0.22em] text-cyan-200">
                Bella&apos;s tag is connected
              </div>

              <h2 className="mt-4 text-4xl font-bold leading-[1.03] tracking-[-0.04em] text-white sm:text-5xl">
                One small tag.
                <span className="block text-cyan-300">
                  A live page for Bella.
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-white/65">
                Bella&apos;s tag connects directly to her live page. If she ever gets
                out, the person who finds her has one clear place to see who she is
                and what to do next.
              </p>

              <div className="mt-8 divide-y divide-white/[0.08] border-y border-white/[0.08]">

                <div className="grid gap-2 py-5 sm:grid-cols-[170px_1fr] sm:gap-6">
                  <div className="font-bold text-white">
                    About Bella
                  </div>
                  <div className="text-white/58">
                    Photo, name, breed, age, temperament, and important safety information.
                  </div>
                </div>

                <div className="grid gap-2 py-5 sm:grid-cols-[170px_1fr] sm:gap-6">
                  <div className="font-bold text-white">
                    Reach the owner
                  </div>
                  <div className="text-white/58">
                    Give the finder a clear way to call or text you immediately.
                  </div>
                </div>

                <div className="grid gap-2 py-5 sm:grid-cols-[170px_1fr] sm:gap-6">
                  <div className="font-bold text-white">
                    Lost Mode
                  </div>
                  <div className="text-white/58">
                    Show last-seen details, approach guidance, and the information that matters most.
                  </div>
                </div>

                <div className="grid gap-2 py-5 sm:grid-cols-[170px_1fr] sm:gap-6">
                  <div className="font-bold text-white">
                    Someone reaches you
                  </div>
                  <div className="text-white/58">
                    Someone who finds your pet can tell you where they are and send a quick report.
                  </div>
                </div>

                <div className="grid gap-2 py-5 sm:grid-cols-[170px_1fr] sm:gap-6">
                  <div className="font-bold text-white">
                    Keep it current
                  </div>
                  <div className="text-white/58">
                    Change the photo, contact information, status, or safety notes without replacing the tag.
                  </div>
                </div>

              </div>

              <Link
                to={`${PET_BASE_PATH}/pet/bella-demo`}
                className="mt-7 inline-flex rounded-2xl bg-cyan-300 px-7 py-4 text-base font-bold text-[#07111f] transition hover:bg-cyan-200"
              >
                See Bella&apos;s Live Tag
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          LIVE PET PAGE EXPERIENCE
          ===================================================== */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[32px] border border-cyan-300/10 bg-[#102330] p-6 sm:p-8 lg:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">

            {/* MESSAGE */}
            <div>
              <div className="text-sm font-bold uppercase tracking-[0.22em] text-cyan-200">
                When Bella is found
              </div>

              <h2 className="mt-4 text-4xl font-bold leading-[1.03] tracking-[-0.04em] text-white sm:text-5xl">
                Scan the tag.
                <span className="block text-cyan-300">
                  Call or text right away.
                </span>
              </h2>

              <p className="mt-6 text-lg leading-8 text-white/62">
                Bella&apos;s live page opens immediately with her important details
                and direct buttons to call or text her owner.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "No app to download",
                  "No finder account or login",
                  "Call the owner with one tap",
                  "Open a prepared text with one tap",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-base font-semibold text-white/78"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-300/12 text-sm font-bold text-cyan-200">
                      ✓
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* REALISTIC LIVE PAGE */}
            <div className="mx-auto w-full max-w-[470px]">
              <div className="rounded-[34px] border border-white/[0.12] bg-[#07111f] p-3 shadow-[0_28px_80px_rgba(0,0,0,0.32)]">
                <div className="overflow-hidden rounded-[26px] bg-[#0b1725]">

                  <div className="relative h-[260px] overflow-hidden sm:h-[310px]">
                    <img
                      src="/images/bella-demo.jpg"
                      alt="Bella's live pet page"
                      className="h-full w-full object-cover object-center"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#07111f] via-[#07111f]/10 to-transparent" />

                    <div className="absolute bottom-5 left-5 right-5">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-4xl font-bold text-white">
                          Bella
                        </h3>

                        <span className="rounded-full border border-red-400/50 bg-red-500/20 px-3 py-1 text-xs font-bold text-red-200 backdrop-blur-md">
                          MISSING
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-white/70">
                        Golden Retriever · 3 years · Golden
                      </p>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6">
                    <div className="grid gap-3">
                      <a
                        href="tel:8635320683"
                        className="rounded-xl bg-emerald-400 px-5 py-4 text-center text-base font-bold text-[#07111f]"
                      >
                        Call Owner
                      </a>

                      <a
                        href="sms:8635320683&body=Hi%2C%20I%20found%20Bella.%20I%20scanned%20her%20HomePlanet%20Pet%20Tag."
                        className="rounded-xl bg-sky-400 px-5 py-4 text-center text-base font-bold text-[#07111f]"
                      >
                        Text Owner
                      </a>


                    </div>

                    <div className="mt-6 grid gap-5 sm:grid-cols-2">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">
                          Last seen
                        </div>
                        <p className="mt-2 text-sm leading-6 text-white/68">
                          Taylor Creek neighborhood area
                        </p>
                      </div>

                      <div>
                        <div className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">
                          Temperament
                        </div>
                        <p className="mt-2 text-sm leading-6 text-white/68">
                          Friendly and gentle. May be nervous if scared.
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 rounded-[18px] border border-amber-200/10 bg-amber-100/[0.05] p-4">
                      <div className="text-xs font-bold uppercase tracking-[0.16em] text-amber-200">
                        Important note
                      </div>
                      <p className="mt-2 text-sm leading-6 text-white/68">
                        Please approach calmly and contact the owner as soon as possible.
                      </p>
                    </div>
                  </div>
                </div>
              </div>


            </div>

          </div>
        </div>
      </section>
      {/* =====================================================
          HOMEPLANET LIVE ACTIVITY
          ===================================================== */}
      <section className="border-t border-white/[0.07] py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">

          <div className="grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">

            {/* STORY */}
            <div className="lg:sticky lg:top-8">
              <div className="text-sm font-bold uppercase tracking-[0.22em] text-cyan-200">
                More than a QR code
              </div>

              <h2 className="mt-4 text-4xl font-bold leading-[1.03] tracking-[-0.04em] text-white sm:text-5xl">
                The scan is only
                <span className="block text-cyan-300">
                  the beginning.
                </span>
              </h2>

              <p className="mt-6 text-lg leading-8 text-white/62">
                When Bella&apos;s tag is scanned, her page comes alive. The scan,
                the finder&apos;s next action, and what happens afterward can become
                part of one clear recovery story.
              </p>

              <div className="mt-8 border-l-2 border-cyan-300/30 pl-5">
                <div className="text-sm font-bold text-white">
                  The tag is the doorway.
                </div>

                <div className="mt-2 text-sm leading-6 text-white/52">
                  Bella&apos;s live page handles what happens next.
                </div>
              </div>
            </div>

            {/* LIVE ACTIVITY */}
            <div className="overflow-hidden rounded-[30px] border border-white/[0.09] bg-[#0d1c29]">

              <div className="border-b border-white/[0.08] px-5 py-5 sm:px-7">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                      Bella · Live Activity
                    </div>

                    <div className="mt-1 text-xl font-bold text-white">
                      Someone just scanned Bella&apos;s tag.
                    </div>
                  </div>

                  <span className="rounded-full bg-cyan-300/10 px-3 py-2 text-xs font-bold text-cyan-200">
                    LIVE
                  </span>
                </div>
              </div>

              <div className="px-5 py-2 sm:px-7">

                <div className="grid grid-cols-[76px_18px_1fr] gap-3 border-b border-white/[0.07] py-5">
                  <div className="pt-1 text-sm font-semibold text-white/42">
                    10:42 AM
                  </div>

                  <div className="relative flex justify-center">
                    <span className="relative z-10 mt-1 h-3 w-3 rounded-full bg-cyan-300" />
                    <span className="absolute bottom-[-22px] top-4 w-px bg-white/[0.10]" />
                  </div>

                  <div>
                    <div className="font-bold text-white">
                      Tag scanned
                    </div>
                    <div className="mt-1 text-sm leading-6 text-white/50">
                      Bella&apos;s tag was scanned from a phone.
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-[76px_18px_1fr] gap-3 border-b border-white/[0.07] py-5">
                  <div className="pt-1 text-sm font-semibold text-white/42">
                    10:42 AM
                  </div>

                  <div className="relative flex justify-center">
                    <span className="relative z-10 mt-1 h-3 w-3 rounded-full bg-cyan-300" />
                    <span className="absolute bottom-[-22px] top-4 w-px bg-white/[0.10]" />
                  </div>

                  <div>
                    <div className="font-bold text-white">
                      Bella&apos;s page opened
                    </div>
                    <div className="mt-1 text-sm leading-6 text-white/50">
                      The finder saw Bella&apos;s information and the available next actions.
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-[76px_18px_1fr] gap-3 border-b border-white/[0.07] py-5">
                  <div className="pt-1 text-sm font-semibold text-white/42">
                    10:43 AM
                  </div>

                  <div className="relative flex justify-center">
                    <span className="relative z-10 mt-1 h-3 w-3 rounded-full bg-amber-300" />
                    <span className="absolute bottom-[-22px] top-4 w-px bg-white/[0.10]" />
                  </div>

                  <div>
                    <div className="font-bold text-white">
                      Finder tapped “Text Owner”
                    </div>
                    <div className="mt-1 text-sm leading-6 text-white/50">
                      Their phone opened a prepared text so they could contact Bella&apos;s owner immediately.
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-[76px_18px_1fr] gap-3 py-5">
                  <div className="pt-1 text-sm font-semibold text-white/42">
                    10:44 AM
                  </div>

                  <div className="flex justify-center">
                    <span className="mt-1 h-3 w-3 rounded-full bg-emerald-300" />
                  </div>

                  <div>
                    <div className="font-bold text-white">
                      Owner contacted
                    </div>
                    <div className="mt-1 text-sm leading-6 text-white/50">
                      The next step is clear and the recovery story keeps moving.
                    </div>
                  </div>
                </div>

              </div>

              <div className="border-t border-white/[0.08] bg-cyan-300/[0.045] px-5 py-5 sm:px-7">
                <div className="text-sm font-bold text-cyan-200">
                  Signal → action → next action → outcome
                </div>

                <p className="mt-2 text-sm leading-6 text-white/52">
                  That is the difference between a QR code that opens a page and
                  a live system that helps move Bella toward home.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          QUIET TRUST STRIP
          ===================================================== */}
      <section className="py-8 sm:py-10">
        <div className="mx-auto max-w-5xl border-y border-white/[0.08] py-8">
          <div className="grid gap-6 sm:grid-cols-3">

            <div>
              <div className="text-sm font-bold text-white">
                No app needed to help
              </div>
              <div className="mt-2 text-sm leading-6 text-white/48">
                A finder can scan with the phone they already have.
              </div>
            </div>

            <div>
              <div className="text-sm font-bold text-white">
                No battery in the tag
              </div>
              <div className="mt-2 text-sm leading-6 text-white/48">
                The tag stays scannable without charging or replacing a battery.
              </div>
            </div>

            <div>
              <div className="text-sm font-bold text-white">
                No constant location tracking
              </div>
              <div className="mt-2 text-sm leading-6 text-white/48">
                The tag does not continuously broadcast where your pet is. The scan is the signal that starts the recovery process.
              </div>
            </div>

          </div>
        </div>
      </section>
      {/* =====================================================
          FINAL CTA
          ===================================================== */}
      <section className="border-t border-white/[0.07] py-16 text-center sm:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="text-sm font-bold uppercase tracking-[0.22em] text-cyan-200">
            HomePlanet Pet Tag
          </div>

          <h2 className="mt-4 text-4xl font-bold leading-[1.03] tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
            Put the next step
            <span className="block text-cyan-300">
              right on their collar.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/62">
            If your pet ever gets out, give the person who finds them a clear way to help.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/planet/guardian-join?item=pet-tag&pets=1"
              className="rounded-2xl bg-cyan-300 px-8 py-4 text-base font-bold text-[#07111f] transition hover:bg-cyan-200"
            >
              Get a Pet Tag
            </Link>

            <Link
              to={`${PET_BASE_PATH}/pet/bella-demo`}
              className="rounded-2xl border border-white/16 bg-white/[0.035] px-8 py-4 text-base font-bold text-white transition hover:bg-white/[0.07]"
            >
              See Bella&apos;s Live Tag
            </Link>
          </div>
        </div>
      </section>
      {/* =====================================================
          PET TAG FOOTER
          ===================================================== */}
      <footer className="border-t border-white/[0.08] py-10 sm:py-12">
        <div className="mx-auto max-w-5xl">

          <div className="grid gap-8 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/38">
                  HomePlanet
                </span>

                <span className="relative inline-flex items-center rounded-full border border-cyan-300/25 bg-cyan-300/[0.06] py-1.5 pl-4 pr-3 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200">
                  <span className="absolute left-2 h-1 w-1 rounded-full border border-cyan-200/55" />
                  Pet Tag
                </span>
              </div>

              <p className="mt-4 max-w-md text-sm leading-6 text-white/50">
                Pet identification built for real-world lost-and-found moments.
              </p>

              <p className="mt-3 text-sm font-semibold text-white/68">
                Scan. Connect. Help them get home.
              </p>
            </div>

            <nav
              aria-label="Pet Tag footer"
              className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-white/48 sm:justify-end"
            >
              <Link
                to={PET_BASE_PATH}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="transition hover:text-white"
              >
                Pet Tag
              </Link>

              <Link
                to="/planet/guardian-pet/privacy"
                className="transition hover:text-white"
              >
                Privacy
              </Link>

              <Link
                to="/"
                className="transition hover:text-white"
              >
                HomePlanet
              </Link>
            </nav>
          </div>

          <div className="mt-8 border-t border-white/[0.06] pt-6 text-xs text-white/32">
            © 2026 HomePlanet. All rights reserved.
          </div>

        </div>
      </footer>
    </div>
  );
}
function FinderMessageFlow({
  petName,
}: {
  petName: string;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(`I found ${petName}.`);

  const [showLocation, setShowLocation] = useState(false);
  const [location, setLocation] = useState("");

  const [helpChoice, setHelpChoice] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const hasLocation = location.trim().length > 0;

  if (submitted) {
    return (
      <div className="mt-5 rounded-[24px] border border-emerald-300/25 bg-emerald-300/[0.075] p-5 sm:p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-300 text-2xl font-bold text-[#07111f]">
          ✓
        </div>

        <h3 className="mt-4 text-2xl font-bold tracking-tight text-white">
          Update submitted
        </h3>

        <p className="mt-2 text-base leading-7 text-white/65">
          Your message and any details you included are together in one recovery update for {petName}&apos;s family.
        </p>

        <div className="mt-5 rounded-[18px] border border-white/[0.08] bg-[#07111f]/45 p-4 text-sm">
          <div className="font-semibold text-white">
            {message.trim() || `I found ${petName}.`}
          </div>

          {name && (
            <div className="mt-3 text-white/55">
              From: {name}
            </div>
          )}

          {phone && (
            <div className="mt-1 text-white/55">
              Phone: {phone}
            </div>
          )}

          {hasLocation && (
            <div className="mt-1 text-white/55">
              Location: {location}
            </div>
          )}

          {helpChoice && (
            <div className="mt-1 text-white/55">
              {helpChoice}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-5 text-sm font-bold text-cyan-200 hover:text-cyan-100"
        >
          Edit update
        </button>
      </div>
    );
  }

  return (
    <div className="mt-5 rounded-[22px] border border-white/10 bg-[#0b1725] p-4 sm:p-5">
      <div className="text-lg font-bold text-white">
        I found {petName}
      </div>

      <p className="mt-2 text-sm leading-6 text-white/58">
        Send one quick message to {petName}&apos;s family.
      </p>

      <div className="mt-4 grid gap-3">
        <input
          type="text"
          name="name"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name (optional)"
          className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-base text-white outline-none placeholder:text-white/35 focus:border-cyan-300/50"
        />

        <input
          type="tel"
          name="tel"
          autoComplete="tel"
          inputMode="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="Your phone number (optional)"
          className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-base text-white outline-none placeholder:text-white/35 focus:border-cyan-300/50"
        />

        <textarea
          rows={2}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-base text-white outline-none placeholder:text-white/35 focus:border-cyan-300/50"
        />
      </div>

      {/* OPTIONAL DETAILS - PART OF THE SAME MESSAGE */}
      <div className="mt-5 border-t border-white/[0.08] pt-4">
        <div className="text-xs font-bold uppercase tracking-[0.15em] text-white/38">
          Optional
        </div>

        <div className="mt-3 grid gap-2">
          {!showLocation && !hasLocation && (
            <button
              type="button"
              onClick={() => setShowLocation(true)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm font-semibold text-white"
            >
              + Add where {petName} is
            </button>
          )}

          {showLocation && (
            <div className="rounded-xl border border-white/10 bg-white/[0.025] p-3">
              <input
                type="text"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder={`Where are you with ${petName}?`}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-base text-white outline-none placeholder:text-white/35 focus:border-cyan-300/50"
              />

              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowLocation(false)}
                  className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-white/65"
                >
                  Done
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLocation("");
                    setShowLocation(false);
                  }}
                  className="rounded-xl px-4 py-3 text-sm font-semibold text-white/38"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          {hasLocation && !showLocation && (
            <button
              type="button"
              onClick={() => setShowLocation(true)}
              className="w-full rounded-xl border border-sky-300/15 bg-sky-300/[0.05] px-4 py-3 text-left"
            >
              <div className="text-sm font-bold text-sky-100">
                ✓ Location included
              </div>

              <div className="mt-1 text-sm text-white/55">
                {location}
              </div>
            </button>
          )}

          <button
            type="button"
            onClick={() =>
              setHelpChoice(
                helpChoice === `I can wait with ${petName}`
                  ? ""
                  : `I can wait with ${petName}`
              )
            }
            className={
              helpChoice === `I can wait with ${petName}`
                ? "w-full rounded-xl border border-emerald-300/20 bg-emerald-300/[0.07] px-4 py-3 text-left text-sm font-bold text-emerald-100"
                : "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm font-semibold text-white"
            }
          >
            {helpChoice === `I can wait with ${petName}` ? "✓ " : ""}
            I can wait with {petName}
          </button>

          <button
            type="button"
            onClick={() =>
              setHelpChoice(
                helpChoice === `I can help bring ${petName} home`
                  ? ""
                  : `I can help bring ${petName} home`
              )
            }
            className={
              helpChoice === `I can help bring ${petName} home`
                ? "w-full rounded-xl border border-emerald-300/20 bg-emerald-300/[0.07] px-4 py-3 text-left text-sm font-bold text-emerald-100"
                : "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm font-semibold text-white"
            }
          >
            {helpChoice === `I can help bring ${petName} home` ? "✓ " : ""}
            I can help bring {petName} home
          </button>
        </div>
      </div>

      {/* ONE SEND - EVERYTHING ABOVE GOES TOGETHER */}
      <button
        type="button"
        onClick={() => {
          const payload = {
            petName,
            finderName: name.trim(),
            finderPhone: phone.trim(),
            message: message.trim() || `I found ${petName}.`,
            location: location.trim(),
            helpChoice,
          };

          window.dispatchEvent(
            new CustomEvent("pet-finder-message-ready", {
              detail: payload,
            })
          );

          setSubmitted(true);
        }}
        className="mt-5 w-full rounded-2xl bg-emerald-300 px-5 py-4 text-center text-base font-bold text-[#07111f] active:scale-[0.99]"
      >
        Send to {petName}&apos;s Family
      </button>

      <div className="mt-4 border-t border-white/[0.07] pt-4 text-center">
        <p className="text-xs leading-5 text-white/38">
          The owner&apos;s private contact details stay hidden until they choose how to respond.
        </p>
      </div>
    </div>
  );
}
function PetIdentity({ pet }: { pet: DemoPet }) {
  const isMissing = pet.status === "missing";

  return (
    <section className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045]">
      <div className="relative aspect-[4/3] min-h-[290px] overflow-hidden sm:aspect-[16/9] lg:aspect-auto lg:h-[500px]">
        <img
          src={pet.photoUrl}
          alt={pet.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07111f] via-[#07111f]/15 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-5xl font-bold tracking-[-0.04em] text-white sm:text-6xl">
              {pet.name}
            </h1>

            <div
              className={cn(
                "inline-flex rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em]",
                isMissing
                  ? "border-rose-300/30 bg-rose-500/25 text-rose-100"
                  : "border-emerald-300/30 bg-emerald-500/20 text-emerald-100"
              )}
            >
              {isMissing ? "Missing" : "Safe"}
            </div>
          </div>

          <p className="mt-2 text-sm text-white/72 sm:text-base">
            {pet.breed} · {pet.age} · {pet.color}
          </p>
        </div>
      </div>
    </section>
  );
}

function PetLivePage({ pet }: { pet: DemoPet }) {
  const location = useLocation();
  const isMissing = pet.status === "missing";

  // Bella is the public demo reached from the Pet Tag landing page.
  // Real QR-scanned pet pages should keep the Pet Tag identity
  // but should not send the finder backward into marketing.
  const isLandingDemo =
    pet.id === "bella-demo" &&
    location.pathname === `${PET_BASE_PATH}/pet/bella-demo`;
  const callHref = buildTelHref(pet.callNumber);
  const textHref = buildSmsHref(
    pet.textNumber,
    `Hi ${pet.ownerName}, I found ${pet.name}. I scanned ${pet.name}'s HomePlanet Pet Tag.`
  );

  return (
    <div className="mx-auto max-w-3xl space-y-4 pb-8">

      {/* PET TAG LIVE PAGE HEADER */}
      <header className="flex min-h-[52px] items-center border-b border-white/[0.07] px-1 pb-3">
        {isLandingDemo ? (
          <Link
            to={PET_BASE_PATH}
            className="inline-flex items-center gap-3 text-white/72 transition hover:text-white"
          >
            <span
              aria-hidden="true"
              className="text-lg leading-none text-white/52"
            >
              ←
            </span>

            <span className="relative inline-flex items-center rounded-full border border-cyan-300/25 bg-cyan-300/[0.06] py-1.5 pl-4 pr-3 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200">
              <span className="absolute left-2 h-1 w-1 rounded-full border border-cyan-200/55" />
              Pet Tag
            </span>
          </Link>
        ) : (
          <div className="relative inline-flex items-center rounded-full border border-cyan-300/25 bg-cyan-300/[0.06] py-1.5 pl-4 pr-3 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200">
            <span className="absolute left-2 h-1 w-1 rounded-full border border-cyan-200/55" />
            Pet Tag
          </div>
        )}
      </header>

      <PetIdentity pet={pet} />

      <section
        className={cn(
          "rounded-[28px] border p-5 sm:p-7",
          isMissing
            ? "border-cyan-300/16 bg-cyan-300/[0.045]"
            : "border-emerald-300/20 bg-emerald-500/[0.06]"
        )}
      >
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {isMissing
            ? `Thank you for stopping to help ${pet.name}.`
            : `Thanks for checking ${pet.name}'s tag.`}
        </h2>

        {isMissing ? (
          <>
            <p className="mt-3 text-base font-semibold leading-7 text-rose-200">
              {pet.name} is deeply loved, and her family is waiting to hear that she is safe.
            </p>

            <p className="mt-2 text-sm leading-7 text-white/70 sm:text-base">
              If you are with her, please call or text them directly below.
            </p>
          </>
        ) : (
          <p className="mt-3 text-sm leading-7 text-white/70 sm:text-base">
            {pet.name} appears to be away from home. Call or text {pet.ownerName} directly below.
          </p>
        )}

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <a
            href={callHref}
            className="rounded-2xl bg-emerald-300 px-5 py-4 text-center text-base font-bold text-[#07111f] transition hover:bg-emerald-200"
          >
            Call Owner
          </a>

          <a
            href={textHref}
            className="rounded-2xl bg-sky-300 px-5 py-4 text-center text-base font-bold text-[#07111f] transition hover:bg-sky-200"
          >
            Text Owner
          </a>
        </div>

        <p className="mt-4 text-center text-xs leading-5 text-white/45">
          Opens a ready-to-send text message.
        </p>
      </section>

      <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 sm:p-7">
        <div className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
          A little about {pet.name}
        </div>
        <p className="mt-3 text-base leading-7 text-white/80">
          {pet.temperament}
        </p>
      </section>

      {isMissing && (
        <section className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-5">
            <div className="text-xs font-bold uppercase tracking-[0.17em] text-white/50">
              Last seen
            </div>
            <p className="mt-2 text-base font-semibold leading-6 text-white">
              {pet.lastSeen}
            </p>
          </div>

          <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-5">
            <div className="text-xs font-bold uppercase tracking-[0.17em] text-white/50">
              Help bring {pet.name} home
            </div>
            <p className="mt-2 text-base font-semibold leading-6 text-white">
              {pet.rewardText}
            </p>
          </div>
        </section>
      )}

      <section className="rounded-[26px] border border-cyan-300/12 bg-cyan-400/[0.04] p-5 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-100">
          HomePlanet Pet Tag
        </p>

        <p className="mt-2 text-sm leading-6 text-white/55">
          This page is connected directly to {pet.name}&apos;s Pet Tag. No app or account is needed to help.
        </p>
      </section>

      {pet.id === "bella-demo" && (
        <section className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035]">
          <img
            src="/images/bella-home-safe-reunion.jpg"
            alt="A beloved golden retriever reunited safely with her owner"
            className="aspect-[16/10] w-full object-cover sm:aspect-[16/9]"
          />

          <div className="p-5 text-left sm:p-7">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Every scan has the chance to become a moment like this.
            </h2>

            <p className="mt-3 max-w-2xl text-base leading-7 text-white/65">
              A stranger took a minute to help. One phone call or text changed
              everything. Thank you for helping pets find their way back home.
            </p>
          </div>
        </section>
      )}

      {/* PET TAG LIVE PAGE FOOTER */}
      <footer className="mt-8 border-t border-white/[0.08] px-1 pb-3 pt-7">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/35">
                HomePlanet
              </span>

              <span className="relative inline-flex items-center rounded-full border border-cyan-300/25 bg-cyan-300/[0.06] py-1.5 pl-4 pr-3 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200">
                <span className="absolute left-2 h-1 w-1 rounded-full border border-cyan-200/55" />
                Pet Tag
              </span>
            </div>

            <p className="mt-3 max-w-md text-sm leading-6 text-white/45">
              Helping pets and the people who find them connect safely.
            </p>
          </div>

          <nav
            aria-label="Pet Tag live page footer"
            className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold text-white/45"
          >
            <Link
              to={PET_BASE_PATH}
              className="transition hover:text-white"
            >
              Pet Tag
            </Link>

            <Link
              to={`${PET_BASE_PATH}/privacy`}
              className="transition hover:text-white"
            >
              Privacy
            </Link>

            <Link
              to="/"
              className="transition hover:text-white"
            >
              HomePlanet
            </Link>
          </nav>
        </div>

        <div className="mt-6 border-t border-white/[0.06] pt-5 text-xs text-white/30">
          © 2026 HomePlanet. All rights reserved.
        </div>
      </footer>

    </div>
  );
}

function SituationButton({
  active,
  title,
  body,
  onClick,
}: {
  active: boolean;
  title: string;
  body: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-[22px] border p-4 text-left transition",
        active
          ? "border-cyan-300/45 bg-cyan-400/12"
          : "border-white/10 bg-white/[0.035] hover:bg-white/[0.06]"
      )}
    >
      <div className="text-base font-bold text-white">{title}</div>
      <div className="mt-1 text-sm leading-6 text-white/58">{body}</div>
    </button>
  );
}

function FinderPage({ pet }: { pet: DemoPet }) {
  const [form, setForm] = useState<FinderFormState>(INITIAL_FINDER_FORM);
  const [submitted, setSubmitted] = useState(false);

  function updateField<K extends keyof FinderFormState>(
    field: K,
    value: FinderFormState[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  const canSubmit = Boolean(form.situation && form.foundLocation.trim());

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl pb-8 pt-2">
        <section className="rounded-[30px] border border-emerald-300/20 bg-emerald-400/[0.07] p-6 text-center sm:p-8">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-300 text-2xl font-black text-[#07111f]">
            ✓
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-white">
            Thank you for helping {pet.name}.
          </h1>

          <p className="mt-3 text-sm leading-7 text-white/68">
            Your update has been captured in this Pet Tag preview. Keep
            {pet.name} safe if you can, and contact {pet.ownerName} directly for
            the fastest response.
          </p>

          <div className="mt-6 grid gap-3">
            <a
              href={buildTelHref(pet.callNumber)}
              className="rounded-2xl bg-emerald-300 px-5 py-4 text-sm font-bold text-[#07111f]"
            >
              Call {pet.ownerName}
            </a>
            <a
              href={buildSmsHref(
                pet.textNumber,
                `Hi ${pet.ownerName}, I found ${pet.name}. I submitted a found update from ${pet.name}'s HomePlanet Pet Tag.`
              )}
              className="rounded-2xl bg-sky-300 px-5 py-4 text-sm font-bold text-[#07111f]"
            >
              Text {pet.ownerName}
            </a>
            <Link
              to={`${PET_BASE_PATH}/pet/${pet.id}`}
              className="rounded-2xl border border-white/12 bg-white/[0.05] px-5 py-4 text-sm font-bold text-white"
            >
              Back to {pet.name}'s Page
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-4 pb-8 pt-2">
      <section className="rounded-[30px] border border-white/10 bg-white/[0.045] p-5 sm:p-7">
        <div className="flex items-center gap-4">
          <img
            src={pet.photoUrl}
            alt={pet.name}
            className="h-20 w-20 shrink-0 rounded-[20px] object-cover"
          />
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
              Found pet update
            </div>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
              You found {pet.name}?
            </h1>
          </div>
        </div>

        <p className="mt-5 text-sm leading-7 text-white/68">
          Keep this quick. Tell {pet.ownerName} what is happening and where
          {pet.name} is.
        </p>
      </section>

      <form onSubmit={handleSubmit} className="space-y-4">
        <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
          <label className="text-sm font-bold text-white">
            What is happening right now?
          </label>

          <div className="mt-4 space-y-2">
            <SituationButton
              active={form.situation === "safe-with-me"}
              title={`${pet.name} is safe with me`}
              body="I have the pet with me now."
              onClick={() => updateField("situation", "safe-with-me")}
            />
            <SituationButton
              active={form.situation === "seen-nearby"}
              title={`I saw ${pet.name} nearby`}
              body="I saw the pet but could not safely catch or keep them."
              onClick={() => updateField("situation", "seen-nearby")}
            />
            <SituationButton
              active={form.situation === "appears-hurt"}
              title={`${pet.name} may be hurt`}
              body="The pet appears injured, sick, or in immediate distress."
              onClick={() => updateField("situation", "appears-hurt")}
            />
          </div>
        </section>

        <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
          <label className="block">
            <span className="text-sm font-bold text-white">
              Where is {pet.name}?
            </span>
            <span className="mt-1 block text-xs leading-5 text-white/48">
              Street, neighborhood, park, landmark, or another clear location.
            </span>

            <input
              required
              value={form.foundLocation}
              onChange={(event) =>
                updateField("foundLocation", event.target.value)
              }
              placeholder="Example: Taylor Creek near the boat ramp"
              className="mt-3 w-full rounded-2xl border border-white/12 bg-white px-4 py-4 text-base text-black outline-none placeholder:text-gray-500 focus:border-cyan-400"
            />
          </label>
        </section>

        <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
          <div className="text-sm font-bold text-white">
            Optional details
          </div>
          <p className="mt-1 text-xs leading-5 text-white/48">
            Add only what could help the owner respond.
          </p>

          <div className="mt-4 space-y-3">
            <input
              value={form.finderName}
              onChange={(event) =>
                updateField("finderName", event.target.value)
              }
              placeholder="Your first name"
              className="w-full rounded-2xl border border-white/12 bg-white px-4 py-4 text-base text-black outline-none placeholder:text-gray-500 focus:border-cyan-400"
            />

            <input
              value={form.callbackNumber}
              onChange={(event) =>
                updateField("callbackNumber", event.target.value)
              }
              placeholder="Callback number"
              inputMode="tel"
              className="w-full rounded-2xl border border-white/12 bg-white px-4 py-4 text-base text-black outline-none placeholder:text-gray-500 focus:border-cyan-400"
            />

            <textarea
              value={form.message}
              onChange={(event) =>
                updateField("message", event.target.value)
              }
              placeholder={`Anything ${pet.ownerName} should know?`}
              rows={4}
              className="w-full rounded-2xl border border-white/12 bg-white px-4 py-4 text-base text-black outline-none placeholder:text-gray-500 focus:border-cyan-400"
            />
          </div>
        </section>

        <button
          type="submit"
          disabled={!canSubmit}
          className={cn(
            "w-full rounded-2xl px-5 py-4 text-base font-bold transition",
            canSubmit
              ? "bg-cyan-300 text-[#06111d] active:scale-[0.99]"
              : "cursor-not-allowed bg-white/8 text-white/35"
          )}
        >
          Send Found Update
        </button>

        <div className="grid grid-cols-2 gap-2">
          <a
            href={buildTelHref(pet.callNumber)}
            className="rounded-2xl border border-white/12 bg-white/[0.05] px-4 py-3 text-center text-sm font-semibold text-white"
          >
            Call Owner
          </a>
          <Link
            to={`${PET_BASE_PATH}/pet/${pet.id}`}
            className="rounded-2xl border border-white/12 bg-white/[0.05] px-4 py-3 text-center text-sm font-semibold text-white"
          >
            Back to Pet
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function GuardianPetTagDemo() {
  const location = useLocation();

  const pet = useMemo(() => {
    return location.pathname.toLowerCase().includes("vamp") ? VAMP : BELLA;
  }, [location.pathname]);

  const currentView = useMemo(() => {
    if (location.pathname.includes("/guardian-pet/found/")) return "found";
    if (location.pathname.includes("/guardian-pet/pet/")) return "pet";
    return "landing";
  }, [location.pathname]);

  return (
    <PetTagShell compact={currentView !== "landing"}>
      {currentView === "landing" && <PetTagLanding />}
      {currentView === "pet" && <PetLivePage pet={pet} />}
      {currentView === "found" && <FinderPage pet={pet} />}
    </PetTagShell>
  );
}

























