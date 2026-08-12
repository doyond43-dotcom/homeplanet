import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "./PerformancePowerboatsEstimatePage.css";

type EstimateProject = {
  id: string;
  project_type: string;
  customer_name: string;
  boat_year: string | null;
  boat_make_model: string | null;
  boat_length: string | null;
  boat_engines: string | null;
  customer_request: string | null;
  recommended_work: string | null;
  labor: any[];
  parts: any[];
  estimate_number: string | null;
  estimate_total: number | null;
  estimate_notes: string | null;
  estimate_status: string | null;
  estimate_sent_at: string | null;
  estimate_approved_at: string | null;
};

function boatLabel(project: EstimateProject) {
  return [
    project.boat_year,
    project.boat_make_model,
    project.boat_length,
    project.boat_engines,
  ]
    .filter(Boolean)
    .join(" · ");
}

function money(value: number | null) {
  if (value === null || value === undefined) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value));
}

function itemLabel(item: any) {
  if (typeof item === "string") return item;

  return (
    item?.description ||
    item?.name ||
    item?.item ||
    item?.title ||
    "Item"
  );
}

function itemAmount(item: any) {
  if (!item || typeof item !== "object") return null;

  const value =
    item.total ??
    item.amount ??
    item.price ??
    item.cost ??
    null;

  if (value === null || value === undefined || value === "") return null;

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export default function PerformancePowerboatsEstimatePage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [project, setProject] = useState<EstimateProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadEstimate() {
    if (!id || !token) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.rpc(
      "get_performance_powerboat_customer_estimate",
      {
        p_project_id: id,
        p_token: token,
      }
    );

    if (error || !data?.length) {
      console.error(error);
      setProject(null);
    } else {
      setProject(data[0] as EstimateProject);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadEstimate();
  }, [id, token]);

  async function approveEstimate() {
    if (!id || !token || !project) return;

    setApproving(true);
    setErrorMessage("");

    const { data, error } = await supabase.rpc(
      "approve_performance_powerboat_customer_estimate",
      {
        p_project_id: id,
        p_token: token,
      }
    );

    if (error || !data) {
      console.error(error);
      setErrorMessage("We could not record the approval. Please try again.");
      setApproving(false);
      return;
    }

    await loadEstimate();
    setApproving(false);
  }

  function questionUrl() {
    const body = encodeURIComponent(
      `Hi Performance Powerboats, I have a question about estimate ${
        project?.estimate_number || ""
      }.`
    );

    const separator =
      /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent) ? "&" : "?";

    return `sms:+19548019524${separator}body=${body}`;
  }

  if (loading) {
    return (
      <main className="ppe-page">
        <div className="ppe-state">Loading estimate...</div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="ppe-page">
        <div className="ppe-state">
          This estimate link is invalid or is not available.
        </div>
      </main>
    );
  }

  const approved = project.estimate_status === "approved";

  return (
    <main className="ppe-page">
      <div className="ppe-shell">
        <header className="ppe-header">
          <div className="ppe-brand">
            <span>PERFORMANCE</span>
            <strong>POWERBOATS</strong>
          </div>

          <div className={`ppe-status ${approved ? "is-approved" : ""}`}>
            {approved ? "APPROVED" : "ESTIMATE"}
          </div>
        </header>

        <section className="ppe-estimate">
          <div className="ppe-estimate-top">
            <div>
              <span className="ppe-kicker">ESTIMATE</span>
              <h1>{project.estimate_number}</h1>
            </div>

            <strong className="ppe-total">
              {money(project.estimate_total)}
            </strong>
          </div>

          <div className="ppe-customer">
            <span>PREPARED FOR</span>
            <strong>{project.customer_name}</strong>
            <p>{boatLabel(project) || project.project_type}</p>
          </div>

          {(project.recommended_work || project.customer_request) && (
            <section className="ppe-block">
              <span>SCOPE</span>
              <p>
                {project.recommended_work ||
                  project.customer_request}
              </p>
            </section>
          )}

          {(project.parts?.length ?? 0) > 0 && (
            <section className="ppe-block">
              <span>PARTS / MATERIALS</span>

              <div className="ppe-lines">
                {project.parts.map((item: any, index: number) => (
                  <div className="ppe-line" key={index}>
                    <strong>{itemLabel(item)}</strong>
                    {itemAmount(item) !== null && (
                      <span>{money(itemAmount(item))}</span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {(project.labor?.length ?? 0) > 0 && (
            <section className="ppe-block">
              <span>LABOR</span>

              <div className="ppe-lines">
                {project.labor.map((item: any, index: number) => (
                  <div className="ppe-line" key={index}>
                    <strong>{itemLabel(item)}</strong>
                    {itemAmount(item) !== null && (
                      <span>{money(itemAmount(item))}</span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {project.estimate_notes && (
            <section className="ppe-block">
              <span>ESTIMATE NOTES</span>
              <p>{project.estimate_notes}</p>
            </section>
          )}

          <div className="ppe-grand-total">
            <span>ESTIMATED TOTAL</span>
            <strong>{money(project.estimate_total)}</strong>
          </div>

          {approved ? (
            <section className="ppe-approved">
              <div className="ppe-check">✓</div>
              <div>
                <span>ESTIMATE APPROVED</span>
                <strong>Thank you. Performance Powerboats has your approval.</strong>
              </div>
            </section>
          ) : (
            <div className="ppe-actions">
              <button
                type="button"
                className="ppe-approve"
                disabled={approving}
                onClick={approveEstimate}
              >
                {approving ? "APPROVING..." : "APPROVE ESTIMATE"}
              </button>

              <a href={questionUrl()}>ASK A QUESTION</a>
            </div>
          )}

          {errorMessage && (
            <p className="ppe-error">{errorMessage}</p>
          )}
        </section>

        <footer>
          PERFORMANCE POWERBOATS · BUILT HERE. RUN HARD.
        </footer>
      </div>
    </main>
  );
}
