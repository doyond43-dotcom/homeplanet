import { useState } from "react";

export default function HayleyLiveBoard() {
  const [engraving, setEngraving] = useState("");
  const [line2, setLine2] = useState("");

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white px-4 py-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 🔥 HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Hayley’s Live Moments
            </h1>
            <p className="text-sm text-white/60">Watch. Feel it. Make it yours.</p>
          </div>

          <div className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
            ● LIVE READY
          </div>
        </div>

        {/* 🎥 VIDEO PANEL */}
        <div className="bg-[#111827] rounded-2xl border border-white/10 overflow-hidden">
          <div className="relative aspect-video bg-black overflow-hidden">
            <iframe
              src="https://www.tiktok.com/embed/7617466411706813710"
              className="w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />

            <div className="absolute top-3 left-3 flex items-center gap-2 bg-red-500/90 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white"></span>
              </span>
              LIVE
            </div>
          </div>

          <div className="p-4 space-y-2">
            <h2 className="text-lg font-medium">
              This one… people usually give to their mom
            </h2>

            <div className="text-xs text-white/40">
              ● Just recorded • added to live board
            </div>

            <p className="text-sm text-white/60">
              A simple message that lasts forever. Perfect for birthdays,
              memorials, or just because.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <button className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 rounded-lg text-sm font-medium">
                Buy This Piece
              </button>

              <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm">
                Customize Yours
              </button>
            </div>

            <div className="text-xs text-yellow-400 pt-2">
              ⚡ 3 people are customizing this right now
            </div>
          </div>
        </div>

        {/* 🧠 MEANING LAYER */}
        <div className="bg-[#111827] rounded-2xl border border-white/10 p-4 space-y-2">
          <h3 className="text-sm text-white/60 uppercase tracking-wide">
            Why People Choose This
          </h3>

          <ul className="text-sm space-y-1 text-white/80">
            <li>• Gift from daughter to mom</li>
            <li>• In memory of a loved one</li>
            <li>• First Mother’s Day gift</li>
          </ul>
        </div>

        {/* 🛍️ BUY / CUSTOMIZE CARD */}
        <div className="bg-[#111827] rounded-2xl border border-white/10 p-4 space-y-4">
          <h3 className="text-sm text-white/60 uppercase tracking-wide">
            Create Your Message
          </h3>

          <div className="space-y-2">
            <input
              value={engraving}
              onChange={(e) => setEngraving(e.target.value)}
              placeholder="Line 1 (e.g. I love you)"
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none"
            />

            <input
              value={line2}
              onChange={(e) => setLine2(e.target.value)}
              placeholder="Line 2 (optional)"
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none"
            />
          </div>

          <div className="text-sm text-white/50">
            Preview:{" "}
            <span className="text-white">
              {engraving || "Your message"}
              {line2 && ` • ${line2}`}
            </span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-lg font-semibold">$24.99</div>
              <div className="text-xs text-white/40">
                Your message becomes part of this live moment
              </div>
            </div>

            <button className="bg-green-500 hover:bg-green-400 text-black px-4 py-2 rounded-lg text-sm font-medium">
              Create My Piece
            </button>
          </div>
        </div>

        {/* 👀 WHAT HAYLEY IS WEARING */}
        <div className="bg-[#111827] rounded-2xl border border-white/10 p-4 space-y-3">
          <h3 className="text-sm text-white/60 uppercase tracking-wide">
            What Hayley Is Wearing
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              "Earrings – I love you / Mommy",
              "Scrunchie",
              "Necklace",
              "Lipstick",
            ].map((item) => (
              <div
                key={item}
                className="bg-black/40 border border-white/10 rounded-lg p-3 text-xs hover:bg-white/10 cursor-pointer"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* 💬 LIVE FEED / PROOF */}
        <div className="bg-[#111827] rounded-2xl border border-white/10 p-4 space-y-2">
          <h3 className="text-sm text-white/60 uppercase tracking-wide">
            Live Moments
          </h3>

          <div className="text-sm text-white/80 space-y-1">
            <div>✨ Ashley (Tampa) just ordered one for her mom</div>
            <div>💬 “Can you engrave ‘Forever my angel’?”</div>
            <div>🛍️ New order created</div>
          </div>
        </div>

        {/* 🎯 ASK BUTTON */}
        <div className="flex justify-center pt-4">
          <button className="bg-purple-500 hover:bg-purple-400 text-black px-6 py-3 rounded-xl text-sm font-medium">
            Ask Hayley About a Custom Piece
          </button>
        </div>
      </div>
    </div>
  );
}