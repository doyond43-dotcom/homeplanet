import { FormEvent, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

const caseLabels: Record<string, string> = {
  "car-accident": "Car Accident",
  "truck-accident": "Truck Accident",
  "motorcycle-accident": "Motorcycle Accident",
  "train-collision": "Train Collision",
  "bicycle-accident": "Bicycle Accident",
  "pedestrian-accident": "Pedestrian Accident",
};

type FormState = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  incidentDate: string;
  location: string;
  details: string;
  injured: string;
  treatment: string;
  contactMethod: string;
  contactTime: string;
};

export default function MarshallRosenbachCaseReviewPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const caseType = searchParams.get("type") || "";
  const caseLabel = useMemo(
    () => caseLabels[caseType] || "Personal Injury",
    [caseType]
  );

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submittedCaseNumber, setSubmittedCaseNumber] = useState("");

  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    incidentDate: "",
    location: "",
    details: "",
    injured: "",
    treatment: "",
    contactMethod: "Phone",
    contactTime: "",
  });

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleStepOne = (event: FormEvent) => {
    event.preventDefault();

    if (!form.firstName.trim() || !form.phone.trim()) {
      return;
    }

    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStepTwo = (event: FormEvent) => {
    event.preventDefault();

    if (!form.details.trim()) {
      return;
    }

    setStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStepThree = (event: FormEvent) => {
    event.preventDefault();
    setStep(4);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submitCaseReview = async () => {
    if (submitting || submittedCaseNumber) return;

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
      client_first_name: form.firstName.trim(),
      client_last_name: form.lastName.trim() || null,
      client_phone: form.phone.trim(),
      client_email: form.email.trim() || null,
      incident_date: form.incidentDate || null,
      incident_location: form.location.trim() || null,
      incident_details: form.details.trim(),
      injured: form.injured || null,
      treatment: form.treatment.trim() || null,
      preferred_contact: form.contactMethod || null,
      best_contact_time: form.contactTime.trim() || null,
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
            href="tel:+18886799090"
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
            Start with a few details so Marshall can understand what happened
            and the best way to reach you.
          </p>

          <div className="mt-6 inline-flex rounded-full border border-[#c99a45]/30 bg-[#c99a45]/10 px-4 py-2 text-sm font-bold text-[#e5c486]">
            {caseLabel}
          </div>

          {step < 4 && (
            <div className="mt-10 grid grid-cols-3 gap-2">
              {[1, 2, 3].map((item) => (
                <div key={item}>
                  <div
                    className={`h-1.5 rounded-full ${
                      step >= item ? "bg-[#c99a45]" : "bg-white/10"
                    }`}
                  />
                  <div className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/35">
                    {item === 1
                      ? "Contact"
                      : item === 2
                      ? "What Happened"
                      : "Reach You"}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-9 overflow-hidden rounded-3xl border border-white/10 bg-[#17181a] shadow-2xl shadow-black/20">
            {step === 1 && (
              <form onSubmit={handleStepOne} className="p-6 sm:p-9">
                <div className="text-xs font-black uppercase tracking-[0.16em] text-white/35">
                  Step 1
                </div>

                <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                  How should Marshall reach you?
                </h2>

                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-white/50">
                      First Name *
                    </span>
                    <input
                      required
                      value={form.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                      autoComplete="given-name"
                      placeholder="First name"
                      className="h-14 w-full rounded-xl border border-white/10 bg-black/25 px-4 text-base text-white outline-none placeholder:text-white/25 focus:border-[#c99a45]"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-white/50">
                      Last Name
                    </span>
                    <input
                      value={form.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                      autoComplete="family-name"
                      placeholder="Last name"
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
                      onChange={(e) => updateField("phone", e.target.value)}
                      autoComplete="tel"
                      placeholder="Best number to reach you"
                      className="h-14 w-full rounded-xl border border-white/10 bg-black/25 px-4 text-base text-white outline-none placeholder:text-white/25 focus:border-[#c99a45]"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-white/50">
                      Email
                    </span>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      autoComplete="email"
                      placeholder="Email address"
                      className="h-14 w-full rounded-xl border border-white/10 bg-black/25 px-4 text-base text-white outline-none placeholder:text-white/25 focus:border-[#c99a45]"
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  className="mt-7 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#c99a45] px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-black transition hover:bg-[#ddb15f] sm:w-auto"
                >
                  Continue
                  <ArrowRight size={18} />
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleStepTwo} className="p-6 sm:p-9">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 text-sm font-bold text-white/50 hover:text-white"
                >
                  <ArrowLeft size={17} />
                  Back
                </button>

                <div className="mt-6 text-xs font-black uppercase tracking-[0.16em] text-white/35">
                  Step 2
                </div>

                <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                  What happened?
                </h2>

                <div className="mt-7 grid gap-5">
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-white/50">
                      Date of incident
                    </span>
                    <input
                      type="date"
                      value={form.incidentDate}
                      onChange={(e) =>
                        updateField("incidentDate", e.target.value)
                      }
                      className="h-14 w-full rounded-xl border border-white/10 bg-black/25 px-4 text-base text-white outline-none focus:border-[#c99a45]"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-white/50">
                      Where did it happen?
                    </span>
                    <input
                      value={form.location}
                      onChange={(e) => updateField("location", e.target.value)}
                      placeholder="City, road, intersection, or location"
                      className="h-14 w-full rounded-xl border border-white/10 bg-black/25 px-4 text-base text-white outline-none placeholder:text-white/25 focus:border-[#c99a45]"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-white/50">
                      Tell Marshall what happened *
                    </span>
                    <textarea
                      required
                      rows={6}
                      value={form.details}
                      onChange={(e) => updateField("details", e.target.value)}
                      placeholder="Give a short description of what happened and anything you think Marshall should know."
                      className="w-full resize-none rounded-xl border border-white/10 bg-black/25 px-4 py-4 text-base leading-7 text-white outline-none placeholder:text-white/25 focus:border-[#c99a45]"
                    />
                  </label>

                  <div>
                    <div className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-white/50">
                      Were you injured?
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {["Yes", "No"].map((answer) => (
                        <button
                          key={answer}
                          type="button"
                          onClick={() => updateField("injured", answer)}
                          className={`min-h-14 rounded-xl border px-4 font-bold transition ${
                            form.injured === answer
                              ? "border-[#c99a45] bg-[#c99a45]/12 text-[#e5c486]"
                              : "border-white/10 bg-black/20 text-white/65"
                          }`}
                        >
                          {answer}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-white/50">
                      Medical treatment so far
                    </span>
                    <textarea
                      rows={3}
                      value={form.treatment}
                      onChange={(e) => updateField("treatment", e.target.value)}
                      placeholder="ER, hospital, doctor, therapy, none yet, etc."
                      className="w-full resize-none rounded-xl border border-white/10 bg-black/25 px-4 py-4 text-base leading-7 text-white outline-none placeholder:text-white/25 focus:border-[#c99a45]"
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  className="mt-7 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#c99a45] px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-black transition hover:bg-[#ddb15f] sm:w-auto"
                >
                  Continue
                  <ArrowRight size={18} />
                </button>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleStepThree} className="p-6 sm:p-9">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 text-sm font-bold text-white/50 hover:text-white"
                >
                  <ArrowLeft size={17} />
                  Back
                </button>

                <div className="mt-6 text-xs font-black uppercase tracking-[0.16em] text-white/35">
                  Step 3
                </div>

                <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                  What’s the best way to reach you?
                </h2>

                <div className="mt-7">
                  <div className="text-xs font-bold uppercase tracking-[0.12em] text-white/50">
                    Preferred contact
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    {["Phone", "Text", "Email"].map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => updateField("contactMethod", method)}
                        className={`min-h-14 rounded-xl border px-4 font-bold transition ${
                          form.contactMethod === method
                            ? "border-[#c99a45] bg-[#c99a45]/12 text-[#e5c486]"
                            : "border-white/10 bg-black/20 text-white/65"
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="mt-6 block">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-white/50">
                    Best time to contact you
                  </span>
                  <input
                    value={form.contactTime}
                    onChange={(e) => updateField("contactTime", e.target.value)}
                    placeholder="Morning, afternoon, after 5 PM, anytime..."
                    className="h-14 w-full rounded-xl border border-white/10 bg-black/25 px-4 text-base text-white outline-none placeholder:text-white/25 focus:border-[#c99a45]"
                  />
                </label>

                <div className="mt-7 rounded-2xl border border-white/10 bg-black/20 p-5">
                  <div className="flex items-start gap-3">
                    <ShieldCheck
                      size={20}
                      className="mt-0.5 shrink-0 text-[#d3a552]"
                    />
                    <p className="text-sm leading-6 text-white/50">
                      Sending this case review does not create an
                      attorney-client relationship. Marshall’s office must
                      review the information and agree to representation.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-7 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#c99a45] px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-black transition hover:bg-[#ddb15f]"
                >
                  Review My Information
                  <ArrowRight size={18} />
                </button>
              </form>
            )}

            {step === 4 && (
              <div className="p-6 sm:p-9">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#c99a45] text-black">
                  <Check size={27} strokeWidth={3} />
                </div>

                <h2 className="mt-6 text-3xl font-black tracking-[-0.03em]">
                  Ready for Marshall’s review.
                </h2>

                <p className="mt-3 text-base leading-7 text-white/60">
                  Review the information below, then send it securely to
                  Marshall’s office.
                </p>

                <div className="mt-7 space-y-4 rounded-2xl border border-white/10 bg-black/20 p-5">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.12em] text-white/35">
                      Client
                    </div>
                    <div className="mt-1 font-bold">
                      {form.firstName} {form.lastName}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.12em] text-white/35">
                      Case Type
                    </div>
                    <div className="mt-1 font-bold text-[#e5c486]">
                      {caseLabel}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.12em] text-white/35">
                      What Happened
                    </div>
                    <div className="mt-1 text-sm leading-6 text-white/65">
                      {form.details}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.12em] text-white/35">
                      Preferred Contact
                    </div>
                    <div className="mt-1 text-sm text-white/65">
                      {form.contactMethod}
                      {form.contactTime ? ` · ${form.contactTime}` : ""}
                    </div>
                  </div>
                </div>

                {submittedCaseNumber ? (
                  <div className="mt-7 rounded-2xl border border-[#c99a45]/35 bg-[#c99a45]/10 p-5">
                    <div className="text-xs font-black uppercase tracking-[0.14em] text-[#d3a552]">
                      Case Review Sent
                    </div>
                    <div className="mt-2 text-xl font-black">
                      Thank you. Marshall’s office has received your information.
                    </div>
                    <div className="mt-3 text-sm text-white/55">
                      Reference: {submittedCaseNumber}
                    </div>
                  </div>
                ) : (
                  <>
                    {submitError && (
                      <div className="mt-6 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
                        {submitError}
                      </div>
                    )}

                    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={submitCaseReview}
                        disabled={submitting}
                        className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[#c99a45] px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-black transition hover:bg-[#ddb15f] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {submitting ? "Sending..." : "Send My Case Review"}
                        {!submitting && <ArrowRight size={18} />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="inline-flex min-h-14 items-center justify-center gap-2 px-4 text-sm font-bold text-[#d3a552]"
                      >
                        <ArrowLeft size={17} />
                        Edit information
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

