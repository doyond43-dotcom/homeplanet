export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#070707] px-5 py-12 text-white sm:px-8 sm:py-16">
      <article className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-[#101010] p-6 shadow-2xl shadow-black/30 sm:p-10">
        <header className="border-b border-white/10 pb-7">
          <div className="text-sm font-bold uppercase tracking-[0.2em] text-[#d6a84f]">
            HomePlanet
          </div>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Privacy Policy
          </h1>
        </header>

        <div className="mt-8 space-y-8 text-base leading-7 text-white/75">
          <section>
            <h2 className="text-xl font-bold text-white">Information we collect</h2>
            <p className="mt-3">
              HomePlanet may collect personal information such as your name,
              email address, mobile phone number, request or service details,
              and other information you voluntarily submit through a
              HomePlanet-powered form, page, upload, or communication.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">How we use information</h2>
            <p className="mt-3">
              We use information to provide and support the services you
              request, communicate with you, send transactional confirmations
              and appointment or project updates, provide secure document
              requests, and deliver customer-care messages related to your
              request or service relationship.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">Data protection</h2>
            <p className="mt-3">
              HomePlanet uses reasonable administrative, technical, and
              organizational practices intended to protect personal
              information. No method of transmission or storage is completely
              secure, so we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">Information sharing</h2>
            <p className="mt-3">
              HomePlanet does not sell personal information. Information may be
              handled by service providers when reasonably necessary to operate
              the requested service, maintain the platform, or deliver customer
              communications.
            </p>
            <p className="mt-3">
              All the above categories exclude text messaging originator opt-in
              data and consent; this information won’t be shared with any third
              parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">SMS and text messaging</h2>
            <p className="mt-3">
              Users opt in voluntarily to receive transactional text messages.
              Message frequency varies according to the request or service.
              Message and data rates may apply. Reply STOP to opt out. Reply
              HELP for help. Consent is not a condition of purchase.
            </p>
          </section>

          <section className="border-t border-white/10 pt-7">
            <h2 className="text-xl font-bold text-white">Contact</h2>
            <p className="mt-3">
              For privacy questions or requests, contact HomePlanet through{" "}
              <a
                href="https://www.homeplanet.city"
                className="font-semibold text-[#d6a84f] underline underline-offset-4"
              >
                homeplanet.city
              </a>
              .
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
