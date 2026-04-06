import { useEffect, useMemo, useState } from "react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const MEAL_ROWS = ["Breakfast", "Lunch", "Dinner", "Snacks"] as const;

type MealRowKey = (typeof MEAL_ROWS)[number];

type MealOption = {
  id: string;
  name: string;
  type: MealRowKey;
  protein: boolean;
  lowSodium: boolean;
  excludes: string[];
};

type BoardState = Record<MealRowKey, (string | null)[]>;
type LockedRows = Record<MealRowKey, boolean>;
type ActivityTone = "good" | "warn" | "info";
type InsightTone = "good" | "warn" | "info";
type InsightAction =
  | "fill-dinner"
  | "shuffle-lunch"
  | "rebalance-protein"
  | "complete-week"
  | "none";

type Insight = {
  tone: InsightTone;
  title: string;
  detail: string;
  action?: InsightAction;
  actionLabel?: string;
};

type ActivityItem = {
  id: string;
  tone: ActivityTone;
  title: string;
  detail: string;
};

type RowHealthTone = "good" | "warn" | "info" | "locked";

type RowHealth = {
  label: string;
  tone: RowHealthTone;
};

type PreviewAction = {
  type: InsightAction;
  title: string;
  detail: string;
  nextBoard: BoardState;
  changedCells: string[];
};

const MEALS: MealOption[] = [
  { id: "eggs", name: "Eggs + Avocado", type: "Breakfast", protein: true, lowSodium: true, excludes: [] },
  { id: "yogurt", name: "Greek Yogurt", type: "Breakfast", protein: true, lowSodium: true, excludes: [] },
  { id: "oatmeal", name: "Oatmeal", type: "Breakfast", protein: false, lowSodium: true, excludes: [] },

  { id: "chicken-bowl", name: "Chicken Bowl", type: "Lunch", protein: true, lowSodium: false, excludes: [] },
  { id: "turkey-wrap", name: "Turkey Wrap", type: "Lunch", protein: true, lowSodium: true, excludes: [] },
  { id: "salmon-salad", name: "Salmon Salad", type: "Lunch", protein: true, lowSodium: true, excludes: [] },

  { id: "chicken", name: "Grilled Chicken", type: "Dinner", protein: true, lowSodium: true, excludes: [] },
  { id: "salmon", name: "Salmon + Rice", type: "Dinner", protein: true, lowSodium: true, excludes: [] },
  { id: "steak", name: "Steak + Veggies", type: "Dinner", protein: true, lowSodium: false, excludes: [] },
  { id: "pasta", name: "Pasta Bowl", type: "Dinner", protein: false, lowSodium: false, excludes: ["mushrooms"] },

  { id: "trail", name: "Trail Mix", type: "Snacks", protein: false, lowSodium: true, excludes: [] },
  { id: "bar", name: "Protein Bar", type: "Snacks", protein: true, lowSodium: true, excludes: [] },
  { id: "fruit", name: "Fruit Cup", type: "Snacks", protein: false, lowSodium: true, excludes: [] },
];

function createEmptyBoard(): BoardState {
  return {
    Breakfast: Array(7).fill(null),
    Lunch: Array(7).fill(null),
    Dinner: Array(7).fill(null),
    Snacks: Array(7).fill(null),
  };
}

function cloneBoard(board: BoardState): BoardState {
  return {
    Breakfast: [...board.Breakfast],
    Lunch: [...board.Lunch],
    Dinner: [...board.Dinner],
    Snacks: [...board.Snacks],
  };
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildMealsByType(filteredMeals: MealOption[]) {
  return {
    Breakfast: filteredMeals.filter((m) => m.type === "Breakfast"),
    Lunch: filteredMeals.filter((m) => m.type === "Lunch"),
    Dinner: filteredMeals.filter((m) => m.type === "Dinner"),
    Snacks: filteredMeals.filter((m) => m.type === "Snacks"),
  };
}

function smartFillRow(
  row: MealRowKey,
  current: (string | null)[],
  mealsByType: Record<MealRowKey, MealOption[]>
) {
  const options = shuffle(mealsByType[row]);
  const used = new Set(current.filter(Boolean));

  let proteinCount = 0;
  let nonProteinCount = 0;

  current.forEach((id) => {
    const meal = MEALS.find((m) => m.id === id);
    if (!meal) return;
    if (meal.protein) proteinCount++;
    else nonProteinCount++;
  });

  return current.map((slot) => {
    if (slot) return slot;

    let candidates = options.filter((m) => !used.has(m.id));
    if (!candidates.length) candidates = options;

    if (proteinCount > nonProteinCount) {
      const nonProtein = candidates.filter((m) => !m.protein);
      if (nonProtein.length) candidates = nonProtein;
    } else {
      const protein = candidates.filter((m) => m.protein);
      if (protein.length) candidates = protein;
    }

    const chosen = candidates[Math.floor(Math.random() * candidates.length)];

    if (chosen) {
      used.add(chosen.id);
      if (chosen.protein) proteinCount++;
      else nonProteinCount++;
      return chosen.id;
    }

    return null;
  });
}

function toneClasses(tone: ActivityTone) {
  if (tone === "good") return "border-emerald-400/30 bg-emerald-500/10";
  if (tone === "warn") return "border-amber-400/30 bg-amber-500/10";
  return "border-cyan-400/30 bg-cyan-500/10";
}

function rowHealthClasses(tone: RowHealthTone) {
  if (tone === "good") return "border-emerald-400/30 bg-emerald-500/15 text-emerald-100";
  if (tone === "warn") return "border-amber-400/30 bg-amber-500/15 text-amber-100";
  if (tone === "locked") return "border-yellow-400/30 bg-yellow-500/20 text-yellow-100";
  return "border-cyan-400/30 bg-cyan-500/15 text-cyan-100";
}

function getRowHealth(
  row: MealRowKey,
  values: (string | null)[],
  locked: boolean
): RowHealth {
  if (locked) {
    return { label: "Locked", tone: "locked" };
  }

  const filled = values.filter(Boolean).length;
  if (filled === 0) {
    return { label: "Open", tone: "info" };
  }

  if (filled < 4) {
    return { label: "Light coverage", tone: "warn" };
  }

  const ids = values.filter(Boolean) as string[];
  const repeats = ids.length - new Set(ids).size;
  if (repeats >= 2) {
    return { label: "Repeating", tone: "warn" };
  }

  const selectedMeals = ids
    .map((id) => MEALS.find((meal) => meal.id === id))
    .filter((meal): meal is MealOption => Boolean(meal));

  const proteinCount = selectedMeals.filter((meal) => meal.protein).length;
  const nonProteinCount = selectedMeals.filter((meal) => !meal.protein).length;

  if (filled === 7 && proteinCount > 0 && nonProteinCount > 0 && Math.abs(proteinCount - nonProteinCount) <= 2) {
    return { label: "Balanced", tone: "good" };
  }

  if (filled === 7) {
    return { label: "Stable", tone: "good" };
  }

  return { label: "Building", tone: "info" };
}

function getChangedCells(current: BoardState, next: BoardState) {
  const changes: string[] = [];

  for (const row of MEAL_ROWS) {
    for (let i = 0; i < DAYS.length; i += 1) {
      if (current[row][i] !== next[row][i]) {
        changes.push(`${row}-${i}`);
      }
    }
  }

  return changes;
}

export default function MealBoardDemo() {
  const [board, setBoard] = useState<BoardState>(createEmptyBoard());
  const [proteinOnly, setProteinOnly] = useState(false);
  const [lowSodiumOnly, setLowSodiumOnly] = useState(false);
  const [lockedRows, setLockedRows] = useState<LockedRows>({
    Breakfast: false,
    Lunch: false,
    Dinner: false,
    Snacks: false,
  });
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([
    {
      id: "boot",
      tone: "info",
      title: "System ready",
      detail: "Start with one row, use Auto, or let insights guide the next move.",
    },
  ]);
  const [pulseKey, setPulseKey] = useState<string | null>(null);
  const [systemMode, setSystemMode] = useState("Ready to build");
  const [previewAction, setPreviewAction] = useState<PreviewAction | null>(null);

  const filteredMeals = useMemo(() => {
    return MEALS.filter((m) => {
      if (proteinOnly && !m.protein) return false;
      if (lowSodiumOnly && !m.lowSodium) return false;
      return true;
    });
  }, [proteinOnly, lowSodiumOnly]);

  const mealsByType = useMemo(() => buildMealsByType(filteredMeals), [filteredMeals]);

  function pushActivity(tone: ActivityTone, title: string, detail: string) {
    setRecentActivity((prev) => [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        tone,
        title,
        detail,
      },
      ...prev,
    ].slice(0, 6));
  }

  function flashArea(key: string) {
    setPulseKey(key);
  }

  useEffect(() => {
    if (!pulseKey) return;
    const timeout = window.setTimeout(() => setPulseKey(null), 900);
    return () => window.clearTimeout(timeout);
  }, [pulseKey]);

  function getDisplayBoard() {
    return previewAction?.nextBoard ?? board;
  }

  const displayBoard = getDisplayBoard();

  function setMeal(row: MealRowKey, day: number, mealId: string) {
    const previous = board[row][day];
    setPreviewAction(null);

    setBoard((prev) => {
      const next = { ...prev, [row]: [...prev[row]] };
      next[row][day] = mealId || null;
      return next;
    });

    if (mealId) {
      const meal = MEALS.find((m) => m.id === mealId);
      pushActivity(
        "info",
        `${row} updated • ${DAYS[day]}`,
        meal ? `${meal.name} was placed into ${row.toLowerCase()}.` : "Meal slot updated."
      );
      flashArea(`${row}-${day}`);
      setSystemMode("Responding live");
    } else if (previous) {
      pushActivity("warn", `${row} cleared • ${DAYS[day]}`, `A ${row.toLowerCase()} slot was removed from the week.`);
      flashArea(`${row}-${day}`);
      setSystemMode("Adjusting coverage");
    }
  }

  function clearSlot(row: MealRowKey, day: number) {
    const existing = board[row][day];
    if (!existing) return;
    setPreviewAction(null);

    setBoard((prev) => {
      const next = { ...prev, [row]: [...prev[row]] };
      next[row][day] = null;
      return next;
    });

    pushActivity("warn", `${row} cleared • ${DAYS[day]}`, `${row} on ${DAYS[day]} is now open again.`);
    flashArea(`${row}-${day}`);
    setSystemMode("Adjusting coverage");
  }

  function toggleLock(row: MealRowKey) {
    const nextValue = !lockedRows[row];
    setPreviewAction(null);
    setLockedRows((prev) => ({ ...prev, [row]: nextValue }));
    pushActivity(
      nextValue ? "good" : "info",
      nextValue ? `${row} locked` : `${row} unlocked`,
      nextValue
        ? `Auto-fill will now work around the ${row.toLowerCase()} row.`
        : `The ${row.toLowerCase()} row is open for system updates again.`
    );
    flashArea(row);
    setSystemMode(nextValue ? "Stable system" : "Ready to optimize");
  }

  function autoFill() {
    setPreviewAction(null);

    let filledSlots = 0;
    let balancedRows = 0;

    setBoard((prev) => {
      const next = cloneBoard(prev);

      for (const row of MEAL_ROWS) {
        if (lockedRows[row]) continue;

        const before = prev[row].filter(Boolean).length;
        next[row] = smartFillRow(row, prev[row], mealsByType);
        const after = next[row].filter(Boolean).length;

        if (after > before) filledSlots += after - before;
        if (after > 0) balancedRows += 1;
      }

      return next;
    });

    if (filledSlots > 0) {
      pushActivity(
        "good",
        "Auto-fill completed",
        `${filledSlots} slot${filledSlots === 1 ? " was" : "s were"} filled and ${balancedRows} row${balancedRows === 1 ? " was" : "s were"} rebalanced.`
      );
      setSystemMode("Optimizing balance");
    } else {
      pushActivity("info", "Auto-fill checked the board", "No open slots needed changes. The system is holding the current week.");
      setSystemMode("Stable system");
    }

    flashArea("board");
  }

  function buildShuffleRowPreview(row: MealRowKey): PreviewAction | null {
    if (lockedRows[row]) {
      pushActivity("warn", `${row} is locked`, `Unlock ${row.toLowerCase()} before reshuffling that row.`);
      return null;
    }

    const currentIds = board[row].filter(Boolean) as string[];
    if (!currentIds.length) return null;

    const shuffledIds = shuffle(currentIds);
    const nextBoard = cloneBoard(board);
    let cursor = 0;

    nextBoard[row] = nextBoard[row].map((slot) => {
      if (!slot) return slot;
      const replacement = shuffledIds[cursor] ?? slot;
      cursor += 1;
      return replacement;
    });

    return {
      type: "shuffle-lunch",
      title: `${row} preview ready`,
      detail: `${row} rotation has been staged. Review the highlighted changes and apply when ready.`,
      nextBoard,
      changedCells: getChangedCells(board, nextBoard),
    };
  }

  function buildFillDinnerPreview(): PreviewAction | null {
    if (lockedRows.Dinner) {
      pushActivity("warn", "Dinner is locked", "Unlock dinner first if you want the system to fill that row.");
      return null;
    }

    const nextBoard = cloneBoard(board);
    nextBoard.Dinner = smartFillRow("Dinner", board.Dinner, mealsByType);

    return {
      type: "fill-dinner",
      title: "Dinner improvement ready",
      detail: "The system staged a stronger dinner row to reduce friction and tighten variety.",
      nextBoard,
      changedCells: getChangedCells(board, nextBoard),
    };
  }

  function buildRebalancePreview(): PreviewAction | null {
    const nextBoard = cloneBoard(board);

    for (const row of MEAL_ROWS) {
      if (lockedRows[row]) continue;
      nextBoard[row] = smartFillRow(row, board[row].map(() => null), mealsByType);
    }

    return {
      type: "rebalance-protein",
      title: "Rebalanced week ready",
      detail: "The system staged a cleaner protein balance and broader spread across the week.",
      nextBoard,
      changedCells: getChangedCells(board, nextBoard),
    };
  }

  function buildCompleteWeekPreview(): PreviewAction | null {
    const nextBoard = cloneBoard(board);

    for (const row of MEAL_ROWS) {
      if (lockedRows[row]) continue;
      nextBoard[row] = smartFillRow(row, board[row], mealsByType);
    }

    return {
      type: "complete-week",
      title: "Completion preview ready",
      detail: "The system staged a finished week without disturbing locked rows.",
      nextBoard,
      changedCells: getChangedCells(board, nextBoard),
    };
  }

  function runInsightAction(action: InsightAction) {
    if (action === "shuffle-lunch") {
      const preview = buildShuffleRowPreview("Lunch");
      if (!preview) return;
      setPreviewAction(preview);
      pushActivity("info", "Lunch preview generated", "The system staged a lunch rotation for review.");
      setSystemMode("Preview ready");
      flashArea("Lunch");
      return;
    }

    if (action === "fill-dinner") {
      const preview = buildFillDinnerPreview();
      if (!preview) return;
      setPreviewAction(preview);
      pushActivity("info", "Dinner preview generated", "The system staged an improved dinner row for approval.");
      setSystemMode("Preview ready");
      flashArea("Dinner");
      return;
    }

    if (action === "rebalance-protein") {
      const preview = buildRebalancePreview();
      if (!preview) return;
      setPreviewAction(preview);
      pushActivity("info", "Rebalance preview generated", "The system staged a better protein spread across the week.");
      setSystemMode("Preview ready");
      flashArea("board");
      return;
    }

    if (action === "complete-week") {
      const preview = buildCompleteWeekPreview();
      if (!preview) return;
      setPreviewAction(preview);
      pushActivity("info", "Completion preview generated", "The system staged open-slot fills for your approval.");
      setSystemMode("Preview ready");
      flashArea("board");
    }
  }

  function applyPreview() {
    if (!previewAction) return;

    setBoard(previewAction.nextBoard);
    pushActivity(
      "good",
      `${previewAction.title.replace(" ready", "")} applied`,
      `The proposed system change is now live on the board.`
    );
    setSystemMode("Responding live");

    if (previewAction.changedCells.length > 0) {
      flashArea(previewAction.changedCells[0]);
    } else {
      flashArea("board");
    }

    setPreviewAction(null);
  }

  function dismissPreview() {
    if (!previewAction) return;
    pushActivity("warn", "Preview dismissed", "The staged system change was not applied.");
    setPreviewAction(null);
    setSystemMode("Stable system");
  }

  function clearAll() {
    setPreviewAction(null);
    setBoard(createEmptyBoard());
    pushActivity("warn", "Board cleared", "All meal slots were reset. The system is ready to build again.");
    flashArea("board");
    setSystemMode("Ready to build");
  }

  const filled = MEAL_ROWS.reduce((acc, row) => acc + displayBoard[row].filter(Boolean).length, 0);
  const total = MEAL_ROWS.length * 7;

  const rowCounts = useMemo(() => {
    return {
      Breakfast: displayBoard.Breakfast.filter(Boolean).length,
      Lunch: displayBoard.Lunch.filter(Boolean).length,
      Dinner: displayBoard.Dinner.filter(Boolean).length,
      Snacks: displayBoard.Snacks.filter(Boolean).length,
    };
  }, [displayBoard]);

  const rowHealth = useMemo<Record<MealRowKey, RowHealth>>(() => {
    return {
      Breakfast: getRowHealth("Breakfast", displayBoard.Breakfast, lockedRows.Breakfast),
      Lunch: getRowHealth("Lunch", displayBoard.Lunch, lockedRows.Lunch),
      Dinner: getRowHealth("Dinner", displayBoard.Dinner, lockedRows.Dinner),
      Snacks: getRowHealth("Snacks", displayBoard.Snacks, lockedRows.Snacks),
    };
  }, [displayBoard, lockedRows]);

  const systemStatus = useMemo(() => {
    if (filled === 0) return "Ready to build";
    if (filled < total / 2) return "Early structure";
    if (filled < total) return "Partial week";
    return "Fully planned";
  }, [filled, total]);

  const insights = useMemo(() => {
    const messages: Insight[] = [];

    const allSelectedIds = MEAL_ROWS.flatMap((row) => displayBoard[row].filter(Boolean) as string[]);
    const selectedMeals = allSelectedIds
      .map((id) => MEALS.find((meal) => meal.id === id))
      .filter((meal): meal is MealOption => Boolean(meal));

    const proteinCount = selectedMeals.filter((meal) => meal.protein).length;
    const nonProteinCount = selectedMeals.filter((meal) => !meal.protein).length;

    const dinnerIds = displayBoard.Dinner.filter(Boolean) as string[];
    const lunchIds = displayBoard.Lunch.filter(Boolean) as string[];

    const repeatedDinnerCount = dinnerIds.length - new Set(dinnerIds).size;
    const repeatedLunchCount = lunchIds.length - new Set(lunchIds).size;
    const activeLocks = MEAL_ROWS.filter((row) => lockedRows[row]);

    if (filled === 0) {
      messages.push({
        tone: "info",
        title: "Start with one row or use Auto",
        detail: "The fastest way to feel the board is to fill dinners first or let the system build the week for you.",
        action: "complete-week",
        actionLabel: "Preview completion",
      });
    }

    if (filled > 0 && filled < total) {
      messages.push({
        tone: "info",
        title: "Partial week in progress",
        detail: `${total - filled} slots are still open. The board will keep what you like and finish the rest around it.`,
        action: "complete-week",
        actionLabel: "Preview fill",
      });
    }

    if (filled === total) {
      messages.push({
        tone: "good",
        title: "Full week planned",
        detail: "Every slot is filled. This now feels like a managed week, not a bunch of scattered food decisions.",
      });
    }

    if (rowCounts.Dinner < 5) {
      messages.push({
        tone: "warn",
        title: "Dinner coverage is light",
        detail: "Dinner usually carries the most friction. Filling this row first makes the week feel calmer faster.",
        action: "fill-dinner",
        actionLabel: "Preview dinner fix",
      });
    }

    if (rowCounts.Lunch > 0 && repeatedLunchCount >= 2) {
      messages.push({
        tone: "warn",
        title: "Lunch is starting to repeat",
        detail: "A couple lunch choices are repeating. You may want one more option in rotation later.",
        action: "shuffle-lunch",
        actionLabel: "Preview lunch rotation",
      });
    }

    if (rowCounts.Dinner > 0 && repeatedDinnerCount >= 2) {
      messages.push({
        tone: "warn",
        title: "Dinner variety is getting tight",
        detail: "Dinner is usable, but a little repetitive. The system is noticing that the same meals are showing up a lot.",
        action: "fill-dinner",
        actionLabel: "Preview dinner refresh",
      });
    }

    if (proteinCount > 0 && proteinCount >= nonProteinCount * 2 && selectedMeals.length >= 6) {
      messages.push({
        tone: "warn",
        title: "Protein is dominating the board",
        detail: "This week is leaning heavily protein. That may be intentional, but the board is flagging the imbalance.",
        action: "rebalance-protein",
        actionLabel: "Preview rebalance",
      });
    }

    if (selectedMeals.length >= 8 && proteinCount > 0 && nonProteinCount > 0 && Math.abs(proteinCount - nonProteinCount) <= 3) {
      messages.push({
        tone: "good",
        title: "The week looks balanced",
        detail: "Protein and non-protein choices are sitting in a good range. It feels guided instead of random.",
      });
    }

    if (activeLocks.length > 0) {
      messages.push({
        tone: "info",
        title: "Locked rows are protected",
        detail: `${activeLocks.join(", ")} ${activeLocks.length === 1 ? "is" : "are"} locked, so auto-fill will work around those choices.`,
      });
    }

    return messages.slice(0, 4);
  }, [displayBoard, filled, total, rowCounts, lockedRows]);

  return (
    <div className="min-h-screen bg-[#071224] text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Meal Board</h1>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-white/70">
              <span>{filled}/{total} slots filled</span>
              <span>•</span>
              <span>{systemStatus}</span>
              <span>•</span>
              <span>{systemMode}</span>
              {previewAction ? (
                <>
                  <span>•</span>
                  <span className="text-cyan-200">Preview staged</span>
                </>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setPreviewAction(null);
                setProteinOnly((v) => !v);
                pushActivity(
                  "info",
                  proteinOnly ? "Protein filter disabled" : "Protein filter enabled",
                  proteinOnly
                    ? "The board is showing full meal options again."
                    : "The system is prioritizing protein-forward meals."
                );
                setSystemMode("Filtering live");
              }}
              className={`px-3 py-1 rounded-lg ${proteinOnly ? "bg-emerald-600" : "bg-[#1a2238]"}`}
            >
              Protein
            </button>
            <button
              onClick={() => {
                setPreviewAction(null);
                setLowSodiumOnly((v) => !v);
                pushActivity(
                  "info",
                  lowSodiumOnly ? "Low sodium disabled" : "Low sodium enabled",
                  lowSodiumOnly
                    ? "The board is showing standard meal options again."
                    : "The system is filtering toward low sodium choices."
                );
                setSystemMode("Filtering live");
              }}
              className={`px-3 py-1 rounded-lg ${lowSodiumOnly ? "bg-cyan-600" : "bg-[#1a2238]"}`}
            >
              Low Sodium
            </button>
            <button onClick={autoFill} className="px-3 py-1 rounded-lg bg-blue-600">
              Auto
            </button>
            <button onClick={clearAll} className="px-3 py-1 rounded-lg bg-red-600">
              Clear
            </button>
          </div>
        </div>

        {previewAction ? (
          <div className="rounded-2xl border border-cyan-400/30 bg-cyan-500/10 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-cyan-100/70">System suggestion preview</div>
                <div className="mt-1 text-lg font-semibold text-white">{previewAction.title}</div>
                <div className="mt-1 text-sm text-white/75">{previewAction.detail}</div>
                <div className="mt-2 text-xs text-cyan-100/80">
                  {previewAction.changedCells.length} highlighted slot{previewAction.changedCells.length === 1 ? "" : "s"} ready to apply
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={applyPreview}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white"
                >
                  Apply fix
                </button>
                <button
                  onClick={dismissPreview}
                  className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className={`space-y-4 transition ${pulseKey === "board" ? "scale-[1.003]" : "scale-100"}`}>
            {MEAL_ROWS.map((row) => (
              <div
                key={row}
                className={`rounded-2xl bg-[#0c1932] p-3 transition ${pulseKey === row ? "ring-1 ring-cyan-300/40" : "ring-1 ring-transparent"}`}
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">{row}</div>
                    <div
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${rowHealthClasses(
                        rowHealth[row].tone
                      )}`}
                    >
                      {rowHealth[row].label}
                    </div>
                  </div>

                  <button
                    onClick={() => toggleLock(row)}
                    className={`text-xs px-2 py-1 rounded ${lockedRows[row] ? "bg-yellow-600 text-black" : "bg-[#1a2238]"}`}
                  >
                    {lockedRows[row] ? "🔒 Locked" : "Lock"}
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {DAYS.map((day, i) => {
                    const mealId = displayBoard[row][i];
                    const meal = MEALS.find((m) => m.id === mealId);
                    const cellKey = `${row}-${i}`;
                    const isPreviewCell = previewAction?.changedCells.includes(cellKey);

                    return (
                      <div
                        key={day}
                        className={`rounded-xl p-2 space-y-1 transition ${
                          isPreviewCell
                            ? "ring-1 ring-cyan-300/60 bg-[#17365f]"
                            : pulseKey === cellKey
                              ? "ring-1 ring-emerald-300/50 bg-[#13264a]"
                              : "ring-1 ring-transparent bg-[#101f3c]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-[10px] opacity-60">{day}</div>
                          {isPreviewCell ? (
                            <div className="rounded-full bg-cyan-400/20 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-cyan-100">
                              Preview
                            </div>
                          ) : null}
                        </div>

                        <div className="h-12 flex items-center justify-center text-xs text-center bg-[#071224] rounded px-1">
                          {meal ? meal.name : "—"}
                        </div>

                        <div className="flex gap-1">
                          <select
                            className="flex-1 text-xs bg-[#1a2238] rounded p-1"
                            value={mealId || ""}
                            onChange={(e) => setMeal(row, i, e.target.value)}
                          >
                            <option value="">Select</option>
                            {mealsByType[row].map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.name}
                              </option>
                            ))}
                          </select>

                          <button onClick={() => clearSlot(row, i)} className="px-2 text-xs bg-[#1a2238] rounded">
                            ✕
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <aside className="rounded-2xl bg-[#0c1932] p-4 space-y-4 h-fit xl:sticky xl:top-6">
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-cyan-200/70">System feedback</div>
              <h2 className="mt-1 text-lg font-semibold">Live insights</h2>
              <p className="mt-1 text-sm text-white/65">
                The board is watching patterns, coverage, balance, and active changes as you build.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-[#101f3c] p-3">
                <div className="text-[11px] uppercase tracking-[0.14em] text-white/50">Status</div>
                <div className="mt-1 text-sm font-semibold text-white">{systemStatus}</div>
              </div>
              <div className="rounded-xl bg-[#101f3c] p-3">
                <div className="text-[11px] uppercase tracking-[0.14em] text-white/50">Mode</div>
                <div className="mt-1 text-sm font-semibold text-white">{systemMode}</div>
              </div>
            </div>

            <div className="rounded-xl bg-[#101f3c] p-3 space-y-2">
              <div className="text-[11px] uppercase tracking-[0.14em] text-white/50">Row coverage</div>
              {MEAL_ROWS.map((row) => (
                <div key={row} className="flex items-center justify-between text-sm text-white/80">
                  <div className="flex items-center gap-2">
                    <span>{row}</span>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${rowHealthClasses(
                        rowHealth[row].tone
                      )}`}
                    >
                      {rowHealth[row].label}
                    </span>
                  </div>
                  <span className="font-semibold text-white">{rowCounts[row]}/7</span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {insights.map((insight, index) => (
                <div key={`${insight.title}-${index}`} className={`rounded-xl border p-3 ${toneClasses(insight.tone)}`}>
                  <div className="text-sm font-semibold text-white">{insight.title}</div>
                  <div className="mt-1 text-sm leading-5 text-white/75">{insight.detail}</div>
                  {insight.action && insight.action !== "none" ? (
                    <button
                      onClick={() => runInsightAction(insight.action!)}
                      className="mt-3 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/20"
                    >
                      {insight.actionLabel ?? "Preview fix"}
                    </button>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-[#101f3c] p-3 space-y-3">
              <div>
                <div className="text-[11px] uppercase tracking-[0.14em] text-white/50">System activity</div>
                <div className="mt-1 text-sm text-white/65">Live events from the board engine</div>
              </div>

              <div className="space-y-2">
                {recentActivity.map((item) => (
                  <div key={item.id} className={`rounded-xl border p-3 ${toneClasses(item.tone)}`}>
                    <div className="text-sm font-semibold text-white">{item.title}</div>
                    <div className="mt-1 text-sm leading-5 text-white/75">{item.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}