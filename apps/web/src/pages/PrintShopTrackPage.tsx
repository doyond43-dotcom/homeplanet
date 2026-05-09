import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

type PrintShopOrder = {
  id: string;
  customer_name: string;
  phone: string | null;
  email: string | null;
  product_type: string | null;
  notes: string | null;
  artwork_url: string | null;
  status: string;
  created_at: string;
  artwork_approved: boolean | null;
  artwork_approved_at: string | null;
};

const stages = [
  "quote-received",
  "artwork-review",
  "customer-approval",
  "printing",
  "ready-for-pickup",
  "completed",
];

const labels: Record<string, string> = {
  "quote-received": "Quote Received",
  "artwork-review": "Artwork Review",
  "customer-approval": "Customer Approval",
  printing: "Printing",
  "ready-for-pickup": "Ready For Pickup",
  completed: "Completed",
};

export default function PrintShopTrackPage() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<PrintShopOrder | null>(null);
  const [error, setError] = useState("");

  const lookupOrder = async () => {
    setLoading(true);
    setError("");
    setOrder(null);

    const needle = search.trim();

    if (!needle) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("printshop_orders")
      .select("*")
      .or(`phone.eq.${needle},email.eq.${needle}`)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (!data) {
      setError("No order found.");
      return;
    }

    setOrder(data as PrintShopOrder);
  };

  const approveArtwork = async () => {
    if (!order) return;

    const approvedAt = new Date().toISOString();

    const { error } = await supabase
      .from("printshop_orders")
      .update({
        artwork_approved: true,
        artwork_approved_at: approvedAt,
        status: "customer-approval",
      })
      .eq("id", order.id);

    if (error) {
      setError(error.message);
      return;
    }

    setOrder({
      ...order,
      artwork_approved: true,
      artwork_approved_at: approvedAt,
      status: "customer-approval",
    });
  };
  const activeIndex = order ? stages.indexOf(order.status) : -1;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-white/10 bg-black/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/planet/printshop" className="text-sm font-bold tracking-wide">
            LIVE PRINT STUDIO
          </Link>

          <Link
            to="/planet/printshop"
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
          >
            Back
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-4 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-xs font-semibold tracking-[0.2em] text-cyan-300">
          TRACK ORDER
        </div>

        <h1 className="text-5xl font-black tracking-tight">
          Track Your Print Job
        </h1>

        <p className="mt-4 max-w-2xl text-white/60">
          Enter your phone number or email to check your current production status.
        </p>

        <section className="mt-10 rounded-[32px] border border-white/10 bg-[#111111] p-6">
          <div className="text-sm font-semibold text-white/70">
            Phone Number or Email
          </div>

          <div className="mt-4 flex flex-col gap-4 md:flex-row">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="8635550000 or customer@email.com"
              className="flex-1 rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white outline-none placeholder:text-white/30"
            />

            <button
              onClick={lookupOrder}
              disabled={loading}
              className="rounded-full bg-cyan-400 px-7 py-4 font-bold text-black transition hover:scale-[1.02] disabled:opacity-60"
            >
              {loading ? "Searching..." : "Track Order"}
            </button>
          </div>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}
        </section>

        {order && (
          <section className="mt-10 rounded-[32px] border border-white/10 bg-[#111111] p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-sm uppercase tracking-[0.2em] text-white/35">
                  Customer
                </div>

                <h2 className="mt-2 text-3xl font-black">
                  {order.customer_name}
                </h2>

                <div className="mt-2 text-sm text-white/45">
                  Last updated from live production flow
                </div>
              </div>

              <div className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 text-sm font-bold text-cyan-200">
                {labels[order.status] || order.status}
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-6">
              {stages.map((stage, index) => {
                const active = index <= activeIndex;

                return (
                  <div
                    key={stage}
                    className={`rounded-3xl border p-5 transition ${
                      active
                        ? "border-cyan-400/30 bg-cyan-400/10"
                        : "border-white/10 bg-black/30"
                    }`}
                  >
                    <div
                      className={`mb-3 h-3 w-3 rounded-full ${
                        active ? "bg-cyan-300" : "bg-white/20"
                      }`}
                    />

                    <div
                      className={`text-sm font-semibold ${
                        active ? "text-cyan-100" : "text-white/45"
                      }`}
                    >
                      {labels[stage]}
                    </div>
                  </div>
                );
              })}
            </div>

            {order.artwork_url && (
              <div className="mt-8 overflow-hidden rounded-[28px] border border-white/10 bg-black/30">
                <img
                  src={order.artwork_url}
                  alt="Artwork Preview"
                  className="h-80 w-full object-cover"
                />

                <div className="border-t border-white/10 p-4">
                  <a
                    href={order.artwork_url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-bold text-black"
                  >
                    View Artwork
                  </a>
                </div>
              </div>
            )}

            {order.notes && (
              <div className="mt-8 rounded-3xl border border-white/10 bg-black/30 p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-white/35">
                  Notes
                </div>

                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  {order.notes}
                </p>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

