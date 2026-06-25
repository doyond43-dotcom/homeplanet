import { useState } from "react";

const issues = ["Ants", "Roaches", "Mosquitoes", "Rodents", "Termites", "Not Sure"];
const actions = ["Request Inspection", "Schedule Service", "Get Recommendation"];
const times = ["Monday 9:00 AM", "Monday 1:00 PM", "Tuesday 10:00 AM", "Wednesday 2:00 PM"];

export default function SlapABugImpulseConversation() {
  const [selectedIssue, setSelectedIssue] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <main className="min-h-screen bg-[#06111f] px-5 py-6 text-white">
      <section className="mx-auto max-w-md">

        <div className="mb-6 rounded-3xl border border-[#2f80ed]/30 bg-[#0b1f3a] p-5">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#f04444]">
            Slap-A-Bug Pest Control
          </p>

          <h1 className="mt-3 text-3xl font-black">
            Tell Brad What's Going On
          </h1>

          <p className="mt-2 text-sm text-white/75">
            One step at a time.
          </p>
        </div>

        <div className="mb-5 overflow-hidden rounded-3xl border border-[#f04444]/40 bg-[#0b1f3a] shadow-lg">
          <video
            controls
            playsInline
            preload="metadata"
            className="w-full bg-black"
          >
            <source
              src="/videos/slap-a-bug-brad-welcome-v1.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>

          <div className="p-4">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-[#f04444]">
              Meet Brad
            </div>

            <div className="mt-1 text-xl font-black">
              Welcome Video
            </div>

            <div className="mt-1 text-sm text-white/70">
              Watch this first, then tap the option that best matches what you're seeing.
            </div>
          </div>
        </div>

        {selectedIssue && (
          <div className="mb-3 rounded-2xl border border-[#f04444]/40 bg-[#f04444]/10 p-3">
            ? {selectedIssue}
          </div>
        )}

        {selectedAction && (
          <div className="mb-3 rounded-2xl border border-[#2f80ed]/40 bg-[#2f80ed]/10 p-3">
            ? {selectedAction}
          </div>
        )}

        {selectedTime && (
          <div className="mb-3 rounded-2xl border border-green-500/40 bg-green-500/10 p-3">
            ? {selectedTime}
          </div>
        )}

        {!selectedIssue && (
          <div className="space-y-3">
            {issues.map((issue) => (
              <button
                key={issue}
                onClick={() => setSelectedIssue(issue)}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-left text-lg font-black"
              >
                {issue}
              </button>
            ))}
          </div>
        )}

        {selectedIssue && !selectedAction && (
          <>
            <button
              onClick={() => setSelectedIssue("")}
              className="mb-4 text-sm text-[#8dbdff]"
            >
              ? Change Problem
            </button>

            <div className="space-y-3">
              {actions.map((action) => (
                <button
                  key={action}
                  onClick={() => setSelectedAction(action)}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-left font-black"
                >
                  {action}
                </button>
              ))}
            </div>
          </>
        )}

        {selectedAction && !selectedTime && (
          <>
            <button
              onClick={() => setSelectedAction("")}
              className="mb-4 text-sm text-[#8dbdff]"
            >
              ? Change Action
            </button>

            <div className="space-y-3">
              {times.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-left font-black"
                >
                  {time}
                </button>
              ))}
            </div>
          </>
        )}

        {selectedTime && (
          <>
            <button
              onClick={() => setSelectedTime("")}
              className="mb-4 text-sm text-[#8dbdff]"
            >
              ? Change Time
            </button>

            <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5">
              <h2 className="text-xl font-black">
                Contact Information
              </h2>

              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
                className="mt-4 w-full rounded-2xl border border-white/10 bg-[#06111f] p-4"
              />

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Anything Brad should know?"
                rows={4}
                className="mt-4 w-full rounded-2xl border border-white/10 bg-[#06111f] p-4"
              />

              <button
                className="mt-4 w-full rounded-2xl bg-[#f04444] p-4 font-black"
              >
                Send To Brad
              </button>
            </div>
          </>
        )}

      </section>
    </main>
  );
}


