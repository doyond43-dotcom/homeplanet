export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#070707] px-5 py-12 text-white sm:px-8 sm:py-16">
      <article className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-[#101010] p-6 shadow-2xl shadow-black/30 sm:p-10">
        <header className="border-b border-white/10 pb-7">
          <div className="text-sm font-bold uppercase tracking-[0.2em] text-[#d6a84f]">
            HomePlanet
          </div>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Terms of Use
          </h1>
        </header>

        <div className="mt-8 space-y-8 text-base leading-7 text-white/75">
          <section>
            <h2 className="text-xl font-bold text-white">HomePlanet services</h2>
            <p className="mt-3">
              HomePlanet provides web-based business and customer workflow
              systems, including tools that support customer requests, service
              coordination, project updates, secure information exchange, and
              transactional communications.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">SMS terms</h2>
            <p className="mt-3">
              Text messages relate to customer-initiated requests or services.
              Message frequency varies. Message and data rates may apply.
              Carriers are not liable for delayed or undelivered messages. Reply
              STOP to cancel SMS messages. Reply HELP for assistance. Consent is
              not a condition of purchase.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">Acceptable use</h2>
            <p className="mt-3">
              You may not misuse HomePlanet services, interfere with their
              operation, attempt unauthorized access, submit unlawful or harmful
              content, or use the services in a way that violates applicable
              law or the rights of others.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">Accuracy and availability</h2>
            <p className="mt-3">
              You are responsible for providing accurate information when using
              the services. HomePlanet works to keep its systems useful and
              available, but information, features, and availability may change,
              and uninterrupted or error-free operation is not guaranteed.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">Limitation of liability</h2>
            <p className="mt-3">
              To the extent permitted by applicable law, HomePlanet is not
              responsible for indirect, incidental, or consequential losses
              arising from use of, or inability to use, the services. Nothing in
              these terms excludes liability that cannot lawfully be excluded or
              limited.
            </p>
          </section>

          <section className="border-t border-white/10 pt-7">
            <h2 className="text-xl font-bold text-white">Contact</h2>
            <p className="mt-3">
              For questions about these terms, contact HomePlanet through{" "}
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
