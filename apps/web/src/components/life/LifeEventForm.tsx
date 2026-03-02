import React from "react";
import type { LifeEventType } from "../../lib/life/types";
import { LIFE_TYPES } from "../../lib/life/types";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (v: { type: LifeEventType; title: string; notes?: string; location?: string }) => Promise<void> | void;
  defaultType?: LifeEventType;
};

export function LifeEventForm({ open, onClose, onSubmit, defaultType = "work" }: Props) {
  const [type, setType] = React.useState<LifeEventType>(defaultType);
  const [title, setTitle] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    setType(defaultType);
    setTitle("");
    setNotes("");
    setLocation("");
    setSaving(false);
  }, [open, defaultType]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setSaving(true);
      await onSubmit({ type, title, notes, location });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-4">
          <div className="text-lg font-semibold">Add Life Event</div>
          <button className="rounded-lg px-3 py-1 hover:bg-gray-100" onClick={onClose} type="button">
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Type</label>
            <select
              className="rounded-xl border px-3 py-2"
              value={type}
              onChange={(e) => setType(e.target.value as LifeEventType)}
            >
              {LIFE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Title</label>
            <input
              className="rounded-xl border px-3 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='e.g., "Left house" / "AWNIT site visit"'
              autoFocus
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Notes (optional)</label>
            <textarea
              className="min-h-[96px] rounded-xl border px-3 py-2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Short notes. Voice-to-text later."
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Location (optional)</label>
            <input
              className="rounded-xl border px-3 py-2"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder='e.g., "Taylor Creek Auto" or "McDonald’s – Okeechobee"'
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" className="rounded-xl px-4 py-2 hover:bg-gray-100" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !title.trim()}
              className="rounded-xl bg-black px-4 py-2 text-white disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
