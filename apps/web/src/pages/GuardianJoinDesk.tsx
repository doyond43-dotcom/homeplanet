import { useState } from "react";
import {
  Shield,
  Mail,
  CheckCircle2,
  CreditCard,
  QrCode,
} from "lucide-react";

type OrderStage =
  | "waiting"
  | "confirmed"
  | "payment-pending"
  | "payment-received"
  | "production"
  | "shipped"
  | "delivered";

function nowStamp() {
  return new Date().toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function GuardianJoinDesk() {
  const [mailing, setMailing] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    email: "",
  });

  const [orderStage, setOrderStage] = useState<OrderStage>("waiting");
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  function updateField(field: string, value: string) {
    setMailing((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleSubmitMailingDetails() {
    if (
      !mailing.fullName.trim() ||
      !mailing.address.trim() ||
      !mailing.city.trim() ||
      !mailing.state.trim() ||
      !mailing.zip.trim()
    ) {
      return;
    }

    setOrderStage("payment-pending");
    setLastUpdate(nowStamp());

    console.log(
      `Order confirmed for ${mailing.fullName}. Waiting for payment to start production.`
    );
  }

  function handlePaymentReceived() {
    setOrderStage("payment-received");
    setLastUpdate(nowStamp());

    console.log(
      `Payment received for ${mailing.fullName}. Order is ready to move into production.`
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1020] text-white">
      <div className="mx-auto max-w-[820px] px-6 py-8">
        <header className="mb-6 rounded-3xl border border-blue-400/20 bg-gradient-to-r from-blue-900/40 to-purple-900/40 p-6">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-blue-300" />
            <h1 className="text-xl font-semibold">Create Your Pet Tag</h1>
          </div>

          <p className="mt-2 text-sm text-blue-200/80">
            No pair code. No device linking. Just create your pet tag and we’ll send it.
          </p>
        </header>

        <section className="rounded-3xl border border-yellow-400/20 bg-yellow-900/10 p-5">
          <div className="mb-3 text-sm uppercase text-yellow-200/80">
            Mailing Details
          </div>

          <div className="grid gap-3">
            <input
              placeholder="Full Name"
              value={mailing.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              className="rounded-xl bg-[#0c1730] p-3 text-white outline-none placeholder:text-white/45"
            />
            <input
              placeholder="Street Address"
              value={mailing.address}
              onChange={(e) => updateField("address", e.target.value)}
              className="rounded-xl bg-[#0c1730] p-3 text-white outline-none placeholder:text-white/45"
            />

            <div className="grid grid-cols-3 gap-2">
              <input
                placeholder="City"
                value={mailing.city}
                onChange={(e) => updateField("city", e.target.value)}
                className="rounded-xl bg-[#0c1730] p-3 text-white outline-none placeholder:text-white/45"
              />
              <input
                placeholder="State"
                value={mailing.state}
                onChange={(e) => updateField("state", e.target.value)}
                className="rounded-xl bg-[#0c1730] p-3 text-white outline-none placeholder:text-white/45"
              />
              <input
                placeholder="ZIP"
                value={mailing.zip}
                onChange={(e) => updateField("zip", e.target.value)}
                className="rounded-xl bg-[#0c1730] p-3 text-white outline-none placeholder:text-white/45"
              />
            </div>

            <input
              placeholder="Email (optional)"
              value={mailing.email}
              onChange={(e) => updateField("email", e.target.value)}
              className="rounded-xl bg-[#0c1730] p-3 text-white outline-none placeholder:text-white/45"
            />

            <button
              onClick={handleSubmitMailingDetails}
              className="mt-2 flex items-center justify-center gap-2 rounded-2xl border border-yellow-400/35 bg-yellow-600/20 px-4 py-3 transition hover:bg-yellow-600/30"
            >
              <Mail className="h-4 w-4" />
              Submit Mailing Details
            </button>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-blue-400/20 bg-blue-900/20 p-5">
          <div className="text-sm uppercase text-blue-200/80">Order Status</div>

          {orderStage === "waiting" && (
            <>
              <div className="mt-2 text-base font-semibold">Waiting for mailing details</div>
              <p className="mt-1 text-sm text-white/70">
                Enter your mailing details so we can confirm your order.
              </p>
            </>
          )}

          {orderStage === "confirmed" && (
            <>
              <div className="mt-2 flex items-center gap-2 text-base font-semibold text-emerald-300">
                <CheckCircle2 className="h-5 w-5" />
                Order Confirmed
              </div>
              <p className="mt-1 text-sm text-white/80">
                Your pet tag request has been received successfully.
              </p>

              <div className="mt-4 space-y-2 text-sm text-white/70">
                <div>• Payment Pending</div>
                <div>• In Production</div>
                <div>• Shipped</div>
                <div>• Delivered</div>
              </div>

              <div className="mt-4 text-xs text-white/55">
                We’ll send updates here and by text.
              </div>

              {lastUpdate ? (
                <div className="mt-2 text-xs text-blue-200/65">Last update: {lastUpdate}</div>
              ) : null}
            </>
          )}

          {orderStage === "payment-pending" && (
            <>
              <div className="mt-2 flex items-center gap-2 text-base font-semibold text-emerald-300">
                <CheckCircle2 className="h-5 w-5" />
                Order Confirmed
              </div>
              <p className="mt-1 text-sm text-white/80">
                Your pet tag request has been received successfully.
              </p>

              <div className="mt-4 space-y-2 text-sm text-white/70">
                <div>• Payment Pending</div>
                <div>• In Production</div>
                <div>• Shipped</div>
                <div>• Delivered</div>
              </div>

              <div className="mt-4 text-xs text-white/55">
                We’ll send updates here and by text.
              </div>

              {lastUpdate ? (
                <div className="mt-2 text-xs text-blue-200/65">Last update: {lastUpdate}</div>
              ) : null}
            </>
          )}

          {orderStage === "payment-received" && (
            <>
              <div className="mt-2 flex items-center gap-2 text-base font-semibold text-emerald-300">
                <CheckCircle2 className="h-5 w-5" />
                Payment Received
              </div>
              <p className="mt-1 text-sm text-white/80">
                Payment has been received. Your tag is ready to move into production.
              </p>

              <div className="mt-4 space-y-2 text-sm text-white/70">
                <div>• In Production</div>
                <div>• Shipped</div>
                <div>• Delivered</div>
              </div>

              <div className="mt-4 text-xs text-white/55">
                We’ll send updates here and by text.
              </div>

              {lastUpdate ? (
                <div className="mt-2 text-xs text-blue-200/65">Last update: {lastUpdate}</div>
              ) : null}
            </>
          )}

          {orderStage === "production" && (
            <>
              <div className="mt-2 text-base font-semibold text-yellow-300">In Production</div>
              <p className="mt-1 text-sm text-white/80">
                Your pet tag is currently being prepared.
              </p>
              {lastUpdate ? (
                <div className="mt-2 text-xs text-blue-200/65">Last update: {lastUpdate}</div>
              ) : null}
            </>
          )}

          {orderStage === "shipped" && (
            <>
              <div className="mt-2 text-base font-semibold text-cyan-300">Shipped</div>
              <p className="mt-1 text-sm text-white/80">
                Your pet tag has shipped. Tracking information will appear here.
              </p>
              {lastUpdate ? (
                <div className="mt-2 text-xs text-blue-200/65">Last update: {lastUpdate}</div>
              ) : null}
            </>
          )}

          {orderStage === "delivered" && (
            <>
              <div className="mt-2 text-base font-semibold text-emerald-300">Delivered</div>
              <p className="mt-1 text-sm text-white/80">
                Your pet tag has been delivered.
              </p>
              {lastUpdate ? (
                <div className="mt-2 text-xs text-blue-200/65">Last update: {lastUpdate}</div>
              ) : null}
            </>
          )}
        </section>

        {orderStage !== "waiting" && (
          <section className="mt-6 rounded-3xl border border-emerald-400/20 bg-emerald-900/10 p-5">
            <div className="text-sm uppercase text-emerald-200/80">Mail Summary</div>

            <div className="mt-2 text-sm text-white/80">
              Ship to: {mailing.fullName || "—"} <br />
              Address: {mailing.address || "—"} <br />
              City/State/ZIP: {mailing.city || "—"} {mailing.state || "—"} {mailing.zip || "—"} <br />
              Email: {mailing.email || "—"}
            </div>
          </section>
        )}

        {orderStage === "payment-pending" && (
          <section className="mt-6 rounded-3xl border border-cyan-400/20 bg-cyan-900/15 p-5">
            <div className="flex items-center gap-2 text-sm uppercase text-cyan-200/80">
              <CreditCard className="h-4 w-4" />
              Complete Payment
            </div>

            <p className="mt-3 text-sm text-white/80">
              Your tag order is confirmed. Payment starts production.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <a
                href="/planet/payments/node"
                className="flex items-center justify-center gap-2 rounded-2xl border border-cyan-400/30 bg-cyan-500/15 px-4 py-3 text-sm font-medium text-cyan-50 transition hover:bg-cyan-500/25"
              >
                <QrCode className="h-4 w-4" />
                Pay with Cash App
              </a>

              <a
                href="/planet/payments/node"
                className="flex items-center justify-center gap-2 rounded-2xl border border-cyan-400/30 bg-cyan-500/15 px-4 py-3 text-sm font-medium text-cyan-50 transition hover:bg-cyan-500/25"
              >
                <QrCode className="h-4 w-4" />
                Pay with Zelle
              </a>

              <button
                type="button"
                onClick={handlePaymentReceived}
                className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-400/30 bg-emerald-500/15 px-4 py-3 text-sm font-medium text-emerald-50 transition hover:bg-emerald-500/25"
              >
                <CheckCircle2 className="h-4 w-4" />
                Mark Payment Received
              </button>
            </div>

            <p className="mt-3 text-xs text-white/55">
              Once payment is received, the tag moves into production.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}