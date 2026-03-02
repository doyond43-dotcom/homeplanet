import React from "react";
import type { LifeEvent } from "../../lib/life/types";
import { LIFE_TYPES } from "../../lib/life/types";
import { createLifeEvent, deleteLifeEvent, listLifeEvents } from "../../lib/life/api";
import { LifeEventForm } from "./LifeEventForm";

function fmtTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
function fmtDay(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}
function dayKey(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function typeLabel(t: LifeEvent["type"]) {
  return LIFE_TYPES.find((x) => x.value === t)?.label ?? t;
}

export function LifeDrawer() {
  const [events, setEvents] = React.useState<LifeEvent[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [openAdd, setOpenAdd] = React.useState(false);


  // ---------------- Quick Timestamp ----------------
  const quickActions = React.useMemo(
    () => [
      { type: "movement" as const, title: "Left house" },
      { type: "movement" as const, title: "Arrived" },
      { type: "work" as const, title: "Back office" },
      { type: "meeting" as const, title: "Meeting" },
      { type: "health" as const, title: "Lunch" },
      { type: "reflection" as const, title: "Note" },
    ],
    []
  );

  async function quickAdd(type: any, title: string) {
    try {
      await createLifeEvent({ type, title });
      await refresh();
    } catch (e: any) {
      setError(e?.message ?? "Failed to save quick event");
    }
  }
  async function refresh() {
    try {
      setLoading(true);
      setError(null);
      const rows = await listLifeEvents(250);
      setEvents(rows);
      setSelectedId((prev) => prev ?? rows[0]?.id ?? null);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load life events");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    refresh();
  }, []);

  const selected = events.find((e) => e.id === selectedId) ?? null;

  const grouped = React.useMemo(() => {
    const map = new Map<string, LifeEvent[]>();
    for (const ev of events) {
      const k = dayKey(ev.created_at);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(ev);
    }
    return Array.from(map.entries());
  }, [events]);

  async function handleAdd(v: { type: any; title: string; notes?: string; location?: string }) {
    await createLifeEvent(v);
    await refresh();
  }

  async function handleDelete(id: string) {
    const ok = confirm("Delete this life event?");
    if (!ok) return;
    await deleteLifeEvent(id);
    // If you deleted the selected item, clear selection so refresh sets it
    if (selectedId === id) setSelectedId(null);
    await refresh();
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-[420px_1fr]">
      <div className="rounded-2xl border bg-white">
        <div className="flex items-center justify-between border-b p-3">
          <div className="font-semibold">Life Timeline</div>
          <button
            className="rounded-xl bg-black px-3 py-2 text-sm text-white"
            onClick={() => setOpenAdd(true)}
            type="button"
          >
            + Add
          </button>
        </div>


        {/* Quick Timestamp bar */}
        <div className="border-b p-3">
          <div className="text-xs font-semibold text-gray-600 mb-2">Quick Timestamp</div>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((a) => (
              <button
                key={a.title}
                type="button"
                onClick={() => quickAdd(a.type, a.title)}
                className="rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold hover:bg-gray-50"
              >
                {a.title}
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <div className="p-3 text-sm text-gray-600">Loading…</div>
        ) : error ? (
          <div className="p-3 text-sm text-red-600">{error}</div>
        ) : events.length === 0 ? (
          <div className="p-3 text-sm text-gray-600">No entries yet. Hit “Add”.</div>
        ) : (
          <div className="max-h-[70vh] overflow-auto p-2">
            {grouped.map(([k, list]) => (
              <div key={k} className="mb-3">
                <div className="px-2 py-1 text-xs font-semibold text-gray-600">
                  {fmtDay(list[0].created_at)}
                </div>
                <div className="space-y-1">
                  {list.map((ev) => (
                    <button
                      key={ev.id}
                      type="button"
                      onClick={() => setSelectedId(ev.id)}
                      className={[
                        "w-full rounded-xl border px-3 py-2 text-left hover:bg-gray-50",
                        selectedId === ev.id ? "border-black" : "border-gray-200",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-medium truncate">{ev.title}</div>
                        <div className="text-xs text-gray-500">{fmtTime(ev.created_at)}</div>
                      </div>
                      <div className="mt-0.5 flex items-center justify-between gap-2">
                        <div className="text-xs text-gray-600">{typeLabel(ev.type)}</div>
                        {ev.location ? <div className="text-xs text-gray-500 truncate">{ev.location}</div> : null}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl border bg-white">
        <div className="border-b p-3">
          <div className="font-semibold">Life Drawer</div>
          <div className="text-xs text-gray-600">Presence-first. Private. Clean timeline.</div>
        </div>

        {!selected ? (
          <div className="p-4 text-sm text-gray-600">Select an entry on the left.</div>
        ) : (
          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xl font-semibold truncate">{selected.title}</div>
                <div className="mt-1 text-sm text-gray-600">
                  {typeLabel(selected.type)} • {fmtDay(selected.created_at)} • {fmtTime(selected.created_at)}
                </div>
                {selected.location ? <div className="mt-1 text-sm text-gray-700">📍 {selected.location}</div> : null}
              </div>

              <button
                type="button"
                className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
                onClick={() => handleDelete(selected.id)}
              >
                Delete
              </button>
            </div>

            {selected.notes ? (
              <div className="rounded-2xl border bg-gray-50 p-3">
                <div className="text-xs font-semibold text-gray-600">Notes</div>
                <div className="mt-1 whitespace-pre-wrap text-sm">{selected.notes}</div>
              </div>
            ) : (
              <div className="rounded-2xl border bg-gray-50 p-3 text-sm text-gray-600">
                No notes. (Mic + voice-to-text will live here later.)
              </div>
            )}

            <div className="rounded-2xl border p-3 text-xs text-gray-600">
              Immutable anchor: created_at is the presence timestamp. Editing content later won’t change origin.
            </div>
          </div>
        )}
      </div>

      <LifeEventForm open={openAdd} onClose={() => setOpenAdd(false)} onSubmit={handleAdd} defaultType="work" />
    </div>
  );
}

