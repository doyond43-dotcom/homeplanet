import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

type PresenceNodeType = "planet" | "city" | "residence";
type PresenceNodeStatus =
  | "live"
  | "active"
  | "protected"
  | "pending"
  | "alert"
  | "offline";

export type PresenceGridItem = {
  id: string;
  title: string;
  subtitle?: string;
  type: PresenceNodeType;
  status?: PresenceNodeStatus;
  route?: string;
  signal?: string;
  badge?: string;
  countLabel?: string;
};

type PresenceGridBoardProps = {
  title?: string;
  subtitle?: string;
  items?: PresenceGridItem[];
  onCellClick?: (item: PresenceGridItem) => void;
};

const DEFAULT_ITEMS: PresenceGridItem[] = [
  {
    id: "planet-creator",
    title: "Creator Planet",
    subtitle: "Launch systems and live boards",
    type: "planet",
    status: "live",
    route: "/planet/creator",
    signal: "System ready",
    badge: "PLANET",
    countLabel: "3 live zones",
  },
  {
    id: "planet-guardian",
    title: "Guardian Planet",
    subtitle: "Protected-side safety layer",
    type: "planet",
    status: "protected",
    route: "/planet/guardian",
    signal: "Protection active",
    badge: "PLANET",
    countLabel: "4 protected nodes",
  },
  {
    id: "planet-experience",
    title: "Experience Planet",
    subtitle: "Sessions, watch mode, outcomes",
    type: "planet",
    status: "active",
    route: "/planet/experience",
    signal: "Experience live",
    badge: "PLANET",
    countLabel: "2 active sessions",
  },
  {
    id: "city-creator",
    title: "Creator City",
    subtitle: "Business system intake and launchpad",
    type: "city",
    status: "active",
    route: "/planet/creator",
    signal: "City online",
    badge: "CITY",
    countLabel: "9 linked boards",
  },
  {
    id: "city-guardian",
    title: "Guardian City",
    subtitle: "Presence, activation, and public safety",
    type: "city",
    status: "protected",
    route: "/planet/guardian/presence",
    signal: "Safe zone live",
    badge: "CITY",
    countLabel: "6 guardian profiles",
  },
  {
    id: "city-payments",
    title: "Payments City",
    subtitle: "Live payment rails and proof",
    type: "city",
    status: "pending",
    route: "/planet/payments/node",
    signal: "Node ready",
    badge: "CITY",
    countLabel: "2 rails connected",
  },
  {
    id: "residence-doyon",
    title: "Doyon Residence",
    subtitle: "Household command layer",
    type: "residence",
    status: "active",
    route: "/planet/guardian",
    signal: "Residence active",
    badge: "RESIDENCE",
    countLabel: "3 members present",
  },
  {
    id: "residence-johnny",
    title: "Johnny Presence",
    subtitle: "Child Guardian profile",
    type: "residence",
    status: "protected",
    route: "/planet/guardian/child/child-1774970822139",
    signal: "Ready to share",
    badge: "RESIDENCE",
    countLabel: "Link live",
  },
  {
    id: "residence-safe",
    title: "Safe Residence",
    subtitle: "Truth layer + timeline anchor",
    type: "residence",
    status: "live",
    route: "/planet/guardian/presence",
    signal: "Origin locked",
    badge: "RESIDENCE",
    countLabel: "Timeline stable",
  },
];

const TYPE_STYLES: Record<
  PresenceNodeType,
  {
    border: string;
    glow: string;
    chip: string;
    chipBorder: string;
    accent: string;
    accentSoft: string;
    count: string;
  }
> = {
  planet: {
    border: "border-cyan-400/35",
    glow: "shadow-[0_0_0_1px_rgba(34,211,238,0.12),0_0_30px_rgba(34,211,238,0.10)]",
    chip: "bg-cyan-500/12",
    chipBorder: "border-cyan-300/25",
    accent: "text-cyan-300",
    accentSoft: "text-cyan-100/85",
    count: "text-cyan-200/90",
  },
  city: {
    border: "border-emerald-400/35",
    glow: "shadow-[0_0_0_1px_rgba(52,211,153,0.10),0_0_30px_rgba(52,211,153,0.08)]",
    chip: "bg-emerald-500/12",
    chipBorder: "border-emerald-300/25",
    accent: "text-emerald-300",
    accentSoft: "text-emerald-100/85",
    count: "text-emerald-200/90",
  },
  residence: {
    border: "border-amber-300/30",
    glow: "shadow-[0_0_0_1px_rgba(251,191,36,0.09),0_0_30px_rgba(245,158,11,0.08)]",
    chip: "bg-amber-400/10",
    chipBorder: "border-amber-200/20",
    accent: "text-amber-200",
    accentSoft: "text-amber-100/85",
    count: "text-amber-100/90",
  },
};

const STATUS_STYLES: Record<
  PresenceNodeStatus,
  {
    dot: string;
    pill: string;
    pillBorder: string;
    label: string;
    ring: string;
  }
> = {
  live: {
    dot: "bg-cyan-300",
    pill: "bg-cyan-500/12",
    pillBorder: "border-cyan-300/20",
    label: "text-cyan-200",
    ring: "group-hover:shadow-[0_0_22px_rgba(34,211,238,0.18)]",
  },
  active: {
    dot: "bg-emerald-300",
    pill: "bg-emerald-500/12",
    pillBorder: "border-emerald-300/20",
    label: "text-emerald-200",
    ring: "group-hover:shadow-[0_0_22px_rgba(52,211,153,0.18)]",
  },
  protected: {
    dot: "bg-violet-300",
    pill: "bg-violet-500/12",
    pillBorder: "border-violet-300/20",
    label: "text-violet-200",
    ring: "group-hover:shadow-[0_0_22px_rgba(167,139,250,0.18)]",
  },
  pending: {
    dot: "bg-amber-300",
    pill: "bg-amber-400/12",
    pillBorder: "border-amber-200/20",
    label: "text-amber-200",
    ring: "group-hover:shadow-[0_0_22px_rgba(251,191,36,0.18)]",
  },
  alert: {
    dot: "bg-rose-400",
    pill: "bg-rose-500/12",
    pillBorder: "border-rose-300/20",
    label: "text-rose-200",
    ring: "group-hover:shadow-[0_0_22px_rgba(251,113,133,0.20)]",
  },
  offline: {
    dot: "bg-slate-500",
    pill: "bg-slate-500/10",
    pillBorder: "border-white/10",
    label: "text-slate-300",
    ring: "group-hover:shadow-[0_0_18px_rgba(148,163,184,0.12)]",
  },
};

const GRID_ORDER: PresenceNodeType[] = [
  "planet",
  "planet",
  "planet",
  "city",
  "city",
  "city",
  "residence",
  "residence",
  "residence",
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function buildBoardItems(items?: PresenceGridItem[]) {
  const source = items && items.length ? items.slice(0, 9) : DEFAULT_ITEMS;

  if (source.length === 9) return source;

  const filled = [...source];

  while (filled.length < 9) {
    const nextIndex = filled.length;
    const type = GRID_ORDER[nextIndex];
    filled.push({
      id: `empty-${nextIndex}`,
      title:
        type === "planet"
          ? "Open Planet"
          : type === "city"
            ? "Open City"
            : "Open Residence",
      subtitle: "Available slot",
      type,
      status: "offline",
      signal: "Unassigned",
      badge: type.toUpperCase(),
      countLabel: "Waiting",
    });
  }

  return filled;
}

function PresenceCell({
  item,
  onClick,
}: {
  item: PresenceGridItem;
  onClick: (item: PresenceGridItem) => void;
}) {
  const typeStyle = TYPE_STYLES[item.type];
  const statusStyle = STATUS_STYLES[item.status ?? "offline"];
  const isClickable = Boolean(item.route);

  return (
    <button
      type="button"
      onClick={() => onClick(item)}
      className={cx(
        "group relative flex min-h-[190px] w-full flex-col justify-between overflow-hidden rounded-[28px] border bg-[#071427]/95 p-4 text-left transition duration-200 sm:min-h-[210px] sm:p-5",
        typeStyle.border,
        typeStyle.glow,
        statusStyle.ring,
        isClickable
          ? "cursor-pointer hover:-translate-y-[2px] hover:border-white/20"
          : "cursor-default opacity-90"
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.06),transparent_32%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10" />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div
            className={cx(
              "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.28em]",
              typeStyle.chip,
              typeStyle.chipBorder,
              typeStyle.accent
            )}
          >
            <span
              className={cx("h-2 w-2 rounded-full", statusStyle.dot)}
              aria-hidden="true"
            />
            {item.badge ?? item.type}
          </div>
        </div>

        <div
          className={cx(
            "inline-flex shrink-0 items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em]",
            statusStyle.pill,
            statusStyle.pillBorder,
            statusStyle.label
          )}
        >
          <span className={cx("h-2 w-2 rounded-full", statusStyle.dot)} />
          {item.status ?? "offline"}
        </div>
      </div>

      <div className="relative z-10 mt-4 space-y-3">
        <div>
          <h3 className="text-[1.1rem] font-semibold leading-tight text-white sm:text-[1.25rem]">
            {item.title}
          </h3>
          {item.subtitle ? (
            <p className="mt-2 text-sm leading-relaxed text-slate-300 sm:text-[0.95rem]">
              {item.subtitle}
            </p>
          ) : null}
        </div>

        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-400">
          <span className={cx("h-2 w-2 rounded-full", statusStyle.dot)} />
          <span>{item.signal ?? "No signal"}</span>
        </div>
      </div>

      <div className="relative z-10 mt-5 flex items-end justify-between gap-3">
        <div className={cx("text-sm font-medium", typeStyle.count)}>
          {item.countLabel ?? "Open"}
        </div>

        <div className="text-xs uppercase tracking-[0.22em] text-white/55">
          {isClickable ? "Enter" : "Locked"}
        </div>
      </div>
    </button>
  );
}

export default function PresenceGridBoard({
  title = "Presence Grid Board",
  subtitle = "Planets, cities, and residences shown as a spatial system instead of one long browser-style line.",
  items,
  onCellClick,
}: PresenceGridBoardProps) {
  const navigate = useNavigate();

  const boardItems = useMemo(() => buildBoardItems(items), [items]);

  const handleCellClick = (item: PresenceGridItem) => {
    if (onCellClick) {
      onCellClick(item);
      return;
    }

    if (item.route) {
      navigate(item.route);
    }
  };

  return (
    <section className="relative overflow-hidden rounded-[34px] border border-cyan-400/20 bg-[#020817] px-4 py-5 shadow-[0_0_0_1px_rgba(34,211,238,0.05),0_20px_80px_rgba(2,8,23,0.75)] sm:px-6 sm:py-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.05),transparent_26%)]" />

      <div className="relative z-10 mb-5 flex flex-col gap-4 border-b border-white/8 pb-5">
        <div className="space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-[0.34em] text-cyan-300">
            HomePlanet Spatial Layer
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-[2rem]">
            {title}
          </h2>
          <p className="max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-[0.98rem]">
            {subtitle}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-200">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-300" />
            Planet layer
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-200">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
            City layer
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/20 bg-amber-400/10 px-3 py-1.5 text-xs font-medium text-amber-100">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            Residence layer
          </div>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {boardItems.map((item) => (
          <PresenceCell key={item.id} item={item} onClick={handleCellClick} />
        ))}
      </div>
    </section>
  );
}