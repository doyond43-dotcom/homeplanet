export default function SmsConsentPage() {
  return (
    <main className="min-h-screen bg-[#070707] px-5 py-12 text-white sm:px-8 sm:py-16">
      <section className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-[#101010] p-6 shadow-2xl shadow-black/30 sm:p-10">
        <header className="border-b border-white/10 pb-7">
          <div className="text-sm font-bold uppercase tracking-[0.2em] text-[#d6a84f]">
            HomePlanet
          </div>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Text Message Consent
          </h1>
        </header>

        <div className="mt-7 space-y-5 text-base leading-7 text-white/75">
          <p>
            Customers voluntarily provide their mobile number and consent to
            receive transactional text messages related to the request or
            service they initiated with HomePlanet.
          </p>

          <p>
            These messages may include request confirmations, appointment or
            project updates, secure document requests, and customer-care
            follow-up.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-5 sm:p-6">
          <div className="text-sm font-bold text-white">Mobile phone number</div>
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(555) 555-0123"
            readOnly
            aria-label="Mobile phone number example"
            className="mt-2 w-full rounded-xl border border-white/15 bg-[#171717] px-4 py-3 text-white outline-none placeholder:text-white/35"
          />

          <label className="mt-5 flex items-start gap-3 text-sm leading-6 text-white/80">
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 shrink-0 accent-[#d6a84f]"
            />
            <span>I agree to receive text messages related to my request.</span>
          </label>
          <p className="mt-3 text-xs leading-5 text-white/50">
            This optional checkbox is unchecked by default. By opting in, you
            acknowledge the HomePlanet{" "}
            <a
              href="/privacy"
              className="font-semibold text-[#d6a84f] underline underline-offset-4"
            >
              Privacy Policy
            </a>{" "}
            and{" "}
            <a
              href="/terms"
              className="font-semibold text-[#d6a84f] underline underline-offset-4"
            >
              Terms of Use
            </a>
            .
          </p>
        </div>

        <div className="mt-7 space-y-2 text-sm leading-6 text-white/65">
          <p>Message and data rates may apply.</p>
          <p>Reply STOP to opt out.</p>
          <p>Reply HELP for help.</p>
          <p>Consent is not a condition of purchase.</p>
        </div>

        <p className="mt-7 border-t border-white/10 pt-7 text-sm leading-6 text-white/55">
          HomePlanet does not use purchased contact lists and does not send
          unsolicited marketing messages. Text messages are sent only in
          connection with a customer-initiated request or service relationship.
        </p>
      </section>
    </main>
  );
}
