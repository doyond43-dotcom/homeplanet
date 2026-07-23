import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  ChevronRight,
  Clock3,
  RefreshCw,
  Truck,
  Wrench,
} from "lucide-react";
import { supabase } from "../lib/supabase";

type JmeAwarenessRequest = {
  id: string;
  request_type: "rental" | "repair";
  status: string;
  equipment: string;
  brand_model: string | null;
  requested_start_date: string | null;
  requested_return_date: string | null;
  movement_preference: string | null;
  problem_description: string | null;
  equipment_condition: string | null;
  service_preference: string | null;
  photo_count: number;
  created_at: string;
};

function formatDate(value: string | null) {
  if (!value) return "";

  const [year, month, day] = value.split("-");

  if (!year || !month || !day) {
    return value;
  }

  return `${Number(month)}/${Number(day)}/${year}`;
}

function formatCreatedAt(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function statusLabel(status: string) {
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function JonesEquipmentOperatorBoard() {
  const [requests, setRequests] = useState<JmeAwarenessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadRequests = useCallback(async (manual = false) => {
    if (manual) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const { data, error: requestError } = await supabase.rpc(
        "get_jme_awareness_requests",
      );

      if (requestError) {
        throw requestError;
      }

      setRequests((data ?? []) as JmeAwarenessRequest[]);
    } catch (requestError) {
      console.error("JME awareness request load failed:", requestError);

      setError(
        "JME requests could not be loaded right now. Refresh and try again.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  const rentalRequests = useMemo(
    () => requests.filter((request) => request.request_type === "rental"),
    [requests],
  );

  const repairRequests = useMemo(
    () => requests.filter((request) => request.request_type === "repair"),
    [requests],
  );

  const newCount = useMemo(
    () => requests.filter((request) => request.status === "new").length,
    [requests],
  );

  return (
    <main className="jme-board-page">
      <style>{`
        :root {
          --jme-yellow: #e4aa12;
          --jme-blue: #1597df;
          --jme-black: #080b0c;
          --jme-panel: #0d1215;
          --jme-panel-2: #12191e;
          --jme-muted: #99a5ad;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
        }

        .jme-board-page {
          min-height: 100vh;
          color: #f7f4ec;
          background:
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px),
            radial-gradient(circle at 12% 0%, rgba(226,173,24,0.10), transparent 28%),
            #080b0c;
          background-size: 4px 4px, 4px 4px, auto, auto;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .jme-board-shell {
          width: min(1220px, calc(100% - 36px));
          margin: 0 auto;
        }

        .jme-board-topbar {
          position: sticky;
          top: 0;
          z-index: 10;
          border-bottom: 1px solid rgba(226,173,24,0.55);
          background: rgba(6,9,10,0.96);
          backdrop-filter: blur(18px);
        }

        .jme-board-topbar-inner {
          min-height: 74px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
        }

        .jme-board-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .jme-board-brand-mark {
          width: 50px;
          height: 42px;
          object-fit: contain;
          border: 1px solid rgba(255,255,255,0.16);
          background: #050708;
        }

        .jme-board-brand strong {
          display: block;
          color: var(--jme-yellow);
          font-size: 0.94rem;
          font-weight: 950;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .jme-board-brand span {
          display: block;
          margin-top: 3px;
          color: #89959d;
          font-size: 0.72rem;
          font-weight: 850;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .jme-board-refresh {
          min-height: 42px;
          padding: 0 15px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 1px solid rgba(255,255,255,0.18);
          background: #0b1013;
          color: #f5f3ed;
          font: inherit;
          font-weight: 900;
          cursor: pointer;
        }

        .jme-board-refresh:hover {
          border-color: var(--jme-blue);
        }

        .jme-board-refresh:disabled {
          opacity: 0.55;
          cursor: wait;
        }

        .jme-board-main {
          padding: 48px 0 72px;
        }

        .jme-board-kicker {
          margin: 0 0 10px;
          color: var(--jme-blue);
          font-size: 0.76rem;
          font-weight: 950;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .jme-board-heading-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
        }

        .jme-board-title {
          max-width: 760px;
          margin: 0;
          font-size: clamp(2.35rem, 7vw, 5.3rem);
          line-height: 0.93;
          letter-spacing: -0.06em;
        }

        .jme-board-title span {
          color: var(--jme-yellow);
        }

        .jme-board-intro {
          max-width: 650px;
          margin: 20px 0 0;
          color: #b8c1c7;
          font-size: 1rem;
          line-height: 1.7;
        }

        .jme-board-count {
          min-width: 180px;
          padding: 19px 20px;
          border-top: 3px solid var(--jme-yellow);
          background: #0c1114;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.07);
        }

        .jme-board-count strong {
          display: block;
          font-size: 2.15rem;
          line-height: 1;
        }

        .jme-board-count span {
          display: block;
          margin-top: 7px;
          color: #9ca7ae;
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .jme-board-lanes {
          margin-top: 42px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 22px;
        }

        .jme-board-lane {
          min-width: 0;
          border-top: 4px solid var(--jme-yellow);
          background:
            linear-gradient(180deg, rgba(21,151,223,0.055), transparent 180px),
            #0c1114;
          box-shadow:
            inset 0 0 0 1px rgba(255,255,255,0.075),
            0 20px 60px rgba(0,0,0,0.24);
        }

        .jme-board-lane.repair {
          border-top-color: var(--jme-blue);
        }

        .jme-board-lane-header {
          min-height: 94px;
          padding: 20px 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          border-bottom: 1px solid rgba(255,255,255,0.09);
        }

        .jme-board-lane-title {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .jme-board-lane-title h2 {
          margin: 0;
          font-size: 1.35rem;
          letter-spacing: -0.025em;
        }

        .jme-board-lane-title span {
          display: block;
          margin-top: 3px;
          color: #89959d;
          font-size: 0.76rem;
          font-weight: 800;
        }

        .jme-board-badge {
          min-width: 36px;
          height: 36px;
          padding: 0 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(226,173,24,0.45);
          background: rgba(226,173,24,0.10);
          color: #f6c741;
          font-weight: 950;
        }

        .repair .jme-board-badge {
          border-color: rgba(21,151,223,0.48);
          background: rgba(21,151,223,0.10);
          color: #62c2fa;
        }

        .jme-board-card-list {
          padding: 16px;
          display: grid;
          gap: 13px;
        }

        .jme-board-card {
          width: 100%;
          padding: 0;
          text-align: left;
          border: 1px solid rgba(255,255,255,0.11);
          background:
            linear-gradient(135deg, rgba(255,255,255,0.025), transparent 50%),
            #11181d;
          color: inherit;
          cursor: pointer;
          overflow: hidden;
          transition:
            transform 150ms ease,
            border-color 150ms ease,
            box-shadow 150ms ease;
        }

        .jme-board-card:hover {
          transform: translateY(-2px);
          border-color: rgba(226,173,24,0.55);
          box-shadow: 0 16px 38px rgba(0,0,0,0.28);
        }

        .repair .jme-board-card:hover {
          border-color: rgba(21,151,223,0.65);
        }

        .jme-board-card-top {
          min-height: 48px;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .jme-board-status {
          color: var(--jme-yellow);
          font-size: 0.68rem;
          font-weight: 950;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .repair .jme-board-status {
          color: #55b9f3;
        }

        .jme-board-time {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #7e8b94;
          font-size: 0.74rem;
          font-weight: 750;
        }

        .jme-board-card-body {
          padding: 18px;
        }

        .jme-board-equipment {
          margin: 0;
          font-size: clamp(1.45rem, 3vw, 2rem);
          line-height: 1.05;
          letter-spacing: -0.04em;
        }

        .jme-board-model {
          margin-top: 6px;
          color: #9ba8b0;
          font-size: 0.86rem;
          font-weight: 750;
        }

        .jme-board-detail-grid {
          margin-top: 18px;
          display: grid;
          gap: 11px;
        }

        .jme-board-detail {
          display: grid;
          grid-template-columns: 24px minmax(0, 1fr);
          gap: 9px;
          align-items: start;
          color: #c9d0d4;
          font-size: 0.88rem;
          line-height: 1.45;
        }

        .jme-board-detail svg {
          margin-top: 1px;
          color: var(--jme-yellow);
        }

        .repair .jme-board-detail svg {
          color: var(--jme-blue);
        }

        .jme-board-card-bottom {
          padding: 13px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border-top: 1px solid rgba(255,255,255,0.08);
          color: #f3f2ed;
          font-size: 0.78rem;
          font-weight: 900;
        }

        .jme-board-empty,
        .jme-board-loading,
        .jme-board-error {
          margin: 16px;
          padding: 26px 20px;
          border: 1px dashed rgba(255,255,255,0.14);
          color: #98a4ab;
          line-height: 1.55;
        }

        .jme-board-error {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          color: #ffb5b5;
          border-color: rgba(255,92,92,0.28);
        }

        .jme-board-footnote {
          margin-top: 28px;
          padding-top: 18px;
          display: flex;
          justify-content: space-between;
          gap: 18px;
          border-top: 1px solid rgba(255,255,255,0.08);
          color: #74818a;
          font-size: 0.78rem;
        }

        @media (max-width: 820px) {
          .jme-board-heading-row {
            display: block;
          }

          .jme-board-count {
            margin-top: 24px;
            min-width: 0;
            width: 100%;
          }

          .jme-board-lanes {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 560px) {
          .jme-board-shell {
            width: min(100% - 22px, 1220px);
          }

          .jme-board-topbar-inner {
            min-height: 66px;
          }

          .jme-board-brand strong {
            font-size: 0.78rem;
          }

          .jme-board-refresh span {
            display: none;
          }

          .jme-board-main {
            padding-top: 34px;
          }

          .jme-board-card-list {
            padding: 11px;
          }
        }
      `}</style>

      <header className="jme-board-topbar">
        <div className="jme-board-shell jme-board-topbar-inner">
          <div className="jme-board-brand">
            <img
              className="jme-board-brand-mark"
              src="/images/jme-logo-primary.jpg"
              alt=""
            />

            <div>
              <strong>Jones Equipment Rental &amp; Repair</strong>
              <span>Operator Board</span>
            </div>
          </div>

          <button
            className="jme-board-refresh"
            type="button"
            disabled={refreshing}
            onClick={() => void loadRequests(true)}
          >
            <RefreshCw size={17} aria-hidden="true" />
            <span>{refreshing ? "Refreshing" : "Refresh"}</span>
          </button>
        </div>
      </header>

      <section className="jme-board-main">
        <div className="jme-board-shell">
          <p className="jme-board-kicker">JME Operations</p>

          <div className="jme-board-heading-row">
            <div>
              <h1 className="jme-board-title">
                What needs <span>attention now.</span>
              </h1>

              <p className="jme-board-intro">
                New rental and repair requests appear here from the JME live
                page. Start with the signal. Open the request when you are
                ready to work it.
              </p>
            </div>

            <div className="jme-board-count">
              <strong>{newCount}</strong>
              <span>New requests</span>
            </div>
          </div>

          {error ? (
            <div className="jme-board-error" role="alert">
              <AlertCircle size={20} aria-hidden="true" />
              <span>{error}</span>
            </div>
          ) : null}

          <div className="jme-board-lanes">
            <section className="jme-board-lane rental">
              <header className="jme-board-lane-header">
                <div className="jme-board-lane-title">
                  <Truck size={24} aria-hidden="true" />

                  <div>
                    <h2>Rental Requests</h2>
                    <span>Equipment and requested dates</span>
                  </div>
                </div>

                <span className="jme-board-badge">
                  {rentalRequests.length}
                </span>
              </header>

              {loading ? (
                <div className="jme-board-loading">
                  Loading live rental requests...
                </div>
              ) : rentalRequests.length === 0 ? (
                <div className="jme-board-empty">
                  No active rental requests right now.
                </div>
              ) : (
                <div className="jme-board-card-list">
                  {rentalRequests.map((request) => (
                    <button
                      key={request.id}
                      className="jme-board-card"
                      type="button"
                      onClick={() => {
                        console.log(
                          "JME rental request selected:",
                          request.id,
                        );
                      }}
                    >
                      <div className="jme-board-card-top">
                        <span className="jme-board-status">
                          {statusLabel(request.status)} rental
                        </span>

                        <span className="jme-board-time">
                          <Clock3 size={14} aria-hidden="true" />
                          {formatCreatedAt(request.created_at)}
                        </span>
                      </div>

                      <div className="jme-board-card-body">
                        <h3 className="jme-board-equipment">
                          {request.equipment}
                        </h3>

                        <div className="jme-board-detail-grid">
                          <div className="jme-board-detail">
                            <CalendarDays size={17} aria-hidden="true" />
                            <span>
                              {request.requested_start_date
                                ? `${formatDate(request.requested_start_date)}${
                                    request.requested_return_date
                                      ? ` through ${formatDate(
                                          request.requested_return_date,
                                        )}`
                                      : ""
                                  }`
                                : "Dates need review"}
                            </span>
                          </div>

                          <div className="jme-board-detail">
                            <Truck size={17} aria-hidden="true" />
                            <span>
                              {request.movement_preference ||
                                "Pickup or delivery needs review"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="jme-board-card-bottom">
                        <span>Open request workspace</span>
                        <ChevronRight size={18} aria-hidden="true" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </section>

            <section className="jme-board-lane repair">
              <header className="jme-board-lane-header">
                <div className="jme-board-lane-title">
                  <Wrench size={24} aria-hidden="true" />

                  <div>
                    <h2>Repair Requests</h2>
                    <span>Machine problem and service need</span>
                  </div>
                </div>

                <span className="jme-board-badge">
                  {repairRequests.length}
                </span>
              </header>

              {loading ? (
                <div className="jme-board-loading">
                  Loading live repair requests...
                </div>
              ) : repairRequests.length === 0 ? (
                <div className="jme-board-empty">
                  No active repair requests right now.
                </div>
              ) : (
                <div className="jme-board-card-list">
                  {repairRequests.map((request) => (
                    <button
                      key={request.id}
                      className="jme-board-card"
                      type="button"
                      onClick={() => {
                        console.log(
                          "JME repair request selected:",
                          request.id,
                        );
                      }}
                    >
                      <div className="jme-board-card-top">
                        <span className="jme-board-status">
                          {statusLabel(request.status)} repair
                        </span>

                        <span className="jme-board-time">
                          <Clock3 size={14} aria-hidden="true" />
                          {formatCreatedAt(request.created_at)}
                        </span>
                      </div>

                      <div className="jme-board-card-body">
                        <h3 className="jme-board-equipment">
                          {request.equipment}
                        </h3>

                        {request.brand_model ? (
                          <div className="jme-board-model">
                            {request.brand_model}
                          </div>
                        ) : null}

                        <div className="jme-board-detail-grid">
                          <div className="jme-board-detail">
                            <Wrench size={17} aria-hidden="true" />
                            <span>
                              {request.problem_description ||
                                "Problem needs review"}
                            </span>
                          </div>

                          <div className="jme-board-detail">
                            <AlertCircle size={17} aria-hidden="true" />
                            <span>
                              {request.equipment_condition ||
                                "Condition needs review"}
                            </span>
                          </div>

                          <div className="jme-board-detail">
                            <Truck size={17} aria-hidden="true" />
                            <span>
                              {request.service_preference ||
                                "Service method needs review"}
                            </span>
                          </div>

                          {request.photo_count > 0 ? (
                            <div className="jme-board-detail">
                              <span aria-hidden="true">#</span>
                              <span>
                                {request.photo_count} photo
                                {request.photo_count === 1 ? "" : "s"} noted
                              </span>
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="jme-board-card-bottom">
                        <span>Open request workspace</span>
                        <ChevronRight size={18} aria-hidden="true" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </section>
          </div>

          <div className="jme-board-footnote">
            <span>
              Awareness first. Work happens after the request is opened.
            </span>

            <span>Built by HomePlanet</span>
          </div>
        </div>
      </section>
    </main>
  );
}