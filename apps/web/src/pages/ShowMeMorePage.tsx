import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function ShowMeMorePage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [request, setRequest] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  async function handleSend() {
    const trimmedRequest = request.trim();

    if (!trimmedRequest || submitting) {
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    const trimmedContact = contact.trim();
    const isEmail = trimmedContact.includes("@");

    const { error } = await supabase
      .from("custom_systems_public_requests")
      .insert({
        problem: trimmedRequest.slice(0, 200),
        business_name: "New Movie Request",
        what_you_do: "Asked to see more of a HomePlanet system.",
        current_flow: "Submitted through the HomePlanet Show Me More doorway.",
        breakdowns: [],
        existing_link: null,
        name: name.trim() || null,
        phone: trimmedContact && !isEmail ? trimmedContact : null,
        email: trimmedContact && isEmail ? trimmedContact : null,
        notes: "Show Me More request",
        status: "New Lead",
      });

    if (error) {
      console.error("Show Me More submission error", error);
      setSubmitError("I couldn't send that just yet. Please try again.");
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    setStep(3);
  }

  return (
    <main className="min-h-screen bg-[#07110d] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-5 py-12">
        <section className="w-full">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-400">
            HomePlanet
          </p>

          {step === 1 && (
            <>
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                I'd Like To See More
              </h1>

              <div className="mt-10">
                <label
                  htmlFor="show-me-more-request"
                  className="mb-3 block text-lg font-bold"
                >
                  What would you like to see?
                </label>

                <textarea
                  id="show-me-more-request"
                  rows={5}
                  value={request}
                  onChange={(event) => setRequest(event.target.value)}
                  placeholder="I'd like to see the auto shop system."
                  className="w-full resize-none rounded-2xl border border-emerald-500/40 bg-black/30 px-4 py-4 text-lg text-white outline-none placeholder:text-white/35 focus:border-emerald-400"
                />

                <button
                  type="button"
                  onClick={() => {
                    if (request.trim()) {
                      setStep(2);
                    }
                  }}
                  className="mt-4 w-full rounded-2xl bg-emerald-400 px-5 py-4 text-lg font-black text-black transition hover:bg-emerald-300"
                >
                  Show Me More
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                Perfect.
              </h1>

              <div className="mt-8 space-y-4 text-lg leading-8 text-white/80">
                <p>I'd love to show you.</p>

                <p>Before I do, I want you to know something.</p>

                <p className="font-semibold text-white">
                  We don't sell your information. We don't hand it off to third parties.
                  We only use it if you'd like me to follow up about what you asked to see.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Name (optional)"
                  className="w-full rounded-2xl border border-emerald-500/40 bg-black/30 px-4 py-4 text-lg text-white outline-none placeholder:text-white/35 focus:border-emerald-400"
                />

                <input
                  type="text"
                  value={contact}
                  onChange={(event) => setContact(event.target.value)}
                  placeholder="Phone or Email (optional)"
                  className="w-full rounded-2xl border border-emerald-500/40 bg-black/30 px-4 py-4 text-lg text-white outline-none placeholder:text-white/35 focus:border-emerald-400"
                />

                {submitError && (
                  <p className="text-sm font-semibold text-red-300">
                    {submitError}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleSend}
                  disabled={submitting}
                  className="w-full rounded-2xl bg-emerald-400 px-5 py-4 text-lg font-black text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Sending..." : "Send"}
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                Perfect.
              </h1>

              <div className="mt-8 space-y-4 text-lg leading-8 text-white/80">
                <p className="font-semibold text-white">
                  I got your request.
                </p>

                <p>
                  I'll take a look and follow up if you left a way to reach you.
                </p>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
