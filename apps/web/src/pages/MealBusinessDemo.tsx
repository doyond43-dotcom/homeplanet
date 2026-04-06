import { useEffect, useMemo, useState } from "react";

type ViewMode = "customer" | "kitchen";

type DayPlan = {
  day: string;
  dateLabel: string;
  deliveryDay: boolean;
  deliveryWindow?: string;
  meals: {
    id: string;
    name: string;
    servings: number;
    portionType: string;
    tags: string[];
    note: string;
    kitchenNote: string;
  }[];
};

type LiveEvent = {
  id: string;
  time: string;
  title: string;
  detail: string;
};

const weekPlan: DayPlan[] = [
  {
    day: "Mon",
    dateLabel: "Apr 6",
    deliveryDay: false,
    meals: [
      {
        id: "m1",
        name: "Garlic Herb Chicken",
        servings: 2,
        portionType: "Dinner",
        tags: ["High protein", "Low prep"],
        note: "Already in your fridge from Sunday delivery.",
        kitchenNote: "No action needed. This meal is already fulfilled.",
      },
      {
        id: "m2",
        name: "Turkey Taco Bowls",
        servings: 2,
        portionType: "Dinner",
        tags: ["Family favorite", "Balanced"],
        note: "Already in your fridge from Sunday delivery.",
        kitchenNote: "No action needed. This meal is already fulfilled.",
      },
    ],
  },
  {
    day: "Tue",
    dateLabel: "Apr 7",
    deliveryDay: true,
    deliveryWindow: "4:30 PM – 6:00 PM",
    meals: [
      {
        id: "m3",
        name: "Lemon Pepper Salmon",
        servings: 2,
        portionType: "Dinner",
        tags: ["Fresh", "Omega-3"],
        note: "Arrives in Tuesday delivery.",
        kitchenNote: "Prep by 1:30 PM. Pack cold. Label tray 2 of 4.",
      },
      {
        id: "m4",
        name: "Steak Rice Bowl",
        servings: 2,
        portionType: "Dinner",
        tags: ["Best seller", "High protein"],
        note: "Arrives in Tuesday delivery.",
        kitchenNote: "Final sear batch closes at 2:15 PM.",
      },
      {
        id: "m5",
        name: "Protein Egg Bites",
        servings: 4,
        portionType: "Breakfast",
        tags: ["Breakfast", "Grab-and-go"],
        note: "Arrives in Tuesday delivery.",
        kitchenNote: "Pack as 2 twin-packs for easier pickup flow.",
      },
      {
        id: "m6",
        name: "Greek Yogurt Parfaits",
        servings: 4,
        portionType: "Breakfast",
        tags: ["Breakfast", "Cold pack"],
        note: "Arrives in Tuesday delivery.",
        kitchenNote: "Cold-hold until driver check-out.",
      },
    ],
  },
  {
    day: "Wed",
    dateLabel: "Apr 8",
    deliveryDay: false,
    meals: [
      {
        id: "m7",
        name: "Buffalo Chicken Wraps",
        servings: 2,
        portionType: "Lunch",
        tags: ["Fast lunch", "Customer favorite"],
        note: "Already in your fridge from Tuesday delivery.",
        kitchenNote: "No action needed. This meal is already fulfilled.",
      },
      {
        id: "m8",
        name: "Loaded Sweet Potatoes",
        servings: 2,
        portionType: "Dinner",
        tags: ["Comfort", "Balanced"],
        note: "Already in your fridge from Tuesday delivery.",
        kitchenNote: "No action needed. This meal is already fulfilled.",
      },
    ],
  },
  {
    day: "Thu",
    dateLabel: "Apr 9",
    deliveryDay: true,
    deliveryWindow: "4:30 PM – 6:00 PM",
    meals: [
      {
        id: "m9",
        name: "Honey Garlic Meatballs",
        servings: 2,
        portionType: "Dinner",
        tags: ["Best seller", "Reheat easy"],
        note: "Arrives in Thursday delivery.",
        kitchenNote: "Sauce cups added at final pack station.",
      },
      {
        id: "m10",
        name: "Cajun Shrimp Pasta",
        servings: 2,
        portionType: "Dinner",
        tags: ["Premium", "Popular"],
        note: "Arrives in Thursday delivery.",
        kitchenNote: "Heat-seal after pasta cool-down window.",
      },
      {
        id: "m11",
        name: "Overnight Oats",
        servings: 4,
        portionType: "Breakfast",
        tags: ["Breakfast", "Cold pack"],
        note: "Arrives in Thursday delivery.",
        kitchenNote: "Lid stickers face front for pickup visibility.",
      },
      {
        id: "m12",
        name: "Chicken Caesar Wraps",
        servings: 2,
        portionType: "Lunch",
        tags: ["Lunch", "Fast grab"],
        note: "Arrives in Thursday delivery.",
        kitchenNote: "Dressing packed on side.",
      },
    ],
  },
  {
    day: "Fri",
    dateLabel: "Apr 10",
    deliveryDay: false,
    meals: [
      {
        id: "m13",
        name: "Teriyaki Chicken",
        servings: 2,
        portionType: "Dinner",
        tags: ["Balanced", "Reheat easy"],
        note: "Already in your fridge from Thursday delivery.",
        kitchenNote: "No action needed. This meal is already fulfilled.",
      },
      {
        id: "m14",
        name: "Breakfast Burritos",
        servings: 4,
        portionType: "Breakfast",
        tags: ["Breakfast", "Freezer friendly"],
        note: "Already in your fridge from Thursday delivery.",
        kitchenNote: "No action needed. This meal is already fulfilled.",
      },
    ],
  },
  {
    day: "Sat",
    dateLabel: "Apr 11",
    deliveryDay: false,
    meals: [
      {
        id: "m15",
        name: "BBQ Chicken Mac Bowls",
        servings: 2,
        portionType: "Dinner",
        tags: ["Comfort", "Family favorite"],
        note: "Already in your fridge from Thursday delivery.",
        kitchenNote: "No action needed. This meal is already fulfilled.",
      },
    ],
  },
  {
    day: "Sun",
    dateLabel: "Apr 12",
    deliveryDay: true,
    deliveryWindow: "1:00 PM – 3:00 PM",
    meals: [
      {
        id: "m16",
        name: "Sunday Reset Delivery",
        servings: 8,
        portionType: "Weekly drop",
        tags: ["Reset", "Weekly plan"],
        note: "Next week starts here. This is the refill point.",
        kitchenNote: "This closes the current week and starts the next cycle.",
      },
    ],
  },
];

const liveFeedSeed: LiveEvent[] = [
  {
    id: "e1",
    time: "9:12 AM",
    title: "Plan generated",
    detail: "Week built around 3 delivery drops and 7 real customer days.",
  },
  {
    id: "e2",
    time: "9:14 AM",
    title: "Tuesday batch locked",
    detail: "Kitchen prep is now tied directly to Tuesday delivery.",
  },
  {
    id: "e3",
    time: "9:16 AM",
    title: "Preference updated",
    detail: "Dinner mix refreshed without rebuilding the whole week.",
  },
  {
    id: "e4",
    time: "9:19 AM",
    title: "Route confirmed",
    detail: "Tuesday delivery window is now visible to the customer.",
  },
];

function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function MealBusinessDemo() {
  const [viewMode, setViewMode] = useState<ViewMode>("customer");
  const [selectedDay, setSelectedDay] = useState<string>("Tue");
  const [liveIndex, setLiveIndex] = useState(0);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setLiveIndex((current) => (current + 1) % liveFeedSeed.length);
      setPulse(true);

      window.setTimeout(() => {
        setPulse(false);
      }, 1200);
    }, 3800);

    return () => window.clearInterval(interval);
  }, []);

  const selectedPlan =
    weekPlan.find((entry) => entry.day === selectedDay) ?? weekPlan[1];

  const totals = useMemo(() => {
    const totalMeals = weekPlan.reduce(
      (sum, day) => sum + day.meals.length,
      0
    );
    const deliveryDays = weekPlan.filter((day) => day.deliveryDay).length;

    return {
      totalMeals,
      deliveryDays,
    };
  }, []);

  const activeLiveEvent = liveFeedSeed[liveIndex];

  const selectedDayLabel =
    viewMode === "customer"
      ? selectedPlan.deliveryDay
        ? "Next arrival"
        : "Already covered"
      : selectedPlan.deliveryDay
      ? "Active production run"
      : "Fulfilled / no action";

  return (
    <div className="min-h-screen bg-[#07111a] text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(13,23,34,0.96),rgba(8,15,23,0.98))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-200">
                Meal system demo • HomePlanet live
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Show the customer their week. Show the kitchen what to run.
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                  One live meal system that makes the week obvious in seconds.
                  Customers see what is arriving and what is already covered.
                  The kitchen sees which delivery run is live and what belongs
                  to it.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                    Week logic
                  </div>
                  <div className="mt-2 text-sm font-medium text-white">
                    7 real days anchored to {totals.deliveryDays} delivery drops
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                    Customer clarity
                  </div>
                  <div className="mt-2 text-sm font-medium text-white">
                    See what arrives next, what is covered, and when
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                    Kitchen control
                  </div>
                  <div className="mt-2 text-sm font-medium text-white">
                    See the live run, prep notes, and delivery timing
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full max-w-md space-y-4">
              <div className="rounded-[24px] border border-white/10 bg-[#091722]/90 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                      View mode
                    </div>
                    <div className="mt-1 text-sm font-medium text-white">
                      Same week, different layer
                    </div>
                  </div>
                  <div
                    className={classNames(
                      "rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] transition",
                      pulse
                        ? "border-emerald-400/40 bg-emerald-400/12 text-emerald-200"
                        : "border-white/10 bg-white/[0.03] text-slate-300"
                    )}
                  >
                    {pulse ? "Live update" : "Ready"}
                  </div>
                </div>

                <div className="grid grid-cols-2 rounded-2xl border border-white/10 bg-[#08131d] p-1">
                  <button
                    type="button"
                    onClick={() => setViewMode("customer")}
                    className={classNames(
                      "rounded-xl px-3 py-2 text-sm font-medium transition",
                      viewMode === "customer"
                        ? "bg-white text-[#07111a]"
                        : "text-slate-300 hover:bg-white/5"
                    )}
                  >
                    Customer View
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("kitchen")}
                    className={classNames(
                      "rounded-xl px-3 py-2 text-sm font-medium transition",
                      viewMode === "kitchen"
                        ? "bg-[#f4a261] text-[#07111a]"
                        : "text-slate-300 hover:bg-white/5"
                    )}
                  >
                    Kitchen Control
                  </button>
                </div>

                <div
                  className={classNames(
                    "mt-3 rounded-2xl border p-3 transition",
                    viewMode === "customer"
                      ? "border-emerald-400/15 bg-emerald-400/[0.05]"
                      : "border-[#f4a261]/20 bg-[#f4a261]/[0.06]"
                  )}
                >
                  {viewMode === "customer" ? (
                    <div className="space-y-2">
                      <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                        What changes in customer view
                      </div>
                      <div className="text-sm font-medium text-white">
                        The page answers one question fast: what is showing up,
                        when it arrives, and what is already handled.
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                        What changes in kitchen control
                      </div>
                      <div className="text-sm font-medium text-white">
                        The same page becomes an execution layer: live run,
                        prep timing, pack notes, and no wasted re-solving.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div
                className={classNames(
                  "rounded-[24px] border p-4 transition",
                  pulse
                    ? "border-emerald-400/30 bg-emerald-400/[0.08] shadow-[0_0_0_1px_rgba(16,185,129,0.08),0_0_30px_rgba(16,185,129,0.08)]"
                    : "border-white/10 bg-[#091722]/90"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                      Live response
                    </div>
                    <div className="mt-1 text-sm font-semibold text-white">
                      {activeLiveEvent.title}
                    </div>
                  </div>
                  <div className="text-xs text-slate-400">
                    {activeLiveEvent.time}
                  </div>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {activeLiveEvent.detail}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-white/10 bg-[#0a1520] p-4 sm:p-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
                  Generated week
                </div>
                <h2 className="mt-1 text-xl font-semibold text-white">
                  {viewMode === "customer"
                    ? "A week the customer understands in seconds"
                    : "A week the kitchen can run without losing the thread"}
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-center">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                    Days
                  </div>
                  <div className="mt-1 text-sm font-semibold text-white">7</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-center">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                    Drops
                  </div>
                  <div className="mt-1 text-sm font-semibold text-white">
                    {totals.deliveryDays}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-center">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                    Meals
                  </div>
                  <div className="mt-1 text-sm font-semibold text-white">
                    {totals.totalMeals}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              {weekPlan.map((day) => {
                const isSelected = selectedDay === day.day;
                const mealCount = day.meals.length;
                const isActiveRun =
                  viewMode === "kitchen" && day.deliveryDay && isSelected;

                return (
                  <button
                    key={day.day}
                    type="button"
                    onClick={() => setSelectedDay(day.day)}
                    className={classNames(
                      "w-full rounded-[24px] border p-4 text-left transition",
                      isSelected
                        ? viewMode === "customer"
                          ? "border-white/25 bg-white/[0.06]"
                          : "border-[#f4a261]/35 bg-[#f4a261]/[0.08]"
                        : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
                    )}
                  >
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="text-base font-semibold text-white">
                            {day.day}
                          </div>
                          <div className="text-sm text-slate-400">
                            {day.dateLabel}
                          </div>

                          {day.deliveryDay ? (
                            <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-200">
                              Delivery day
                            </span>
                          ) : (
                            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                              Covered day
                            </span>
                          )}

                          {isActiveRun ? (
                            <span className="rounded-full border border-[#f4a261]/30 bg-[#f4a261]/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f4c08e]">
                              Active run
                            </span>
                          ) : null}
                        </div>

                        <div className="text-sm leading-6 text-slate-300">
                          {viewMode === "customer" ? (
                            day.deliveryDay ? (
                              <>
                                {mealCount} items arrive{" "}
                                <span className="font-medium text-white">
                                  {day.deliveryWindow}
                                </span>
                                . This is the next visible drop.
                              </>
                            ) : (
                              <>
                                {mealCount} items already covered from the last
                                delivery. No extra order needed today.
                              </>
                            )
                          ) : day.deliveryDay ? (
                            <>
                              {mealCount} live items tied to this delivery run.
                              Prep, pack, and route timing stay attached here.
                            </>
                          ) : (
                            <>
                              This day is already fulfilled. The kitchen is not
                              re-solving it.
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <div className="rounded-2xl border border-white/10 bg-[#08131d] px-3 py-2">
                          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                            Meals
                          </div>
                          <div className="mt-1 text-sm font-semibold text-white">
                            {mealCount}
                          </div>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-[#08131d] px-3 py-2">
                          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                            State
                          </div>
                          <div className="mt-1 text-sm font-semibold text-white">
                            {viewMode === "customer"
                              ? day.deliveryDay
                                ? "Arrives"
                                : "Covered"
                              : day.deliveryDay
                              ? "Live run"
                              : "Handled"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#0a1520] p-4 sm:p-5">
            <div className="mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
                  {viewMode === "customer" ? "Customer detail" : "Kitchen detail"}
                </div>
                <span
                  className={classNames(
                    "rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
                    viewMode === "customer"
                      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                      : "border-[#f4a261]/25 bg-[#f4a261]/10 text-[#f4c08e]"
                  )}
                >
                  {selectedDayLabel}
                </span>
              </div>

              <h2 className="mt-2 text-xl font-semibold text-white">
                {selectedPlan.day} • {selectedPlan.dateLabel}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {viewMode === "customer"
                  ? selectedPlan.deliveryDay
                    ? "Customer view keeps this simple: what is arriving in this drop and when."
                    : "Customer view keeps this simple: this day is already covered from the last delivery."
                  : selectedPlan.deliveryDay
                  ? "Kitchen control turns this day into an active run with timing, prep, and pack context."
                  : "Kitchen control shows this day as fulfilled so the team does not keep re-solving it."}
              </p>
            </div>

            <div className="space-y-3">
              {selectedPlan.deliveryDay && (
                <div
                  className={classNames(
                    "rounded-2xl border p-3 transition",
                    viewMode === "customer"
                      ? "border-emerald-400/20 bg-emerald-400/[0.08]"
                      : "border-[#f4a261]/25 bg-[#f4a261]/[0.08]"
                  )}
                >
                  <div className="text-[11px] uppercase tracking-[0.22em] text-slate-300">
                    {viewMode === "customer"
                      ? "Delivery window"
                      : "Production / route window"}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-white">
                    {selectedPlan.deliveryWindow}
                  </div>
                </div>
              )}

              {selectedPlan.meals.map((meal) => (
                <div
                  key={meal.id}
                  className={classNames(
                    "rounded-[24px] border p-4 transition",
                    viewMode === "customer"
                      ? "border-white/10 bg-white/[0.03]"
                      : "border-[#f4a261]/12 bg-[#f4a261]/[0.03]"
                  )}
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="text-base font-semibold text-white">
                          {meal.name}
                        </div>
                        <div className="mt-1 text-sm text-slate-400">
                          {meal.portionType} • {meal.servings} servings
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {meal.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-white/10 bg-[#08131d] px-2.5 py-1 text-[11px] font-medium text-slate-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div
                      className={classNames(
                        "rounded-2xl border p-3 transition",
                        viewMode === "customer"
                          ? "border-white/10 bg-[#08131d]"
                          : "border-[#f4a261]/15 bg-[#101820]"
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                          {viewMode === "customer"
                            ? "What the customer sees"
                            : "What the kitchen sees"}
                        </div>

                        {viewMode === "kitchen" && selectedPlan.deliveryDay ? (
                          <span className="rounded-full border border-[#f4a261]/25 bg-[#f4a261]/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f4c08e]">
                            Live run
                          </span>
                        ) : null}
                      </div>

                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {viewMode === "customer"
                          ? meal.note
                          : meal.kitchenNote}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-[24px] border border-white/10 bg-[#08131d] p-4">
              <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                Why this view shift matters
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {viewMode === "customer"
                  ? "Customer View removes internal noise and turns the week into a simple answer: what arrives, when it arrives, and what is already handled."
                  : "Kitchen Control turns the same week into an execution layer: which run is live, what needs prep, and what belongs to that delivery window."}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}