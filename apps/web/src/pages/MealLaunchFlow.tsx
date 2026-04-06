import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MealLaunchFlow() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [intent, setIntent] = useState<string | null>(null);
  const [avoid, setAvoid] = useState<string[]>([]);
  const [mode, setMode] = useState<string | null>(null);

  function toggleAvoid(item: string) {
    setAvoid((prev) =>
      prev.includes(item)
        ? prev.filter((x) => x !== item)
        : [...prev, item]
    );
  }

  function launch() {
    navigate("/planet/lifestyle/meal-board-demo", {
      state: {
        intent,
        avoid,
        mode,
      },
    });
  }

  return (
    <div className="min-h-screen bg-[#071224] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold">Build your food week</h1>
          <p className="text-sm text-white/60">
            Tell the system a few things. It builds your week instantly.
          </p>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="text-sm text-white/70">
              What do you want help with most?
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                "Less stress",
                "Faster decisions",
                "More protein",
                "Lower sodium",
                "Better variety",
              ].map((option) => (
                <button
                  key={option}
                  onClick={() => setIntent(option)}
                  className={`p-3 rounded-xl border ${
                    intent === option
                      ? "bg-blue-600 border-blue-400"
                      : "bg-[#101f3c] border-white/10"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <button
              disabled={!intent}
              onClick={() => setStep(2)}
              className="w-full py-3 rounded-xl bg-blue-600 disabled:opacity-30"
            >
              Continue
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="text-sm text-white/70">
              Anything to avoid?
            </div>

            <div className="flex flex-wrap gap-2">
              {["Mushrooms", "Eggplant", "Beets", "High sodium"].map((item) => (
                <button
                  key={item}
                  onClick={() => toggleAvoid(item)}
                  className={`px-3 py-1 rounded-full border text-sm ${
                    avoid.includes(item)
                      ? "bg-red-600 border-red-400"
                      : "bg-[#101f3c] border-white/10"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 rounded-xl bg-[#101f3c]"
              >
                Back
              </button>

              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 rounded-xl bg-blue-600"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="text-sm text-white/70">
              How should the system help?
            </div>

            <div className="space-y-2">
              {[
                "Build my full week",
                "Give me a starting point",
                "Focus on dinners",
              ].map((option) => (
                <button
                  key={option}
                  onClick={() => setMode(option)}
                  className={`w-full p-3 rounded-xl border text-left ${
                    mode === option
                      ? "bg-green-600 border-green-400"
                      : "bg-[#101f3c] border-white/10"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 rounded-xl bg-[#101f3c]"
              >
                Back
              </button>

              <button
                disabled={!mode}
                onClick={launch}
                className="flex-1 py-3 rounded-xl bg-green-600 disabled:opacity-30"
              >
                Generate my week
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}