import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  ArrowLeft,
  BedDouble,
  Building2,
  Check,
  ChevronRight,
  Clock3,
  HeartHandshake,
  MapPin,
  MoonStar,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";

type FlowStep = "closed" | "location" | "timing" | "intent" | "results" | "request" | "requested";

type IntentOption = {
  label: string;
  helper: string;
  icon: typeof Search;
};

const intentOptions: IntentOption[] = [
  {
    label: "Closest Available",
    helper: "Get me somewhere fast.",
    icon: MapPin,
  },
  {
    label: "Best Deal",
    helper: "Show me the strongest value.",
    icon: Sparkles,
  },
  {
    label: "Quiet & Comfortable",
    helper: "I need somewhere I can actually rest.",
    icon: MoonStar,
  },
  {
    label: "Something Nice",
    helper: "Better room, amenities, and experience.",
    icon: BedDouble,
  },
  {
    label: "Family Friendly",
    helper: "A practical place for the family.",
    icon: Users,
  },
  {
    label: "Pet Friendly",
    helper: "I need somewhere that accepts my pet.",
    icon: HeartHandshake,
  },
];

const sampleHotels = [
  {
    name: "Harbor Lights Hotel",
    status: "AVAILABLE NOW",
    statusTone: "confirmed",
    checkIn: "Check-in confirmed until 3:30 AM",
    distance: "1.8 miles away",
    price: "$129",
    match: "Quiet & Comfortable",
    amenities: ["Free parking", "24-hour front desk"],
  },
  {
    name: "Palm Court Motor Lodge",
    status: "VERIFYING",
    statusTone: "verifying",
    checkIn: "Checking late-night availability",
    distance: "2.6 miles away",
    price: "$98",
    match: "Best Deal",
    amenities: ["Parking", "Easy room access"],
  },
] as const;

function LateNightHotelsLandingPage() {
  const [step, setStep] = useState<FlowStep>("closed");
  const [location, setLocation] = useState("");
  const [timing, setTiming] = useState("Right now");
  const [intent, setIntent] = useState("Best Deal");
  const [selectedHotelName, setSelectedHotelName] = useState("");
  const [travelerName, setTravelerName] = useState("");
  const [travelerPhone, setTravelerPhone] = useState("");
  const [requestSaving, setRequestSaving] = useState(false);
  const [requestError, setRequestError] = useState("");
  const flowScrollRef = useRef<HTMLElement | null>(null);

  const summary = useMemo(
    () =>
      [location || "Choose location", timing, "1 Room · 2 Guests"]
        .filter(Boolean)
        .join(" · "),
    [location, timing],
  );

  const selectedHotel =
    sampleHotels.find((hotel) => hotel.name === selectedHotelName) ?? null;

  useEffect(() => {
    if (step === "closed") return;

    requestAnimationFrame(() => {
      flowScrollRef.current?.scrollTo({
        top: 0,
        behavior: "auto",
      });
    });
  }, [step]);

  async function submitRoomRequest() {
    if (!selectedHotel || requestSaving) return;

    setRequestSaving(true);
    setRequestError("");

    const { error } = await supabase
      .from("late_night_hotel_requests")
      .insert({
        traveler_name: travelerName.trim(),
        traveler_phone: travelerPhone.trim(),
        location: location.trim(),
        timing,
        intent,
        requested_property: selectedHotel.name,
        current_property: selectedHotel.name,
        quoted_price: selectedHotel.price,
        status: "Needs Confirmation",
      });

    if (error) {
      console.error("Late-night hotel request insert failed:", error);
      setRequestError(
        "We could not send your room request yet. Please try again."
      );
      setRequestSaving(false);
      return;
    }

    setRequestSaving(false);
    setStep("requested");
  }

  const openFlow = () => {
    setStep("location");
  };

  const closeFlow = () => {
    setStep("closed");
  };

  const goBack = () => {
    if (step === "timing") setStep("location");
    else if (step === "intent") setStep("timing");
    else if (step === "results") setStep("intent");
    else if (step === "request") setStep("results");
    else if (step === "requested") setStep("request");
    else closeFlow();
  };

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <div className="mx-auto min-h-screen w-full max-w-7xl overflow-hidden bg-[#0b1626]">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0b1626]/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <div className="min-w-0">
              <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#f3c57d]">
                Working Concept
              </div>
              <div className="truncate text-lg font-black tracking-tight">
                Late Night Hotels
              </div>
            </div>

            <nav className="flex items-center gap-1 text-sm text-white/70">
              <button
                type="button"
                className="rounded-full px-3 py-2 transition hover:bg-white/10 hover:text-white"
              >
                Deals
              </button>
              <button
                type="button"
                className="rounded-full px-3 py-2 transition hover:bg-white/10 hover:text-white"
              >
                For Properties
              </button>
            </nav>
          </div>
        </header>

        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(240,182,93,0.18),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(56,117,182,0.16),transparent_42%)]" />

          <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-16">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/75">
                <MoonStar className="h-4 w-4 text-[#f3c57d]" />
                Late-night check-in made simpler
              </div>

              <h1 className="mt-5 max-w-2xl text-4xl font-black leading-[1.02] tracking-[-0.04em] sm:text-5xl md:text-6xl">
                Need a room tonight?
              </h1>

              <p className="mt-4 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
                Find a place that can actually check you in when you need it.
              </p>

              <div className="mt-7 grid gap-3">
                <button
                  type="button"
                  onClick={openFlow}
                  className="group rounded-2xl border border-white/10 bg-white/[0.07] p-4 text-left transition hover:border-white/20 hover:bg-white/10"
                >
                  <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">
                    Where are you?
                  </div>

                  <div className="mt-1 flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <MapPin className="h-5 w-5 shrink-0 text-[#f3c57d]" />
                      <span className={`truncate text-base font-bold ${location ? "" : "text-white/60"}`}>
                        {location || "City, airport, or area"}
                      </span>
                    </div>

                    <ChevronRight className="h-5 w-5 shrink-0 text-white/40 transition group-hover:translate-x-0.5" />
                  </div>
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setStep("timing")}
                    className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 text-left transition hover:bg-white/10"
                  >
                    <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">
                      Check-in
                    </div>
                    <div className="mt-1 flex items-center gap-2 font-bold">
                      <Clock3 className="h-5 w-5 text-[#f3c57d]" />
                      Tonight
                    </div>
                  </button>

                  <button
                    type="button"
                    className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 text-left transition hover:bg-white/10"
                  >
                    <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">
                      Guests
                    </div>
                    <div className="mt-1 flex items-center gap-2 font-bold">
                      <Users className="h-5 w-5 text-[#f3c57d]" />
                      1 Room · 2
                    </div>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={openFlow}
                  className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#f0b65d] px-5 py-4 text-base font-black text-[#142033] transition hover:bg-[#f4c573] active:scale-[0.99]"
                >
                  <Search className="h-5 w-5" />
                  FIND A ROOM NOW
                </button>

                <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-white/50">
                  <span>Late-night availability</span>
                  <span>Clear check-in times</span>
                  <span>No endless searching</span>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#111f31] p-5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(240,182,93,0.14),transparent_44%)]" />

              <div className="relative">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.17em] text-white/45">
                      A late-night match
                    </div>
                    <div className="mt-1 text-2xl font-black">
                      Know before you drive.
                    </div>
                  </div>

                  <ShieldCheck className="h-8 w-8 text-[#f3c57d]" />
                </div>

                <div className="mt-5 overflow-hidden rounded-3xl border border-white/10 bg-black/15">
                  <div className="flex h-44 items-end bg-[linear-gradient(145deg,#20364e,#101b2a_58%,#0a131f)] p-4">
                    <span className="rounded-full bg-black/45 px-3 py-1 text-xs font-bold text-white/75">
                      Nighttime hotel imagery
                    </span>
                  </div>

                  <div className="p-4">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-black text-emerald-300">
                      <Check className="h-3.5 w-3.5" />
                      AVAILABLE NOW
                    </div>

                    <div className="mt-2 text-sm font-bold text-white/85">
                      Check-in confirmed until 3:30 AM
                    </div>

                    <div className="mt-4 flex items-end justify-between gap-3">
                      <div>
                        <div className="text-xl font-black">
                          Harbor Lights Hotel
                        </div>
                        <div className="mt-1 text-sm text-white/50">
                          1.8 miles away
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs uppercase tracking-[0.14em] text-white/40">
                          Tonight
                        </div>
                        <div className="text-2xl font-black">$129</div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-white/55">
                  Familiar hotel information, but the most important question comes
                  first: can they actually check you in right now?
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="max-w-2xl">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">
              Smarter than a random hotel list
            </div>
            <h2 className="mt-2 text-3xl font-black tracking-tight">
              What matters tonight?
            </h2>
            <p className="mt-3 text-white/60">
              Start with the reason behind the search. We narrow the choices before
              making you sort through dozens of properties.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
            {intentOptions.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  type="button"
                  key={item.label}
                  onClick={() => {
                    setIntent(item.label);
                    setStep(location.trim() ? "timing" : "location");
                  }}
                  className="min-h-36 rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-left transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.075]"
                >
                  <Icon className="h-6 w-6 text-[#f3c57d]" />
                  <div className="mt-4 font-black">{item.label}</div>
                  <div className="mt-2 text-sm leading-5 text-white/55">
                    {item.helper}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="border-y border-white/10 bg-black/10">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
            <div className="grid gap-6 rounded-[30px] border border-[#f0b65d]/25 bg-[#f0b65d]/[0.07] p-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#f3c57d]">
                  <Building2 className="h-4 w-4" />
                  Hotels · Motels · Motor Lodges
                </div>

                <h2 className="mt-3 text-3xl font-black tracking-tight">
                  Have rooms available tonight?
                </h2>

                <p className="mt-3 max-w-2xl leading-7 text-white/65">
                  Reach travelers actively looking for somewhere to stay right now.
                </p>
              </div>

              <button
                type="button"
                className="min-h-13 rounded-2xl border border-white/15 bg-white/[0.08] px-5 py-4 font-black transition hover:bg-white/[0.12]"
              >
                LIST YOUR PROPERTY
              </button>
            </div>
          </div>
        </section>

        <footer className="mx-auto max-w-6xl px-4 py-8 text-sm text-white/40 sm:px-6">
          Initial Level One traveler experience · Built with HomePlanet
        </footer>
      </div>

      {step !== "closed" && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/65 sm:items-center sm:p-4"
          role="presentation"
        >
          <section
            ref={flowScrollRef}
            role="dialog"
            aria-modal="true"
            aria-label="Find a room tonight"
            className="max-h-[94dvh] w-full overflow-y-auto overscroll-contain rounded-t-[30px] border border-white/10 bg-[#0d1a2b] text-white shadow-2xl sm:max-w-lg sm:rounded-[30px]"
          >
            <div className="sticky top-0 z-10 border-b border-white/10 bg-[#0d1a2b]/95 px-4 pb-4 pt-3 backdrop-blur">
              <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-white/20 sm:hidden" />

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={goBack}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 transition hover:bg-white/10 hover:text-white"
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>

                <div className="min-w-0 flex-1 text-center">
                  <div className="truncate text-xs font-bold uppercase tracking-[0.14em] text-white/40">
                    {summary}
                  </div>
                  <div className="mt-1 text-sm text-white/55">
                    {step === "location" && "Step 1 of 3"}
                    {step === "timing" && "Step 2 of 3"}
                    {step === "intent" && "Step 3 of 3"}
                    {step === "results" && "Best matches for you"}
                    {step === "request" && "Request this room"}
                    {step === "requested" && "Request sent"}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeFlow}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 transition hover:bg-white/10 hover:text-white"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-4 pb-8 sm:p-6">
              {step === "location" && (
                <div>
                  <h2 className="text-3xl font-black tracking-tight">
                    Where do you need a room?
                  </h2>

                  <p className="mt-2 leading-6 text-white/60">
                    Start with the city, airport, or area. We’ll narrow it from
                    there.
                  </p>

                  <label className="mt-6 block">
                    <span className="text-sm font-bold text-white/75">
                      City, airport, or area
                    </span>

                    <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-3">
                      <MapPin className="h-5 w-5 shrink-0 text-[#f3c57d]" />
                      <input
                        value={location}
                        onChange={(event) => setLocation(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" && location.trim()) {
                            setStep("timing");
                          }
                        }}
                        className="min-w-0 flex-1 border-0 bg-transparent p-0 text-lg font-semibold text-white outline-none placeholder:text-white/25"
                        placeholder="Miami, FL"
                      />
                    </div>
                  </label>

                  <button
                    type="button"
                    onClick={() => setLocation("Current location")}
                    className="mt-3 flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-4 text-left font-bold transition hover:bg-white/[0.08]"
                  >
                    <MapPin className="h-5 w-5 text-[#f3c57d]" />
                    Use my current location
                  </button>

                  <button
                    type="button"
                    disabled={!location.trim()}
                    onClick={() => setStep("timing")}
                    className="mt-6 w-full rounded-2xl bg-[#f0b65d] px-5 py-4 font-black text-[#142033] transition hover:bg-[#f4c573] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    CONTINUE
                  </button>
                </div>
              )}

              {step === "timing" && (
                <div>
                  <h2 className="text-3xl font-black tracking-tight">
                    When do you need to check in?
                  </h2>

                  <p className="mt-2 leading-6 text-white/60">
                    We’ll prioritize places that can actually accept you at that
                    time.
                  </p>

                  <div className="mt-6 grid gap-3">
                    {["Right now", "Within 1 hour", "Later tonight"].map(
                      (option) => (
                        <button
                          type="button"
                          key={option}
                          onClick={() => {
                            setTiming(option);
                            setStep("intent");
                          }}
                          className={`flex min-h-16 items-center justify-between rounded-2xl border px-4 py-4 text-left font-black transition ${
                            timing === option
                              ? "border-[#f0b65d]/60 bg-[#f0b65d]/10"
                              : "border-white/10 bg-white/[0.05] hover:bg-white/[0.08]"
                          }`}
                        >
                          <span>{option}</span>
                          <ChevronRight className="h-5 w-5 text-white/35" />
                        </button>
                      ),
                    )}
                  </div>
                </div>
              )}

              {step === "intent" && (
                <div>
                  <h2 className="text-3xl font-black tracking-tight">
                    What matters tonight?
                  </h2>

                  <p className="mt-2 leading-6 text-white/60">
                    Pick the one thing that matters most. We’ll use it to focus
                    the matches.
                  </p>

                  <div className="mt-6 grid gap-3">
                    {intentOptions.map((item) => {
                      const Icon = item.icon;

                      return (
                        <button
                          type="button"
                          key={item.label}
                          onClick={() => {
                            setIntent(item.label);
                            setStep("results");
                          }}
                          className={`flex items-center gap-4 rounded-2xl border px-4 py-4 text-left transition ${
                            intent === item.label
                              ? "border-[#f0b65d]/60 bg-[#f0b65d]/10"
                              : "border-white/10 bg-white/[0.05] hover:bg-white/[0.08]"
                          }`}
                        >
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.07]">
                            <Icon className="h-5 w-5 text-[#f3c57d]" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="font-black">{item.label}</div>
                            <div className="mt-1 text-sm text-white/55">
                              {item.helper}
                            </div>
                          </div>

                          <ChevronRight className="h-5 w-5 shrink-0 text-white/30" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === "results" && (
                <div className="pt-1">
                  <h2 className="text-3xl font-black tracking-tight">
                    Best matches for you right now
                  </h2>

                  <p className="mt-2 leading-6 text-white/60">
                    {location} · {timing} · {intent}
                  </p>

                  <div className="mt-6 grid gap-4">
                    {sampleHotels.map((hotel) => (
                      <article
                        key={hotel.name}
                        className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045]"
                      >
                        <div className="flex h-40 items-end bg-[linear-gradient(145deg,#20364e,#101b2a_58%,#0a131f)] p-4">
                          <span className="rounded-full bg-black/45 px-3 py-1 text-xs font-bold text-white/70">
                            Nighttime property image
                          </span>
                        </div>

                        <div className="p-4">
                          <div
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black ${
                              hotel.statusTone === "confirmed"
                                ? "bg-emerald-400/15 text-emerald-300"
                                : "bg-sky-400/15 text-sky-200"
                            }`}
                          >
                            {hotel.statusTone === "confirmed" ? (
                              <Check className="h-3.5 w-3.5" />
                            ) : (
                              <Clock3 className="h-3.5 w-3.5" />
                            )}

                            {hotel.status}
                          </div>

                          <div className="mt-2 text-sm font-bold text-white/85">
                            {hotel.checkIn}
                          </div>

                          <h3 className="mt-4 text-2xl font-black tracking-tight">
                            {hotel.name}
                          </h3>

                          <div className="mt-1 text-sm text-white/50">
                            {hotel.distance}
                          </div>

                          <div className="mt-4 rounded-2xl border border-white/10 bg-black/10 p-3">
                            <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/40">
                              Why this matches you
                            </div>

                            <div className="mt-2 font-bold">{intent}</div>

                            <div className="mt-3 flex flex-wrap gap-2">
                              {hotel.amenities.map((amenity) => (
                                <span
                                  key={amenity}
                                  className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-white/55"
                                >
                                  {amenity}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="mt-5 flex items-end justify-between gap-3">
                            <div>
                              <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/40">
                                Tonight
                              </div>
                              <div className="text-3xl font-black">
                                {hotel.price}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedHotelName(hotel.name);
                                setStep("request");
                              }}
                              className="min-h-12 rounded-2xl bg-[#f0b65d] px-4 py-3 font-black text-[#142033] transition hover:bg-[#f4c573]"
                            >
                              BOOK / REQUEST
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="font-black">
                      Level One truth rule
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/55">
                      Results shown here are interface examples only. Live
                      availability will never be presented as confirmed until the
                      system has a real confirmation source.
                    </p>
                  </div>
                </div>
              )}

              {step === "request" && selectedHotel && (
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.17em] text-[#f3c57d]">
                    {selectedHotel.status === "AVAILABLE NOW"
                      ? "Late-night request"
                      : "Availability request"}
                  </div>

                  <h2 className="mt-2 text-3xl font-black tracking-tight">
                    Request {selectedHotel.name}
                  </h2>

                  <p className="mt-2 leading-6 text-white/60">
                    Send your details so this property can confirm that they can
                    accept your late-night arrival.
                  </p>

                  <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-black">{selectedHotel.name}</div>
                        <div className="mt-1 text-sm text-white/55">
                          {selectedHotel.distance}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">
                          Tonight
                        </div>
                        <div className="text-2xl font-black">
                          {selectedHotel.price}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-white/10 pt-4">
                      <div className="text-sm font-bold text-white/85">
                        {selectedHotel.checkIn}
                      </div>

                      <div className="mt-2 text-sm text-white/55">
                        {location} · {timing} · {intent}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4">
                    <label>
                      <span className="text-sm font-bold text-white/75">
                        Your name
                      </span>

                      <input
                        value={travelerName}
                        onChange={(event) => setTravelerName(event.target.value)}
                        autoComplete="name"
                        placeholder="Full name"
                        className="mt-2 w-full rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-4 text-base font-semibold text-white outline-none placeholder:text-white/25 focus:border-[#f0b65d]/60"
                      />
                    </label>

                    <label>
                      <span className="text-sm font-bold text-white/75">
                        Mobile number
                      </span>

                      <input
                        value={travelerPhone}
                        onChange={(event) => setTravelerPhone(event.target.value)}
                        autoComplete="tel"
                        inputMode="tel"
                        placeholder="Best number for confirmation"
                        className="mt-2 w-full rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-4 text-base font-semibold text-white outline-none placeholder:text-white/25 focus:border-[#f0b65d]/60"
                      />
                    </label>
                  </div>

                  <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] p-4">
                    <div className="flex gap-3">
                      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#f3c57d]" />

                      <div>
                        <div className="font-black">
                          This does not confirm the room yet.
                        </div>

                        <p className="mt-1 text-sm leading-6 text-white/60">
                          Your room is confirmed only after the property accepts
                          the request and you receive a confirmation.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={
                      requestSaving ||
                      !travelerName.trim() ||
                      travelerPhone.replace(/\D/g, "").length < 7
                    }
                    onClick={submitRoomRequest}
                    className="mt-6 w-full rounded-2xl bg-[#f0b65d] px-5 py-4 font-black text-[#142033] transition hover:bg-[#f4c573] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {requestSaving ? "SENDING REQUEST..." : "REQUEST THIS ROOM"}
                  </button>

                  {requestError && (
                    <div className="mt-3 rounded-2xl border border-rose-400/25 bg-rose-400/[0.07] p-3 text-sm font-bold text-rose-200">
                      {requestError}
                    </div>
                  )}
                </div>
              )}

              {step === "requested" && selectedHotel && (
                <div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
                    <Check className="h-7 w-7" />
                  </div>

                  <h2 className="mt-5 text-3xl font-black tracking-tight">
                    Request sent.
                  </h2>

                  <p className="mt-2 leading-6 text-white/60">
                    We’re waiting for {selectedHotel.name} to confirm your
                    late-night arrival.
                  </p>

                  <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.045] p-5">
                    <div className="text-xs font-bold uppercase tracking-[0.17em] text-white/40">
                      Current status
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-lg font-black">
                      <Clock3 className="h-5 w-5 text-[#f3c57d]" />
                      Waiting for hotel confirmation
                    </div>

                    <div className="mt-5 grid gap-3 text-sm">
                      <div className="flex justify-between gap-4 border-t border-white/10 pt-3">
                        <span className="text-white/45">Property</span>
                        <span className="text-right font-bold">
                          {selectedHotel.name}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4 border-t border-white/10 pt-3">
                        <span className="text-white/45">Needed</span>
                        <span className="text-right font-bold">{timing}</span>
                      </div>

                      <div className="flex justify-between gap-4 border-t border-white/10 pt-3">
                        <span className="text-white/45">Preference</span>
                        <span className="text-right font-bold">{intent}</span>
                      </div>

                      <div className="flex justify-between gap-4 border-t border-white/10 pt-3">
                        <span className="text-white/45">Contact</span>
                        <span className="text-right font-bold">
                          {travelerPhone}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-white/10 bg-black/10 p-4">
                    <div className="font-black">What happens next?</div>

                    <p className="mt-2 text-sm leading-6 text-white/55">
                      Once the property confirms availability and late check-in,
                      you’ll receive the next booking or confirmation step.
                    </p>
                  </div>

                  <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] p-4 text-sm leading-6 text-white/65">
                    <strong className="text-white">
                      Do not travel to the property yet.
                    </strong>{" "}
                    Wait until you receive confirmation that the room is
                    available for your arrival.
                  </div>

                  <button
                    type="button"
                    onClick={closeFlow}
                    className="mt-6 w-full rounded-2xl border border-white/15 bg-white/[0.07] px-5 py-4 font-black transition hover:bg-white/[0.1]"
                  >
                    DONE
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default LateNightHotelsLandingPage;
