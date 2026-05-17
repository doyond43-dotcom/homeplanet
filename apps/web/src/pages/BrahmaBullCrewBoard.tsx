import { useEffect, useMemo, useState } from "react";

type RestaurantRequest = {
  id: string;
  table: string;
  type: string;
  status: "open" | "acknowledged" | "completed";
  createdAt: number;
};

const STORAGE_KEY = "hp-brahma-bull-requests";

function readRequests(): RestaurantRequest[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeRequests(requests: RestaurantRequest[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  window.dispatchEvent(new Event("brahma-bull-sync"));
}

const sideWork = [
  "Roll Silverware",
  "Check Bathrooms",
  "Restock Napkins",
  "Refill Ketchup",
  "Wipe Bar Top",
];

export default function BrahmaBullCrewBoard() {
  const [requests, setRequests] = useState<RestaurantRequest[]>(() => readRequests());

  useEffect(() => {
    function sync() {
      setRequests(readRequests());
    }

    window.addEventListener("storage", sync);
    window.addEventListener("brahma-bull-sync", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("brahma-bull-sync", sync);
    };
  }, []);

  function updateRequest(id: string, status: RestaurantRequest["status"]) {
    const updated = readRequests().map((item) => (item.id === id ? { ...item, status } : item));
    writeRequests(updated);
    setRequests(updated);
  }

  const activeRequests = useMemo(
    () => requests.filter((item) => item.status !== "completed"),
    [requests]
  );

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-5 text-white">
      <section className="mx-auto max-w-md space-y-5">
        <div className="rounded-3xl border border-white/10 bg-neutral-900 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">
            Crew Phone Board
          </p>
          <h1 className="mt-2 text-3xl font-black">Server Terminal</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Table requests, side work, prep reminders, and service alerts without yelling across the room.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-neutral-900 p-4">
          <h2 className="text-xl font-black">Open Table Requests</h2>
          <div className="mt-4 space-y-3">
            {activeRequests.length === 0 ? (
              <p className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-neutral-400">
                Nothing open right now.
              </p>
            ) : (
              activeRequests.map((request) => (
                <div key={request.id} className="rounded-2xl border border-white/10 bg-black/40 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xl font-black">Table {request.table}</p>
                      <p className="text-sm text-neutral-300">{request.type}</p>
                    </div>
                    <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-black text-black">
                      {request.status}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button onClick={() => updateRequest(request.id, "acknowledged")} className="rounded-xl bg-white px-3 py-3 text-sm font-black text-black">
                      Acknowledge
                    </button>
                    <button onClick={() => updateRequest(request.id, "completed")} className="rounded-xl bg-emerald-400 px-3 py-3 text-sm font-black text-black">
                      Completed
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-neutral-900 p-4">
          <h2 className="text-xl font-black">Side Work</h2>
          <div className="mt-4 space-y-3">
            {sideWork.map((task, index) => (
              <div key={task} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 p-4">
                <div>
                  <p className="font-black">{task}</p>
                  <p className="text-xs text-neutral-500">{index < 2 ? "Needs attention" : "Ready when slow"}</p>
                </div>
                <button className="rounded-xl bg-neutral-800 px-3 py-2 text-xs font-black text-white">
                  Done
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
