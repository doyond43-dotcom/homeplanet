import {
  Bell,
  Calendar,
  Camera,
  Clapperboard,
  Dot,
  ExternalLink,
  Gamepad2,
  Headphones,
  MessageSquare,
  Mic,
  Monitor,
  Package,
  Pin,
  Radio,
  Smartphone,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

type QuickAction = {
  label: string;
  detail: string;
  icon: typeof Clapperboard;
  tone: string;
};

type MomentItem = {
  time: string;
  title: string;
  detail: string;
  tone: string;
};

const quickActions: QuickAction[] = [
  {
    label: "Clip That",
    detail: "Mark this moment for highlights",
    icon: Clapperboard,
    tone:
      "from-fuchsia-500/18 via-fuchsia-400/10 to-transparent border-fuchsia-400/25 text-fuchsia-100",
  },
  {
    label: "Pin Moment",
    detail: "Send the best part to your page",
    icon: Pin,
    tone:
      "from-cyan-500/18 via-cyan-400/10 to-transparent border-cyan-400/25 text-cyan-100",
  },
  {
    label: "Drop Product",
    detail: "Push merch, gear, or a live link",
    icon: Package,
    tone:
      "from-amber-500/18 via-amber-400/10 to-transparent border-amber-400/25 text-amber-100",
  },
  {
    label: "Accept Booking",
    detail: "Take commissions, collabs, or requests",
    icon: Calendar,
    tone:
      "from-emerald-500/18 via-emerald-400/10 to-transparent border-emerald-400/25 text-emerald-100",
  },
];

const momentItems: MomentItem[] = [
  {
    time: "2m ago",
    title: "Clip saved",
    detail: "Boss fight reaction marked for edit",
    tone: "border-fuchsia-400/20 bg-fuchsia-500/10 text-fuchsia-100",
  },
  {
    time: "5m ago",
    title: "Custom request received",
    detail: "Viewer asked for a commissioned logo reveal",
    tone: "border-cyan-400/20 bg-cyan-500/10 text-cyan-100",
  },
  {
    time: "8m ago",
    title: "Drop pushed live",
    detail: "New product link pinned during stream",
    tone: "border-amber-400/20 bg-amber-500/10 text-amber-100",
  },
  {
    time: "11m ago",
    title: "Booking captured",
    detail: "Saturday event styling inquiry submitted",
    tone: "border-emerald-400/20 bg-emerald-500/10 text-emerald-100",
  },
];

const pulseStats = [
  {
    label: "Live viewers",
    value: "128",
    icon: Users,
    accent: "text-rose-200",
  },
  {
    label: "Chat pulse",
    value: "22",
    icon: MessageSquare,
    accent: "text-cyan-200",
  },
  {
    label: "Moments saved",
    value: "07",
    icon: Sparkles,
    accent: "text-fuchsia-200",
  },
  {
    label: "Drops ready",
    value: "03",
    icon: Zap,
    accent: "text-amber-200",
  },
];

const channelCards = [
  {
    label: "Current mode",
    value: "Open Stream",
    icon: Radio,
  },
  {
    label: "Featured lane",
    value: "Live Clips + Drops",
    icon: Camera,
  },
  {
    label: "Creator station",
    value: "Phone + Desktop Active",
    icon: Monitor,
  },
];

export default function CreatorCommandDeck() {
  return (
    <section className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[#050816] px-4 py-5 text-white shadow-[0_30px_120px_rgba(0,0,0,0.45)] sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(236,72,153,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.10),transparent_28%),radial-gradient(circle_at_bottom,rgba(245,158,11,0.10),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      <div className="relative z-10 space-y-5 lg:space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-400/25 bg-rose-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-rose-100">
              <Dot className="h-4 w-4 fill-current stroke-none" />
              Creator Command Deck
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-[2.2rem]">
                Stream from your phone. Run your creator world from your desktop.
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-white/68 sm:text-[15px]">
                This is the holy-shit zone. Go live on mobile, watch your channel
                move in real time, capture moments, push drops, accept bookings,
                and keep your creator timeline alive without bouncing between five
                different apps.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {pulseStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="min-w-[120px] rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3 backdrop-blur"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <Icon className={`h-4 w-4 ${stat.accent}`} />
                    <span className="text-[10px] uppercase tracking-[0.24em] text-white/40">
                      live
                    </span>
                  </div>
                  <div className="text-lg font-semibold text-white">{stat.value}</div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/48">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.28em] text-white/45">
                  Mobile live rig
                </div>
                <div className="mt-1 text-lg font-semibold text-white">
                  Phone-on-tripod stream view
                </div>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-rose-400/25 bg-rose-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-100">
                <Dot className="h-4 w-4 fill-current stroke-none" />
                Live
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative w-full max-w-[290px] rounded-[36px] border border-white/10 bg-[#090d1d] p-2 shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
                <div className="absolute left-1/2 top-2 h-1.5 w-20 -translate-x-1/2 rounded-full bg-white/10" />
                <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[#0a0f22]">
                  <div className="flex items-center justify-between border-b border-white/10 bg-black/20 px-3 py-2">
                    <div className="inline-flex items-center gap-2 rounded-full border border-rose-400/25 bg-rose-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-100">
                      <Dot className="h-3.5 w-3.5 fill-current stroke-none" />
                      Streaming
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.22em] text-white/48">
                      portrait cam
                    </div>
                  </div>

                  <div className="relative aspect-[9/16] bg-[radial-gradient(circle_at_top,rgba(244,63,94,0.16),transparent_28%),radial-gradient(circle_at_center,rgba(59,130,246,0.14),transparent_38%),linear-gradient(180deg,#10172f_0%,#090d1b_100%)]">
                    <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/55 to-transparent" />

                    <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/35 px-2.5 py-1 text-[10px] font-medium text-white/88 backdrop-blur">
                      <Users className="h-3.5 w-3.5 text-rose-200" />
                      128 watching
                    </div>

                    <div className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/35 px-2.5 py-1 text-[10px] font-medium text-white/88 backdrop-blur">
                      <Bell className="h-3.5 w-3.5 text-cyan-200" />
                      Chat pulse
                    </div>

                    <div className="absolute inset-x-5 bottom-4 space-y-3">
                      <div className="rounded-2xl border border-white/10 bg-black/35 p-3 backdrop-blur">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-xs uppercase tracking-[0.22em] text-white/45">
                              Stream title
                            </div>
                            <div className="mt-1 text-sm font-semibold text-white">
                              Late-night ranked grind + live drops
                            </div>
                          </div>
                          <Gamepad2 className="mt-0.5 h-4 w-4 text-fuchsia-200" />
                        </div>

                        <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] uppercase tracking-[0.18em] text-white/50">
                          <div className="rounded-xl border border-white/10 bg-white/[0.05] px-2 py-2 text-center">
                            <Mic className="mx-auto mb-1 h-3.5 w-3.5 text-white/72" />
                            mic hot
                          </div>
                          <div className="rounded-xl border border-white/10 bg-white/[0.05] px-2 py-2 text-center">
                            <Headphones className="mx-auto mb-1 h-3.5 w-3.5 text-white/72" />
                            monitor
                          </div>
                          <div className="rounded-xl border border-white/10 bg-white/[0.05] px-2 py-2 text-center">
                            <Smartphone className="mx-auto mb-1 h-3.5 w-3.5 text-white/72" />
                            mobile live
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-cyan-100">
                        Streaming from mobile • desktop board synced
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-4 sm:p-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.28em] text-white/45">
                  Desktop creator board
                </div>
                <div className="mt-1 text-lg font-semibold text-white">
                  Control surface for clips, drops, bookings, and channel motion
                </div>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-100">
                <Dot className="h-4 w-4 fill-current stroke-none" />
                Channel active
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-white/10 bg-[#0a0f20] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="space-y-3">
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.24em] text-white/40">
                        Stream title
                      </div>
                      <div className="mt-1 text-xl font-semibold text-white">
                        Ranked grind, live clip pulls, and midnight drop test
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {channelCards.map((card) => {
                        const Icon = card.icon;
                        return (
                          <div
                            key={card.label}
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/76"
                          >
                            <Icon className="h-3.5 w-3.5 text-white/62" />
                            <span className="text-white/45">{card.label}:</span>
                            <span className="font-medium text-white">{card.value}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:w-[380px]">
                    {quickActions.map((action) => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={action.label}
                          type="button"
                          className={`group rounded-2xl border bg-gradient-to-br px-3 py-3 text-left transition duration-200 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.07] ${action.tone}`}
                        >
                          <Icon className="mb-3 h-4 w-4 text-white" />
                          <div className="text-sm font-semibold text-white">
                            {action.label}
                          </div>
                          <div className="mt-1 text-[11px] leading-4 text-white/62">
                            {action.detail}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
                <div className="rounded-3xl border border-white/10 bg-[#0a0f20] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.24em] text-white/40">
                        Recent moments
                      </div>
                      <div className="mt-1 text-base font-semibold text-white">
                        Live timeline building in real time
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/46">
                      <Radio className="h-3.5 w-3.5 text-rose-200" />
                      synced
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {momentItems.map((item) => (
                      <div
                        key={`${item.time}-${item.title}`}
                        className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-3"
                      >
                        <div
                          className={`mt-0.5 rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${item.tone}`}
                        >
                          {item.time}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-white">
                            {item.title}
                          </div>
                          <div className="mt-1 text-sm leading-5 text-white/60">
                            {item.detail}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-[#0a0f20] p-4">
                  <div className="mb-3">
                    <div className="text-[11px] uppercase tracking-[0.24em] text-white/40">
                      Creator lane
                    </div>
                    <div className="mt-1 text-base font-semibold text-white">
                      Your stream station should feel like home
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-white">
                          Featured channel page
                        </div>
                        <ExternalLink className="h-4 w-4 text-white/45" />
                      </div>
                      <div className="mt-2 text-sm leading-5 text-white/60">
                        Watch your creator page move while you stream, clip, and
                        drop in real time.
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-white">
                        <Monitor className="h-4 w-4 text-cyan-200" />
                        Desktop view active
                      </div>
                      <div className="mt-2 text-sm leading-5 text-white/60">
                        Keep your channel up on desktop while mobile handles the
                        live camera and audience.
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-white">
                        <Package className="h-4 w-4 text-amber-200" />
                        Drops, bookings, and collabs
                      </div>
                      <div className="mt-2 text-sm leading-5 text-white/60">
                        Push merch, take requests, accept appointments, and keep
                        everything tied to one creator truth layer.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}