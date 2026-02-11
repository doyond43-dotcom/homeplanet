import type { TenantTheme } from "../routes/tenantThemes";

export function TenantHeader({ theme }: { theme: TenantTheme }) {
  return (
    <div className="border-b border-slate-800 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold">
            {theme.brandName.split(" ").slice(0, 1).map(() => "TC")}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <div className="text-lg font-semibold leading-tight">{theme.brandName}</div>

              {/* Planet badge */}
              <span className="hidden sm:inline-flex items-center rounded-full border border-slate-700 bg-slate-950/40 px-2.5 py-1 text-[11px] text-slate-300">
                🪐 {theme.planetLabel}
              </span>
            </div>

            <div className="text-xs text-slate-400 leading-tight">{theme.locationLine}</div>
          </div>
        </div>

        {/* Tier badge */}
        {theme.tierLabel ? (
          <div className={`hidden sm:flex items-center gap-2 rounded-full border border-amber-400/60 bg-amber-400/10 px-3 py-1`}>
            <span className="inline-block h-2 w-2 rounded-full bg-amber-300" />
            <span className="text-xs font-medium text-amber-200">{theme.tierLabel}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
