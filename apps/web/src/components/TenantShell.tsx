import * as React from "react";
import type { TenantTheme } from "../routes/tenantThemes";
import { TenantHeader } from "./TenantHeader";

export function TenantShell({
  theme,
  children,
  rightRail,
}: {
  theme: TenantTheme;
  children: React.ReactNode;
  rightRail?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <TenantHeader theme={theme} />

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 md:p-10 shadow">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-8">
            <div>{children}</div>
            <div className="space-y-4">{rightRail}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
