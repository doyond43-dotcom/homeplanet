import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

type PrintShopOrder = {
  id: string;
  created_at: string;
  customer_name: string;
  phone: string | null;
  email: string | null;
  product_type: string | null;
  quantity: string | null;
  notes: string | null;
  artwork_url: string | null;
  status: string;
  marketing_opt_in: boolean;
};

const statusLabels: Record<string, string> = {
  "quote-received": "Quote Received",
  "artwork-review": "Artwork Review",
  "customer-approval": "Customer Approval",
  printing: "Printing",
  "ready-for-pickup": "Ready For Pickup",
  completed: "Completed",
};

const statusOptions = Object.keys(statusLabels);

export default function PrintShopOwnerBoard() {
  const [orders, setOrders] = useState<PrintShopOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState("");

  const loadOrders = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("printshop_orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setOrders([]);
    } else {
      setOrders((data || []) as PrintShopOrder[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const needle = search.trim().toLowerCase();

    if (!needle) return orders;

    return orders.filter((order) => {
      return [
        order.customer_name,
        order.phone,
        order.email,
        order.product_type,
        order.quantity,
        order.notes,
        order.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [orders, search]);

  const copyText = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1800);
  };

  const copyEmails = () => {
    const emails = filteredOrders
      .map((order) => order.email?.trim())
      .filter(Boolean)
      .join(", ");

    copyText("emails copied", emails || "No emails found");
  };

  const copyPhones = () => {
    const phones = filteredOrders
      .map((order) => order.phone?.trim())
      .filter(Boolean)
      .join(", ");

    copyText("phones copied", phones || "No phones found");
  };

  const copyCustomers = () => {
    const customers = filteredOrders
      .map((order) => {
        const parts = [
          order.customer_name,
          order.phone,
          order.email,
          order.product_type,
        ].filter(Boolean);

        return parts.join(" | ");
      })
      .join("\n");

    copyText("customers copied", customers || "No customers found");
  };

  const updateStatus = async (orderId: string, status: string) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );

    const { error } = await supabase
      .from("printshop_orders")
      .update({ status })
      .eq("id", orderId);

    if (error) {
      console.error(error);
      loadOrders();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-white/10 bg-black/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/planet/printshop" className="text-sm font-bold tracking-wide">
            LIVE PRINT STUDIO
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={loadOrders}
              className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
            >
              Refresh
            </button>

            <Link
              to="/planet/printshop"
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black"
            >
              Public Page
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-4 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-xs font-semibold tracking-[0.2em] text-cyan-300">
          OWNER BOARD
        </div>

        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-5xl font-black tracking-tight">
              Print Shop Orders
            </h1>

            <p className="mt-4 max-w-2xl text-white/60">
              Live customer requests, contact info, order notes, and status flow.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#111111] px-5 py-4">
            <div className="text-xs uppercase tracking-[0.2em] text-white/40">
              Active Requests
            </div>
            <div className="mt-1 text-3xl font-black">{orders.length}</div>
          </div>
        </div>

        <section className="mt-8 rounded-[32px] border border-white/10 bg-[#111111] p-5">
          <div className="grid gap-4 md:grid-cols-[1fr_auto_auto_auto] md:items-center">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35"
              placeholder="Search name, phone, email, product, notes..."
            />

            <button
              onClick={copyEmails}
              className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-200"
            >
              Copy Emails
            </button>

            <button
              onClick={copyPhones}
              className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-200"
            >
              Copy Phones
            </button>

            <button
              onClick={copyCustomers}
              className="rounded-full border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white"
            >
              Copy Customers
            </button>
          </div>

          {copied && (
            <div className="mt-4 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-200">
              {copied}
            </div>
          )}
        </section>

        <section className="mt-8 grid gap-5">
          {loading ? (
            <div className="rounded-3xl border border-white/10 bg-[#111111] p-6 text-white/60">
              Loading orders...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-[#111111] p-6 text-white/60">
              No orders found.
            </div>
          ) : (
            filteredOrders.map((order) => (
              <article
                key={order.id}
                className="rounded-[32px] border border-white/10 bg-[#111111] p-6"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-black">
                        {order.customer_name}
                      </h2>

                      <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-200">
                        {statusLabels[order.status] || order.status}
                      </span>

                      {order.marketing_opt_in && (
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-white/60">
                          Opted In
                        </span>
                      )}
                    </div>

                    <div className="mt-2 text-sm text-white/40">
                      {new Date(order.created_at).toLocaleString()}
                    </div>
                  </div>

                  <select
                    value={order.status}
                    onChange={(event) => updateStatus(order.id, event.target.value)}
                    className="rounded-full border border-white/10 bg-black px-4 py-2 text-sm text-white outline-none"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {statusLabels[status]}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-4">
                  <Info label="Phone" value={order.phone || "—"} />
                  <Info label="Email" value={order.email || "—"} />
                  <Info label="Product" value={order.product_type || "—"} />
                  <Info label="Quantity" value={order.quantity || "—"} />
                </div>

                
                {order.artwork_url && (
                  <div className="mt-5 overflow-hidden rounded-[28px] border border-white/10 bg-black/30">
                    <a
                      href={order.artwork_url}
                      target="_blank"
                      rel="noreferrer"
                      className="block"
                    >
                      <img
                        src={order.artwork_url}
                        alt="Artwork Preview"
                        className="h-72 w-full object-cover transition hover:scale-[1.01]"
                      />
                    </a>

                    <div className="flex flex-wrap gap-3 border-t border-white/10 p-4">
                      <a
                        href={order.artwork_url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-bold text-black"
                      >
                        Open Artwork
                      </a>

                      <a
                        href={order.artwork_url}
                        download
                        className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white"
                      >
                        Download File
                      </a>
                    </div>
                  </div>
                )}

                {order.notes && (
                  <div className="mt-5 rounded-3xl border border-white/10 bg-black/30 p-5">
                    <div className="text-xs uppercase tracking-[0.2em] text-white/35">
                      Notes
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-white/75">
                      {order.notes}
                    </p>
                  </div>
                )}

                <div className="mt-5 flex flex-wrap gap-3">
                  {order.phone && (
                    <button
                      onClick={() => copyText("phone copied", order.phone || "")}
                      className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Copy Phone
                    </button>
                  )}

                  {order.email && (
                    <button
                      onClick={() => copyText("email copied", order.email || "")}
                      className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Copy Email
                    </button>
                  )}
                </div>
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
      <div className="text-xs uppercase tracking-[0.2em] text-white/35">
        {label}
      </div>
      <div className="mt-2 break-words text-sm font-semibold text-white/80">
        {value}
      </div>
    </div>
  );
}


