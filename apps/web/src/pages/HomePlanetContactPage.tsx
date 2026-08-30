import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function HomePlanetContactPage() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [question, setQuestion] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanName = name.trim();
    const cleanContact = contact.trim();
    const cleanBusiness = businessName.trim();
    const cleanQuestion = question.trim();

    setError("");

    if (!cleanName) {
      setError("Please add your name.");
      return;
    }

    if (!cleanContact) {
      setError("Please add an email address or phone number.");
      return;
    }

    if (!cleanQuestion) {
      setError("Please tell us what you would like to ask.");
      return;
    }

    setSaving(true);

    const leadId = crypto.randomUUID();

    const { error: insertError } = await supabase
      .from("homeplanet_leads")
      .insert({
        id: leadId,
        name: cleanName,
        contact: cleanContact,
        message: cleanQuestion,
        selected_operation:
          new URLSearchParams(window.location.search).get("source") ===
          "okeechobee-live-meat-market"
            ? "Okeechobee Live Meat Market Question"
            : "Ask A Question",
        board_slug:
          new URLSearchParams(window.location.search).get("source") ===
          "okeechobee-live-meat-market"
            ? "okeechobee-live-meat-market"
            : null,
        business_name: cleanBusiness,
      });

    setSaving(false);

    if (insertError) {
      console.error("[homeplanet-contact] insert failed:", insertError);

      setError("Your question could not be sent yet. Please try again in a moment.");
      return;
    }

    try {
      const notifyResponse = await fetch("/api/homeplanet-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project: "homeplanet-contact",
          requestId: leadId,
        }),
      });

      const notifyResult = await notifyResponse.json().catch(() => null);

      if (!notifyResponse.ok || !notifyResult?.accepted) {
        console.warn(
          "[homeplanet-contact] email notification was not accepted:",
          notifyResult
        );

        setError("Your question was saved, but the notification could not be completed. Please try again.");
        return;
      }
    } catch (notifyError) {
      console.warn(
        "[homeplanet-contact] email notification request failed:",
        notifyError
      );

      setError("Your question was saved, but the notification could not be completed. Please try again.");
      return;
    }

    setSaved(true);
    setName("");
    setContact("");
    setBusinessName("");
    setQuestion("");
  }

  return (
    <main className="min-h-screen bg-[#020504] text-white">
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-5xl px-5 pb-16 pt-6 sm:px-8 lg:px-12">
          <header className="flex items-center justify-between gap-6">
            <Link
              to="/"
              className="text-sm font-black uppercase tracking-[0.28em] text-emerald-300"
            >
              HomePlanet
            </Link>

            <Link
              to="/planet/custom-websites"
              className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500 transition hover:text-white"
            >
              Back To HomePlanet
            </Link>
          </header>

          <div className="max-w-3xl pt-16 sm:pt-20">
            <p className="text-xs font-black uppercase tracking-[0.38em] text-emerald-300">
              Ask HomePlanet
            </p>

            <h1 className="mt-5 text-5xl font-black leading-[0.94] tracking-[-0.05em] sm:text-6xl">
              Have a question?
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
              You do not need to be ready to start a project. Ask us about
              HomePlanet, how the systems work, or whether something could work
              for your business or organization.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.25fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-zinc-600">
              Simple By Design
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
              Just ask the question.
            </h2>

            <p className="mt-5 max-w-md text-base leading-7 text-zinc-400">
              No sales maze. No giant intake form. Give us enough information
              to understand what you are asking and how to reach you.
            </p>

            <div className="mt-8 rounded-[24px] border border-emerald-300/15 bg-emerald-300/[0.035] p-5">
              <p className="text-sm font-bold leading-6 text-zinc-300">
                Your information is used to respond to your request.
                HomePlanet does not sell your personal information.
              </p>

              <div className="mt-4 flex gap-4 text-xs font-bold text-zinc-500">
                <Link to="/privacy" className="transition hover:text-white">
                  Privacy
                </Link>

                <Link to="/terms" className="transition hover:text-white">
                  Terms
                </Link>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/[0.025] p-5 sm:p-7">
            {saved ? (
              <div className="rounded-[24px] border border-emerald-300/20 bg-emerald-300/[0.045] p-6">
                <p className="text-xs font-black uppercase tracking-[0.26em] text-emerald-300">
                  Question Sent
                </p>

                <h2 className="mt-4 text-3xl font-black">
                  We received it.
                </h2>

                <p className="mt-4 text-base leading-7 text-zinc-400">
                  HomePlanet can follow up using the contact information you
                  provided.
                </p>

                <button
                  type="button"
                  onClick={() => setSaved(false)}
                  className="mt-6 rounded-full border border-white/15 px-5 py-3 text-sm font-black transition hover:border-white/30"
                >
                  Ask Another Question
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-5">
                <div>
                  <label
                    htmlFor="homeplanet-contact-name"
                    className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500"
                  >
                    Name
                  </label>

                  <input
                    id="homeplanet-contact-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-4 text-white outline-none transition placeholder:text-zinc-700 focus:border-emerald-300/45"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="homeplanet-contact-method"
                    className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500"
                  >
                    Email or phone
                  </label>

                  <input
                    id="homeplanet-contact-method"
                    value={contact}
                    onChange={(event) => setContact(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-4 text-white outline-none transition placeholder:text-zinc-700 focus:border-emerald-300/45"
                    placeholder="How should we reach you?"
                  />
                </div>

                <div>
                  <label
                    htmlFor="homeplanet-contact-business"
                    className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500"
                  >
                    Business / Organization
                    <span className="ml-2 normal-case tracking-normal text-zinc-700">
                      optional
                    </span>
                  </label>

                  <input
                    id="homeplanet-contact-business"
                    value={businessName}
                    onChange={(event) => setBusinessName(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-4 text-white outline-none transition placeholder:text-zinc-700 focus:border-emerald-300/45"
                    placeholder="Business or organization name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="homeplanet-contact-question"
                    className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500"
                  >
                    Your question
                  </label>

                  <textarea
                    id="homeplanet-contact-question"
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    rows={7}
                    className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/35 px-4 py-4 text-white outline-none transition placeholder:text-zinc-700 focus:border-emerald-300/45"
                    placeholder="What would you like to know?"
                  />
                </div>

                {error ? (
                  <div className="rounded-2xl border border-red-400/20 bg-red-400/[0.06] px-4 py-3 text-sm font-bold text-red-200">
                    {error}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-emerald-300 px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-black transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Sending..." : "Send Question"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-5xl flex-col gap-5 px-5 py-8 text-xs font-bold text-zinc-600 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <span>HomePlanet</span>

          <div className="flex flex-wrap gap-5">
            <Link to="/planet/custom-websites" className="transition hover:text-white">
              Custom Websites
            </Link>

            <Link to="/planet/custom-systems/examples" className="transition hover:text-white">
              Custom Systems
            </Link>

            <Link to="/privacy" className="transition hover:text-white">
              Privacy
            </Link>

            <Link to="/terms" className="transition hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
