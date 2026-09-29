import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  ChefHat,
  Hammer,
  Scissors,
  ShoppingBasket,
  Store,
  Wrench,
  Workflow,
  MessageCircle,
  X,
} from "lucide-react";
import { trackCustomSystemsActivity } from "../lib/customSystemsActivity";
import { supabase } from "../lib/supabase";

const businessTypes = [
  {
    name: "Home Services",
    detail: "Cleaning / Lawn Care / HVAC / Handyman",
    flow: "Request -> Estimate -> Schedule",
    icon: Hammer,
  },
  {
    name: "Salon & Barber",
    detail: "Bookings / Clients / Payments / Follow-up",
    flow: "Book -> Service -> Pay",
    icon: Scissors,
  },
  {
    name: "Restaurant & Food",
    detail: "Orders / Pickup / Inventory / Customers",
    flow: "Order -> Prep -> Pickup",
    icon: ChefHat,
  },
  {
    name: "Auto & Repair",
    detail: "Jobs / Parts / Techs / Work Status",
    flow: "Check-in -> Work -> Done",
    icon: Wrench,
  },
  {
    name: "Finance & Professional Services",
    detail: "Mortgage / Insurance / Real Estate / Documents",
    flow: "Lead -> Documents -> Close",
    icon: BriefcaseBusiness,
  },
  {
    name: "Local Sellers",
    detail: "Inventory / Orders / Pickup / Delivery",
    flow: "Browse -> Order -> Fulfill",
    icon: ShoppingBasket,
  },
];

const flowSteps = [
  "Customer Request",
  "Estimate",
  "Schedule",
  "Work",
  "Payment",
  "Follow-up",
];

export default function DanielCustomSystemsLandingPage() {
  const [liveTime, setLiveTime] = useState(() =>
    new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    })
  )

  useEffect(() => {
    const updateLiveTime = () => {
      setLiveTime(
        new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        })
      )
    }

    updateLiveTime()
    const timer = window.setInterval(updateLiveTime, 30000)

    return () => window.clearInterval(timer)
  }, [])

  const pageViewTrackedRef = useRef(false);
  const requestStartedRef = useRef(false);

  const [businessType, setBusinessType] = useState("Home Services");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [questionOpen, setQuestionOpen] = useState(false);
  const [questionSubmitting, setQuestionSubmitting] = useState(false);
  const [questionSubmitted, setQuestionSubmitted] = useState(false);
  const [questionError, setQuestionError] = useState("");

  const [questionForm, setQuestionForm] = useState({
    name: "",
    phone: "",
    email: "",
    question: "",
  });


  const [form, setForm] = useState({
    businessName: "",
    need: "",
    name: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    if (pageViewTrackedRef.current) return;
    pageViewTrackedRef.current = true;
    void trackCustomSystemsActivity("page_view");
  }, []);

  function markStarted() {
    if (requestStartedRef.current) return;
    requestStartedRef.current = true;

    void trackCustomSystemsActivity("request_started", {
      label: businessType,
    });
  }

  function updateField(field: keyof typeof form, value: string) {
    markStarted();

    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function chooseBusiness(type: string) {
    setBusinessType(type);
    setSubmitted(false);

    void trackCustomSystemsActivity("problem_selected", {
      label: type,
    });
  }

  function startRequest(type?: string) {
    if (type) {
      chooseBusiness(type);
    }

    void trackCustomSystemsActivity("request_opened", {
      label: type || businessType,
    });

    window.setTimeout(() => {
      document
        .getElementById("start-my-system")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 40);
  }

  function openQuestionDrawer() {
    setQuestionError("");
    setQuestionSubmitted(false);
    setQuestionOpen(true);
  }

  function updateQuestionField(
    field: keyof typeof questionForm,
    value: string
  ) {
    setQuestionForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function submitQuestion(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (questionSubmitting) return;

    setQuestionSubmitting(true);
    setQuestionError("");
    setQuestionSubmitted(false);

    const { error } = await supabase
      .from("custom_systems_public_requests")
      .insert({
        problem: "Customer Question",
        business_name: "Question",
        what_you_do: "Question",
        current_flow: questionForm.question.trim(),
        breakdowns: [],
        existing_link: null,
        name: questionForm.name.trim() || null,
        phone: questionForm.phone.trim() || null,
        email: questionForm.email.trim() || null,
        contact_preference: "Text or call",
        notes: "Submitted through Ask Us a Question",
        status: "New Lead",
      });

    if (error) {
      console.error("Custom Systems question submission error", error);
      setQuestionError("Your question could not be sent. Please try again.");
      setQuestionSubmitting(false);
      return;
    }

    setQuestionSubmitted(true);
    setQuestionSubmitting(false);
  }
  async function submitRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting) return;

    setSubmitting(true);
    setSubmitError("");
    setSubmitted(false);

    const { error } = await supabase
      .from("custom_systems_public_requests")
      .insert({
        problem: "Custom Business System",
        business_name: form.businessName.trim(),
        what_you_do: businessType,
        current_flow: form.need.trim(),
        breakdowns: [],
        existing_link: null,
        name: form.name.trim() || null,
        phone: form.phone.trim() || null,
        email: form.email.trim() || null,
        contact_preference: "Text or call",
        notes: null,
        status: "New Lead",
      });

    if (error) {
      console.error("Custom Systems request submission error", error);
      setSubmitError("Your request could not be sent. Please try again.");
      setSubmitting(false);
      return;
    }

    await trackCustomSystemsActivity("request_submitted", {
      label: businessType,
    });

    setSubmitted(true);
    setSubmitting(false);
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between px-5 py-3 sm:px-8">
          <a
            href="/planet/custom-systems"
            className="flex items-center gap-3"
          >
            <img
              src="/images/homeplanet-brand-logo-header.png"
              alt="HomePlanet"
              className="h-[52px] w-auto object-contain sm:h-[58px]"
            />

            <div className="hidden border-l border-black/10 pl-3 sm:block">
              <div className="text-[10px] font-black uppercase tracking-[0.22em] text-[#1597F3]">
                Custom Systems
              </div>
            </div>
          </a>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openQuestionDrawer}
              className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl border border-[#1597F3]/35 bg-[#1597F3]/5 px-3 text-xs font-black text-[#087fd0] transition hover:bg-[#1597F3]/10 sm:px-4 sm:text-sm"
            >
              <MessageCircle className="h-4 w-4" />
              Ask Us a Question
            </button>

            <button
              type="button"
              onClick={() => startRequest()}
              className="hidden rounded-xl bg-black px-4 py-3 text-sm font-black text-white transition hover:bg-black/80 sm:inline-flex"
            >
              Start My System
            </button>
          </div>
        </div>
      </header>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#e7e8e4]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(123,224,0,0.17),transparent_24%),radial-gradient(circle_at_16%_12%,rgba(255,255,255,0.94),transparent_28%),radial-gradient(circle_at_84%_18%,rgba(255,255,255,0.72),transparent_26%),radial-gradient(circle_at_78%_88%,rgba(0,0,0,0.05),transparent_34%)]" />

        <div className="relative mx-auto max-w-[1440px] px-5 py-6 text-center sm:px-8 lg:py-7">

          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#4d9d00]">
            Built Around How You Already Work
          </p>

          <h1 className="mx-auto mt-3 text-[clamp(2.35rem,11vw,5.2rem)] font-black leading-[0.92] tracking-[-0.055em] text-black lg:whitespace-nowrap">
            Stop bouncing between texts,
          </h1>

          <div className="mx-auto -mt-1 w-full max-w-[1220px]">
            <img
              src="/images/homeplanet_app_dashboard_mockup.png"
              alt="HomePlanet live activity and business board"
              className="mx-auto block w-full object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.16)]"
            />
          </div>

          <h2 className="mx-auto -mt-2 text-[clamp(2.4rem,11vw,5.3rem)] font-black leading-[0.92] tracking-[-0.055em] text-black sm:-mt-5 lg:-mt-7">
            apps, and notes.
          </h2>

          <p className="mx-auto mt-5 max-w-[660px] text-base leading-7 text-black/60">
            Keep requests, scheduling, payments, and follow-up easier to manage.
          </p>

          <button
            type="button"
            onClick={() => startRequest()}
            className="mt-4 inline-flex min-h-[52px] w-full items-center justify-center gap-3 rounded-2xl bg-[#7be000] px-8 font-black text-black transition hover:-translate-y-0.5 hover:bg-[#8bf011] sm:w-auto"
          >
            Start My System
            <ArrowRight className="h-5 w-5" />
          </button>

          <div className="mt-4 flex flex-wrap justify-center gap-x-7 gap-y-2">
            {["Less mess", "Save time", "Keep work moving"].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-sm font-bold text-black/60"
              >
                <span className="h-4 w-4 rounded-full bg-[#7be000]" />
                {item}
              </div>
            ))}
          </div>

        </div>
      </section>







      {/* DARK SYSTEM VISUAL */}
      <section className="bg-[#0b0f0b] text-white">
        <div className="mx-auto max-w-[1240px] px-5 py-14 sm:px-8 sm:py-16 lg:py-18">
          <div className="mx-auto max-w-[1080px] text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#1597F3]">
              One Connected System
            </p>

            <h2 className="mx-auto mt-4 max-w-[1050px] text-5xl font-black leading-[0.94] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              Stop running your business through
              <span className="block text-[#1597F3]">
                scattered conversations.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-[820px] text-lg leading-8 text-white/72">
              Calls, texts, Facebook messages, notes and spreadsheets can all
              become one clear flow.
            </p>
          </div>

          <div className="mx-auto mt-9 max-w-[1120px] rounded-[1.65rem] border border-white/10 bg-[#141914] p-3 sm:p-4">
            <div className="rounded-[1.25rem] bg-white p-5 text-black sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#438c00]">
                    Live Workflow
                  </p>

                  <h3 className="mt-1 text-2xl font-black tracking-[-0.035em] sm:text-3xl">
                    Everything stays connected.
                  </h3>
                </div>

                <div className="w-fit rounded-full bg-[#dcffb5] px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#325c00]">
                  Active
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                {flowSteps.map((step, index) => (
                  <div
                    key={step}
                    className="rounded-xl border border-black/10 bg-[#f5f6f2] px-4 py-4"
                  >
                    <div className="text-[10px] font-black text-[#4f9f00]">
                      0{index + 1}
                    </div>

                    <div className="mt-1 text-sm font-black">{step}</div>
                  </div>
                ))}
              </div>

              <div className="mt-3 rounded-xl bg-black px-5 py-4 text-white">
                <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#78dc12]">
                  Next Action
                </div>

                <div className="mt-1 text-sm font-bold">
                  Customer approved -&gt; schedule the work
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* BUSINESS TYPES */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-8 sm:py-20">
          <div className="max-w-[780px]">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#4d9d00]">
              Built For Real Businesses
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
              What kind of business do you run?
            </h2>

            <p className="mt-4 text-base leading-7 text-black/55">
              Pick the closest fit. We build around the way your operation
              already works.
            </p>
          </div>

          <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {businessTypes.map(({ name, detail, flow, icon: Icon }) => {
              const active = businessType === name;

              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => chooseBusiness(name)}
                  className={`min-h-0 rounded-[1.5rem] border p-5 text-left transition sm:min-h-[190px] sm:p-6 ${
                    active
                      ? "border-[#7be000] bg-[#f3ffe5]"
                      : "border-black/10 bg-white hover:-translate-y-1 hover:border-black/25"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f1f5ec]">
                      <Icon className="h-5 w-5 text-[#4d9d00]" />
                    </div>

                    {active && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7be000]">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>

                  <h3 className="mt-4 text-xl font-black tracking-[-0.03em] sm:mt-6">
                    {name}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-black/50">
                    {detail}
                  </p>
                  <div className="mt-4 border-t border-black/10 pt-3">
                    <div className="text-[10px] font-black uppercase tracking-[0.14em] text-[#438c00]">
                      Example Flow
                    </div>

                    <div className="mt-1 text-sm font-black text-black/80">
                      {flow}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-col gap-5 rounded-[1.5rem] bg-black p-6 text-white sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#7be000] text-black">
                <Store className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-xl font-black">
                  Don't see your business?
                </h3>

                <p className="mt-1 text-sm leading-6 text-white/55">
                  Tell us what you do. We'll build around your workflow.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                chooseBusiness("Custom Business");
                startRequest("Custom Business");
              }}
              className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-white px-5 font-black text-black sm:w-auto"
            >
              Custom Business
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
      {/* DARK PROCESS */}
      <section className="bg-black text-white">
        <div className="mx-auto max-w-[1240px] px-5 py-14 sm:px-8 sm:py-16 lg:py-18">
          <div className="mx-auto max-w-[1060px] text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#1597F3]">
              Built Around Your Workflow
            </p>

            <h2 className="mx-auto mt-4 max-w-[1000px] text-4xl font-black leading-[0.95] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              Your business already has a process.
            </h2>

            <p className="mx-auto mt-5 max-w-[820px] text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
              We connect the parts that are already there instead of forcing you
              into somebody else's software.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-[1160px]">
            <div className="relative">
              <div className="absolute left-[5%] right-[5%] top-[50%] hidden h-[2px] -translate-y-1/2 bg-white/10 lg:block" />
              <div className="absolute left-[5%] top-[50%] hidden h-[2px] w-[52%] -translate-y-1/2 bg-[#69c900] lg:block" />

              <div className="relative grid grid-cols-2 gap-3 lg:grid-cols-6">
                {flowSteps.map((step, index) => {
                  const active = step === "Work";

                  return (
                    <div
                      key={step}
                      className={`relative rounded-[1.15rem] border px-4 py-5 transition ${
                        active
                          ? "border-[#69c900] bg-[#14200f] shadow-[0_0_0_1px_rgba(105,201,0,0.18),0_16px_35px_rgba(0,0,0,0.28)]"
                          : "border-white/12 bg-[#0b0b0b]"
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-black ${
                          active
                            ? "bg-[#69c900] text-black"
                            : "bg-white/[0.06] text-[#78dc12]"
                        }`}
                      >
                        0{index + 1}
                      </div>

                      <div className="mt-4 text-base font-black">
                        {step}
                      </div>

                      {active && (
                        <div className="mt-3 w-fit rounded-full bg-[#69c900] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-black">
                          Active
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 rounded-[1.15rem] border border-white/10 bg-[#111111] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#78dc12]">
                  Live Activity
                </div>

                <div className="mt-1 text-sm font-bold text-white">
                  Estimate approved -&gt; scheduling opened
                </div>
              </div>

              <div className="flex items-baseline gap-0.5 whitespace-nowrap text-[15px] font-bold tracking-[-0.01em] text-white/80 sm:text-base">
                <span>{liveTime.split(":")[0]}</span>
                <span className="text-[#78dc12]">:</span>
                <span>{liveTime.split(":")[1]}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* BUILD YOUR SYSTEM EXPLAINER */}
      <section className="relative overflow-hidden bg-[#eef3df] text-black">

        {/* soft product-reveal atmosphere */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(123,224,0,0.22),transparent_28%),radial-gradient(circle_at_88%_22%,rgba(21,151,243,0.12),transparent_26%),linear-gradient(180deg,#f7f8ef_0%,#e9f0d8_100%)]" />

        <div className="relative mx-auto max-w-[1240px] px-5 py-14 sm:px-8 sm:py-18 lg:py-24">

          {/* FEATURED PRODUCT FRAME */}
          <div className="relative overflow-hidden rounded-[2.3rem] border border-black/[0.08] bg-white/88 px-5 py-8 shadow-[0_30px_90px_rgba(30,55,0,0.14)] ring-1 ring-white/80 backdrop-blur-sm sm:px-8 sm:py-10 lg:px-12 lg:py-14">

            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#7be000]/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-[#1597F3]/10 blur-3xl" />

            {/* HEADER */}
            <div className="relative mx-auto max-w-[820px] text-center">

              <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#69c900]/25 bg-[#7be000]/10 px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-[#69c900]" />
                <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#438c00]">
                  Build Your System
                </span>
              </div>

              <h2 className="mt-5 text-4xl font-black leading-[0.94] tracking-[-0.055em] sm:text-5xl lg:text-[4rem]">
                Build your business setup
                <span className="block text-[#59ad00]">
                  in minutes.
                </span>
              </h2>

              <p className="mx-auto mt-5 max-w-[720px] text-base leading-7 text-black/60 sm:text-lg">
                Add your business name, logo, services, photos, contact info,
                and the tools you need.
              </p>

            </div>

            {/* 3 BUILD STEPS */}
            <div className="relative mt-10 grid gap-4 lg:grid-cols-3">

              <div className="group rounded-[1.6rem] border border-black/[0.08] bg-[#f8f9f5] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.045)]">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1597F3]/10 text-sm font-black text-[#087fd0]">
                    01
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.16em] text-black/30">
                    Add It
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-black tracking-[-0.025em]">
                  Add your business
                </h3>

                <p className="mt-2 text-sm font-bold leading-6 text-black/50">
                  Name · Logo · Services · Photos
                </p>
              </div>

              <div className="group rounded-[1.6rem] border border-black/[0.08] bg-[#f8f9f5] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.045)]">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1597F3]/10 text-sm font-black text-[#087fd0]">
                    02
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.16em] text-black/30">
                    Choose It
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-black tracking-[-0.025em]">
                  Choose how you work
                </h3>

                <p className="mt-2 text-sm font-bold leading-6 text-black/50">
                  Requests · Estimates · Scheduling · Payments
                </p>
              </div>

              <div className="group relative overflow-hidden rounded-[1.6rem] border border-[#69c900]/30 bg-[#11170d] p-6 text-white shadow-[0_18px_45px_rgba(72,120,0,0.18)]">
                <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-[#7be000]/20 blur-3xl" />

                <div className="relative flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7be000] text-sm font-black text-black">
                    03
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7be000]">
                    Build It
                  </span>
                </div>

                <h3 className="relative mt-5 text-xl font-black tracking-[-0.025em]">
                  HomePlanet builds the system
                </h3>

                <p className="relative mt-2 text-sm font-bold leading-6 text-white/55">
                  Landing Page · Customer Flow · Work Drawer
                </p>
              </div>

            </div>

            {/* WHAT GETS BUILT */}
            <div className="relative mt-5 grid gap-4 md:grid-cols-3">

              <div className="rounded-[1.4rem] border border-black/[0.07] bg-white p-6">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#087fd0]">
                  Your Landing Page
                </div>
                <h4 className="mt-3 text-lg font-black">
                  Ready for customers.
                </h4>
                <p className="mt-2 text-sm leading-6 text-black/55">
                  Business info, services, photos, contact options, and customer requests.
                </p>
              </div>

              <div className="rounded-[1.4rem] border border-black/[0.07] bg-white p-6">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#087fd0]">
                  Your Customer Experience
                </div>
                <h4 className="mt-3 text-lg font-black">
                  Easy from the first tap.
                </h4>
                <p className="mt-2 text-sm leading-6 text-black/55">
                  Requests, messages, scheduling, payments, and notifications.
                </p>
              </div>

              <div className="rounded-[1.4rem] border border-[#69c900]/20 bg-[#f7fbeF] p-6">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#438c00]">
                  Your Work Drawer
                </div>
                <h4 className="mt-3 text-lg font-black">
                  Run the job from one place.
                </h4>
                <p className="mt-2 text-sm leading-6 text-black/55">
                  Call, text, navigate, estimate, track progress, add photos, and complete the job.
                </p>
              </div>

            </div>

            {/* CTA */}
            <div className="relative mt-9 flex flex-col items-center border-t border-black/[0.07] pt-8 text-center">

              <p className="text-sm font-black text-black/65 sm:text-base">
                No coding. No website builder. No software setup.
              </p>

              <button
                type="button"
                onClick={() => window.location.href = "/planet/creator/starter"}
                className="mt-5 inline-flex min-h-[54px] items-center justify-center rounded-xl bg-[#70d400] px-8 font-black text-black shadow-[0_12px_32px_rgba(91,173,0,0.24)] transition hover:-translate-y-0.5 hover:bg-[#7be000]"
              >
                Start Building →
              </button>

            </div>

          </div>

        </div>
      </section>


      {/* FORM */}
      <section
        id="start-my-system"
        className="relative scroll-mt-24 overflow-hidden bg-[#e7e8e4]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(123,224,0,0.11),transparent_26%),radial-gradient(circle_at_12%_16%,rgba(255,255,255,0.95),transparent_30%),radial-gradient(circle_at_88%_20%,rgba(255,255,255,0.78),transparent_28%),radial-gradient(circle_at_75%_85%,rgba(0,0,0,0.055),transparent_34%)]" />



        <div className="relative mx-auto max-w-[1240px] px-5 py-10 sm:px-8 sm:py-12 lg:py-14">
          <div className="relative z-10 mx-auto max-w-[820px] text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#438c00]">
              Start My System
            </p>

            <h2 className="mt-3 text-4xl font-black leading-[0.95] tracking-[-0.055em] sm:text-5xl lg:text-[3.5rem]">
              Tell us what you need.
            </h2>

            <p className="mx-auto mt-3 max-w-[720px] text-base leading-7 text-black/65">
              Tell us what your business does, what gets messy, and what you want
              working better.
            </p>
          </div>

          <div className="relative z-10 mx-auto mt-5 flex items-center justify-center gap-2 text-sm text-black/55">
            <span>Not ready to start?</span>
            <button
              type="button"
              onClick={openQuestionDrawer}
              className="font-black text-[#087fd0] underline decoration-[#1597F3]/30 underline-offset-4"
            >
              Ask us a question.
            </button>
          </div>

          <div className="relative z-10 mx-auto mt-5 max-w-[1180px] rounded-[1.7rem] border border-white/70 bg-white/95 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.12)] ring-1 ring-black/[0.06] backdrop-blur-sm sm:p-6 lg:p-7">

            <form onSubmit={submitRequest}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label>
                  <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-black/65">
                    Business Name
                  </span>

                  <input
                    required
                    value={form.businessName}
                    onChange={(event) =>
                      updateField("businessName", event.target.value)
                    }
                    placeholder="Your business"
                    className="min-h-[56px] w-full rounded-xl border border-black/15 bg-[#f5f6f2] px-4 text-base font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] outline-none transition focus:border-[#69c900] focus:ring-2 focus:ring-[#69c900]/15"
                  />
                </label>

                <label>
                  <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-black/65">
                    Business Type
                  </span>

                  <select
                    value={businessType}
                    onChange={(event) => chooseBusiness(event.target.value)}
                    className="min-h-[56px] w-full rounded-xl border border-black/15 bg-[#f5f6f2] px-4 text-base font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] outline-none transition focus:border-[#69c900] focus:ring-2 focus:ring-[#69c900]/15"
                  >
                    {businessTypes.map((item) => (
                      <option key={item.name}>{item.name}</option>
                    ))}
                    <option>Custom Business</option>
                  </select>
                </label>
              </div>

              <label className="mt-4 block">
                <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-black/65">
                  What do you need help organizing?
                </span>

                <textarea
                  required
                  value={form.need}
                  onChange={(event) =>
                    updateField("need", event.target.value)
                  }
                  placeholder="Example: Customers message me everywhere, estimates get lost, scheduling gets messy, and I need one place to keep everything moving."
                  className="min-h-[110px] w-full resize-y rounded-xl border border-black/15 bg-[#f5f6f2] px-4 py-4 text-base font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] leading-7 outline-none transition focus:border-[#69c900] focus:ring-2 focus:ring-[#69c900]/15"
                />
              </label>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label>
                  <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-black/65">
                    Your Name
                  </span>

                  <input
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                    placeholder="Your name"
                    className="min-h-[56px] w-full rounded-xl border border-black/15 bg-[#f5f6f2] px-4 text-base font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] outline-none transition focus:border-[#69c900] focus:ring-2 focus:ring-[#69c900]/15"
                  />
                </label>

                <label>
                  <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-black/65">
                    Phone
                  </span>

                  <input
                    required
                    inputMode="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(event) =>
                      updateField("phone", event.target.value)
                    }
                    placeholder="Phone number"
                    className="min-h-[56px] w-full rounded-xl border border-black/15 bg-[#f5f6f2] px-4 text-base font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] outline-none transition focus:border-[#69c900] focus:ring-2 focus:ring-[#69c900]/15"
                  />
                </label>
              </div>

              <label className="mt-4 block">
                <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-black/65">
                  Email - Optional
                </span>

                <input
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) =>
                    updateField("email", event.target.value)
                  }
                  placeholder="Email"
                  className="min-h-[56px] w-full rounded-xl border border-black/15 bg-[#f5f6f2] px-4 text-base font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] outline-none transition focus:border-[#69c900] focus:ring-2 focus:ring-[#69c900]/15"
                />
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="mt-5 flex min-h-[58px] w-full items-center justify-center gap-3 rounded-xl bg-[#69c900] px-6 text-base font-black text-black transition hover:bg-[#78dc12] disabled:cursor-wait disabled:opacity-60"
              >
                {submitting ? "Sending..." : "Send My Request"}
                {!submitting && <ArrowRight className="h-5 w-5" />}
              </button>

              {submitError && (
                <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm font-bold text-red-700">
                  {submitError}
                </div>
              )}

              {submitted && (
                <div className="mt-4 rounded-xl border border-[#69c900]/40 bg-[#f3ffe5] p-5">
                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#69c900]">
                      <Check className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="font-black">We got it.</p>

                      <p className="mt-1 text-sm leading-6 text-black/65">
                        Your request has been sent to HomePlanet.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>


      {questionOpen && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close question form"
            onClick={() => setQuestionOpen(false)}
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
          />

          <div className="absolute inset-y-0 right-0 flex w-full max-w-[480px] flex-col bg-white shadow-[-24px_0_70px_rgba(0,0,0,0.22)]">
            <div className="flex items-start justify-between border-b border-black/10 px-5 py-5 sm:px-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1597F3]">
                  HomePlanet
                </p>

                <h2 className="mt-1 text-2xl font-black tracking-[-0.04em]">
                  Ask us a question.
                </h2>

                <p className="mt-2 max-w-[360px] text-sm leading-6 text-black/55">
                  Send us what you are wondering about and we will get back to you.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setQuestionOpen(false)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/5 text-black transition hover:bg-black/10"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
              <form onSubmit={submitQuestion}>
                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-black/60">
                    Your Name
                  </span>

                  <input
                    required
                    autoComplete="name"
                    value={questionForm.name}
                    onChange={(event) =>
                      updateQuestionField("name", event.target.value)
                    }
                    placeholder="Your name"
                    className="min-h-[54px] w-full rounded-xl border border-black/15 bg-[#f5f6f2] px-4 text-base outline-none transition focus:border-[#1597F3] focus:ring-2 focus:ring-[#1597F3]/15"
                  />
                </label>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label>
                    <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-black/60">
                      Phone
                    </span>

                    <input
                      required
                      inputMode="tel"
                      autoComplete="tel"
                      value={questionForm.phone}
                      onChange={(event) =>
                        updateQuestionField("phone", event.target.value)
                      }
                      placeholder="Phone number"
                      className="min-h-[54px] w-full rounded-xl border border-black/15 bg-[#f5f6f2] px-4 text-base outline-none transition focus:border-[#1597F3] focus:ring-2 focus:ring-[#1597F3]/15"
                    />
                  </label>

                  <label>
                    <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-black/60">
                      Email - Optional
                    </span>

                    <input
                      type="email"
                      autoComplete="email"
                      value={questionForm.email}
                      onChange={(event) =>
                        updateQuestionField("email", event.target.value)
                      }
                      placeholder="Email"
                      className="min-h-[54px] w-full rounded-xl border border-black/15 bg-[#f5f6f2] px-4 text-base outline-none transition focus:border-[#1597F3] focus:ring-2 focus:ring-[#1597F3]/15"
                    />
                  </label>
                </div>

                <label className="mt-4 block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-black/60">
                    Your Question
                  </span>

                  <textarea
                    required
                    value={questionForm.question}
                    onChange={(event) =>
                      updateQuestionField("question", event.target.value)
                    }
                    placeholder="What would you like to know?"
                    className="min-h-[150px] w-full resize-y rounded-xl border border-black/15 bg-[#f5f6f2] px-4 py-4 text-base leading-7 outline-none transition focus:border-[#1597F3] focus:ring-2 focus:ring-[#1597F3]/15"
                  />
                </label>

                <button
                  type="submit"
                  disabled={questionSubmitting}
                  className="mt-5 flex min-h-[56px] w-full items-center justify-center gap-3 rounded-xl bg-[#1597F3] px-6 text-base font-black text-white transition hover:bg-[#087fd0] disabled:cursor-wait disabled:opacity-60"
                >
                  {questionSubmitting ? "Sending..." : "Send My Question"}
                  {!questionSubmitting && <ArrowRight className="h-5 w-5" />}
                </button>

                {questionError && (
                  <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm font-bold text-red-700">
                    {questionError}
                  </div>
                )}

                {questionSubmitted && (
                  <div className="mt-4 rounded-xl border border-[#1597F3]/25 bg-[#eef8ff] p-4">
                    <div className="flex gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1597F3] text-white">
                        <Check className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="font-black">Question sent.</p>
                        <p className="mt-1 text-sm leading-6 text-black/60">
                          We received it and will get back to you.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
      <footer className="border-t border-white/10 bg-black text-white">
        <div className="mx-auto max-w-[1180px] px-5 py-12 sm:px-8 lg:py-14">

          <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end lg:gap-10">

            <div>
              <img
                src="/images/homeplanet-brand-logo.png"
                alt="HomePlanet"
                className="h-[72px] w-auto object-contain sm:h-[92px]"
              />

              <div className="mt-5 text-xl font-black tracking-[-0.03em]">
                HomePlanet Custom Systems
              </div>

              <p className="mt-2 max-w-[540px] text-sm leading-6 text-white/60">
                Keep requests, scheduling, payments, customers, and follow-up moving through one clearer workflow.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-black uppercase tracking-[0.16em]">
                <span className="text-[#1597F3]">Systems</span>
                <span className="text-white/20">/</span>
                <span className="text-[#7be000]">Workflows</span>
                <span className="text-white/20">/</span>
                <span className="text-[#1597F3]">Intelligence</span>
              </div>
            </div>

            <div className="lg:text-right">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#1597F3]">
                Ready when you are
              </p>

              <button
                type="button"
                onClick={() => startRequest()}
                className="mt-4 inline-flex min-h-[52px] w-full items-center justify-center gap-3 rounded-xl bg-[#7be000] px-6 font-black text-black transition hover:bg-[#8bf011] sm:w-auto"
              >
                Start My System
                <ArrowRight className="h-5 w-5" />
              </button>

              <div className="mt-5 text-sm font-bold text-white/55">
                homeplanet.city
              </div>
            </div>

          </div>

          <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-5 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
            <span>HomePlanet Systems LLC</span>
            <span>Your business. Your workflow. Your system.</span>
          </div>

        </div>
      </footer>
    </main>
  );
}





