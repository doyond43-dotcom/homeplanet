export default function SlapABugLiveBoard() {
  const appointments = [
    { time: "8:30 AM", customer: "Sarah M.", job: "Rodent inspection", area: "Okeechobee", status: "Next Stop" },
    { time: "10:15 AM", customer: "Mike R.", job: "Roach treatment", area: "SW section", status: "Scheduled" },
    { time: "1:00 PM", customer: "Linda P.", job: "Ant perimeter spray", area: "Taylor Creek", status: "Scheduled" },
  ]

  const requests = [
    { name: "James T.", issue: "Rat noise in attic", time: "12 min ago" },
    { name: "Maria G.", issue: "Need estimate for monthly service", time: "34 min ago" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-green-950 to-black px-5 py-8 text-white">
      <section className="mx-auto max-w-md">
        <div className="mb-6 text-center">
          <img src="/images/slap-a-bug-logo.png" alt="Slap-A-Bug Pest Control" className="mx-auto mb-4 w-full max-w-[220px] object-contain" />

          <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-400">
            Owner Live Board
          </p>

          <h1 className="mt-3 text-4xl font-black leading-none">
            TODAY'S
            <br />
            PEST ROUTE
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-zinc-300">
            Appointments, new requests, follow-ups, and completed jobs in one simple daily view.
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <a
              href="/planet/slap-a-bug"
              className="rounded-2xl border border-green-400/30 bg-green-500/15 px-5 py-3 text-sm font-bold text-green-200 shadow-lg shadow-green-500/10"
            >
              Customer Intake
            </a>

            <button
              className="rounded-2xl border border-zinc-700 bg-zinc-900/80 px-5 py-3 text-sm font-bold text-zinc-200"
            >
              Share QR
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            ["3", "Jobs Today"],
            ["2", "New Requests"],
            ["$1,240", "Today's Revenue"],
            ["2", "Pending Payments"],
          ].map(([number, label]) => (
            <div key={label} className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
              <p className="text-3xl font-black text-green-400">{number}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-zinc-400">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-3xl border border-green-400/20 bg-green-500/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-green-300">
                Repeat Customers
              </p>

              <p className="mt-2 text-3xl font-black text-white">
                18 Active
              </p>
            </div>

            <div className="rounded-2xl bg-black/40 px-4 py-3 text-right">
              <p className="text-xs uppercase tracking-wider text-zinc-500">
                Monthly Service
              </p>

              <p className="mt-1 text-lg font-black text-green-300">
                9 Renewals
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-red-400/40 bg-red-500/15 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-300">
            Next Appointment
          </p>
          <p className="mt-3 text-2xl font-black">8:30 AM • Sarah M.</p>
          <p className="mt-1 text-sm text-zinc-200">Rodent inspection • Shed / garage area</p>

          <div className="mt-5 grid grid-cols-2 gap-2">
            <a href="tel:8633683628" className="rounded-xl bg-red-600 px-3 py-3 text-center text-sm font-bold">Call</a>
            <a href="sms:+18633683628?&body=Hey%2C%20I%E2%80%99m%20on%20the%20way%20for%20your%20Slap-A-Bug%20service%20visit." className="rounded-xl bg-green-500 px-3 py-3 text-center text-sm font-bold text-black">Text ETA</a>
          </div>
        </div>

        <div className="mt-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-zinc-400">
            Today's Route
          </p>

          <div className="space-y-3">
            {appointments.map((job) => (
              <div key={job.customer} className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-green-400">{job.time}</p>
                    <p className="mt-1 text-lg font-black">{job.customer}</p>
                    <p className="text-sm text-zinc-300">{job.job}</p>
                    <p className="mt-1 text-xs uppercase tracking-wider text-zinc-500">{job.area}</p>
                  </div>
                  <span className="rounded-full bg-zinc-800 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-zinc-300">
                    {job.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <button className="rounded-xl bg-green-500/20 border border-green-400/40 px-3 py-2 text-xs font-bold text-green-300">Start</button>
                  <a href="https://www.google.com/maps/search/?api=1&query=Okeechobee%2C%20FL" target="_blank" rel="noreferrer" className="rounded-xl bg-blue-500/15 border border-blue-400/30 px-3 py-2 text-center text-xs font-bold text-blue-200">Map</a>
                  <button className="rounded-xl bg-zinc-800 border border-zinc-600 px-3 py-2 text-xs font-bold text-zinc-200">Done</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-zinc-400">
            New Requests
          </p>

          <div className="space-y-3">
            {requests.map((request) => (
              <div key={request.name} className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4">
                <p className="text-lg font-black">{request.name}</p>
                <p className="mt-1 text-sm text-zinc-300">{request.issue}</p>
                <p className="mt-2 text-xs uppercase tracking-wider text-zinc-500">{request.time}</p>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <a href="tel:8633683628" className="rounded-xl bg-red-600 px-3 py-3 text-center text-sm font-bold">Call Back</a>
                  <a href="sms:+18633683628?&body=Hey%2C%20I%20would%20like%20to%20schedule%20your%20Slap-A-Bug%20service%20visit." className="rounded-xl bg-green-500 px-3 py-3 text-center text-sm font-bold text-black">Schedule</a>
                </div>
              </div>
            ))}
          </div>
        </div>

        
        <div className="mt-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-zinc-400">
            Today's Activity
          </p>

          <div className="space-y-3">
            {[
              "Payment received from Sarah M. • 8:42 AM",
              "New rodent estimate requested • 9:15 AM",
              "Technician arrived at Mike R. property • 10:08 AM",
              "Monthly service renewed • 11:20 AM",
            ].map((activity) => (
              <div
                key={activity}
                className="rounded-2xl border border-zinc-800 bg-zinc-950/70 px-4 py-4 text-sm text-zinc-200"
              >
                {activity}
              </div>
            ))}
          </div>
        </div>
<div className="mt-8 rounded-3xl border border-green-400/30 bg-green-500/10 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-green-300">
            How Customers Flow In
          </p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-200">
            Customers click the live page, scan a QR code, or tap from a Facebook post. New calls, text requests, appointments, and follow-ups land here so the day stays organized.
          </p>
        </div>
      </section>
    </main>
  )
}








