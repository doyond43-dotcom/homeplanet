import { useEffect, useMemo, useState } from "react";

type TableStatus = "Available" | "Active" | "Waiting Food" | "Ready To Pay";

type TableState = {
  table: string;
  status: TableStatus;
};

type SeatOrder = {
  seat: number;
  drink?: string;
  drinkFlags: string[];
  food?: string;
  foodFlags: string[];
};

type KitchenTicket = {
  id: string;
  table: string;
  item: string;
  notes: string;
  stage: "New" | "Cooking" | "Ready" | "Delivered";
  time: string;
  flags: string[];
  urgency: "normal" | "watch" | "critical";
  editedAt?: number;
};

const KITCHEN_KEY = "hp-brahma-bull-kitchen";
const TABLES_KEY = "hp-brahma-bull-tables";
const SEATS_KEY = "hp-brahma-bull-seat-orders";

const drinkItems = ["Coke", "Pepsi", "Sprite", "Mountain Dew", "Sweet Tea", "Water", "Shirley Temple"];
const foodItems = ["Brahma Burger", "Wings + Fries", "Chicken Tenders", "Fries", "House Salad"];

const drinkFlags = ["LEMON", "LIME", "NO ICE", "EXTRA CHERRIES"];
const foodFlags = ["NO MAYO", "NO TOMATO", "NO ONION", "EXTRA RANCH", "ALLERGY"];

const initialTables: TableState[] = [
  { table: "1", status: "Available" },
  { table: "2", status: "Available" },
  { table: "3", status: "Available" },
  { table: "4", status: "Available" },
  { table: "5", status: "Available" },
  { table: "6", status: "Available" },
  { table: "7", status: "Available" },
  { table: "8", status: "Available" },
];

function blankSeats(): SeatOrder[] {
  return [1, 2, 3, 4].map((seat) => ({
    seat,
    drinkFlags: [],
    foodFlags: [],
  }));
}

function readKitchenTickets(): KitchenTicket[] {
  try {
    return JSON.parse(localStorage.getItem(KITCHEN_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeKitchenTickets(tickets: KitchenTicket[]) {
  localStorage.setItem(KITCHEN_KEY, JSON.stringify(tickets));
  window.dispatchEvent(new Event("brahma-bull-kitchen-sync"));
}

function readTables(): TableState[] {
  try {
    const saved = localStorage.getItem(TABLES_KEY);
    if (!saved) return initialTables;
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : initialTables;
  } catch {
    return initialTables;
  }
}

function writeTables(tables: TableState[]) {
  localStorage.setItem(TABLES_KEY, JSON.stringify(tables));
  window.dispatchEvent(new Event("brahma-bull-tables-sync"));
}

function readSeatOrders(): Record<string, SeatOrder[]> {
  try {
    return JSON.parse(localStorage.getItem(SEATS_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeSeatOrders(orders: Record<string, SeatOrder[]>) {
  localStorage.setItem(SEATS_KEY, JSON.stringify(orders));
  window.dispatchEvent(new Event("brahma-bull-seats-sync"));
}

function statusClass(status: TableStatus) {
  if (status === "Available") return "border-white/10 bg-black/40 text-neutral-400";
  if (status === "Active") return "border-emerald-300/50 bg-emerald-400/10 text-emerald-100";
  if (status === "Waiting Food") return "border-sky-300/40 bg-sky-300/10 text-sky-100";
  return "border-amber-300/50 bg-amber-300/10 text-amber-100";
}

function flagButtonClass(active: boolean, danger = false) {
  if (!active) return "bg-neutral-800 text-neutral-300";
  if (danger) return "bg-red-500 text-white";
  return "bg-amber-300 text-black";
}

export default function BrahmaBullCrewBoard() {
  const [tables, setTables] = useState<TableState[]>(() => readTables());
  const [seatOrdersByTable, setSeatOrdersByTable] = useState<Record<string, SeatOrder[]>>(() => readSeatOrders());
  const [activeTable, setActiveTable] = useState<string | null>(null);
  const [activeSeat, setActiveSeat] = useState<number | null>(null);
  const [mode, setMode] = useState<"drinks" | "food">("drinks");
  const [message, setMessage] = useState("");

  useEffect(() => {
    function sync() {
      setTables(readTables());
      setSeatOrdersByTable(readSeatOrders());
    }

    window.addEventListener("storage", sync);
    window.addEventListener("brahma-bull-tables-sync", sync);
    window.addEventListener("brahma-bull-seats-sync", sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("brahma-bull-tables-sync", sync);
      window.removeEventListener("brahma-bull-seats-sync", sync);
    };
  }, []);

  const selectedTable = tables.find((table) => table.table === activeTable);

  const activeTables = useMemo(
    () => tables.filter((table) => table.status !== "Available"),
    [tables]
  );

  const seats = activeTable
    ? seatOrdersByTable[activeTable] || blankSeats()
    : blankSeats();

  const selectedSeat = activeSeat
    ? seats.find((seat) => seat.seat === activeSeat)
    : null;

  function saveTables(updated: TableState[]) {
    setTables(updated);
    writeTables(updated);
  }

  function updateTableStatus(tableNumber: string, status: TableStatus) {
    saveTables(tables.map((table) => (table.table === tableNumber ? { ...table, status } : table)));
  }

  function saveSeatsForTable(tableNumber: string, updatedSeats: SeatOrder[]) {
    const updated = {
      ...seatOrdersByTable,
      [tableNumber]: updatedSeats,
    };

    setSeatOrdersByTable(updated);
    writeSeatOrders(updated);
  }

  function updateSeat(updatedSeat: SeatOrder) {
    if (!activeTable) return;

    saveSeatsForTable(
      activeTable,
      seats.map((seat) => (seat.seat === updatedSeat.seat ? updatedSeat : seat))
    );

    setMessage("");
  }

  function setDrink(drink: string) {
    if (!selectedSeat || !activeTable) return;

    const allowedFlags = selectedSeat.drinkFlags.filter((flag) => {
      if (drink === "Water") return ["LEMON", "LIME", "NO ICE"].includes(flag);
      if (drink === "Sweet Tea") return ["LEMON", "NO ICE"].includes(flag);
      if (drink === "Shirley Temple") return ["NO ICE", "EXTRA CHERRIES"].includes(flag);
      return ["NO ICE"].includes(flag);
    });

    updateSeat({ ...selectedSeat, drink, drinkFlags: allowedFlags });
    updateTableStatus(activeTable, "Active");
  }

  function toggleDrinkFlag(flag: string) {
    if (!selectedSeat) return;

    const active = selectedSeat.drinkFlags.includes(flag);

    updateSeat({
      ...selectedSeat,
      drinkFlags: active
        ? selectedSeat.drinkFlags.filter((item) => item !== flag)
        : [...selectedSeat.drinkFlags, flag],
    });
  }

  function setFood(food: string) {
    if (!selectedSeat || !activeTable) return;
    updateSeat({ ...selectedSeat, food });
    updateTableStatus(activeTable, "Active");
  }

  function toggleFoodFlag(flag: string) {
    if (!selectedSeat) return;

    const active = selectedSeat.foodFlags.includes(flag);

    updateSeat({
      ...selectedSeat,
      foodFlags: active
        ? selectedSeat.foodFlags.filter((item) => item !== flag)
        : [...selectedSeat.foodFlags, flag],
    });
  }

  function drinkFlagsFor(drink?: string) {
    if (drink === "Water") return ["LEMON", "LIME", "NO ICE"];
    if (drink === "Sweet Tea") return ["LEMON", "NO ICE"];
    if (drink === "Shirley Temple") return ["NO ICE", "EXTRA CHERRIES"];
    if (drink) return ["NO ICE"];
    return [];
  }

  function sendDrinks() {
    if (!activeTable) return;

    const drinks = seats.filter((seat) => seat.drink);

    if (drinks.length === 0) return;

    updateTableStatus(activeTable, "Active");
    setMessage(`Drinks sent for Table ${activeTable}.`);
    setMode("food");
    setActiveSeat(null);
  }

  function sendFood() {
    if (!activeTable) return;

    const foodSeats = seats.filter((seat) => seat.food);

    if (foodSeats.length === 0) return;

    const tickets: KitchenTicket[] = foodSeats.map((seat) => ({
      id: crypto.randomUUID(),
      table: activeTable,
      item: `Seat ${seat.seat}: ${seat.food}`,
      notes: seat.foodFlags.length ? seat.foodFlags.join(", ").toLowerCase() : "Standard order",
      stage: "New",
      time: "00:00",
      flags: seat.foodFlags,
      urgency: seat.foodFlags.includes("ALLERGY")
        ? "critical"
        : seat.foodFlags.some((flag) => flag.includes("NO"))
          ? "watch"
          : "normal",
      editedAt: Date.now(),
    }));

    writeKitchenTickets([...tickets, ...readKitchenTickets()]);
    updateTableStatus(activeTable, "Waiting Food");
    setMessage(`Food sent to kitchen for Table ${activeTable}.`);
    setActiveSeat(null);
  }

  function clearTable(tableNumber: string) {
    const updatedOrders = { ...seatOrdersByTable };
    delete updatedOrders[tableNumber];

    setSeatOrdersByTable(updatedOrders);
    writeSeatOrders(updatedOrders);
    updateTableStatus(tableNumber, "Available");
    setActiveTable(null);
    setActiveSeat(null);
    setMode("drinks");
    setMessage("");
  }

  if (selectedTable) {
    return (
      <main className="min-h-screen bg-neutral-950 px-4 py-5 text-white">
        <section className="mx-auto max-w-md space-y-5">
          <button
            onClick={() => {
              setActiveTable(null);
              setActiveSeat(null);
              setMessage("");
            }}
            className="rounded-full border border-white/10 bg-neutral-900 px-4 py-2 text-sm font-black text-white"
          >
            ← Back To Tables
          </button>

          <div className="rounded-3xl border border-white/10 bg-neutral-900 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">
              Server Phone
            </p>
            <h1 className="mt-2 text-4xl font-black">Table {selectedTable.table}</h1>
            <p className="mt-2 text-sm text-neutral-400">
              Paper-pad simple. Drinks first. Food second.
            </p>
          </div>

          {message && (
            <p className="rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm font-black text-emerald-100">
              {message}
            </p>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMode("drinks");
                setActiveSeat(null);
              }}
              className={`rounded-2xl px-4 py-4 text-sm font-black ${
                mode === "drinks" ? "bg-sky-300 text-black" : "bg-neutral-900 text-white"
              }`}
            >
              Drinks First
            </button>

            <button
              onClick={() => {
                setMode("food");
                setActiveSeat(null);
              }}
              className={`rounded-2xl px-4 py-4 text-sm font-black ${
                mode === "food" ? "bg-emerald-400 text-black" : "bg-neutral-900 text-white"
              }`}
            >
              Food Second
            </button>
          </div>

          <div className="rounded-3xl border border-white/10 bg-neutral-900 p-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-black">
                {mode === "drinks" ? "Drinks" : "Food"}
              </h2>

              <span className="rounded-full bg-black/40 px-3 py-2 text-xs font-black text-neutral-300">
                {selectedTable.status}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {seats.map((seat) => {
                const isOpen = activeSeat === seat.seat;

                return (
                  <div
                    key={seat.seat}
                    className={`rounded-2xl border p-4 ${
                      isOpen ? "border-emerald-300/70 bg-emerald-400/10" : "border-white/10 bg-black/40"
                    }`}
                  >
                    <button
                      onClick={() => setActiveSeat(isOpen ? null : seat.seat)}
                      className="w-full text-left"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-2xl font-black">Seat {seat.seat}</p>

                          <p className="mt-1 text-sm font-bold text-sky-100">
                            Drink: {seat.drink ? `${seat.drink}${seat.drinkFlags.length ? ` (${seat.drinkFlags.join(", ")})` : ""}` : "—"}
                          </p>

                          <p className="mt-1 text-sm font-bold text-emerald-100">
                            Food: {seat.food ? `${seat.food}${seat.foodFlags.length ? ` (${seat.foodFlags.join(", ")})` : ""}` : "—"}
                          </p>
                        </div>

                        <span className="rounded-full bg-neutral-800 px-3 py-2 text-xs font-black text-white">
                          {isOpen ? "Close" : "Open"}
                        </span>
                      </div>
                    </button>

                    {isOpen && mode === "drinks" && (
                      <div className="mt-4 rounded-2xl border border-sky-300/20 bg-sky-300/10 p-3">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-100">
                          Pick Drink
                        </p>

                        <div className="mt-3 grid grid-cols-2 gap-2">
                          {drinkItems.map((drink) => (
                            <button
                              key={drink}
                              onClick={() => setDrink(drink)}
                              className={`rounded-xl px-3 py-3 text-left text-xs font-black ${
                                seat.drink === drink ? "bg-white text-black" : "bg-black/40 text-white"
                              }`}
                            >
                              {drink}
                            </button>
                          ))}
                        </div>

                        {seat.drink && (
                          <>
                            <p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-sky-100">
                              Drink Notes
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">
                              {drinkFlagsFor(seat.drink).map((flag) => {
                                const active = seat.drinkFlags.includes(flag);

                                return (
                                  <button
                                    key={flag}
                                    onClick={() => toggleDrinkFlag(flag)}
                                    className={`rounded-full px-3 py-2 text-xs font-black ${flagButtonClass(active)}`}
                                  >
                                    {active ? "✓ " : "+ "}
                                    {flag}
                                  </button>
                                );
                              })}
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {isOpen && mode === "food" && (
                      <div className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-3">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-100">
                          Pick Food
                        </p>

                        <div className="mt-3 grid gap-2">
                          {foodItems.map((food) => (
                            <button
                              key={food}
                              onClick={() => setFood(food)}
                              className={`rounded-xl px-3 py-3 text-left text-xs font-black ${
                                seat.food === food ? "bg-white text-black" : "bg-black/40 text-white"
                              }`}
                            >
                              {food}
                            </button>
                          ))}
                        </div>

                        {seat.food && (
                          <>
                            <p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-emerald-100">
                              Food Notes
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">
                              {foodFlags.map((flag) => {
                                const active = seat.foodFlags.includes(flag);

                                return (
                                  <button
                                    key={flag}
                                    onClick={() => toggleFoodFlag(flag)}
                                    className={`rounded-full px-3 py-2 text-xs font-black ${flagButtonClass(active, flag === "ALLERGY")}`}
                                  >
                                    {active ? "✓ " : "+ "}
                                    {flag}
                                  </button>
                                );
                              })}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {mode === "drinks" ? (
              <button
                onClick={sendDrinks}
                className="mt-5 w-full rounded-2xl bg-sky-300 px-4 py-5 text-sm font-black text-black"
              >
                SEND DRINKS
              </button>
            ) : (
              <button
                onClick={sendFood}
                className="mt-5 w-full rounded-2xl bg-emerald-400 px-4 py-5 text-sm font-black text-black"
              >
                SEND FOOD TO KITCHEN
              </button>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-neutral-900 p-4">
            <h2 className="text-xl font-black">Table Actions</h2>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                onClick={() => updateTableStatus(selectedTable.table, "Ready To Pay")}
                className="rounded-2xl bg-amber-300 px-3 py-4 text-sm font-black text-black"
              >
                Ready To Pay
              </button>

              <button
                onClick={() => clearTable(selectedTable.table)}
                className="rounded-2xl bg-neutral-800 px-3 py-4 text-sm font-black text-white"
              >
                Clear Table
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-5 text-white">
      <section className="mx-auto max-w-md space-y-5">
        <div className="rounded-3xl border border-white/10 bg-neutral-900 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">
            Crew Phone Board
          </p>
          <h1 className="mt-2 text-3xl font-black">Tables</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Tap a table. Take drinks first. Send food when they are ready.
          </p>
        </div>

        {activeTables.length > 0 && (
          <div className="rounded-3xl border border-amber-300/30 bg-amber-300/10 p-4">
            <h2 className="text-xl font-black">Active Tables</h2>

            <div className="mt-4 space-y-3">
              {activeTables.map((table) => (
                <button
                  key={table.table}
                  onClick={() => setActiveTable(table.table)}
                  className={`w-full rounded-2xl border p-4 text-left ${statusClass(table.status)}`}
                >
                  <p className="text-2xl font-black">Table {table.table}</p>
                  <p className="text-sm font-bold">{table.status}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-3xl border border-white/10 bg-neutral-900 p-4">
          <h2 className="text-xl font-black">All Tables</h2>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {tables.map((table) => (
              <button
                key={table.table}
                onClick={() => setActiveTable(table.table)}
                className={`rounded-2xl border p-4 text-left ${statusClass(table.status)}`}
              >
                <p className="text-2xl font-black">Table {table.table}</p>
                <p className="text-xs font-bold">{table.status}</p>
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}