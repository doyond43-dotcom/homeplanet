// LiveIntakeBoard.tsx
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams } from "react-router-dom";

type Row = {
  id: string;
  created_at: string;
  slug: string;
  payload: any;
  status: "new" | "in_progress" | "done";
};

type Employee = {
  id: string;
  shop_slug: string;
  employee_code: string;
  display_name: string;
  active: boolean;
  created_at?: string;
};

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export default function LiveIntakeBoard() {
  const { slug } = useParams();
  const shopSlug = (slug ?? "").trim();

  const [rows, setRows] = useState<Row[]>([]);
  const [active, setActive] = useState<Row | null>(null);

  // Employee identity (no login yet; code-based)
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [employeeCodeInput, setEmployeeCodeInput] = useState("");
  const [empErr, setEmpErr] = useState<string | null>(null);

  const canWork = useMemo(() => !!employee, [employee]);

  // LOAD ROWS
  async function load() {
    if (!shopSlug) return;

    const { data, error } = await supabase
      .from("public_intake_submissions")
      .select("*")
      .eq("slug", shopSlug)
      .neq("status", "done")
      .order("created_at", { ascending: false });

    if (error) {
      // keep silent-ish; you can surface if you want
      setRows([]);
      return;
    }

    setRows((data as any) || []);
  }

  // LOAD EMPLOYEES + AUTO-RESTORE CODE
  async function loadEmployees() {
    if (!shopSlug) return;

    const { data, error } = await supabase
      .from("shop_employees")
      .select("id, shop_slug, employee_code, display_name, active, created_at")
      .eq("shop_slug", shopSlug)
      .eq("active", true)
      .order("created_at", { ascending: true });

    if (error) {
      setEmployees([]);
      setEmpErr(error.message || "Failed to load employees");
      return;
    }

    const list = (data as any as Employee[]) ?? [];
    setEmployees(list);

    const saved = localStorage.getItem("hp_employee_code");
    if (saved) {
      const found = list.find((e) => e.employee_code === saved);
      if (found) setEmployee(found);
    }
  }

  // REALTIME + INITIAL LOAD
  useEffect(() => {
    load();
    loadEmployees();

    const channel = supabase
      .channel(`board:${shopSlug || "no-slug"}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "public_intake_submissions" },
        () => load()
      )
      .subscribe();

    return () => {
      try {
        supabase.removeChannel(channel);
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopSlug]);

  // EMPLOYEE PICK
  function pickEmployee() {
    setEmpErr(null);
    const code = employeeCodeInput.trim();

    if (!code) {
      setEmpErr("Enter a code.");
      return;
    }

    const found = employees.find((e) => e.employee_code === code);
    if (!found) {
      setEmpErr("Invalid employee code.");
      return;
    }

    localStorage.setItem("hp_employee_code", found.employee_code);
    setEmployee(found);
  }

  function clearEmployee() {
    localStorage.removeItem("hp_employee_code");
    setEmployee(null);
    setEmployeeCodeInput("");
    setEmpErr(null);
  }

  // UPDATE STATUS (stamps employee attribution)
  async function setStatus(row: Row, status: Row["status"]) {
    if (!canWork) return;

    await supabase
      .from("public_intake_submissions")
      .update({
        status,
        handled_by_employee_id: employee?.id ?? null,
        handled_by_employee_name: employee?.display_name ?? null,
        handled_by_employee_code: employee?.employee_code ?? null,
        status_updated_at: new Date().toISOString(),
      })
      .eq("id", row.id);

    setActive(null);
  }

  return (
    <div className="h-screen bg-slate-950 text-white flex">
      {/* EMPLOYEE CODE MODAL */}
      {!employee && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <div className="text-2xl font-extrabold">Employee Code</div>
            <div className="text-sm text-slate-300 mt-1">
              Enter your code to work this board. This stamps every action to you.
            </div>

            <div className="mt-4">
              <input
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-lg tracking-widest text-center outline-none focus:border-blue-500"
                placeholder="e.g. 1111"
                value={employeeCodeInput}
                onChange={(e) => setEmployeeCodeInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") pickEmployee();
                }}
              />

              {empErr && (
                <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                  {empErr}
                </div>
              )}

              <button
                className="mt-4 w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-3 font-bold"
                onClick={pickEmployee}
              >
                Start Shift
              </button>

              <div className="mt-4 text-xs text-slate-400">
                Active employees for <span className="text-slate-200 font-semibold">/{shopSlug || "no-slug"}</span>:{" "}
                {employees.length ? employees.map((e) => e.display_name).join(", ") : "none loaded"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LIST */}
      <div className="w-2/3 p-6 space-y-3 overflow-y-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-slate-300">
            Staff board: <span className="text-slate-100 font-semibold">/{shopSlug || "no-slug"}</span>
          </div>

          <div className="flex items-center gap-2">
            {employee ? (
              <>
                <div className="text-xs rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-slate-200">
                  Employee: <span className="font-semibold">{employee.display_name}</span>{" "}
                  <span className="text-slate-400">({employee.employee_code})</span>
                </div>
                <button
                  className="text-xs rounded-full border border-slate-700 bg-slate-900 px-3 py-1 hover:border-slate-500"
                  onClick={clearEmployee}
                  title="Switch employee"
                >
                  Switch
                </button>
              </>
            ) : (
              <div className="text-xs text-slate-400">Waiting for employee code…</div>
            )}
          </div>
        </div>

        {rows.map((r) => (
          <div
            key={r.id}
            onClick={() => setActive(r)}
            className="cursor-pointer rounded-xl border border-slate-800 bg-slate-900 p-4 hover:border-blue-400"
          >
            <div className="font-bold text-lg">{r.payload?.vehicle || "Vehicle"}</div>
            <div className="text-sm text-slate-300">{r.payload?.name || "Customer"}</div>
            <div className="text-xs text-slate-400 mt-1">{r.payload?.message}</div>

            <div className="mt-2 text-xs">
              Status:
              <span
                className={
                  r.status === "new"
                    ? "text-yellow-400"
                    : r.status === "in_progress"
                    ? "text-blue-400"
                    : "text-green-400"
                }
              >
                {" "}
                {r.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* DRAWER */}
      {active && (
        <div className="w-1/3 border-l border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-bold mb-2">{active.payload?.vehicle}</h2>
          <div className="text-sm text-slate-300 mb-6">{active.payload?.message}</div>

          {!employee && (
            <div className="mb-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-sm text-yellow-200">
              Enter employee code to take actions.
            </div>
          )}

          <div className="space-y-3">
            {active.status === "new" && (
              <button
                disabled={!canWork}
                className={`w-full p-3 rounded-xl ${
                  canWork ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-700 cursor-not-allowed"
                }`}
                onClick={() => setStatus(active, "in_progress")}
              >
                Start Job
              </button>
            )}

            {active.status !== "done" && (
              <button
                disabled={!canWork}
                className={`w-full p-3 rounded-xl ${
                  canWork ? "bg-green-600 hover:bg-green-700" : "bg-slate-700 cursor-not-allowed"
                }`}
                onClick={() => setStatus(active, "done")}
              >
                Finish Job
              </button>
            )}

            <button
              className="w-full bg-slate-700 hover:bg-slate-600 p-3 rounded-xl"
              onClick={() => setActive(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}