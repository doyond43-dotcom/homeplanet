import { Link } from "react-router-dom";

export default function GuardianPetPrivacyPage() {
  return (
    <div className="min-h-screen bg-[#07111f] text-white">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">

        {/* PRODUCT MARK */}
        <div className="flex justify-center">
          <Link
            to="/planet/guardian-pet"
            className="relative inline-flex items-center rounded-full border border-cyan-300/30 bg-cyan-300/[0.07] py-2 pl-5 pr-4 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200"
          >
            <span className="absolute left-2.5 h-1.5 w-1.5 rounded-full border border-cyan-200/60" />
            Pet Tag
          </Link>
        </div>

        {/* INTRO */}
        <section className="mx-auto max-w-3xl pb-14 pt-12 text-center sm:pb-16 sm:pt-16">
          <div className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
            Privacy & Safety
          </div>

          <h1 className="mt-4 text-4xl font-bold leading-[1.03] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
            Your pet can be found
            <span className="block text-cyan-300">
              without exposing your life.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/62">
            HomePlanet Pet Tag is designed to help someone assist your pet
            without automatically giving strangers access to private household
            information.
          </p>
        </section>

        {/* PRIVACY PRINCIPLES */}
        <section className="border-t border-white/[0.08] py-12 sm:py-16">
          <div className="divide-y divide-white/[0.08]">

            <div className="grid gap-3 py-7 sm:grid-cols-[220px_1fr] sm:gap-10">
              <h2 className="text-xl font-bold text-white">
                You choose what is visible
              </h2>

              <p className="text-base leading-7 text-white/60">
                A pet owner decides what information is useful for a finder to
                see. That may include the pet&apos;s name, photo, temperament,
                safety notes, and selected contact options.
              </p>
            </div>

            <div className="grid gap-3 py-7 sm:grid-cols-[220px_1fr] sm:gap-10">
              <h2 className="text-xl font-bold text-white">
                Private details stay private
              </h2>

              <p className="text-base leading-7 text-white/60">
                A scan should not automatically reveal a home address, private
                email, internal account information, veterinarian records, or
                other details the owner has not chosen to share.
              </p>
            </div>

            <div className="grid gap-3 py-7 sm:grid-cols-[220px_1fr] sm:gap-10">
              <h2 className="text-xl font-bold text-white">
                No constant location tracking
              </h2>

              <p className="text-base leading-7 text-white/60">
                The Pet Tag itself does not continuously broadcast or track
                your pet&apos;s location. A scan is a real-world signal that
                someone has physically encountered the tag and opened the
                connected pet page.
              </p>
            </div>

            <div className="grid gap-3 py-7 sm:grid-cols-[220px_1fr] sm:gap-10">
              <h2 className="text-xl font-bold text-white">
                No battery in the tag
              </h2>

              <p className="text-base leading-7 text-white/60">
                The QR tag does not depend on a battery that must be charged or
                replaced in order for someone to scan it.
              </p>
            </div>

            <div className="grid gap-3 py-7 sm:grid-cols-[220px_1fr] sm:gap-10">
              <h2 className="text-xl font-bold text-white">
                Recovery information is controlled
              </h2>

              <p className="text-base leading-7 text-white/60">
                More sensitive information should only be shared when it is
                needed and when the owner chooses to share it as part of the
                recovery process.
              </p>
            </div>

          </div>
        </section>

        {/* SIMPLE TRUST STATEMENT */}
        <section className="py-10 sm:py-14">
          <div className="rounded-[28px] border border-cyan-300/12 bg-[#102330] px-6 py-8 sm:px-10 sm:py-10">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">
              The principle
            </div>

            <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-white sm:text-4xl">
              Share what helps.
              <span className="block text-cyan-300">
                Protect what does not need to be shared.
              </span>
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-white/58">
              The goal is simple: give a person enough information to help the
              pet while keeping the owner in control of more private details.
            </p>
          </div>
        </section>

        {/* RETURN */}
        <div className="flex justify-center py-10">
          <Link
            to="/planet/guardian-pet"
            className="rounded-2xl bg-cyan-300 px-7 py-4 text-sm font-bold text-[#07111f] transition hover:bg-cyan-200"
          >
            Back to Pet Tag
          </Link>
        </div>

        {/* FOOTER */}
        <footer className="border-t border-white/[0.08] py-8">
          <div className="flex flex-col gap-5 text-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="font-bold text-cyan-200">
                Pet Tag
              </div>

              <div className="mt-1 text-white/42">
                © 2026 HomePlanet. All rights reserved.
              </div>
            </div>

            <div className="flex gap-5 text-white/48">
              <Link
                to="/planet/guardian-pet"
                className="transition hover:text-white"
              >
                Pet Tag
              </Link>

              <Link
                to="/"
                className="transition hover:text-white"
              >
                HomePlanet
              </Link>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
