import { useState } from "react";
import { supabase } from "../lib/supabase";

type Props = {
  animalSlug: string;
  currentStage: string;
  onSaved?: () => void;
};

export default function LivestockProofCapture({
  animalSlug,
  currentStage,
  onSaved,
}: Props) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    setSaving(true);
    setError("");

    const { error } = await supabase.from("livestock_proof").insert({
      animal_slug: animalSlug,
      stage: currentStage,
      title,
      note,
    });

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    setTitle("");
    setNote("");
    setSaving(false);

    if (onSaved) onSaved();
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#071523]/70 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
            Proof Capture
          </div>
          <div className="text-sm text-slate-200 mt-1">
            Attach real-world proof to this stage.
          </div>
        </div>

        {saving && (
          <div className="text-sm font-semibold text-cyan-100">
            Saving...
          </div>
        )}
      </div>

      <div className="mt-4 grid gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Proof title (ex: Intake photo locked)"
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none"
        />

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What happened here?"
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none"
        />

        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-xl bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-900 hover:brightness-110"
        >
          Add Proof
        </button>

        {error && (
          <div className="text-sm text-rose-300">{error}</div>
        )}
      </div>
    </div>
  );
}