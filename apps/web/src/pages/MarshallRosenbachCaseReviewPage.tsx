import { FormEvent, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Phone, ShieldCheck } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import MarshallRosenbachFooter from "../components/MarshallRosenbachFooter";
import ShareMetadata from "../components/ShareMetadata";

const caseLabels: Record<string, string> = {
  "car-accident": "Car Accident",
  "truck-accident": "Truck Accident",
  "motorcycle-accident": "Motorcycle Accident",
  "train-collision": "Train Collision",
  "bicycle-accident": "Bicycle Accident",
  "pedestrian-accident": "Pedestrian Accident",
};

type FormState = {
  name: string;
  phone: string;
  email: string;
  incidentDate: string;
  details: string;
};

export default function MarshallRosenbachCaseReviewPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const caseType = searchParams.get("type") || "";
  const caseLabel = useMemo(
    () => caseLabels[caseType] || "Personal Injury",
    [caseType]
  );

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submittedCaseNumber, setSubmittedCaseNumber] = useState("");
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    email: "",
    incidentDate: "",
    details: "",
  });

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submitCaseReview = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting || submittedCaseNumber) return;

    const nameParts = form.name.trim().split(/\s+/).filter(Boolean);
    const firstName = nameParts.shift() || "";
    const lastName = nameParts.join(" ");
    if (
      !firstName ||
      !form.phone.trim() ||
      !form.email.trim() ||
      !form.incidentDate ||
      !form.details.trim()
    ) return;

    setSubmitting(true);
    setSubmitError("");

    const id = crypto.randomUUID();
    const caseNumber = `MR-${new Date().getFullYear()}-${id
      .replace(/-/g, "")
      .slice(0, 8)
      .toUpperCase()}`;

    const { error } = await supabase.from("marshall_cases").insert({
      id,
      case_number: caseNumber,
      case_type: caseLabel,
      status: "new_review",
      client_first_name: firstName,
      client_last_name: lastName || null,
      client_phone: form.phone.trim(),
      client_email: form.email.trim(),
      incident_date: form.incidentDate,
      incident_details: form.details.trim(),
      next_action: "Review case and contact client",
    });

    if (error) {
      console.error("Marshall case review submission failed:", error);
      setSubmitError(
        "We could not send your case review. Please try again or call Marshall."
      );
      setSubmitting(false);
      return;
    }

    try {
      const emailResponse = await fetch("/api/homeplanet-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project: "marshall-case-review",
          caseReference: caseNumber,
        }),
      });
      const emailResult = await emailResponse.json().catch(() => null);

      if (
        !emailResponse.ok ||
        !emailResult?.ok ||
        !emailResult?.accepted ||
        !emailResult?.messageId
      ) {
        console.warn("Marshall case email notification was not accepted", {
          error: emailResult?.error || "Unknown error",
          provider: emailResult?.provider || null,
          providerCode: emailResult?.providerCode || null,
        });
      }
    } catch (emailError) {
      console.warn("Marshall case email notification request failed", {
        error:
          emailError instanceof Error
            ? emailError.message
            : "Unknown email error",
      });
    }

    setSubmittedCaseNumber(caseNumber);
    setSubmitting(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-[#0c0d0f] text-white">
      <ShareMetadata
        title="Free Case Review | Marshall E. Rosenbach"
        description="Send a short, private case review to the Law Offices of Marshall E. Rosenbach in North Palm Beach, Florida."
        image="https://www.homeplanet.city/homeplanet-favicon.svg"
        url="https://www.homeplanet.city/planet/marshall-rosenbach/case-review"
        canonical="https://www.homeplanet.city/planet/marshall-rosenbach/case-review"
        robots="noindex,follow"
        twitterCard="summary"
      />
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5 sm:px-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-bold text-white/55 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back
          </button>
          <a
            href="tel:+15616278990"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#ddb15f]"
          >
            <Phone size={17} />
            Call Marshall
          </a>
        </div>
      </header>

      <section className="px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="text-xs font-black uppercase tracking-[0.22em] text-[#d3a552]">
            Free Case Review
          </div>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
            Tell Marshall what happened.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-white/60">
            Share the basics and Marshall’s office will follow up with you.
          </p>
          <div className="mt-6 inline-flex rounded-full border border-[#c99a45]/30 bg-[#c99a45]/10 px-4 py-2 text-sm font-bold text-[#e5c486]">
            {caseLabel}
          </div>

          <div className="mt-9 overflow-hidden rounded-3xl border border-white/10 bg-[#17181a] shadow-2xl shadow-black/20">
            {submittedCaseNumber ? (
              <div className="p-6 sm:p-9">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#c99a45] text-black">
                  <Check size={27} strokeWidth={3} />
                </div>
                <h2 className="mt-6 text-3xl font-black tracking-[-0.03em]">
                  Your case review was sent.
                </h2>
                <p className="mt-3 text-base leading-7 text-white/60">
                  Marshall’s office has received your information.
                </p>
                <div className="mt-7 rounded-2xl border border-[#c99a45]/35 bg-[#c99a45]/10 p-5">
                  <div className="text-xs font-black uppercase tracking-[0.14em] text-[#d3a552]">
                    Case Reference
                  </div>
                  <div className="mt-2 text-xl font-black">
                    {submittedCaseNumber}
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={submitCaseReview} className="p-6 sm:p-9">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-white/50">
                      Name *
                    </span>
                    <input
                      required
                      value={form.name}
                      onChange={(event) => updateField("name", event.target.value)}
                      autoComplete="name"
                      placeholder="Your full name"
                      className="h-14 w-full rounded-xl border border-white/10 bg-black/25 px-4 text-base text-white outline-none placeholder:text-white/25 focus:border-[#c99a45]"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-white/50">
                      Phone *
                    </span>
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(event) => updateField("phone", event.target.value)}
                      autoComplete="tel"
                      placeholder="Best number to reach you"
                      className="h-14 w-full rounded-xl border border-white/10 bg-black/25 px-4 text-base text-white outline-none placeholder:text-white/25 focus:border-[#c99a45]"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-white/50">
                      Email *
                    </span>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      autoComplete="email"
                      placeholder="Email address"
                      className="h-14 w-full rounded-xl border border-white/10 bg-black/25 px-4 text-base text-white outline-none placeholder:text-white/25 focus:border-[#c99a45]"
                    />
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-white/50">
                      Date of accident *
                    </span>
                    <input
                      required
                      type="date"
                      value={form.incidentDate}
                      onChange={(event) => updateField("incidentDate", event.target.value)}
                      className="h-14 w-full rounded-xl border border-white/10 bg-black/25 px-4 text-base text-white outline-none focus:border-[#c99a45]"
                    />
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-white/50">
                      What happened? *
                    </span>
                    <textarea
                      required
                      rows={5}
                      value={form.details}
                      onChange={(event) => updateField("details", event.target.value)}
                      placeholder="Give Marshall a short summary of what happened."
                      className="w-full resize-none rounded-xl border border-white/10 bg-black/25 px-4 py-4 text-base leading-7 text-white outline-none placeholder:text-white/25 focus:border-[#c99a45]"
                    />
                    <span className="mt-2 block text-sm leading-6 text-white/45">
                      Just give Marshall a quick overview. His office can get the rest when they speak with you.
                    </span>
                  </label>
                </div>

                <div className="mt-7 rounded-2xl border border-white/10 bg-black/20 p-5">
                  <div className="flex items-start gap-3">
                    <ShieldCheck size={20} className="mt-0.5 shrink-0 text-[#d3a552]" />
                    <p className="text-sm leading-6 text-white/50">
                      Sending this case review does not create an attorney-client relationship. Marshall’s office must review the information and agree to representation.
                    </p>
                  </div>
                </div>

                {submitError && (
                  <div className="mt-6 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-7 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#c99a45] px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-black transition hover:bg-[#ddb15f] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? "Sending..." : "Send My Case Review"}
                  {!submitting && <ArrowRight size={18} />}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
      <MarshallRosenbachFooter />
    </main>
  );
}
