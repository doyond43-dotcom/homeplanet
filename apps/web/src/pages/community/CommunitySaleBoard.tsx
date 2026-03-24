// src/pages/community/CommunitySaleBoard.tsx
import { useMemo, useState } from "react";

type SaleStage =
  | "New Listings"
  | "Questions"
  | "Hold / Pending"
  | "Sold"
  | "Pickup Complete";

type PaymentMethod = "Cash App" | "Zelle" | "Venmo" | "Cash" | "Other";

type ItemCategory =
  | "Furniture"
  | "Home"
  | "Kids"
  | "Tools"
  | "Electronics"
  | "Clothing"
  | "Outdoor"
  | "Other";

type QuestionStatus = "open" | "answered";

type SaleQuestion = {
  id: string;
  from: string;
  text: string;
  time: string;
  status: QuestionStatus;
};

type SaleTimelineEvent = {
  id: string;
  time: string;
  title: string;
  detail: string;
};

type SaleItem = {
  id: string;
  title: string;
  category: ItemCategory;
  stage: SaleStage;
  price: number;
  photoUrl: string;
  description: string;
  condition: string;
  pickupArea: string;
  paymentMethods: PaymentMethod[];
  quantity: number;
  sellerNote: string;
  holdFor?: string;
  buyerName?: string;
  buyerContact?: string;
  featured?: boolean;
  questions: SaleQuestion[];
  timeline: SaleTimelineEvent[];
  tags: string[];
};

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function makeId(prefix = "id") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function safeToast(message: string) {
  try {
    alert(message);
  } catch {
    /* noop */
  }
}

async function copyToClipboard(text: string) {
  const value = (text || "").trim();
  if (!value) {
    safeToast("Nothing to copy.");
    return;
  }

  try {
    await navigator.clipboard.writeText(value);
    safeToast("Copied.");
  } catch {
    const ta = document.createElement("textarea");
    ta.value = value;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      safeToast("Copied.");
    } catch {
      safeToast("Copy failed.");
    } finally {
      document.body.removeChild(ta);
    }
  }
}

function stageTone(stage: SaleStage) {
  switch (stage) {
    case "New Listings":
      return {
        lane: "border-l-cyan-400/70",
        pill: "border-cyan-400/30 bg-cyan-500/10 text-cyan-100",
      };
    case "Questions":
      return {
        lane: "border-l-amber-300/70",
        pill: "border-amber-300/30 bg-amber-400/10 text-amber-100",
      };
    case "Hold / Pending":
      return {
        lane: "border-l-violet-400/70",
        pill: "border-violet-400/30 bg-violet-500/10 text-violet-100",
      };
    case "Sold":
      return {
        lane: "border-l-fuchsia-400/70",
        pill: "border-fuchsia-400/30 bg-fuchsia-500/10 text-fuchsia-100",
      };
    case "Pickup Complete":
      return {
        lane: "border-l-emerald-400/70",
        pill: "border-emerald-400/30 bg-emerald-500/10 text-emerald-100",
      };
    default:
      return {
        lane: "border-l-cyan-400/70",
        pill: "border-cyan-400/30 bg-cyan-500/10 text-cyan-100",
      };
  }
}

function categoryTone(category: ItemCategory) {
  switch (category) {
    case "Furniture":
      return "border-cyan-400/20 bg-cyan-500/10 text-cyan-100";
    case "Home":
      return "border-emerald-400/20 bg-emerald-500/10 text-emerald-100";
    case "Kids":
      return "border-fuchsia-400/20 bg-fuchsia-500/10 text-fuchsia-100";
    case "Tools":
      return "border-amber-300/20 bg-amber-400/10 text-amber-100";
    case "Electronics":
      return "border-violet-400/20 bg-violet-500/10 text-violet-100";
    case "Clothing":
      return "border-pink-400/20 bg-pink-500/10 text-pink-100";
    case "Outdoor":
      return "border-lime-400/20 bg-lime-500/10 text-lime-100";
    default:
      return "border-white/10 bg-white/5 text-white/75";
  }
}

function priceLabel(value: number) {
  return `$${value.toFixed(0)}`;
}

function paymentSummary(methods: PaymentMethod[]) {
  return methods.join(" • ");
}

function buildItemShareText(item: SaleItem) {
  return [
    `COMMUNITY SALE BOARD`,
    ``,
    `Item: ${item.title}`,
    `Price: ${priceLabel(item.price)}`,
    `Category: ${item.category}`,
    `Status: ${item.stage}`,
    `Condition: ${item.condition}`,
    `Pickup Area: ${item.pickupArea}`,
    `Payment: ${paymentSummary(item.paymentMethods)}`,
    ``,
    `Description`,
    item.description || "-",
    ``,
    `Seller Note`,
    item.sellerNote || "-",
  ].join("\n");
}

function buildEventSummary(items: SaleItem[]) {
  const totals = {
    listed: items.filter((x) => x.stage === "New Listings").length,
    questions: items.filter((x) => x.stage === "Questions").length,
    pending: items.filter((x) => x.stage === "Hold / Pending").length,
    sold: items.filter((x) => x.stage === "Sold").length,
    complete: items.filter((x) => x.stage === "Pickup Complete").length,
  };

  const soldValue = items
    .filter((x) => x.stage === "Sold" || x.stage === "Pickup Complete")
    .reduce((sum, item) => sum + item.price, 0);

  const lines = items
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.title} — ${priceLabel(item.price)} — ${item.stage} — ${item.pickupArea}`
    )
    .join("\n");

  return [
    `COMMUNITY SALE BOARD — EVENT SUMMARY`,
    ``,
    `New Listings: ${totals.listed}`,
    `Questions: ${totals.questions}`,
    `Hold / Pending: ${totals.pending}`,
    `Sold: ${totals.sold}`,
    `Pickup Complete: ${totals.complete}`,
    `Sold Value: $${soldValue.toFixed(0)}`,
    ``,
    `ITEMS`,
    lines || "-",
  ].join("\n");
}

function seedItems(): SaleItem[] {
  return [
    {
      id: "sale_1",
      title: "Solid Wood Entry Table",
      category: "Furniture",
      stage: "New Listings",
      price: 65,
      photoUrl:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      description:
        "Clean entry table with lower shelf. Great for hallway, foyer, or porch setup.",
      condition: "Good",
      pickupArea: "Okeechobee • Front driveway pickup",
      paymentMethods: ["Cash App", "Cash", "Zelle"],
      quantity: 1,
      sellerNote: "First come, first served. Easy load-in from driveway.",
      featured: true,
      tags: ["wood", "table", "entry"],
      questions: [
        {
          id: makeId("q"),
          from: "Ashley",
          text: "Is this still available?",
          time: "8:14 AM",
          status: "open",
        },
      ],
      timeline: [
        {
          id: makeId("t"),
          time: "8:02 AM",
          title: "Item listed",
          detail: "Entry table posted to board.",
        },
      ],
    },
    {
      id: "sale_2",
      title: "Kids Bike - Blue",
      category: "Kids",
      stage: "Questions",
      price: 25,
      photoUrl:
        "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=1200&q=80",
      description:
        "Used kids bike with training wheels included. Tires hold air. Ready to go.",
      condition: "Fair",
      pickupArea: "Okeechobee • Side gate pickup",
      paymentMethods: ["Cash", "Venmo", "Cash App"],
      quantity: 1,
      sellerNote: "Good for quick neighborhood pickup.",
      tags: ["bike", "kids", "blue"],
      questions: [
        {
          id: makeId("q"),
          from: "Megan",
          text: "What size is it?",
          time: "8:26 AM",
          status: "answered",
        },
        {
          id: makeId("q"),
          from: "Tom",
          text: "Could you hold until 1 PM?",
          time: "8:31 AM",
          status: "open",
        },
      ],
      timeline: [
        {
          id: makeId("t"),
          time: "8:10 AM",
          title: "Item listed",
          detail: "Bike posted with photo and pickup note.",
        },
        {
          id: makeId("t"),
          time: "8:31 AM",
          title: "Question received",
          detail: "Buyer asked about hold until 1 PM.",
        },
      ],
    },
    {
      id: "sale_3",
      title: "Patio Tool Bundle",
      category: "Tools",
      stage: "Hold / Pending",
      price: 40,
      photoUrl:
        "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1200&q=80",
      description:
        "Yard rake, shovel, hand trimmer, and small extension cord sold together.",
      condition: "Good",
      pickupArea: "Okeechobee • Back shed pickup",
      paymentMethods: ["Zelle", "Cash", "Cash App"],
      quantity: 1,
      sellerNote: "Pending with buyer through lunch.",
      holdFor: "Daniela",
      buyerName: "Daniela",
      buyerContact: "(863) 555-0108",
      tags: ["tools", "yard", "bundle"],
      questions: [],
      timeline: [
        {
          id: makeId("t"),
          time: "8:05 AM",
          title: "Item listed",
          detail: "Tool bundle posted live.",
        },
        {
          id: makeId("t"),
          time: "8:42 AM",
          title: "Hold placed",
          detail: "Bundle pending for Daniela until noon.",
        },
      ],
    },
    {
      id: "sale_4",
      title: "Vintage Lamp Pair",
      category: "Home",
      stage: "Sold",
      price: 30,
      photoUrl:
        "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80",
      description:
        "Matching lamp pair. Works fine. Good for side tables or guest room setup.",
      condition: "Good",
      pickupArea: "Okeechobee • Front porch pickup",
      paymentMethods: ["Cash", "Cash App"],
      quantity: 2,
      sellerNote: "Buyer paid through Cash App.",
      buyerName: "Rachel",
      buyerContact: "(772) 555-0114",
      tags: ["lamp", "pair", "home"],
      questions: [],
      timeline: [
        {
          id: makeId("t"),
          time: "7:48 AM",
          title: "Item listed",
          detail: "Lamp pair added with payment options.",
        },
        {
          id: makeId("t"),
          time: "8:20 AM",
          title: "Marked sold",
          detail: "Buyer sent payment and confirmed pickup.",
        },
      ],
    },
    {
      id: "sale_5",
      title: "Folding Chairs Set of 4",
      category: "Outdoor",
      stage: "Pickup Complete",
      price: 20,
      photoUrl:
        "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1200&q=80",
      description:
        "Four clean folding chairs. Great for events, cookouts, or extra seating.",
      condition: "Good",
      pickupArea: "Okeechobee • Garage pickup",
      paymentMethods: ["Cash", "Zelle"],
      quantity: 4,
      sellerNote: "Buyer already picked up.",
      buyerName: "Chris",
      buyerContact: "(863) 555-0122",
      tags: ["chairs", "folding", "event"],
      questions: [],
      timeline: [
        {
          id: makeId("t"),
          time: "7:30 AM",
          title: "Item listed",
          detail: "Chair set posted to board.",
        },
        {
          id: makeId("t"),
          time: "8:16 AM",
          title: "Pickup complete",
          detail: "Buyer arrived and loaded chairs.",
        },
      ],
    },
  ];
}

export default function CommunitySaleBoard() {
  const [items, setItems] = useState<SaleItem[]>(() => seedItems());
  const [selectedItemId, setSelectedItemId] = useState<string>(() => seedItems()[0]?.id || "");
  const [showLanes, setShowLanes] = useState(true);
  const [summaryOpen, setSummaryOpen] = useState(true);
  const [quickTagText, setQuickTagText] = useState("");
  const [paymentHandle, setPaymentHandle] = useState("$yourcashapp");
  const [eventTitle, setEventTitle] = useState("Community Sale Board");
  const [eventSubtitle, setEventSubtitle] = useState(
    "Photos, prices, sold status, pickup notes, and payment links in one live board."
  );

  const stages: SaleStage[] = useMemo(
    () => ["New Listings", "Questions", "Hold / Pending", "Sold", "Pickup Complete"],
    []
  );

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedItemId) || items[0] || null,
    [items, selectedItemId]
  );

  const itemsByStage = useMemo(() => {
    const map = new Map<SaleStage, SaleItem[]>();
    for (const stage of stages) map.set(stage, []);
    for (const item of items) map.get(item.stage)?.push(item);
    return map;
  }, [items, stages]);

  const listedCount = items.filter((item) => item.stage === "New Listings").length;
  const questionCount = items.reduce((sum, item) => sum + item.questions.filter((q) => q.status === "open").length, 0);
  const soldCount = items.filter(
    (item) => item.stage === "Sold" || item.stage === "Pickup Complete"
  ).length;
  const soldValue = items
    .filter((item) => item.stage === "Sold" || item.stage === "Pickup Complete")
    .reduce((sum, item) => sum + item.price, 0);

  function updateItem(itemId: string, patch: Partial<SaleItem>) {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, ...patch } : item))
    );
  }

  function updateSelected(patch: Partial<SaleItem>) {
    if (!selectedItem) return;
    updateItem(selectedItem.id, patch);
  }

  function addItem() {
    const next: SaleItem = {
      id: makeId("sale"),
      title: "New Item",
      category: "Other",
      stage: "New Listings",
      price: 10,
      photoUrl:
        "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1200&q=80",
      description: "Add photos, price, payment options, and pickup details.",
      condition: "Good",
      pickupArea: "Okeechobee • Pickup area",
      paymentMethods: ["Cash", "Cash App"],
      quantity: 1,
      sellerNote: "",
      tags: [],
      questions: [],
      timeline: [
        {
          id: makeId("t"),
          time: "Now",
          title: "Item listed",
          detail: "New sale item added to board.",
        },
      ],
    };

    setItems((prev) => [next, ...prev]);
    setSelectedItemId(next.id);
  }

  function addQuestion() {
    if (!selectedItem) return;

    const nextQuestion: SaleQuestion = {
      id: makeId("q"),
      from: "New buyer",
      text: "Is this still available?",
      time: "Now",
      status: "open",
    };

    updateSelected({
      questions: [nextQuestion, ...selectedItem.questions],
      stage: selectedItem.stage === "New Listings" ? "Questions" : selectedItem.stage,
      timeline: [
        {
          id: makeId("t"),
          time: "Now",
          title: "Question received",
          detail: "Buyer asked about availability.",
        },
        ...selectedItem.timeline,
      ],
    });
  }

  function addTimelineEvent() {
    if (!selectedItem) return;

    updateSelected({
      timeline: [
        {
          id: makeId("t"),
          time: "Now",
          title: "Seller update",
          detail: "Manual board update added.",
        },
        ...selectedItem.timeline,
      ],
    });
  }

  function addQuickTags() {
    if (!selectedItem) return;

    const nextTags = quickTagText
      .split(/[\n,]/g)
      .map((x) => x.trim())
      .filter(Boolean);

    if (nextTags.length === 0) return;

    updateSelected({
      tags: Array.from(new Set([...(selectedItem.tags || []), ...nextTags])),
    });
    setQuickTagText("");
  }

  function toggleQuestionStatus(questionId: string) {
    if (!selectedItem) return;

    updateSelected({
      questions: selectedItem.questions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              status: question.status === "open" ? "answered" : "open",
            }
          : question
      ),
    });
  }

  function removeQuestion(questionId: string) {
    if (!selectedItem) return;

    updateSelected({
      questions: selectedItem.questions.filter((question) => question.id !== questionId),
    });
  }

  function removeTimelineEvent(eventId: string) {
    if (!selectedItem) return;

    updateSelected({
      timeline: selectedItem.timeline.filter((event) => event.id !== eventId),
    });
  }

  function removeTag(tag: string) {
    if (!selectedItem) return;
    updateSelected({
      tags: selectedItem.tags.filter((x) => x !== tag),
    });
  }

  return (
    <div className="min-h-screen bg-[#07111b] text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(217,70,239,0.08),_transparent_24%)]" />

        <div className="relative mx-auto max-w-[1680px] px-4 py-5 md:px-6 md:py-6">
          <header className="mb-4 rounded-[28px] border border-white/10 bg-white/[0.05] p-4 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0">
                <div className="mb-2 inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-200">
                  Community Demo
                </div>

                <input
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full max-w-3xl bg-transparent text-[32px] font-semibold tracking-tight text-white outline-none md:text-[40px]"
                />

                <textarea
                  value={eventSubtitle}
                  onChange={(e) => setEventSubtitle(e.target.value)}
                  rows={2}
                  className="mt-2 w-full max-w-3xl resize-none bg-transparent text-sm leading-7 text-white/65 outline-none md:text-base"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowLanes((v) => !v)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10"
                >
                  {showLanes ? "Hide Lanes" : "Show Lanes"}
                </button>

                <button
                  type="button"
                  onClick={addItem}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10"
                >
                  + Add Item
                </button>

                <button
                  type="button"
                  onClick={() => copyToClipboard(buildEventSummary(items))}
                  className="rounded-2xl border border-cyan-400/30 bg-cyan-500/12 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/18"
                >
                  Copy Event Summary
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
              <MetricCard
                label="New Listings"
                value={String(listedCount)}
                helper="Fresh items live"
              />
              <MetricCard
                label="Open Questions"
                value={String(questionCount)}
                helper="Buyer follow-up"
              />
              <MetricCard
                label="Sold Items"
                value={String(soldCount)}
                helper="Marked sold"
              />
              <MetricCard
                label="Sold Value"
                value={`$${soldValue.toFixed(0)}`}
                helper="Closed sales"
              />
            </div>
          </header>

          {showLanes ? (
            <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
              {stages.map((stage) => {
                const tone = stageTone(stage);
                const list = itemsByStage.get(stage) || [];

                return (
                  <section
                    key={stage}
                    className={cn(
                      "rounded-[24px] border border-white/10 bg-white/[0.05] shadow-xl shadow-black/20 backdrop-blur",
                      tone.lane,
                      "border-l-4"
                    )}
                  >
                    <div className="flex items-center justify-between border-b border-white/10 p-3">
                      <div className="text-sm font-extrabold text-white">{stage}</div>
                      <div className={cn("rounded-full border px-2 py-0.5 text-xs font-bold", tone.pill)}>
                        {list.length}
                      </div>
                    </div>

                    <div className="space-y-2 p-2">
                      {list.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-white/10 bg-black/10 px-3 py-6 text-sm text-white/30">
                          No items
                        </div>
                      ) : null}

                      {list.map((item) => {
                        const isSelected = selectedItem?.id === item.id;

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setSelectedItemId(item.id)}
                            className={cn(
                              "w-full rounded-[18px] border p-3 text-left transition",
                              isSelected
                                ? "border-cyan-400/40 bg-cyan-500/10"
                                : "border-white/10 bg-[#111d2e] hover:bg-[#152338]"
                            )}
                          >
                            <div className="aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-black/10">
                              <img
                                src={item.photoUrl}
                                alt={item.title}
                                className="h-full w-full object-cover"
                              />
                            </div>

                            <div className="mt-3 flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <div className="truncate text-sm font-bold text-white">
                                  {item.title}
                                </div>
                                <div className="mt-1 text-xs text-white/55">
                                  {item.pickupArea}
                                </div>
                              </div>

                              <div className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-2 py-0.5 text-[11px] font-extrabold text-cyan-100">
                                {priceLabel(item.price)}
                              </div>
                            </div>

                            <div className="mt-2 flex items-center gap-2">
                              <span
                                className={cn(
                                  "rounded-full border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.14em]",
                                  categoryTone(item.category)
                                )}
                              >
                                {item.category}
                              </span>

                              {item.featured ? (
                                <span className="rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-fuchsia-100">
                                  Featured
                                </span>
                              ) : null}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          ) : null}

          <div className="rounded-[28px] border border-white/10 bg-white/[0.05] shadow-2xl shadow-black/20 backdrop-blur">
            <div className="flex flex-col gap-2 border-b border-white/10 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-lg font-extrabold text-white">Sale Console</div>
                <div className="text-xs text-white/55">
                  Photos, prices, buyer questions, payment links, sold status, and pickup coordination
                </div>
              </div>

              {selectedItem ? (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(buildItemShareText(selectedItem))}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-bold text-white/90 transition hover:bg-white/10"
                  >
                    Copy Item Text
                  </button>

                  <button
                    type="button"
                    onClick={addQuestion}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-bold text-white/90 transition hover:bg-white/10"
                  >
                    Add Buyer Question
                  </button>

                  <button
                    type="button"
                    onClick={addTimelineEvent}
                    className="rounded-xl border border-cyan-400/30 bg-cyan-500/12 px-3 py-2 text-sm font-bold text-cyan-100 transition hover:bg-cyan-500/18"
                  >
                    Add Seller Update
                  </button>
                </div>
              ) : null}
            </div>

            {!selectedItem ? (
              <div className="p-4 text-sm text-white/55">Select an item to open the drawer.</div>
            ) : (
              <div className="grid grid-cols-1 gap-4 p-4 xl:grid-cols-[1.05fr_1fr_1fr]">
                <div className="space-y-4">
                  <section className="rounded-[24px] border border-white/10 bg-[#0c1623] p-4">
                    <div className="aspect-[4/3] overflow-hidden rounded-[20px] border border-white/10 bg-black/10">
                      <img
                        src={selectedItem.photoUrl}
                        alt={selectedItem.title}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <InfoCard label="Price" value={priceLabel(selectedItem.price)} />
                      <InfoCard label="Status" value={selectedItem.stage} />
                      <InfoCard label="Category" value={selectedItem.category} />
                      <InfoCard label="Qty" value={String(selectedItem.quantity)} />
                    </div>
                  </section>

                  <section className="rounded-[24px] border border-white/10 bg-[#0c1623] p-4">
                    <div className="text-sm font-extrabold text-white">Item Details</div>

                    <div className="mt-3 space-y-3">
                      <FieldLabel label="Title">
                        <input
                          value={selectedItem.title}
                          onChange={(e) => updateSelected({ title: e.target.value })}
                          className="mt-1 w-full rounded-xl border border-white/10 bg-[#111d2e] px-3 py-2 text-white outline-none"
                        />
                      </FieldLabel>

                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <FieldLabel label="Price">
                          <input
                            type="number"
                            value={selectedItem.price}
                            onChange={(e) =>
                              updateSelected({ price: Number(e.target.value || 0) })
                            }
                            className="mt-1 w-full rounded-xl border border-white/10 bg-[#111d2e] px-3 py-2 text-white outline-none"
                          />
                        </FieldLabel>

                        <FieldLabel label="Quantity">
                          <input
                            type="number"
                            value={selectedItem.quantity}
                            onChange={(e) =>
                              updateSelected({ quantity: Number(e.target.value || 1) })
                            }
                            className="mt-1 w-full rounded-xl border border-white/10 bg-[#111d2e] px-3 py-2 text-white outline-none"
                          />
                        </FieldLabel>
                      </div>

                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <FieldLabel label="Category">
                          <select
                            value={selectedItem.category}
                            onChange={(e) =>
                              updateSelected({ category: e.target.value as ItemCategory })
                            }
                            className="mt-1 w-full rounded-xl border border-white/10 bg-[#111d2e] px-3 py-2 text-white outline-none"
                          >
                            {[
                              "Furniture",
                              "Home",
                              "Kids",
                              "Tools",
                              "Electronics",
                              "Clothing",
                              "Outdoor",
                              "Other",
                            ].map((category) => (
                              <option key={category} value={category} className="text-black">
                                {category}
                              </option>
                            ))}
                          </select>
                        </FieldLabel>

                        <FieldLabel label="Stage">
                          <select
                            value={selectedItem.stage}
                            onChange={(e) =>
                              updateSelected({ stage: e.target.value as SaleStage })
                            }
                            className="mt-1 w-full rounded-xl border border-white/10 bg-[#111d2e] px-3 py-2 text-white outline-none"
                          >
                            {stages.map((stage) => (
                              <option key={stage} value={stage} className="text-black">
                                {stage}
                              </option>
                            ))}
                          </select>
                        </FieldLabel>
                      </div>

                      <FieldLabel label="Condition">
                        <input
                          value={selectedItem.condition}
                          onChange={(e) => updateSelected({ condition: e.target.value })}
                          className="mt-1 w-full rounded-xl border border-white/10 bg-[#111d2e] px-3 py-2 text-white outline-none"
                        />
                      </FieldLabel>

                      <FieldLabel label="Photo URL">
                        <input
                          value={selectedItem.photoUrl}
                          onChange={(e) => updateSelected({ photoUrl: e.target.value })}
                          className="mt-1 w-full rounded-xl border border-white/10 bg-[#111d2e] px-3 py-2 text-white outline-none"
                        />
                      </FieldLabel>

                      <FieldLabel label="Description">
                        <textarea
                          value={selectedItem.description}
                          onChange={(e) => updateSelected({ description: e.target.value })}
                          rows={5}
                          className="mt-1 w-full rounded-xl border border-white/10 bg-[#111d2e] px-3 py-2 text-white outline-none"
                        />
                      </FieldLabel>

                      <FieldLabel label="Pickup Area">
                        <input
                          value={selectedItem.pickupArea}
                          onChange={(e) => updateSelected({ pickupArea: e.target.value })}
                          className="mt-1 w-full rounded-xl border border-white/10 bg-[#111d2e] px-3 py-2 text-white outline-none"
                        />
                      </FieldLabel>

                      <FieldLabel label="Seller Note">
                        <textarea
                          value={selectedItem.sellerNote}
                          onChange={(e) => updateSelected({ sellerNote: e.target.value })}
                          rows={4}
                          className="mt-1 w-full rounded-xl border border-white/10 bg-[#111d2e] px-3 py-2 text-white outline-none"
                        />
                      </FieldLabel>

                      <div className="rounded-[20px] border border-white/10 bg-[#111d2e] p-3">
                        <div className="text-xs font-bold uppercase tracking-[0.14em] text-cyan-200/80">
                          Payment + Buyer
                        </div>

                        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                          <FieldLabel label="Buyer Name">
                            <input
                              value={selectedItem.buyerName || ""}
                              onChange={(e) => updateSelected({ buyerName: e.target.value })}
                              className="mt-1 w-full rounded-xl border border-white/10 bg-[#162136] px-3 py-2 text-white outline-none"
                            />
                          </FieldLabel>

                          <FieldLabel label="Buyer Contact">
                            <input
                              value={selectedItem.buyerContact || ""}
                              onChange={(e) =>
                                updateSelected({ buyerContact: e.target.value })
                              }
                              className="mt-1 w-full rounded-xl border border-white/10 bg-[#162136] px-3 py-2 text-white outline-none"
                            />
                          </FieldLabel>

                          <FieldLabel label="Hold For">
                            <input
                              value={selectedItem.holdFor || ""}
                              onChange={(e) => updateSelected({ holdFor: e.target.value })}
                              className="mt-1 w-full rounded-xl border border-white/10 bg-[#162136] px-3 py-2 text-white outline-none"
                            />
                          </FieldLabel>

                          <FieldLabel label="Cash App / Payment Handle">
                            <input
                              value={paymentHandle}
                              onChange={(e) => setPaymentHandle(e.target.value)}
                              className="mt-1 w-full rounded-xl border border-white/10 bg-[#162136] px-3 py-2 text-white outline-none"
                            />
                          </FieldLabel>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {(["Cash App", "Zelle", "Venmo", "Cash", "Other"] as PaymentMethod[]).map(
                            (method) => {
                              const active = selectedItem.paymentMethods.includes(method);

                              return (
                                <button
                                  key={method}
                                  type="button"
                                  onClick={() =>
                                    updateSelected({
                                      paymentMethods: active
                                        ? selectedItem.paymentMethods.filter((x) => x !== method)
                                        : [...selectedItem.paymentMethods, method],
                                    })
                                  }
                                  className={cn(
                                    "rounded-full border px-3 py-1.5 text-xs font-extrabold transition",
                                    active
                                      ? "border-cyan-400/30 bg-cyan-500/10 text-cyan-100"
                                      : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10"
                                  )}
                                >
                                  {method}
                                </button>
                              );
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  </section>
                </div>

                <div className="space-y-4">
                  <section className="rounded-[24px] border border-white/10 bg-[#0c1623] p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-extrabold text-white">Buyer Questions</div>
                      <div className="rounded-full border border-amber-300/30 bg-amber-400/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-amber-100">
                        {selectedItem.questions.filter((q) => q.status === "open").length} Open
                      </div>
                    </div>

                    <div className="mt-3 space-y-2">
                      {selectedItem.questions.length === 0 ? (
                        <div className="rounded-xl border border-white/10 bg-[#111d2e] p-3 text-sm text-white/55">
                          No buyer questions yet.
                        </div>
                      ) : null}

                      {selectedItem.questions.map((question) => (
                        <div
                          key={question.id}
                          className="rounded-xl border border-white/10 bg-[#111d2e] p-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="text-sm font-bold text-white">{question.from}</div>
                              <div className="mt-1 text-sm text-white/70">{question.text}</div>
                              <div className="mt-2 text-xs text-white/45">{question.time}</div>
                            </div>

                            <div className="flex flex-col gap-2">
                              <button
                                type="button"
                                onClick={() => toggleQuestionStatus(question.id)}
                                className={cn(
                                  "rounded-xl border px-3 py-1.5 text-xs font-extrabold transition",
                                  question.status === "open"
                                    ? "border-amber-300/30 bg-amber-400/10 text-amber-100"
                                    : "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
                                )}
                              >
                                {question.status === "open" ? "Open" : "Answered"}
                              </button>

                              <button
                                type="button"
                                onClick={() => removeQuestion(question.id)}
                                className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-extrabold text-white/85 transition hover:bg-white/10"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="rounded-[24px] border border-white/10 bg-[#0c1623] p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-extrabold text-white">Tags + Search Hooks</div>
                      <button
                        type="button"
                        onClick={addQuickTags}
                        className="rounded-xl border border-cyan-400/30 bg-cyan-500/12 px-3 py-2 text-xs font-extrabold text-cyan-100 transition hover:bg-cyan-500/18"
                      >
                        Add Tags
                      </button>
                    </div>

                    <textarea
                      value={quickTagText}
                      onChange={(e) => setQuickTagText(e.target.value)}
                      rows={3}
                      placeholder="wood, table, porch, kid item, electronics"
                      className="mt-3 w-full rounded-xl border border-white/10 bg-[#111d2e] px-3 py-2 text-sm text-white outline-none placeholder:text-white/30"
                    />

                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedItem.tags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-3 py-1.5 text-xs font-extrabold text-fuchsia-100 transition hover:bg-fuchsia-500/18"
                        >
                          #{tag} ×
                        </button>
                      ))}
                    </div>
                  </section>

                  <section className="rounded-[24px] border border-white/10 bg-[#0c1623] p-4">
                    <div className="text-sm font-extrabold text-white">Seller Timeline</div>

                    <div className="mt-3 space-y-2">
                      {selectedItem.timeline.length === 0 ? (
                        <div className="rounded-xl border border-white/10 bg-[#111d2e] p-3 text-sm text-white/55">
                          No seller updates yet.
                        </div>
                      ) : null}

                      {selectedItem.timeline.map((event) => (
                        <div
                          key={event.id}
                          className="rounded-xl border border-white/10 bg-[#111d2e] p-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="text-xs font-bold uppercase tracking-[0.14em] text-cyan-200/80">
                                {event.time}
                              </div>
                              <div className="mt-1 text-sm font-extrabold text-white">
                                {event.title}
                              </div>
                              <div className="mt-1 text-sm text-white/70">
                                {event.detail}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeTimelineEvent(event.id)}
                              className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-extrabold text-white/85 transition hover:bg-white/10"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="space-y-4">
                  <section className="rounded-[24px] border border-white/10 bg-[#0c1623] p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-extrabold text-white">Item Summary Preview</div>
                      <button
                        type="button"
                        onClick={() => setSummaryOpen((v) => !v)}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold text-white/85 transition hover:bg-white/10"
                      >
                        {summaryOpen ? "Hide" : "Show"}
                      </button>
                    </div>

                    {summaryOpen ? (
                      <>
                        <textarea
                          value={buildItemShareText(selectedItem)}
                          readOnly
                          rows={16}
                          className="mt-3 w-full rounded-xl border border-white/10 bg-[#0b1422] px-3 py-2 text-xs text-white outline-none"
                        />

                        <div className="mt-2 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => copyToClipboard(buildItemShareText(selectedItem))}
                            className="rounded-xl border border-cyan-400/30 bg-cyan-500/12 px-3 py-2 text-xs font-extrabold text-cyan-100 transition hover:bg-cyan-500/18"
                          >
                            Copy Item Summary
                          </button>
                        </div>
                      </>
                    ) : null}
                  </section>

                  <section className="rounded-[24px] border border-white/10 bg-[#0c1623] p-4">
                    <div className="text-sm font-extrabold text-white">Quick Payment + Pickup</div>

                    <div className="mt-3 rounded-[20px] border border-white/10 bg-[#111d2e] p-3">
                      <div className="text-xs font-bold uppercase tracking-[0.14em] text-cyan-200/80">
                        Suggested Share Block
                      </div>

                      <div className="mt-3 space-y-2 text-sm text-white/75">
                        <div>
                          <span className="text-cyan-200/80">Item:</span> {selectedItem.title}
                        </div>
                        <div>
                          <span className="text-cyan-200/80">Price:</span> {priceLabel(selectedItem.price)}
                        </div>
                        <div>
                          <span className="text-cyan-200/80">Pickup:</span> {selectedItem.pickupArea}
                        </div>
                        <div>
                          <span className="text-cyan-200/80">Payment:</span>{" "}
                          {paymentSummary(selectedItem.paymentMethods)}
                        </div>
                        <div>
                          <span className="text-cyan-200/80">Cash App:</span> {paymentHandle}
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="rounded-[24px] border border-white/10 bg-[#0c1623] p-4">
                    <div className="text-sm font-extrabold text-white">What This Board Can Sell</div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <MiniInfo title="Yard Sale" text="Household items, tools, furniture" />
                      <MiniInfo title="Church Sale" text="Donation tables, pickup flow" />
                      <MiniInfo title="Vendor Event" text="Booth items, questions, payment" />
                      <MiniInfo title="Fundraiser" text="Live listings with sold status" />
                    </div>
                  </section>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0c1623] p-3">
      <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-200/80">
        {label}
      </div>
      <div className="mt-2 text-2xl font-extrabold text-white">{value}</div>
      <div className="mt-1 text-xs text-white/45">{helper}</div>
    </div>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#162136] p-3">
      <div className="text-xs text-cyan-200/80">{label}</div>
      <div className="mt-1 text-sm font-bold text-white">{value}</div>
    </div>
  );
}

function FieldLabel({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-xs font-bold text-cyan-200/80">{label}</div>
      {children}
    </div>
  );
}

function MiniInfo({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#111d2e] p-3">
      <div className="text-sm font-bold text-white">{title}</div>
      <div className="mt-1 text-xs text-white/55">{text}</div>
    </div>
  );
}