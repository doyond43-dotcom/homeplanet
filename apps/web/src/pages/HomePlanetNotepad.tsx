import React, { useMemo, useState } from "react";

type Status = "draft" | "invoice" | "sent" | "paid" | "followup";
type DrawerSection = "invoice" | "proof" | "notes" | "timeline" | null;

type Note = {
  id: string;
  text: string;
  createdAt: string;
};

type Invoice = {
  id: string;
  number: string;
  service: string;
  amount: string;
  paymentLink: string;
  status: "created" | "sent" | "paid";
  createdAt: string;
  updatedAt: string;
};

type ProofPhotos = {
  before?: string;
  after?: string;
};

type Customer = {
  id: string;
  name: string;
  phone: string;
  address?: string;
  note: string;
  amount: string;
  paymentLink: string;
  status: Status;
  invoice?: Invoice;
  proofPhotos?: ProofPhotos;
  notes: Note[];
  createdAt: string;
  updatedAt: string;
};

const STORAGE_KEY = "homeplanet-notepad-customers-one-demo-v1";

function nowIso() {
  return new Date().toISOString();
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createInvoiceNumber() {
  const date = new Date();
  const y = String(date.getFullYear()).slice(2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const short = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `HP-${y}${m}${d}-${short}`;
}

const seedCustomers: Customer[] = [
  {
    id: "seed-bobby",
    name: "Bobby Welch",
    phone: "8635550182",
    address: "Okeechobee, FL",
    note: "Lawn cleanup. Wants cheaper help and follow-up.",
    amount: "125",
    paymentLink: "",
    status: "draft",
    proofPhotos: {},
    notes: [
      {
        id: "note-bobby-1",
        text: "Lawn cleanup lead from Facebook. Needs follow-up.",
        createdAt: nowIso(),
      },
    ],
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
];

function statusLabel(status: Status) {
  if (status === "invoice") return "Invoice Created";
  if (status === "sent") return "Invoice Sent";
  if (status === "paid") return "Paid";
  if (status === "followup") return "Follow Up";
  return "Draft";
}

function statusClass(status: Status) {
  if (status === "paid") return "bg-emerald-400/15 text-emerald-200 border-emerald-300/30";
  if (status === "sent") return "bg-blue-400/15 text-blue-200 border-blue-300/30";
  if (status === "invoice") return "bg-purple-400/15 text-purple-100 border-purple-300/30";
  if (status === "followup") return "bg-amber-400/15 text-amber-200 border-amber-300/30";
  return "bg-white/10 text-white/70 border-white/15";
}

function buildInvoiceText(customer: Customer) {
  const invoiceNumber = customer.invoice?.number || "Not created yet";
  const service = customer.invoice?.service || customer.note || "Service";
  const amount = customer.invoice?.amount || customer.amount || "0";
  const paymentLink = customer.invoice?.paymentLink || customer.paymentLink;

  return [
    `Invoice ${invoiceNumber}`,
    ``,
    `Customer: ${customer.name}`,
    `Service: ${service}`,
    `Amount Due: $${amount}`,
    paymentLink ? `Payment Link: ${paymentLink}` : `Payment Link: Not added yet`,
  ].join("\n");
}

function getDisplayStatus(customer: Customer): Status {
  if (customer.status === "paid" || customer.invoice?.status === "paid") return "paid";
  if (customer.invoice?.status === "sent") return "sent";
  if (customer.invoice) return "invoice";
  if (customer.status === "followup") return "followup";
  return "draft";
}

function getNextActionLabel(customer: Customer) {
  const displayStatus = getDisplayStatus(customer);

  if (displayStatus === "paid") return "Done";
  if (!customer.invoice) return "Invoice needed";
  if (displayStatus === "sent") return "Waiting payment";
  return "Ready to send";
}

function runNextAction(customer: Customer, createInvoice: (customer: Customer) => void, sendInvoice: (customer: Customer) => void, markPaid: (customer: Customer) => void) {
  const displayStatus = getDisplayStatus(customer);

  if (displayStatus === "paid") return;
  if (!customer.invoice) {
    createInvoice(customer);
    return;
  }
  if (displayStatus === "sent") {
    markPaid(customer);
    return;
  }
  sendInvoice(customer);
}

function getNextActionButton(customer: Customer) {
  const displayStatus = getDisplayStatus(customer);

  if (displayStatus === "paid") return "Paid / Done";
  if (!customer.invoice) return "Create Invoice";
  if (displayStatus === "sent") return "Mark Paid";
  return "Send Invoice";
}
function buildProofText(customer: Customer) {
  const hasBefore = Boolean(customer.proofPhotos?.before);
  const hasAfter = Boolean(customer.proofPhotos?.after);

  return [
    `Hey ${customer.name}, here is your job proof and invoice info.`,
    ``,
    hasBefore || hasAfter
      ? `Proof photos are ready: ${hasBefore ? "Before photo added" : "No before photo"} / ${hasAfter ? "After photo added" : "No after photo"}`
      : `Proof photos have not been added yet.`,
    ``,
    buildInvoiceText(customer),
  ].join("\n");
}

export default function HomePlanetNotepad() {
  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return seedCustomers;

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) return seedCustomers;

      return parsed;
    } catch {
      return seedCustomers;
    }
  });

  const [openId, setOpenId] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<DrawerSection>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
    amount: "",
    paymentLink: "",
  });
  const [newNotes, setNewNotes] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
  }, [customers]);

  const openCharges = useMemo(() => {
    return customers.filter((customer) => customer.status !== "paid").length;
  }, [customers]);

  const openCustomer = customers.find((customer) => customer.id === openId) || null;

  function openCustomerDrawer(customer: Customer, section: DrawerSection = null) {
    if (openId === customer.id && section === null) {
      setOpenId(null);
      setOpenSection(null);
      return;
    }

    setOpenId(customer.id);
    setOpenSection(section);

    window.setTimeout(() => {
      document.getElementById("open-charges")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  }

  function closeDrawer() {
    setOpenId(null);
    setOpenSection(null);
  }

  function toggleSection(section: Exclude<DrawerSection, null>) {
    setOpenSection((current) => (current === section ? null : section));
  }

  function saveCustomer() {
    if (!form.name.trim()) return;

    const now = nowIso();

    const customer: Customer = {
      id: createId("customer"),
      name: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      note: form.note.trim(),
      amount: form.amount.trim(),
      paymentLink: "",
      status: "draft",
      proofPhotos: {},
      notes: form.note.trim()
        ? [
            {
              id: createId("note"),
              text: form.note.trim(),
              createdAt: now,
            },
          ]
        : [],
      createdAt: now,
      updatedAt: now,
    };

    setCustomers((prev) => [customer, ...prev]);
    setForm({
      name: "",
      phone: "",
      address: "",
      note: "",
      amount: "",
      paymentLink: "",
    });
    setOpenId(customer.id);
    setOpenSection(null);
  }

  function resetDemoData() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedCustomers));
    setCustomers(seedCustomers);
    setOpenId(null);
    setOpenSection(null);
    setForm({
      name: "",
      phone: "",
      address: "",
      note: "",
      amount: "",
      paymentLink: "",
    });
    setNewNotes({});
  }

  function updateCustomer(id: string, updates: Partial<Customer>) {
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === id
          ? {
              ...customer,
              ...updates,
              updatedAt: nowIso(),
            }
          : customer
      )
    );
  }

  function addNote(id: string) {
    const text = (newNotes[id] || "").trim();
    if (!text) return;

    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === id
          ? {
              ...customer,
              note: text,
              notes: [
                {
                  id: createId("note"),
                  text,
                  createdAt: nowIso(),
                },
                ...customer.notes,
              ],
              updatedAt: nowIso(),
            }
          : customer
      )
    );

    setNewNotes((prev) => ({ ...prev, [id]: "" }));
  }

  function createInvoice(customer: Customer) {
    const now = nowIso();
    const invoice: Invoice = {
      id: customer.invoice?.id || createId("invoice"),
      number: customer.invoice?.number || createInvoiceNumber(),
      service: customer.note || "Service",
      amount: customer.amount || "0",
      paymentLink: customer.paymentLink || "",
      status: customer.invoice?.status || "created",
      createdAt: customer.invoice?.createdAt || now,
      updatedAt: now,
    };

    setCustomers((prev) =>
      prev.map((item) =>
        item.id === customer.id
          ? {
              ...item,
              invoice,
              status: "invoice",
              notes: [
                {
                  id: createId("note"),
                  text: `Invoice ${invoice.number} created for $${invoice.amount}.`,
                  createdAt: now,
                },
                ...item.notes,
              ],
              updatedAt: now,
            }
          : item
      )
    );

    setOpenId(customer.id);
    setOpenSection(null);
  }

  function updateInvoice(customer: Customer, updates: Partial<Invoice>) {
    if (!customer.invoice) return;

    const invoice: Invoice = {
      ...customer.invoice,
      ...updates,
      updatedAt: nowIso(),
    };

    updateCustomer(customer.id, { invoice });
  }

  function sendInvoice(customer: Customer) {
    const customerToSend = customer.invoice
      ? customer
      : {
          ...customer,
          invoice: {
            id: createId("invoice"),
            number: createInvoiceNumber(),
            service: customer.note || "Service",
            amount: customer.amount || "0",
            paymentLink: customer.paymentLink || "",
            status: "created" as const,
            createdAt: nowIso(),
            updatedAt: nowIso(),
          },
        };

    if (!customer.invoice) {
      createInvoice(customer);
    }

    setCustomers((prev) =>
      prev.map((item) =>
        item.id === customer.id
          ? {
              ...item,
              status: "sent",
              invoice: {
                ...(customerToSend.invoice as Invoice),
                status: "sent",
                updatedAt: nowIso(),
              },
              notes: [
                {
                  id: createId("note"),
                  text: `Invoice sent to ${item.name}.`,
                  createdAt: nowIso(),
                },
                ...item.notes,
              ],
              updatedAt: nowIso(),
            }
          : item
      )
    );

    setOpenId(customer.id);
    setOpenSection(null);

    if (!customer.phone) return;

    const cleanPhone = customer.phone.replace(/\D/g, "");
    const message = `Hey ${customer.name}, here is your invoice:\n\n${buildInvoiceText(customerToSend)}`;

    window.location.href = `sms:${cleanPhone}?&body=${encodeURIComponent(message)}`;
  }

  function sendProofAndInvoice(customer: Customer) {
    if (!customer.invoice) {
      createInvoice(customer);
    }

    setCustomers((prev) =>
      prev.map((item) =>
        item.id === customer.id
          ? {
              ...item,
              status: "sent",
              invoice: item.invoice
                ? {
                    ...item.invoice,
                    status: "sent",
                    updatedAt: nowIso(),
                  }
                : item.invoice,
              notes: [
                {
                  id: createId("note"),
                  text: "Proof + invoice message prepared for customer.",
                  createdAt: nowIso(),
                },
                ...item.notes,
              ],
              updatedAt: nowIso(),
            }
          : item
      )
    );

    if (!customer.phone) return;

    const cleanPhone = customer.phone.replace(/\D/g, "");
    const message = buildProofText(customer);

    window.location.href = `sms:${cleanPhone}?&body=${encodeURIComponent(message)}`;
  }

  function markPaid(customer: Customer) {
    updateCustomer(customer.id, {
      status: "paid",
      invoice: customer.invoice
        ? { ...customer.invoice, status: "paid", updatedAt: nowIso() }
        : customer.invoice,
    });
  }
  function callCustomer(customer: Customer) {
    if (!customer.phone) return;
    const cleanPhone = customer.phone.replace(/\D/g, "");
    window.location.href = `tel:${cleanPhone}`;
  }

  function navigateCustomer(customer: Customer) {
    const address = (customer.address || "").trim();

    if (!address) {
      setOpenId(customer.id);
      setOpenSection(null);
      return;
    }

    const destination = encodeURIComponent(address);
    window.location.href = `https://www.google.com/maps/search/?api=1&query=${destination}`;
  }

  function textCustomer(customer: Customer) {
    if (!customer.phone) return;
    const cleanPhone = customer.phone.replace(/\D/g, "");
    window.location.href = `sms:${cleanPhone}`;
  }

  async function copyInvoice(customer: Customer) {
    try {
      await navigator.clipboard.writeText(buildInvoiceText(customer));
      setCopiedId(customer.id);
      window.setTimeout(() => setCopiedId(null), 1400);
    } catch {
      setCopiedId(null);
    }
  }

  function addProofPhoto(customer: Customer, type: "before" | "after", file?: File) {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const imageUrl = String(reader.result || "");
      const nextProofPhotos: ProofPhotos = {
        ...(customer.proofPhotos || {}),
        [type]: imageUrl,
      };

      setCustomers((prev) =>
        prev.map((item) =>
          item.id === customer.id
            ? {
                ...item,
                proofPhotos: nextProofPhotos,
                notes: [
                  {
                    id: createId("note"),
                    text: `${type === "before" ? "Before" : "After"} photo added.`,
                    createdAt: nowIso(),
                  },
                  ...item.notes,
                ],
                updatedAt: nowIso(),
              }
            : item
        )
      );
    };

    reader.readAsDataURL(file);
  }

  return (
    <div className="min-h-screen bg-[#050806] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.18),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(74,222,128,0.10),transparent_28%)]" />

      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-white/10 bg-black/45 p-5 shadow-2xl shadow-emerald-950/30 backdrop-blur md:p-8">
          <div className="mb-4 inline-flex rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-emerald-200">
            Simple Business Notepad
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr] lg:items-end">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                HomePlanet Notepad
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-white/72">
                A simple business notepad for customers, notes, charges, invoices, payment links, proof photos, and paid status.
              </p>
              <p className="mt-4 max-w-2xl rounded-2xl border border-emerald-300/15 bg-emerald-400/10 p-4 text-sm font-semibold leading-6 text-emerald-100">
                Not a CRM. Not accounting. Just the simple business notepad between the customer and the payment.
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-300/15 bg-emerald-400/10 p-5 text-center">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-100/60">
                Open Charges
              </p>
              <p className="mt-2 text-4xl font-black text-emerald-200">
                {openCharges}
              </p>
              <p className="mt-2 text-sm font-semibold text-white/45">
                Customers still needing invoice, proof, follow-up, or payment.
              </p>
            </div>
          </div>
        </section>

        <section id="add-customer" className="rounded-[1.6rem] border border-white/10 bg-white/[0.035] p-4 shadow-xl shadow-black/20">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-lg font-black text-white">Add Customer</h2>
            <button
              onClick={resetDemoData}
              className="rounded-full border border-white/10 bg-black px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-white/55 hover:border-emerald-300/40 hover:text-emerald-100 hover:shadow-[0_0_14px_rgba(74,222,128,0.18)]"
              type="button"
            >
              Reset Demo
            </button>
          </div>

          <div className="grid gap-3 lg:grid-cols-[1fr_0.75fr_1fr_0.55fr]">
            <input
              className="rounded-2xl border border-white/20 bg-black/45 px-4 py-3.5 text-white outline-none placeholder:text-white/45 focus:border-emerald-300/50"
              placeholder="Customer name"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            />

            <input
              className="rounded-2xl border border-white/20 bg-black/45 px-4 py-3.5 text-white outline-none placeholder:text-white/45 focus:border-emerald-300/50"
              placeholder="Phone number"
              value={form.phone}
              onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            />

            <input
              className="rounded-2xl border border-white/20 bg-black/45 px-4 py-3.5 text-white outline-none placeholder:text-white/45 focus:border-emerald-300/50"
              placeholder="Address for navigation"
              value={form.address}
              onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
            />

            <input
              className="rounded-2xl border border-white/20 bg-black/45 px-4 py-3.5 text-white outline-none placeholder:text-white/45 focus:border-emerald-300/50"
              placeholder="Amount"
              value={form.amount}
              onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))}
            />

            <input
              className="rounded-2xl border border-white/20 bg-black/45 px-4 py-3.5 text-white outline-none placeholder:text-white/45 focus:border-emerald-300/50 lg:col-span-4"
              placeholder="Quick note — driveway wash, lawn cleanup, deep clean, quote, follow-up..."
              value={form.note}
              onChange={(event) => setForm((prev) => ({ ...prev, note: event.target.value }))}
            />
          </div>

          <button
            onClick={saveCustomer}
            className="mt-3 w-full rounded-2xl bg-emerald-400 px-5 py-3.5 text-base font-black text-black shadow-lg shadow-emerald-400/20 hover:shadow-[0_0_18px_rgba(74,222,128,0.35)]"
          >
            Save Customer
          </button>
        </section>

        <section id="open-charges" className="grid gap-4 lg:grid-cols-[1fr_420px]">
          <div className="flex flex-col gap-4 self-start">
            {customers.map((customer) => (
              <article
                key={customer.id}
                className="rounded-[1.75rem] border border-white/20 bg-black/45 p-4 shadow-xl shadow-black/20"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <button
                    onClick={() => openCustomerDrawer(customer)}
                    className="text-left"
                  >
                    <h2 className="text-2xl font-black text-white">{customer.name}</h2>
                    <p className="mt-1 text-sm text-white/55">{customer.phone || "No phone added"}</p>
                    <p className="mt-3 text-base leading-6 text-white/75">{customer.note || "No note yet."}</p>
                  </button>

                  <div className="flex flex-row items-center gap-2 sm:flex-col sm:items-end">
                    <span className={`rounded-full border px-3 py-1 text-xs font-black ${statusClass(getDisplayStatus(customer))}`}>
                      {statusLabel(getDisplayStatus(customer))}
                    </span>
                    <span className="text-lg font-black text-emerald-200">
                      {customer.amount ? `$${customer.amount}` : "$0"}
                    </span>
                  </div>
                </div>
                {customer.invoice && (
                  <p className="mt-2 text-xs font-bold text-purple-100/70">
                    Invoice {customer.invoice.number} · {customer.invoice.status}
                  </p>
                )}

                {(customer.proofPhotos?.before || customer.proofPhotos?.after) && (
                  <div className="mt-2 rounded-xl border border-emerald-300/15 bg-emerald-400/10 px-3 py-2 text-xs font-bold text-emerald-100">
                    Proof Photos · {customer.proofPhotos?.before ? "Before" : ""}{customer.proofPhotos?.before && customer.proofPhotos?.after ? " + " : ""}{customer.proofPhotos?.after ? "After" : ""}
                  </div>
                )}

                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <button onClick={() => callCustomer(customer)} className="rounded-xl border border-white/10 bg-white/10 px-3 py-2.5 text-sm font-bold hover:border-emerald-300/35 hover:shadow-[0_0_12px_rgba(74,222,128,0.16)]">
                    Call
                  </button>
                  <button onClick={() => textCustomer(customer)} className="rounded-xl border border-white/10 bg-white/10 px-3 py-2.5 text-sm font-bold hover:border-emerald-300/35 hover:shadow-[0_0_12px_rgba(74,222,128,0.16)]">
                    Text
                  </button>
                  <button onClick={() => navigateCustomer(customer)} className={`rounded-xl border px-3 py-2.5 text-sm font-bold hover:border-emerald-300/35 hover:shadow-[0_0_12px_rgba(74,222,128,0.16)] ${customer.address ? "border-emerald-300/20 bg-emerald-400/15 text-emerald-100" : "border-white/10 bg-white/10 text-white/70"}`}>
                    Navigate
                  </button>
                  <button onClick={() => openCustomerDrawer(customer, null)} className="rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-sm font-bold text-white">
                    Open
                  </button>
                </div>
              </article>
            ))}
          </div>

          <aside className="order-first overflow-hidden rounded-[1.75rem] border border-white/20 bg-white/[0.045] p-4 lg:order-none lg:sticky lg:top-4 lg:h-fit">
            {openCustomer ? (
              <div>
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-2xl font-black">{openCustomer.name}</h3>
                    <p className="text-sm text-white/55">{openCustomer.phone || "No phone added"}</p>
                    {openCustomer.address && (
                      <p className="mt-1 text-xs font-semibold text-white/40">{openCustomer.address}</p>
                    )}
                  </div>
                  <button
                      onClick={closeDrawer}
                      className="rounded-xl border border-white/30 bg-black px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white shadow-lg shadow-black/40 hover:border-emerald-300/40 hover:text-emerald-100 hover:shadow-[0_0_14px_rgba(74,222,128,0.18)]"
                      type="button"
                    >
                      Close
                    </button>
                </div>

                <div className="grid gap-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="grid gap-2">
                      <span className="text-xs font-black uppercase tracking-[0.18em] text-white/40">Charge</span>
                      <input
                        className="min-w-0 w-full rounded-2xl border border-white/20 bg-black/45 px-4 py-3 text-white outline-none"
                        value={openCustomer.amount}
                        onChange={(event) => updateCustomer(openCustomer.id, { amount: event.target.value })}
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="text-xs font-black uppercase tracking-[0.18em] text-white/40">Payment Link</span>
                      <input
                        className="min-w-0 w-full rounded-2xl border border-white/20 bg-black/45 px-4 py-3 text-white outline-none"
                        value={openCustomer.paymentLink}
                        onChange={(event) => updateCustomer(openCustomer.id, { paymentLink: event.target.value })}
                        placeholder="Add payment link"
                      />
                      {!openCustomer.paymentLink && (
                        <span className="text-[11px] font-semibold text-white/35">
                          No payment link added yet. Invoice can still be sent.
                        </span>
                      )}
                    </label>
                  </div>
<div className="rounded-2xl border border-white/10 bg-black/25 p-3">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-white/40">Address</p>
                    {openCustomer.address ? (
                      <p className="mt-2 text-sm font-semibold text-white/70">{openCustomer.address}</p>
                    ) : (
                      <div className="mt-2 grid gap-2">
                        <input
                          className="min-w-0 w-full rounded-2xl border border-white/20 bg-black/45 px-4 py-3 text-white outline-none"
                          value={openCustomer.address || ""}
                          onChange={(event) => updateCustomer(openCustomer.id, { address: event.target.value })}
                          placeholder="Add address for navigation"
                        />
                        <span className="text-[11px] font-semibold text-white/35">
                          Add an address once. Navigate will use it from the card.
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl border border-emerald-300/15 bg-emerald-400/10 p-3">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-100/70">Next Action</p>
                      <span className="text-xs font-semibold text-white/45">
                        {getNextActionLabel(openCustomer)}
                      </span>
                    </div>

                    <button
                      disabled={getDisplayStatus(openCustomer) === "paid"}
                      onClick={() => runNextAction(openCustomer, createInvoice, sendInvoice, markPaid)}
                      className={
                        getDisplayStatus(openCustomer) === "paid"
                          ? "w-full rounded-xl bg-white/15 px-3 py-3 text-sm font-black text-white/60"
                          : !openCustomer.invoice
                            ? "w-full rounded-xl bg-purple-400/20 px-3 py-3 text-sm font-black text-purple-100"
                            : getDisplayStatus(openCustomer) === "sent"
                              ? "w-full rounded-xl bg-white px-3 py-3 text-sm font-black text-black"
                              : "w-full rounded-xl bg-emerald-400 px-3 py-3 text-sm font-black text-black"
                      }
                    >
                      {getNextActionButton(openCustomer)}
                    </button>

                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => textCustomer(openCustomer)}
                        className="rounded-xl border border-white/10 bg-black/25 px-3 py-2.5 text-xs font-bold text-white/70"
                      >
                        Text Customer
                      </button>
                      <button
                        onClick={() => {
                          updateCustomer(openCustomer.id, { status: "followup" });
                          setOpenSection("timeline");
                        }}
                        className="rounded-xl border border-amber-300/15 bg-amber-400/10 px-3 py-2.5 text-xs font-bold text-amber-100"
                      >
                        Follow Up
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <button
                      onClick={() => toggleSection("invoice")}
                      className={`${!openCustomer.invoice ? "hidden" : "flex"} items-center justify-between rounded-2xl border px-4 py-2.5 text-left ${
                        openSection === "invoice"
                          ? "border-purple-300/20 bg-purple-400/10"
                          : "border-white/10 bg-black/25"
                      }`}
                    >
                      <span>
                        <span className="block text-sm font-black text-white">Invoice</span>
                        <span className="text-xs text-white/45">
                          {openCustomer.invoice ? `${openCustomer.invoice.number} · ${openCustomer.invoice.status}` : "Not created yet"}
                        </span>
                      </span>
                      <span className="text-white/45">{openSection === "invoice" ? "▾" : "▸"}</span>
                    </button>

                    {openSection === "invoice" && (
                      <div className="rounded-2xl border border-purple-300/20 bg-purple-400/10 p-4">
                        {openCustomer.invoice ? (
                          <>
                            <div className="mb-3 flex items-start justify-between gap-3">
                              <div>
                                <p className="text-xs font-black uppercase tracking-[0.18em] text-purple-100/70">Invoice</p>
                                <h4 className="mt-1 text-xl font-black text-white">{openCustomer.invoice.number}</h4>
                              </div>
                              <span className="rounded-full border border-purple-300/20 bg-purple-400/15 px-3 py-1 text-xs font-black uppercase text-purple-100">
                                {openCustomer.invoice.status}
                              </span>
                            </div>

                            <label className="text-xs font-black uppercase tracking-[0.18em] text-white/40">Invoice Service</label>
                            <input
                              className="mt-2 w-full rounded-2xl border border-white/20 bg-black/45 px-4 py-3 text-white outline-none"
                              value={openCustomer.invoice.service}
                              onChange={(event) => updateInvoice(openCustomer, { service: event.target.value })}
                            />

                            <label className="mt-3 block text-xs font-black uppercase tracking-[0.18em] text-white/40">Invoice Amount</label>
                            <input
                              className="mt-2 w-full rounded-2xl border border-white/20 bg-black/45 px-4 py-3 text-white outline-none"
                              value={openCustomer.invoice.amount}
                              onChange={(event) => updateInvoice(openCustomer, { amount: event.target.value })}
                            />

                            <pre className="mt-3 max-h-20 max-w-full overflow-auto whitespace-pre-wrap break-words rounded-2xl border border-white/10 bg-black/35 p-3 text-xs leading-5 text-white/65">
                              {buildInvoiceText(openCustomer)}
                            </pre>

                            <button
                              onClick={() => copyInvoice(openCustomer)}
                              className="mt-3 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2.5 text-sm font-bold"
                            >
                              {copiedId === openCustomer.id ? "Copied" : "Copy Invoice Text"}
                            </button>
                          </>
                        ) : (
                          <div className="rounded-2xl border border-dashed border-purple-300/20 bg-purple-400/5 p-4 text-sm leading-6 text-white/55">
                            No invoice created yet. Tap <span className="font-black text-purple-100">Create Invoice</span> to turn this customer note and charge into an invoice.
                          </div>
                        )}
                      </div>
                    )}

                    <button
                      onClick={() => toggleSection("proof")}
                      className={`flex items-center justify-between rounded-2xl border px-4 py-2.5 text-left ${
                        openSection === "proof"
                          ? "border-emerald-300/25 bg-emerald-400/15"
                          : "border-white/10 bg-black/25"
                      }`}
                    >
                      <span>
                        <span className="block text-sm font-black text-white">Proof</span>
                        <span className="text-xs text-white/45">
                          Before: {openCustomer.proofPhotos?.before ? "added" : "missing"} · After: {openCustomer.proofPhotos?.after ? "added" : "missing"}
                        </span>
                      </span>
                      <span className="text-white/45">{openSection === "proof" ? "▾" : "▸"}</span>
                    </button>

                    {openSection === "proof" && (
                      <div className="rounded-2xl border border-emerald-300/15 bg-emerald-400/10 p-4">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="cursor-pointer rounded-2xl border border-white/10 bg-black/35 p-3 text-center text-sm font-black text-white/80 hover:border-emerald-300/30">
                            Add Before
                            <input
                              className="hidden"
                              type="file"
                              accept="image/*"
                              onChange={(event) => addProofPhoto(openCustomer, "before", event.target.files?.[0])}
                            />
                          </label>

                          <label className="cursor-pointer rounded-2xl border border-white/10 bg-black/35 p-3 text-center text-sm font-black text-white/80 hover:border-emerald-300/30">
                            Add After
                            <input
                              className="hidden"
                              type="file"
                              accept="image/*"
                              onChange={(event) => addProofPhoto(openCustomer, "after", event.target.files?.[0])}
                            />
                          </label>
                        </div>

                        {(openCustomer.proofPhotos?.before || openCustomer.proofPhotos?.after) ? (
                          <div className="mt-3 grid grid-cols-2 gap-3">
                            {openCustomer.proofPhotos?.before ? (
                              <div>
                                <p className="mb-1 text-xs font-black uppercase tracking-[0.16em] text-white/40">Before</p>
                                <img src={openCustomer.proofPhotos.before} alt="Before proof" className="h-24 w-full rounded-2xl object-cover" />
                              </div>
                            ) : (
                              <div className="rounded-2xl border border-dashed border-white/10 p-3 text-xs text-white/35">No before photo</div>
                            )}

                            {openCustomer.proofPhotos?.after ? (
                              <div>
                                <p className="mb-1 text-xs font-black uppercase tracking-[0.16em] text-white/40">After</p>
                                <img src={openCustomer.proofPhotos.after} alt="After proof" className="h-24 w-full rounded-2xl object-cover" />
                              </div>
                            ) : (
                              <div className="rounded-2xl border border-dashed border-white/10 p-3 text-xs text-white/35">No after photo</div>
                            )}
                          </div>
                        ) : (
                          <div className="mt-3 rounded-2xl border border-dashed border-white/10 p-3 text-sm text-white/45">
                            No proof photos added yet.
                          </div>
                        )}

                        <button
                          onClick={() => sendProofAndInvoice(openCustomer)}
                          className="mt-3 w-full rounded-xl bg-emerald-400 px-3 py-3 text-sm font-black text-black"
                        >
                          Send Proof + Invoice
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => toggleSection("notes")}
                      className={`flex items-center justify-between rounded-2xl border px-4 py-2.5 text-left ${
                        openSection === "notes"
                          ? "border-white/20 bg-white/10"
                          : "border-white/10 bg-black/25"
                      }`}
                    >
                      <span>
                        <span className="block text-sm font-black text-white">Notes</span>
                        <span className="text-xs text-white/45">Add a quick customer note</span>
                      </span>
                      <span className="text-white/45">{openSection === "notes" ? "▾" : "▸"}</span>
                    </button>

                    {openSection === "notes" && (
                      <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
                        <textarea
                          className="min-h-[90px] w-full rounded-2xl border border-white/20 bg-black/45 px-4 py-4 text-white outline-none placeholder:text-white/45"
                          placeholder="Write a note..."
                          value={newNotes[openCustomer.id] || ""}
                          onChange={(event) =>
                            setNewNotes((prev) => ({
                              ...prev,
                              [openCustomer.id]: event.target.value,
                            }))
                          }
                        />
                        <button onClick={() => addNote(openCustomer.id)} className="mt-3 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 font-black">
                          Add Note
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => toggleSection("timeline")}
                      className={`flex items-center justify-between rounded-2xl border px-4 py-2.5 text-left ${
                        openSection === "timeline"
                          ? "border-white/20 bg-white/10"
                          : "border-white/10 bg-black/25"
                      }`}
                    >
                      <span>
                        <span className="block text-sm font-black text-white">Timeline</span>
                        <span className="text-xs text-white/45">
                          {openCustomer.notes[0]?.text || "No activity yet"}
                        </span>
                      </span>
                      <span className="text-white/45">{openSection === "timeline" ? "▾" : "▸"}</span>
                    </button>

                    {openSection === "timeline" && (
                      <div className="space-y-3 rounded-2xl border border-white/10 bg-black/25 p-3">
                        {openCustomer.notes.length ? (
                          openCustomer.notes.map((note) => (
                            <div key={note.id} className="rounded-2xl border border-white/10 bg-black/35 p-3">
                              <p className="text-sm leading-6 text-white/78">{note.text}</p>
                              <p className="mt-2 text-xs text-white/35">
                                {new Date(note.createdAt).toLocaleString()}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="rounded-2xl border border-white/10 bg-black/35 p-3 text-sm text-white/50">
                            No notes yet.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden rounded-2xl border border-dashed border-white/15 p-5 text-white/60 lg:block">
                Open a customer to view notes, charge, invoice, proof photos, payment link, and status.
              </div>
            )}
          </aside>
        </section>

        <footer className="rounded-[1.5rem] border border-emerald-300/15 bg-emerald-400/10 p-5 text-center text-sm font-black text-emerald-100">
          Payment companies own the transaction. HomePlanet owns the workflow around it.
        </footer>
      </main>
    </div>
  );
}

























