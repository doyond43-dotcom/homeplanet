import { useEffect, useMemo, useState } from "react";
import { CalendarCheck, MapPin, MessageCircle, Phone, Share2, Trash2, X } from "lucide-react";
import { supabase } from "../lib/supabase";

type Signal = {
  id: string;
  name: string;
  phone: string;
  service: string;
  location: string;
  home: string;
  condition: string;
  pets: string;
  preferred: string;
  value: string;
  nextMove: string;
  suggestion: string;
  message: string;
};

const initialSignals: Signal[] = [
  {
    id: "dan-test",
    name: "Dan Test Doyon",
    service: "Deep Cleaning",
    location: "Okeechobee, FL",
    home: "2 Bed / 2 Bath",
    condition: "Heavy Deep Clean",
    pets: "Multiple Pets",
    preferred: "Mornings",
    value: "$160–$240 est.",
    nextMove: "Ask for photos before final quote.",
    suggestion: "This looks like a heavier job. Confirm photos, pets, access, and expected time before scheduling.",
    message: "Hey Dan, thanks for reaching out. Before I lock in a quote, can you send a few photos of the main areas so I can give you a fair estimate?",
  },
  {
    id: "sarah-weekly",
    name: "Sarah Miller",
    service: "Weekly Cleaning",
    location: "Taylor Creek",
    home: "3 Bed / 2 Bath",
    condition: "Average",
    pets: "Cats",
    preferred: "Fridays",
    value: "Recurring lead",
    nextMove: "Offer a recurring schedule.",
    suggestion: "This could become steady weekly work. Offer a simple recurring cleaning spot.",
    message: "Hey Sarah, I can help with weekly cleaning. If you want, I can hold a regular spot so you do not have to keep rebooking each week.",
  },
  {
    id: "moveout-airbnb",
    name: "Lakeview Airbnb",
    service: "Vacation Rental Reset",
    location: "Lakeview Estates",
    home: "2 Bed / 1 Bath",
    condition: "Needs Extra Attention",
    pets: "No Pets",
    preferred: "Same day reset",
    value: "Fast-turnover job",
    nextMove: "Confirm checkout/check-in window.",
    suggestion: "Timing matters most here. Confirm the exact turnover window before accepting.",
    message: "Hey there, I can help with the rental reset. What time is checkout and what time does the next guest arrive?",
  },
];


function smsBody(phone: string, body: string) {
  const digits = phone.replace(/\D/g, "");
  const normalized =
    digits.length === 10 ? `+1${digits}` : digits.length === 11 && digits.startsWith("1") ? `+${digits}` : digits;

  return normalized ? `sms:${normalized}?body=${encodeURIComponent(body)}` : "#";
}

function buildFirstReplyText(signal: Signal) {
  return `Hi ${signal.name}, this is Kaitlin with Only The Essentials Cleaning. I received your cleaning request and I’m reviewing the details now.

I’ll reply here with the next step.`;
}

function buildEstimateText(signal: Signal) {
  return `Hi ${signal.name}, this is Kaitlin with Only The Essentials Cleaning.

I reviewed your cleaning request:

Service: ${signal.service}
Home: ${signal.home}
Condition: ${signal.condition}
Pets: ${signal.pets}
Preferred time: ${signal.preferred}

I can help with this. I’ll confirm the final price based on the home details, condition, and any photos/notes you sent.`;
}

function buildScheduleText(signal: Signal) {
  return `Hi ${signal.name}, this is Kaitlin with Only The Essentials Cleaning.

Your cleaning request is ready to schedule.

Preferred time: ${signal.preferred}

What day works best for you?`;
}

function buildPaymentText(signal: Signal) {
  return `Hi ${signal.name}, this is Kaitlin with Only The Essentials Cleaning.

Your cleaning is ready for payment. I can send the payment link here once everything is confirmed.`;
}

function buildReviewText(signal: Signal) {
  return `Hi ${signal.name}, thank you for choosing Only The Essentials Cleaning.

If you were happy with the cleaning, I’d really appreciate a quick review. It helps a local business more than you know.`;
}

function buildSocialPost(signal: Signal) {
  return `Another cleaning request organized through Only The Essentials Cleaning.

Service: ${signal.service}
Home: ${signal.home}
Condition: ${signal.condition}

Simple request. Clear details. Clean follow-up.`;
}

function copyText(label: string, text: string) {
  navigator.clipboard?.writeText(text);
  alert(label);
}
export default function OnlyTheEssentialsIntelligenceDashboard() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [selected, setSelected] = useState<Signal | null>(null);
  const [showContactDetails, setShowContactDetails] = useState(false);

  useEffect(() => {
    async function loadRequests() {
      const { data, error } = await supabase
        .from("cleaning_requests")
        .select("*")
        .eq("business_slug", "only-the-essentials")
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Could not load cleaning requests:", error);
        return;
      }

      const liveSignals = (data || []).map((row: any) => {
        const notes = row.notes || "";
        const read = (label: string, fallback: string) => {
          const match = notes.match(new RegExp(label + ":\\s*([^\\n]+)", "i"));
          if (match?.[1]?.trim()) return match[1].trim();

          const lines = notes.split(/\r?\n/).map((line: string) => line.trim()).filter(Boolean);
          const index = lines.findIndex((line: string) => line.toLowerCase() === label.toLowerCase());
          if (index >= 0 && lines[index + 1]) return lines[index + 1];

          return fallback;
        };

        const service = read("Service Type", row.request_type === "quote" ? "Cleaning Quote" : "Cleaning Request");
        const bedrooms = read("Bedrooms", "Bedrooms not listed");
        const bathrooms = read("Bathrooms", "Bathrooms not listed");
        const condition = read("Condition", "Condition not listed");
        const pets = read("Pets", "Pets not listed");
        const preferred = read("Preferred Time", row.preferred_time || "Preferred time not listed");

        const heavy = condition.toLowerCase().includes("heavy") || condition.toLowerCase().includes("extra");
        const hasPets = pets !== "No Pets" && pets !== "Pets not listed";

        return {
          id: row.id,
          name: row.customer_name || "New Cleaning Request",
          phone: row.customer_phone || "",
          service,
          location: row.customer_address === "Quote request from landing page" ? "Okeechobee, FL" : row.customer_address || "Okeechobee, FL",
          home: `${bedrooms} / ${bathrooms}`,
          condition,
          pets,
          preferred,
          value: "Needs quote",
          nextMove: heavy ? "Ask for photos before final quote." : hasPets ? "Confirm pet notes before scheduling." : "Review request and follow up with customer.",
          suggestion: heavy ? "This looks like a heavier job. Confirm photos, pets, access, and expected time before scheduling." : hasPets ? "Pet home request. Confirm animals, access, and any extra cleaning needs before quoting." : "New customer request. Review the details and follow up while the lead is fresh.",
          message: `Hey ${row.customer_name || "there"}, thanks for reaching out. I received your cleaning request and will review the details before confirming the quote.`,
        };
      });

      setSignals(liveSignals);
    }

    loadRequests();
  }, []);

  const metrics = useMemo(() => {
    const heavy = signals.filter((s) => {
      const condition = s.condition.toLowerCase();
      return condition.includes("heavy") || condition.includes("extra attention") || condition.includes("needs extra");
    }).length;

    const pets = signals.filter((s) => {
      const pets = s.pets.toLowerCase();
      return pets !== "no pets" && pets !== "pets not listed" && pets !== "condition not listed";
    }).length;

    return [
      { label: "Active Signals", value: signals.length },
      { label: "Needs Quote", value: signals.length },
      { label: "Heavy Jobs", value: heavy },
      { label: "Pet Homes", value: pets },
    ];
  }, [signals]);

  async function deleteSignal(id: string) {
    const signal = signals.find((item) => item.id === id);
    const label = signal?.name || "this request";

    const confirmed = window.confirm(`Delete ${label}? This removes the request from the database.`);
    if (!confirmed) return;

    const { data, error } = await supabase
      .from("cleaning_requests")
      .delete()
      .eq("id", id)
      .select("id, customer_name");

    if (error) {
      console.error("Could not delete cleaning request:", error);
      window.alert("Could not delete this request. Supabase returned an error. Check console.");
      return;
    }

    if (!data || data.length === 0) {
      console.warn("Delete returned no rows. RLS may be blocking delete or the id did not match.", { id, data });
      window.alert("The card was removed from the screen, but Supabase did not delete the database row. RLS/policy is probably blocking it.");
      return;
    }

    setSignals((current) => current.filter((signal) => signal.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-6xl px-4 py-6">
        <header className="rounded-[2rem] border border-pink-300/20 bg-gradient-to-br from-pink-950/40 via-zinc-950 to-black p-6">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-pink-300">
            Customer Intelligence
          </p>
          <h1 className="mt-3 text-4xl font-black sm:text-6xl">
            Only The Essentials
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300">
            Signals, follow-ups, job difficulty, and next moves for Kaitlin&apos;s cleaning requests.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="text-3xl font-black text-pink-300">{metric.value}</div>
                <div className="mt-1 text-[11px] font-black uppercase tracking-[0.22em] text-zinc-400">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </header>

        <section className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-white/10 bg-zinc-950 p-4 sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.32em] text-pink-300">
              Active Customer Signals
            </p>

            <div className="mt-5 space-y-4">
              {signals.map((signal) => (
                <article
                  key={signal.id}
                  className="rounded-2xl border border-white/10 bg-black p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <button onClick={() => {
                      setSelected(signal);
                      setShowContactDetails(false);
                    }} className="flex-1 text-left">
                      <h2 className="text-2xl font-black">{signal.name}</h2>
                      <p className="mt-1 font-black text-pink-300">{signal.service}</p>
                      <p className="mt-1 text-sm text-zinc-400">{signal.location}</p>
                    </button>

                    <button
                      onClick={() => deleteSignal(signal.id)}
                      className="rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-red-200"
                      aria-label="Delete signal"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>

                  <button onClick={() => {
                    setSelected(signal);
                    setShowContactDetails(false);
                  }} className="mt-4 w-full text-left">
                    <div className="grid gap-2 text-sm text-zinc-300 sm:grid-cols-2">
                      <div>{signal.home}</div>
                      <div>{signal.condition}</div>
                      <div>{signal.pets}</div>
                      <div>{signal.preferred}</div>
                    </div>

                    <div className="mt-4 rounded-xl bg-pink-400/10 p-3 text-sm font-bold text-pink-100">
                      Next move: {signal.nextMove}
                    </div>
                  </button>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-[2rem] border border-pink-300/20 bg-pink-950/20 p-5">
            <p className="text-xs font-black uppercase tracking-[0.32em] text-pink-300">
              Live Suggestions
            </p>

            <div className="mt-4 space-y-3">
              <div className="rounded-2xl bg-black p-4">
                <h3 className="font-black">Heavy cleans need protection.</h3>
                <p className="mt-1 text-sm text-zinc-400">
                  Ask for photos before confirming price or time.
                </p>
              </div>

              <div className="rounded-2xl bg-black p-4">
                <h3 className="font-black">Pet homes are showing up.</h3>
                <p className="mt-1 text-sm text-zinc-400">
                  Add pet notes to every quote before scheduling.
                </p>
              </div>

              <div className="rounded-2xl bg-black p-4">
                <h3 className="font-black">Recurring cleaning is the win.</h3>
                <p className="mt-1 text-sm text-zinc-400">
                  Weekly and biweekly leads should get follow-up first.
                </p>
              </div>
            </div>
          </aside>
        </section>
      </section>

      {selected ? (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm">
          <aside className="ml-auto flex h-full w-full max-w-md flex-col border-l border-pink-300/20 bg-black p-5 shadow-2xl shadow-pink-950/40">
            <button
              onClick={() => {
                setSelected(null);
                setShowContactDetails(false);
              }}
              className="ml-auto rounded-xl border border-white/10 bg-white/10 p-3"
            >
              <X size={18} />
            </button>

            <div className="mt-4 rounded-2xl border border-pink-300/20 bg-pink-400/10 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-pink-300">
                Customer Signal
              </p>

              <div className="mt-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-2xl font-black">{selected.name}</h2>
                  <p className="mt-1 text-lg font-black text-pink-300">{selected.service}</p>
                  <p className="mt-1 truncate text-sm text-zinc-400">{selected.location}</p>
                </div>


              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <a href={selected.phone ? `tel:${selected.phone}` : undefined} className="rounded-xl border border-pink-300/30 bg-pink-400/10 py-3 text-center text-xs font-black">
                <Phone className="mx-auto mb-1" size={16} />
                Call
              </a>
              <a href={smsBody(selected.phone, buildFirstReplyText(selected))} className="rounded-xl border border-pink-300/30 bg-pink-400/10 py-3 text-center text-xs font-black">
                <MessageCircle className="mx-auto mb-1" size={16} />
                Text
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selected.location)}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-pink-300/30 bg-pink-400/10 py-3 text-center text-xs font-black"
              >
                <MapPin className="mx-auto mb-1" size={16} />
                Navigate
              </a>
            </div>

            <div className="mt-5 space-y-4 overflow-auto pb-6">
              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
                <button
                  type="button"
                  onClick={() => setShowContactDetails((current) => !current)}
                  className="flex w-full items-center justify-between gap-3 text-left"
                >
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.35em] text-pink-200">
                      CONTACT / DETAILS
                    </p>
                    <p className="mt-2 text-sm font-bold text-zinc-300">
                      {selected.phone || "No phone"} • {selected.home} • {selected.preferred}
                    </p>
                  </div>
                  <span className="rounded-full border border-pink-300/25 bg-pink-400/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-pink-100">
                    {showContactDetails ? "Hide" : "Show"}
                  </span>
                </button>

                {showContactDetails ? (
                  <div className="mt-4 space-y-4 border-t border-white/10 pt-4">
                    <div className="space-y-1 text-sm text-zinc-200">
                      <div>{selected.name}</div>
                      <div>{selected.phone || "No phone number provided"}</div>
                      <div>{selected.location}</div>
                    </div>

                    <div className="space-y-1 text-sm text-zinc-200">
                      <div>Service: {selected.service}</div>
                      <div>Home: {selected.home}</div>
                      <div>Condition: {selected.condition}</div>
                      <div>Pets: {selected.pets}</div>
                      <div>Preferred: {selected.preferred}</div>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.35em] text-pink-200">
                  INTELLIGENCE
                </p>
                <p className="mt-3 text-sm text-zinc-200">
                  {selected.suggestion}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
  <p className="text-[11px] font-black uppercase tracking-[0.35em] text-pink-200">
    ESTIMATE
  </p>

  <div className="mt-3 space-y-2 text-sm">
    <div className="flex justify-between">
      <span className="text-zinc-400">Status</span>
      <span className="font-bold text-yellow-300">Not Sent</span>
    </div>

    <div className="flex justify-between">
      <span className="text-zinc-400">Range</span>
      <span className="font-bold">$160-$240</span>
    </div>
  </div>

  <div className="mt-4 grid gap-2">
    <button
      type="button"
      onClick={() => copyText("Estimate draft copied", buildEstimateText(selected))}
      className="rounded-xl border border-white/10 py-3 text-sm font-black"
    >
      Copy Estimate Draft
    </button>

    <a
      href={smsBody(selected.phone, buildEstimateText(selected))}
      className="rounded-xl bg-pink-400 py-3 text-center text-sm font-black text-black"
    >
      Send Estimate Text
    </a>
  </div>

  <div className="mt-4 rounded-xl bg-yellow-500/10 p-3 text-sm font-bold text-yellow-200">
    Next Move: Send estimate to customer.
  </div>
</div>

              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
  <p className="text-[11px] font-black uppercase tracking-[0.35em] text-pink-200">
    SCHEDULE
  </p>

  <div className="mt-3 space-y-2 text-sm">
    <div className="flex justify-between">
      <span className="text-zinc-400">Status</span>
      <span className="font-bold text-yellow-300">Not Scheduled</span>
    </div>

    <div className="flex justify-between">
      <span className="text-zinc-400">Preferred</span>
      <span className="font-bold">{selected.preferred}</span>
    </div>
  </div>

  <div className="mt-4 grid gap-2">
    <a
      href={smsBody(selected.phone, buildScheduleText(selected))}
      className="rounded-xl bg-pink-400 py-3 text-center text-sm font-black text-black"
    >
      Confirm Schedule Text
    </a>
  </div>

  <div className="mt-4 rounded-xl bg-yellow-500/10 p-3 text-sm font-bold text-yellow-200">
    Next Move: Book customer on calendar.
  </div>
</div>

              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.35em] text-pink-200">
                  WORK / PHOTOS
                </p>

                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Work Status</span>
                    <span className="font-bold text-yellow-300">Not Started</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-zinc-400">Before Photos</span>
                    <span className="font-bold">Not Added</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-zinc-400">After Photos</span>
                    <span className="font-bold">Not Added</span>
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-pink-400/10 p-3 text-sm font-bold text-pink-100">
                  Next Move: Take before and after photos when the cleaning starts and finishes so the job proof stays with the request.
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
  <p className="text-[11px] font-black uppercase tracking-[0.35em] text-pink-200">
    PAYMENT
  </p>

  <div className="mt-3 grid gap-2">
    <a
      href={smsBody(selected.phone, buildPaymentText(selected))}
      className="rounded-xl border border-green-400/30 bg-green-500/10 py-3 text-center text-sm font-black"
    >
      Send Payment Link Text
    </a>

    <button
      type="button"
      onClick={() => copyText("Payment note copied", buildPaymentText(selected))}
      className="rounded-xl border border-white/10 py-3 text-sm font-black"
    >
      Copy Payment Note
    </button>
  </div>
</div>

              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
  <p className="text-[11px] font-black uppercase tracking-[0.35em] text-pink-200">
    REVIEWS
  </p>

  <div className="mt-3 space-y-2 text-sm">
    <div className="flex justify-between">
      <span className="text-zinc-400">Status</span>
      <span className="font-bold text-yellow-300">Not Requested</span>
    </div>
  </div>

  <div className="mt-4 grid gap-2">
    <a
      href={smsBody(selected.phone, buildReviewText(selected))}
      className="rounded-xl bg-pink-400 py-3 text-center text-sm font-black text-black"
    >
      Send Review Text
    </a>

    <button
      type="button"
      onClick={() => copyText("Post copied", buildSocialPost(selected))}
      className="rounded-xl border border-white/10 py-3 text-sm font-black"
    >
      <Share2 className="mr-1 inline" size={14} />
      Copy Post
    </button>
  </div>

  <div className="mt-4 rounded-xl bg-yellow-500/10 p-3 text-sm font-bold text-yellow-200">
    Next Move: Request customer review after payment.
  </div>
</div>

              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.35em] text-pink-200">
                  TIMELINE
                </p>

                <button
                  onClick={() => deleteSignal(selected.id)}
                  className="mt-4 w-full rounded-xl border border-red-400/30 bg-red-500/10 py-3 text-sm font-black text-red-200"
                >
                  Delete Request
                </button>
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </main>
  );
}





















