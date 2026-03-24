import { useState } from "react";

export default function RequestAccessSection() {
  const [form, setForm] = useState({
    name: "",
    business: "",
    type: "",
    city: "",
    contact: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        "https://kcmcssyyopmvqglsddyw.supabase.co/rest/v1/request_access",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjbWNzc3l5b3BtdnFnbHNkZHl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4NjUwODUsImV4cCI6MjA4NDQ0MTA4NX0.OWjhyCAzhVkMfMrBL96FLjdUUlU51B8N3mKuBvqntt4",
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjbWNzc3l5b3BtdnFnbHNkZHl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4NjUwODUsImV4cCI6MjA4NDQ0MTA4NX0.OWjhyCAzhVkMfMrBL96FLjdUUlU51B8N3mKuBvqntt4",
          },
          body: JSON.stringify({
            name: form.name,
            business: form.business,
            type: form.type,
            city: form.city,
            contact: form.contact,
            message: form.message,
          }),
        }
      );

      const text = await res.text();
      console.log("SUPABASE RESPONSE:", res.status, text);

      if (!res.ok) {
        throw new Error(text || "Failed to submit");
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error("ERROR:", err.message);
      alert("Submission failed:\n" + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-20">
      <div className="rounded-[28px] border border-emerald-400/15 bg-white/[0.03] p-6 shadow-[0_0_50px_rgba(16,185,129,0.08)] backdrop-blur-sm md:p-10">

        {/* HEADER */}
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300/80">
            Request Access
          </p>

          <h2 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
            Ready to Bring Your Business Into HomePlanet?
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/65 md:text-base">
            Tell us about your business and what you’re looking to improve. We’ll review your request and respond directly through your submission.
          </p>
        </div>

        {/* SUCCESS STATE */}
        {submitted ? (
          <div className="py-10 text-center">
            <h3 className="mb-2 text-2xl font-semibold text-emerald-300">
              Request Received ⚡
            </h3>
            <p className="text-white/60">
              Your submission was successfully saved.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">

            <input
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
              className="rounded-lg border border-white/10 bg-black/40 p-3 text-sm text-white outline-none focus:border-emerald-400"
            />

            <input
              name="business"
              placeholder="Business Name"
              value={form.business}
              onChange={handleChange}
              required
              className="rounded-lg border border-white/10 bg-black/40 p-3 text-sm text-white outline-none focus:border-emerald-400"
            />

            <input
              name="type"
              placeholder="Business Type (Auto, Lawn, etc.)"
              value={form.type}
              onChange={handleChange}
              className="rounded-lg border border-white/10 bg-black/40 p-3 text-sm text-white outline-none focus:border-emerald-400"
            />

            <input
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              className="rounded-lg border border-white/10 bg-black/40 p-3 text-sm text-white outline-none focus:border-emerald-400"
            />

            <input
              name="contact"
              placeholder="Email or preferred contact"
              value={form.contact}
              onChange={handleChange}
              required
              className="md:col-span-2 rounded-lg border border-white/10 bg-black/40 p-3 text-sm text-white outline-none focus:border-emerald-400"
            />

            <textarea
              name="message"
              placeholder="What are you trying to fix or improve in your business?"
              value={form.message}
              onChange={handleChange}
              rows={4}
              className="md:col-span-2 rounded-lg border border-white/10 bg-black/40 p-3 text-sm text-white outline-none focus:border-emerald-400"
            />

            <button
              type="submit"
              disabled={loading}
              className="md:col-span-2 mt-2 rounded-lg bg-emerald-500 py-3 font-semibold text-black transition hover:bg-emerald-400 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Request Access"}
            </button>

            <p className="md:col-span-2 mt-2 text-center text-xs text-white/50">
              Your data belongs to you. HomePlanet does not track, sell, or exploit your information—only uses it to respond to your request.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}