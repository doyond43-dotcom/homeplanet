import { useMemo, useState } from "react";
import { CalendarCheck, MessageCircle, Phone, Trash2, X } from "lucide-react";

type Signal = {
  id: string;
  name: string;
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

export default function OnlyTheEssentialsIntelligenceDashboard() {
  const [signals, setSignals] = useState(initialSignals);
  const [selected, setSelected] = useState<Signal | null>(null);

  const metrics = useMemo(() => {
    const heavy = signals.filter((s) => s.condition.toLowerCase().includes("heavy")).length;
    const pets = signals.filter((s) => s.pets !== "No Pets").length;

    return [
      { label: "Active Signals", value: signals.length },
      { label: "Needs Quote", value: signals.length },
      { label: "Heavy Jobs", value: heavy },
      { label: "Pet Homes", value: pets },
    ];
  }, [signals]);

  function deleteSignal(id: string) {
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
                    <button onClick={() => setSelected(signal)} className="flex-1 text-left">
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

                  <button onClick={() => setSelected(signal)} className="mt-4 w-full text-left">
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
              onClick={() => setSelected(null)}
              className="ml-auto rounded-xl border border-white/10 bg-white/10 p-3"
            >
              <X size={18} />
            </button>

            <p className="mt-4 text-xs font-black uppercase tracking-[0.32em] text-pink-300">
              Customer Signal
            </p>

            <h2 className="mt-3 text-4xl font-black">{selected.name}</h2>
            <p className="mt-1 text-xl font-black text-pink-300">{selected.service}</p>
            <p className="mt-1 text-sm text-zinc-400">{selected.location}</p>

            <div className="mt-6 grid grid-cols-3 gap-2">
              <a href="tel:8635320683" className="rounded-xl border border-pink-300/30 bg-pink-400/10 py-3 text-center text-xs font-black">
                <Phone className="mx-auto mb-1" size={16} />
                Call
              </a>
              <a href="sms:8635320683" className="rounded-xl border border-pink-300/30 bg-pink-400/10 py-3 text-center text-xs font-black">
                <MessageCircle className="mx-auto mb-1" size={16} />
                Text
              </a>
              <button className="rounded-xl border border-pink-300/30 bg-pink-400/10 py-3 text-center text-xs font-black">
                <CalendarCheck className="mx-auto mb-1" size={16} />
                Schedule
              </button>
            </div>

            <div className="mt-5 space-y-4 overflow-auto pb-6">
              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-500">
                  CUSTOMER
                </p>
                <div className="mt-3 text-sm text-zinc-200">
                  <div>{selected.name}</div>
                  <div>{selected.location}</div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-500">
                  REQUEST
                </p>
                <div className="mt-3 space-y-1 text-sm text-zinc-200">
                  <div>Service: {selected.service}</div>
                  <div>Home: {selected.home}</div>
                  <div>Condition: {selected.condition}</div>
                  <div>Pets: {selected.pets}</div>
                  <div>Preferred: {selected.preferred}</div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-500">
                  INTELLIGENCE
                </p>
                <p className="mt-3 text-sm text-zinc-200">
                  {selected.suggestion}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
  <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-500">
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
      onClick={() => alert("Create Estimate")}
      className="rounded-xl border border-white/10 py-3 text-sm font-black"
    >
      Create Estimate
    </button>

    <button
      onClick={() => alert("Send Estimate")}
      className="rounded-xl bg-pink-400 py-3 text-sm font-black text-black"
    >
      Send Estimate
    </button>
  </div>

  <div className="mt-4 rounded-xl bg-yellow-500/10 p-3 text-sm font-bold text-yellow-200">
    Next Move: Send estimate to customer.
  </div>
</div>

              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
  <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-500">
    SCHEDULE
  </p>

  <div className="mt-3 space-y-2 text-sm">
    <div className="flex justify-between">
      <span className="text-zinc-400">Status</span>
      <span className="font-bold text-yellow-300">Not Scheduled</span>
    </div>

    <div className="flex justify-between">
      <span className="text-zinc-400">Preferred</span>
      <span className="font-bold">Mornings</span>
    </div>
  </div>

  <div className="mt-4 grid gap-2">
    <button
      onClick={() => alert("Choose Date")}
      className="rounded-xl border border-white/10 py-3 text-sm font-black"
    >
      Choose Date
    </button>

    <button
      onClick={() => alert("Confirm Schedule")}
      className="rounded-xl bg-pink-400 py-3 text-sm font-black text-black"
    >
      Confirm Schedule
    </button>
  </div>

  <div className="mt-4 rounded-xl bg-yellow-500/10 p-3 text-sm font-bold text-yellow-200">
    Next Move: Book customer on calendar.
  </div>
</div>

              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4"><p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-500">WORK</p></div>

              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
  <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-500">
    PAYMENT
  </p>

  <div className="mt-3 grid gap-2">
    <button
      onClick={() => alert("Send Payment Request")}
      className="rounded-xl border border-green-400/30 bg-green-500/10 py-3 text-sm font-black"
    >
      Send Payment Request
    </button>

    <button
      onClick={() => alert("Mark Paid")}
      className="rounded-xl border border-white/10 py-3 text-sm font-black"
    >
      Mark Paid
    </button>
  </div>
</div>

              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4"><p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-500">MEDIA</p></div>

              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4"><p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-500">REVIEWS</p></div>

              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-500">
                  TIMELINE
                </p>

                <button
                  onClick={() => deleteSignal(selected.id)}
                  className="mt-4 w-full rounded-xl border border-red-400/30 bg-red-500/10 py-3 text-sm font-black text-red-200"
                >
                  Delete Test Card
                </button>
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </main>
  );
}




