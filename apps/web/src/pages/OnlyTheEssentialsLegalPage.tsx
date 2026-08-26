import { Link, useLocation } from "react-router-dom";

export default function OnlyTheEssentialsLegalPage() {
  const location = useLocation();
  const isPrivacy = location.pathname.endsWith("/privacy");

  return (
    <main className="min-h-screen bg-[#090609] px-5 py-12 text-white sm:px-8 sm:py-16">
      <article className="mx-auto max-w-3xl rounded-[2rem] border border-pink-300/15 bg-[#140b12] p-6 shadow-2xl shadow-black/40 sm:p-10">
        <Link
          to="/onlytheessentials"
          className="text-sm font-semibold text-pink-300 hover:text-pink-200"
        >
          ← Back to Only The Essentials
        </Link>

        <header className="mt-8 border-b border-white/10 pb-7">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-pink-300">
            Only The Essentials Cleaning
          </p>
          <h1 className="mt-4 font-serif text-4xl italic text-pink-100 sm:text-5xl">
            {isPrivacy ? "Privacy Policy" : "Terms & Conditions"}
          </h1>
          <p className="mt-4 text-sm text-zinc-400">
            Effective August 26, 2026
          </p>
        </header>

        {isPrivacy ? (
          <div className="mt-8 space-y-8 text-sm leading-7 text-zinc-300">
            <section>
              <h2 className="text-xl font-bold text-white">Information we collect</h2>
              <p className="mt-3">
                When you request cleaning services, contact Only The Essentials
                Cleaning, or use this website, we may collect information you
                provide such as your name, phone number, email address, service
                address, preferred scheduling information, cleaning needs, home
                details, and notes you choose to provide.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white">How we use your information</h2>
              <p className="mt-3">
                Information is used to respond to requests, prepare estimates,
                communicate about cleaning services, schedule work, maintain job
                records, provide customer service, and operate the cleaning
                business.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white">HomePlanet</h2>
              <p className="mt-3">
                Only The Essentials Cleaning uses HomePlanet-powered tools to help
                receive requests, organize customer and job information, maintain
                workflow records, and communicate about services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white">Sharing information</h2>
              <p className="mt-3">
                Customer information is not sold. Information may be processed by
                service providers used to operate the website, communications,
                hosting, scheduling, or related business systems when necessary
                to provide the requested service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white">Photos and job information</h2>
              <p className="mt-3">
                Photos, notes, or other job information provided by a customer or
                created during service may be used for job documentation and
                customer service. Customer-specific photos will not be publicly
                used for marketing without appropriate permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white">Contact</h2>
              <p className="mt-3">
                For privacy questions or requests, contact Only The Essentials
                Cleaning at{" "}
                <a
                  href="mailto:Kaitlinlee863@gmail.com"
                  className="font-semibold text-pink-300 underline underline-offset-4"
                >
                  Kaitlinlee863@gmail.com
                </a>.
              </p>
            </section>
          </div>
        ) : (
          <div className="mt-8 space-y-8 text-sm leading-7 text-zinc-300">
            <section>
              <h2 className="text-xl font-bold text-white">Cleaning requests</h2>
              <p className="mt-3">
                Submitting a cleaning request or quote form does not by itself
                guarantee an appointment. Service availability, pricing, timing,
                and job details may need to be confirmed before work is scheduled.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white">Estimates and pricing</h2>
              <p className="mt-3">
                Estimates are based on the information available at the time they
                are provided. Final pricing may change if the actual condition,
                size, scope, requested services, or time required differs from the
                information originally provided.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white">Scheduling</h2>
              <p className="mt-3">
                Requested dates and times are preferences until confirmed. If you
                need to reschedule, update job information, or provide additional
                notes, please contact Only The Essentials Cleaning as soon as
                reasonably possible.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white">Access and safety</h2>
              <p className="mt-3">
                Customers are responsible for providing reasonable access to the
                property and communicating known conditions that could affect the
                safety or ability to perform the requested cleaning service,
                including pets, hazards, damaged areas, or restricted spaces.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white">Website and HomePlanet</h2>
              <p className="mt-3">
                This website and its request tools help connect customers with
                Only The Essentials Cleaning. HomePlanet provides technology used
                to support the workflow, while the cleaning services themselves
                are provided by Only The Essentials Cleaning.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white">Contact</h2>
              <p className="mt-3">
                Questions about services or these terms can be sent to{" "}
                <a
                  href="mailto:Kaitlinlee863@gmail.com"
                  className="font-semibold text-pink-300 underline underline-offset-4"
                >
                  Kaitlinlee863@gmail.com
                </a>.
              </p>
            </section>
          </div>
        )}

        <footer className="mt-10 border-t border-white/10 pt-6 text-xs text-zinc-500">
          © 2026 Only The Essentials Cleaning · Okeechobee, Florida
        </footer>
      </article>
    </main>
  );
}
