import { FormEvent, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  Droplets,
  ImagePlus,
  MapPin,
  Phone,
  Play,
  ShieldCheck,
  Waves,
} from "lucide-react";

const waterConcerns = [
  "Rotten egg smell",
  "Iron stains",
  "White spots",
  "Bad taste",
  "Cloudy water",
  "Low pressure",
  "Other",
];

const waterSources = ["Well", "City", "Not sure"];

const problemLocations = [
  "Kitchen",
  "Bathroom",
  "Shower",
  "Whole house",
  "Outside",
];

type WaterTestRequest = {
  id: string;
  concerns: string[];
  waterSource: string;
  locations: string[];
  details: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  photoNames: string[];
  status: "new";
  createdAt: string;
};

export default function EcholsWaterTestingLandingPage() {
  const formRef = useRef<HTMLElement | null>(null);

  const [concerns, setConcerns] = useState<string[]>([]);
  const [waterSource, setWaterSource] = useState("");
  const [locations, setLocations] = useState<string[]>([]);
  const [details, setDetails] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [photoNames, setPhotoNames] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function toggleValue(
    value: string,
    values: string[],
    setValues: React.Dispatch<React.SetStateAction<string[]>>,
  ) {
    setValues(
      values.includes(value)
        ? values.filter((item) => item !== value)
        : [...values, value],
    );
  }

  function scrollToRequest() {
    formRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function handlePhotoSelection(files: FileList | null) {
    if (!files) {
      setPhotoNames([]);
      return;
    }

    setPhotoNames(Array.from(files).map((file) => file.name));
  }

  function resetForm() {
    setConcerns([]);
    setWaterSource("");
    setLocations([]);
    setDetails("");
    setCustomerName("");
    setCustomerPhone("");
    setCustomerAddress("");
    setPhotoNames([]);
    setSubmitError("");
    setSubmitted(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");

    if (concerns.length === 0) {
      setSubmitError("Choose at least one thing you are noticing with your water.");
      return;
    }

    if (!waterSource) {
      setSubmitError("Choose your water source, or select Not sure.");
      return;
    }

    if (locations.length === 0) {
      setSubmitError("Choose at least one place where you notice the problem.");
      return;
    }

    if (!customerName.trim() || !customerPhone.trim()) {
      setSubmitError("Add your name and phone number before sending the request.");
      return;
    }

    const request: WaterTestRequest = {
      id: crypto.randomUUID(),
      concerns,
      waterSource,
      locations,
      details: details.trim(),
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerAddress: customerAddress.trim(),
      photoNames,
      status: "new",
      createdAt: new Date().toISOString(),
    };

    const storageKey = "homeplanet-echols-water-test-requests";
    const currentRequests = JSON.parse(
      window.localStorage.getItem(storageKey) ?? "[]",
    ) as WaterTestRequest[];

    window.localStorage.setItem(
      storageKey,
      JSON.stringify([request, ...currentRequests]),
    );

    setSubmitted(true);
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#061015] text-white">
      <header className="border-b border-white/10 bg-[#061015]/95">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-white">
              Echols
            </p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-sky-300">
              Plumbing &amp; Air Conditioning
            </p>
          </div>

          <button
            type="button"
            onClick={scrollToRequest}
            className="rounded-full border border-sky-300/30 bg-sky-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-sky-100 transition hover:border-sky-300/60 hover:bg-sky-400/15"
          >
            Free Water Test
          </button>
        </div>
      </header>

      <section className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.16),transparent_42%),radial-gradient(circle_at_bottom_left,rgba(14,116,144,0.18),transparent_38%)]" />

        <div className="relative mx-auto grid w-full max-w-6xl gap-8 px-5 pb-10 pt-10 sm:px-8 sm:pb-14 sm:pt-14 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-12 lg:py-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-sky-200">
              <Droplets size={16} />
              Free water quality testing
            </div>

            <h1 className="mt-6 max-w-xl text-4xl font-black leading-[0.98] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
              Do you know what&apos;s in your water?
            </h1>

            <p className="mt-5 max-w-lg text-lg leading-8 text-slate-300">
              Tell Echols what you are noticing. Their team can review the details
              before reaching out, so the conversation starts with context.
            </p>

            <button
              type="button"
              onClick={scrollToRequest}
              className="mt-8 flex min-h-16 w-full items-center justify-center gap-3 rounded-2xl bg-sky-400 px-6 text-base font-black uppercase tracking-[0.12em] text-[#031016] shadow-[0_20px_60px_rgba(56,189,248,0.2)] transition hover:bg-sky-300 sm:w-auto sm:min-w-72"
            >
              Request Free Water Quality Test
              <ChevronDown size={20} />
            </button>

            <div className="mt-7 flex flex-wrap gap-3">
              {["Simple request", "Real human review", "No guessing"].map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold text-slate-300"
                  >
                    <Check size={14} className="text-sky-300" />
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-sky-300/20 bg-[#0a1820] shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
            <div className="aspect-[4/5] sm:aspect-video lg:aspect-[4/5]">
              <div className="flex h-full flex-col items-center justify-center bg-[linear-gradient(145deg,rgba(14,116,144,0.22),rgba(3,16,22,0.96)),radial-gradient(circle_at_70%_20%,rgba(125,211,252,0.2),transparent_35%)] px-8 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-sky-200/30 bg-sky-300/10 text-sky-200 shadow-[0_0_50px_rgba(56,189,248,0.15)]">
                  <Play size={34} fill="currentColor" />
                </div>

                <p className="mt-6 text-xs font-black uppercase tracking-[0.24em] text-sky-300">
                  Real Echols work
                </p>

                <h2 className="mt-3 max-w-sm text-2xl font-black tracking-[-0.03em] text-white">
                  See how Echols tests and treats local water.
                </h2>

                <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
                  Real water testing, clear explanations, filtration work, repairs,
                  and complete water-system installations.
                </p>
              </div>
            </div>

            <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/10 bg-black/50 p-4 backdrop-blur-md">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 shrink-0 text-sky-300" size={20} />
                <p className="text-sm leading-6 text-slate-200">
                  Real work builds more trust than stock photos or generic
                  plumbing claims.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={formRef}
        id="water-test-request"
        className="scroll-mt-4 border-t border-white/10 bg-[#08141a] px-5 py-12 sm:px-8 sm:py-16"
      >
        <form
          onSubmit={handleSubmit}
          className="mx-auto w-full max-w-4xl"
          noValidate
        >
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-sky-300">
              Request your free test
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
              Help Echols understand what is happening.
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-400">
              Choose what fits. You do not need to know the cause or diagnose
              the problem yourself.
            </p>
          </div>

          <div className="mt-10 space-y-6">
            <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5 sm:p-7">
              <h3 className="text-xl font-black tracking-[-0.02em] text-white">
                What are you noticing?
              </h3>

              <p className="mt-2 text-sm text-slate-300">
                Choose everything that applies.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {waterConcerns.map((concern) => {
                  const selected = concerns.includes(concern);

                  return (
                    <button
                      key={concern}
                      type="button"
                      onClick={() =>
                        toggleValue(concern, concerns, setConcerns)
                      }
                      aria-pressed={selected}
                      className={`min-h-20 rounded-2xl border p-4 text-left text-sm font-black leading-5 transition ${
                        selected
                          ? "border-sky-300 bg-sky-400/25 text-white shadow-[0_0_0_1px_rgba(125,211,252,0.22),0_14px_38px_rgba(14,165,233,0.14)]"
                          : "border-white/15 bg-[#091920] text-slate-100 hover:border-sky-300/55 hover:bg-sky-400/10 hover:text-white active:border-sky-300 active:bg-sky-400/20 active:text-white"
                      }`}
                    >
                      <span className="flex items-start justify-between gap-2">
                        {concern}
                        {selected && (
                          <Check
                            size={17}
                            className="shrink-0 text-sky-300"
                          />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5 sm:p-7">
              <h3 className="text-xl font-black tracking-[-0.02em] text-white">
                Water source
              </h3>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {waterSources.map((source) => {
                  const selected = waterSource === source;

                  return (
                    <button
                      key={source}
                      type="button"
                      onClick={() => setWaterSource(source)}
                      aria-pressed={selected}
                      className={`min-h-20 rounded-2xl border p-3 text-center text-sm font-black transition ${
                        selected
                          ? "border-sky-300 bg-sky-400/25 text-white shadow-[0_0_0_1px_rgba(125,211,252,0.22),0_14px_38px_rgba(14,165,233,0.14)]"
                          : "border-white/15 bg-[#091920] text-slate-100 hover:border-sky-300/55 hover:bg-sky-400/10 hover:text-white active:border-sky-300 active:bg-sky-400/20 active:text-white"
                      }`}
                    >
                      {source}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5 sm:p-7">
              <h3 className="text-xl font-black tracking-[-0.02em] text-white">
                Where do you notice it?
              </h3>

              <p className="mt-2 text-sm text-slate-300">
                Choose every area that applies.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {problemLocations.map((location) => {
                  const selected = locations.includes(location);

                  return (
                    <button
                      key={location}
                      type="button"
                      onClick={() =>
                        toggleValue(location, locations, setLocations)
                      }
                      aria-pressed={selected}
                      className={`min-h-20 rounded-2xl border p-4 text-left text-sm font-black transition ${
                        selected
                          ? "border-sky-300 bg-sky-400/25 text-white shadow-[0_0_0_1px_rgba(125,211,252,0.22),0_14px_38px_rgba(14,165,233,0.14)]"
                          : "border-white/15 bg-[#091920] text-slate-100 hover:border-sky-300/55 hover:bg-sky-400/10 hover:text-white active:border-sky-300 active:bg-sky-400/20 active:text-white"
                      }`}
                    >
                      <span className="flex items-start justify-between gap-2">
                        {location}
                        {selected && (
                          <Check
                            size={17}
                            className="shrink-0 text-sky-300"
                          />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5 sm:p-7">
              <h3 className="text-xl font-black text-white">Tell us more</h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Share when it started, whether it comes and goes, or anything
                else the Echols team should know.
              </p>

              <textarea
                value={details}
                onChange={(event) => setDetails(event.target.value)}
                rows={5}
                placeholder="Example: The shower smells like rotten eggs in the morning, but the kitchen sink seems normal."
                className="mt-5 w-full resize-none rounded-2xl border border-white/10 bg-[#061015] px-4 py-4 text-base text-white outline-none placeholder:text-slate-600 focus:border-sky-300/50"
              />
            </section>

            <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5 sm:p-7">
              <div className="flex items-start gap-3">
                <ImagePlus className="mt-1 shrink-0 text-sky-300" size={22} />
                <div>
                  <h3 className="text-xl font-black text-white">
                    Upload photos
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Optional. Photos of stains, fixtures, filters, tanks, or
                    existing water equipment can help.
                  </p>
                </div>
              </div>

              <label className="mt-5 flex min-h-24 cursor-pointer items-center justify-center rounded-2xl border border-dashed border-sky-300/25 bg-sky-400/[0.04] px-5 text-center text-sm font-black text-sky-200 transition hover:border-sky-300/50">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={(event) =>
                    handlePhotoSelection(event.target.files)
                  }
                />

                {photoNames.length > 0
                  ? `${photoNames.length} photo${
                      photoNames.length === 1 ? "" : "s"
                    } selected`
                  : "Choose photos"}
              </label>

              {photoNames.length > 0 && (
                <div className="mt-4 space-y-2">
                  {photoNames.map((photoName) => (
                    <p
                      key={photoName}
                      className="truncate rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-slate-400"
                    >
                      {photoName}
                    </p>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5 sm:p-7">
              <h3 className="text-xl font-black text-white">
                Where should Echols reach you?
              </h3>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                    Name
                  </span>
                  <input
                    type="text"
                    autoComplete="name"
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                    placeholder="Your name"
                    className="mt-2 min-h-14 w-full rounded-2xl border border-white/10 bg-[#061015] px-4 text-base text-white outline-none placeholder:text-slate-600 focus:border-sky-300/50"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                    Phone
                  </span>
                  <div className="relative mt-2">
                    <Phone
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sky-300"
                    />
                    <input
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={customerPhone}
                      onChange={(event) => setCustomerPhone(event.target.value)}
                      placeholder="Best number to reach you"
                      className="min-h-14 w-full rounded-2xl border border-white/10 bg-[#061015] pl-12 pr-4 text-base text-white outline-none placeholder:text-slate-600 focus:border-sky-300/50"
                    />
                  </div>
                </label>

                <label className="block sm:col-span-2">
                  <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                    Address
                    <span className="ml-2 normal-case tracking-normal text-slate-600">
                      Optional
                    </span>
                  </span>

                  <div className="relative mt-2">
                    <MapPin
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sky-300"
                    />
                    <input
                      type="text"
                      autoComplete="street-address"
                      value={customerAddress}
                      onChange={(event) =>
                        setCustomerAddress(event.target.value)
                      }
                      placeholder="Property address"
                      className="min-h-14 w-full rounded-2xl border border-white/10 bg-[#061015] pl-12 pr-4 text-base text-white outline-none placeholder:text-slate-600 focus:border-sky-300/50"
                    />
                  </div>
                </label>
              </div>
            </section>

            {submitError && (
              <div
                role="alert"
                className="rounded-2xl border border-red-400/25 bg-red-500/10 px-5 py-4 text-sm font-bold leading-6 text-red-100"
              >
                {submitError}
              </div>
            )}

            <button
              type="submit"
              className="flex min-h-16 w-full items-center justify-center gap-3 rounded-2xl bg-sky-400 px-6 text-base font-black uppercase tracking-[0.12em] text-[#031016] shadow-[0_20px_60px_rgba(56,189,248,0.18)] transition hover:bg-sky-300"
            >
              <Waves size={22} />
              Submit Water Quality Test Request
            </button>

            <p className="px-2 text-center text-xs leading-5 text-slate-500">
              This first build saves test submissions on this device while the
              live Echols request database and James&apos;s operator dashboard
              are connected.
            </p>
          </div>
        </form>
      </section>

      <section className="border-t border-white/10 bg-[#061015] px-5 py-12 sm:px-8">
        <div className="mx-auto grid w-full max-w-4xl gap-4 sm:grid-cols-3">
          {[
            {
              number: "01",
              title: "You send context",
              text: "Echols receives what you notice, where it happens, and what kind of water source you have.",
            },
            {
              number: "02",
              title: "Echols reviews it",
              text: "The first conversation starts with useful information instead of starting from zero.",
            },
            {
              number: "03",
              title: "The test is scheduled",
              text: "An Echols team member reaches out to coordinate your free water quality test.",
            },
          ].map((step) => (
            <article
              key={step.number}
              className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5"
            >
              <p className="text-xs font-black tracking-[0.2em] text-sky-300">
                {step.number}
              </p>
              <h3 className="mt-3 text-lg font-black text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {step.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#040b0f] px-5 py-8 text-center sm:px-8">
        <p className="text-sm font-black text-white">
          Echols Plumbing &amp; Air Conditioning
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Organized by HomePlanet.
        </p>
      </footer>

      {submitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-5 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[2rem] border border-sky-300/25 bg-[#08161d] p-7 text-center shadow-[0_30px_100px_rgba(0,0,0,0.65)] sm:p-9">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-sky-300/30 bg-sky-400/10 text-sky-200">
              <Check size={30} />
            </div>

            <p className="mt-6 text-xs font-black uppercase tracking-[0.24em] text-sky-300">
              Request captured
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white">
              Your water quality request is organized.
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-300">
              This test request was saved on this device. The next build step
              will connect it to the live Echols request board and
              notification workflow.
            </p>

            <button
              type="button"
              onClick={resetForm}
              className="mt-7 min-h-14 w-full rounded-2xl bg-sky-400 px-5 text-sm font-black uppercase tracking-[0.14em] text-[#031016] transition hover:bg-sky-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}


