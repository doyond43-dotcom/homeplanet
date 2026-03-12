import { Routes, Route, Navigate, useParams } from "react-router-dom";

function WorkspaceHome() {
  return (
    <div className="min-h-screen bg-[#020617] p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="text-3xl font-black">Workspace Layer</div>

        <div className="mt-2 text-sm text-white/70">
          This is the private operations layer for HomePlanet tenants.
          Public planets live under <span className="font-mono">/planet</span>.
          Real business operations live under <span className="font-mono">/app</span>.
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-lg font-bold">AWNIT</div>
            <div className="mt-1 text-sm text-white/70">
              Door / window service workspace
            </div>
            <div className="mt-3 text-xs font-mono text-cyan-300">
              /app/awnit/board
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-lg font-bold">Wilding</div>
            <div className="mt-1 text-sm text-white/70">
              Screen repair operations workspace
            </div>
            <div className="mt-3 text-xs font-mono text-cyan-300">
              /app/wilding/board
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-lg font-bold">Mom's Kitchen</div>
            <div className="mt-1 text-sm text-white/70">
              Restaurant rush board workspace
            </div>
            <div className="mt-3 text-xs font-mono text-cyan-300">
              /app/moms-kitchen/board
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function WorkspaceBoard() {
  const { tenantSlug } = useParams();

  return (
    <div className="min-h-screen bg-[#020617] p-6 text-white">
      <div className="mx-auto max-w-6xl">

        <div className="text-3xl font-black">
          {tenantSlug} Workspace Board
        </div>

        <div className="mt-2 text-sm text-white/70">
          This is the private workspace shell for tenant operations.
          Real jobs, customers, notes, materials, and invoices will live here.
        </div>

        <div className="mt-6 rounded-xl border border-cyan-400/20 bg-cyan-500/10 p-5">
          <div className="text-sm font-bold text-cyan-200">
            Private Workspace Route
          </div>

          <div className="mt-2 text-sm text-cyan-100">
            Example route:
          </div>

          <div className="mt-2 font-mono text-xs text-cyan-200">
            /app/{tenantSlug}/board
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm font-bold">Jobs</div>
            <div className="mt-1 text-xs text-white/60">
              /app/{tenantSlug}/jobs
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm font-bold">Invoices</div>
            <div className="mt-1 text-xs text-white/60">
              /app/{tenantSlug}/invoices
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm font-bold">Admin</div>
            <div className="mt-1 text-xs text-white/60">
              /app/{tenantSlug}/admin
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function WorkspaceRoutes() {
  return (
    <Routes>
      <Route index element={<WorkspaceHome />} />

      <Route path=":tenantSlug">
        <Route path="board" element={<WorkspaceBoard />} />
      </Route>

      <Route path="*" element={<Navigate to="/city" replace />} />
    </Routes>
  );
}