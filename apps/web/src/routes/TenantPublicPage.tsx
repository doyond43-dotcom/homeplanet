import * as React from "react";
import { useParams } from "react-router-dom";
import PublicPage from "./PublicPage";
import { getTenantTheme } from "./tenantThemes";
import { TenantShell } from "../components/TenantShell";

export default function TenantPublicPage() {
  const { slug } = useParams();
  const theme = getTenantTheme(slug);

  // No theme? Render the normal intake page exactly as before.
  if (!theme) return <PublicPage />;

  return (
    <TenantShell
      theme={theme}
      rightRail={
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
            <div className="text-sm font-semibold">Contact</div>
            <div className="mt-2 text-sm text-slate-300 space-y-1">
              <div>
                Phone: <span className="text-slate-200">{theme.phoneLabel ?? ""}</span>
              </div>
              <div>
                Address: <span className="text-slate-200">{theme.addressLabel ?? ""}</span>
              </div>
            </div>
            <div className="mt-3 text-xs text-slate-500">
              Uploads + notes become a clean, time-ordered intake trail you can reference later.
            </div>
          </div>

          <div className={`rounded-2xl border ${theme.accentBorderClass} ${theme.accentBgClass} p-4`}>
            <div className="text-sm font-semibold text-amber-200">Proof-ready workflow</div>
            <div className="mt-1 text-xs text-amber-100/90">
              Time-ordered record. Cleaner approvals. Fewer disputes.
            </div>
          </div>
        </div>
      }
    >
      <PublicPage />
    </TenantShell>
  );
}
