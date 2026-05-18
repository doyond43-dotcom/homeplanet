import { useState } from "react";
import { ArrowRight, Briefcase, HeartHandshake, Home, MapPin, Send, Users } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function OkeechobeeTogetherPage() {
  const [submitStatus, setSubmitStatus] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "");
    const type = String(form.get("type") || "");
    const message = String(form.get("message") || "");

    setSubmitStatus("Saving...");

    const { error } = await supabase.from("okeechobee_community_requests").insert({
      name,
      type,
      message,
      status: "new",
    });

    if (error) {
      console.error(error);
      setSubmitStatus("Something went wrong saving it. Messenger will still open as backup.");
    } else {
      setSubmitStatus("Saved. Opening Messenger as backup.");
      e.currentTarget.reset();
    }

    const text = encodeURIComponent(
      `Okeechobee Together Submission

Name: ${name}
Type: ${type}

Message:
${message}`
    );

    window.open(`https://m.me/doyon.56?text=${text}`, "_blank");
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-5 py-10">
        <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
          <MapPin className="h-4 w-4" />
          Okeechobee, Florida
        </div>

        <h1 className="text-5xl font-black tracking-tight sm:text-6xl">Okeechobee Together</h1>

        <p className="mt-5 text-2xl font-semibold text-neutral-200">
          Real people. Real needs. Real local support.
        </p>

        <p className="mt-6 text-lg leading-8 text-neutral-300">
          One flat tire, one missed paycheck, one broken AC unit, one accident,
          or one medical emergency can push a family behind.
        </p>

        <p className="mt-4 text-lg leading-8 text-neutral-300">
          This is the beginning of a local support board for Okeechobee —
          connecting people, rides, work, food support, local businesses,
          skills, and neighbors who want to help.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white px-5 py-5 text-neutral-950 shadow-xl">
            <HeartHandshake className="mb-4 h-6 w-6" />
            <div className="font-bold">I Need Help</div>
            <div className="mt-1 text-sm text-neutral-600">Food, rides, support, emergency needs.</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-neutral-900 px-5 py-5">
            <Users className="mb-4 h-6 w-6 text-emerald-300" />
            <div className="font-bold">I Want To Help</div>
            <div className="mt-1 text-sm text-neutral-400">Volunteer, offer skills, rides, or resources.</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-neutral-900 px-5 py-5">
            <Briefcase className="mb-4 h-6 w-6 text-amber-300" />
            <div className="font-bold">Local Business</div>
            <div className="mt-1 text-sm text-neutral-400">Businesses that want to support the town.</div>
          </div>
        </div>

        <form
          id="community-form"
          onSubmit={handleSubmit}
          className="mt-8 rounded-3xl border border-white/10 bg-neutral-900 p-6"
        >
          <h2 className="text-2xl font-bold">Send A Local Need Or Offer</h2>

          <p className="mt-2 text-neutral-400">
            Need help? Want to help? Own a local business? Reach out directly while this is being built.
          </p>

          <div className="mt-6 grid gap-4">
            <input
              name="name"
              placeholder="Your name"
              className="rounded-2xl border border-white/10 bg-black px-4 py-4 text-white outline-none"
              required
            />

            <select
              name="type"
              className="rounded-2xl border border-white/10 bg-black px-4 py-4 text-white outline-none"
              required
            >
              <option value="">Select one</option>
              <option>I Need Help</option>
              <option>I Want To Help</option>
              <option>Local Business</option>
              <option>I Want Hands-On Experience</option>
            </select>

            <textarea
              name="message"
              placeholder="What would you like to share?"
              rows={5}
              className="rounded-2xl border border-white/10 bg-black px-4 py-4 text-white outline-none"
              required
            />

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-5 py-4 font-bold text-black transition hover:scale-[1.02]"
            >
              Send Message
              <Send className="h-5 w-5" />
            </button>
          </div>

          {submitStatus && (
            <p className="mt-4 text-sm text-emerald-300">{submitStatus}</p>
          )}

          <p className="mt-4 text-sm text-neutral-500">Live community board coming next.</p>
        </form>

        <div className="mt-8 rounded-3xl border border-white/10 bg-neutral-900 p-6">
          <div className="flex items-start gap-4">
            <Home className="mt-1 h-6 w-6 text-emerald-300" />
            <div>
              <h2 className="text-xl font-bold">This is only the beginning.</h2>
              <p className="mt-3 leading-7 text-neutral-300">
                Okeechobee deserves better local connection systems than scattered
                Facebook comments. For now, message Daniel directly while this is
                being built.
              </p>

              <a href="https://www.facebook.com/doyon.56/" className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-400 px-5 py-3 font-bold text-neutral-950">
                Message Daniel
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}





