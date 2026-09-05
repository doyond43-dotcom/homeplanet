const localSuppliers = [
  {
    badge: "LOCAL • OKEECHOBEE",
    name: "Okeechobee Feed",
    title: "Feed + Farm Supply",
    description:
      "Local livestock feed and supply store on State Road 70 serving Okeechobee farms, ranches, and animal owners.",
    detail: "1579 State Road 70 E • Okeechobee",
    phone: "863-763-2123",
    status: "Local feed store",
    action: "Visit Okeechobee Feed",
    href: "https://www.ranchfeedandpetsupplyinc.com/okeechobee-location",
  },
  {
    badge: "LOCAL • OKEECHOBEE",
    name: "Rabon's Country Feed",
    title: "Cattle Feed + Bulk Feed + Hay",
    description:
      "Local feed store carrying cattle feed, supplements, ranch products, hay, bulk feed, and molasses.",
    detail: "1852 NW 9th St • Okeechobee",
    phone: "863-763-3447",
    status: "Bulk feed + delivery",
    action: "See Rabon's Country Feed",
    href: "https://countryfeedokee.com/",
  },
  {
    badge: "LOCAL • OKEECHOBEE",
    name: "Walpole Feed & Supply",
    title: "Fresh-Milled Feed + Ranch Supplies",
    description:
      "Longtime Okeechobee feed mill with cattle feed, custom blends, hay, bulk feed, and farm and ranch supplies.",
    detail: "2595 NW 8th St • Okeechobee",
    phone: "863-763-6905",
    status: "On-site feed mill",
    action: "See Walpole Feed",
    href: "https://www.walpolefeed.com/",
  },
  {
    badge: "LOCAL • OKEECHOBEE",
    name: "Syfrett Feed / The Feedery",
    title: "Bagged + Bulk Feed",
    description:
      "Drive-up feed source with 50 lb bags, bulk feed, custom mixes, hay, minerals, and livestock feeding supplies.",
    detail: "3079 NW 8th St • Okeechobee",
    phone: "863-763-5586",
    status: "Bagged + bulk",
    action: "See Feed Options",
    href: "https://syfrettfeed.com/feedery",
  },
  {
    badge: "LOCAL • OKEECHOBEE",
    name: "Gator Feed Company",
    title: "Cattle Feed + Minerals",
    description:
      "Okeechobee feed manufacturer offering cattle feeds, custom feed mixes, minerals, conditioners, and balancers.",
    detail: "1205 US-98 • Okeechobee",
    phone: "863-763-3337",
    status: "Online pricing available",
    action: "View Current Feed Prices",
    href: "https://www.gatorfeedco.com/shop",
  },
  {
    badge: "LOCAL • OKEECHOBEE",
    name: "Jones Supply A.I. Sales & Service",
    title: "ADM Feed + Minerals + Livestock Equipment",
    description:
      "Local ADM Animal Nutrition dealer carrying feed, minerals, cattle equipment, breeding supplies, and other ranch products.",
    detail: "801 SW Park St • Okeechobee",
    phone: "863-467-0351",
    status: "Feed + equipment",
    action: "See Jones Supply",
    href: "https://www.jonessupply.biz/",
  },
  {
    badge: "LOCAL DEALER • FORT DRUM",
    name: "Fort Drum Hitching Post",
    title: "Local Knight's Feed Dealer",
    description:
      "Knight's Feed lists Fort Drum Hitching Post as a dealer located in Fort Drum, Okeechobee County.",
    detail: "Fort Drum • Okeechobee County",
    phone: "",
    status: "Knight's Feed dealer",
    action: "Get Directions",
    href: "https://www.google.com/maps/search/?api=1&query=Fort+Drum+Hitching+Post+Okeechobee+FL",
  },
];

const regionalSuppliers = [
  {
    badge: "REGIONAL • BUSHNELL",
    name: "Knight's Feed",
    title: "Cattle Feed + Minerals",
    description:
      "Cattle feed lineup includes developer feeds, cattle cubes, calf feed, protein supplements, minerals, blocks, and tubs.",
    detail: "Bushnell, Florida",
    phone: "352-793-2242",
    status: "Cattle product catalog",
    action: "View Cattle Feed",
    href: "https://knightsfeed.com/cattle-1",
  },
  {
    badge: "REGIONAL BULK • LAKE CITY",
    name: "Furst-McNess",
    title: "Bulk Feed + Commodities",
    description:
      "Large-scale feed and commodity source serving beef, dairy, poultry, and production agriculture across the Southeast.",
    detail: "Lake City, Florida operations",
    phone: "",
    status: "Request current quote",
    action: "See Bulk Commodities",
    href: "https://www.mcness.com/commodities/",
  },
];

type Supplier = {
  badge: string;
  name: string;
  title: string;
  description: string;
  detail: string;
  phone: string;
  status: string;
  action: string;
  href: string;
};

function SupplierCard({ supplier }: { supplier: Supplier }) {
  return (
    <article className="rr-card">
      <div className="rr-card-badge">
        {supplier.badge}
      </div>

      <h3>{supplier.name}</h3>

      <div className="rr-card-title">
        {supplier.title}
      </div>

      <div className="rr-card-copy">
        {supplier.description}
      </div>

      <div className="rr-card-detail">
        {supplier.detail}
      </div>

      {supplier.phone ? (
        <a
          className="rr-phone"
          href={`tel:${supplier.phone.replace(/\D/g, "")}`}
        >
          {supplier.phone}
        </a>
      ) : null}

      <div className="rr-card-bottom">
        <div className="rr-status">
          {supplier.status}
        </div>

        <a
          className="rr-action"
          href={supplier.href}
        >
          {supplier.action}
        </a>
      </div>
    </article>
  );
}

export default function OkeechobeeMeatMarketRanchResourcesPage() {
  return (
    <div className="ranch-resources-page">
      <style>{`
        .ranch-resources-page {
          min-height: 100vh;
          background: #f5f0e5;
          color: #17231b;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .rr-shell {
          width: min(1120px, calc(100% - 32px));
          margin: 0 auto;
        }

        .rr-topbar {
          padding: 22px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .rr-back {
          color: #33463a;
          text-decoration: none;
          font-weight: 800;
          font-size: 14px;
        }

        .rr-brand {
          font-size: 13px;
          font-weight: 950;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: #876e2d;
        }

        .rr-hero {
          background: linear-gradient(145deg, #253029 0%, #303d34 100%);
          color: white;
          border-radius: 28px;
          padding: 42px;
          box-shadow: 0 22px 50px rgba(23,35,27,.14);
        }

        .rr-kicker {
          color: #d8b75f;
          text-transform: uppercase;
          letter-spacing: .12em;
          font-size: 12px;
          font-weight: 950;
          margin-bottom: 10px;
        }

        .rr-hero h1 {
          margin: 0;
          font-size: clamp(38px, 7vw, 72px);
          line-height: .98;
          letter-spacing: -.045em;
          max-width: 800px;
        }

        .rr-hero p {
          margin: 20px 0 0;
          max-width: 730px;
          color: rgba(255,255,255,.76);
          font-size: 18px;
          line-height: 1.6;
        }

        .rr-section {
          padding: 46px 0 0;
        }

        .rr-section-head {
          margin-bottom: 20px;
        }

        .rr-section-head h2 {
          margin: 0 0 8px;
          font-size: clamp(28px, 4vw, 40px);
          letter-spacing: -.035em;
        }

        .rr-section-head p {
          margin: 0;
          color: #667067;
          line-height: 1.55;
          max-width: 760px;
        }

        .rr-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .rr-card {
          background: rgba(255,255,255,.72);
          border: 1px solid rgba(23,35,27,.12);
          border-radius: 22px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          min-height: 300px;
        }

        .rr-card-badge {
          color: #876e2d;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: .1em;
          margin-bottom: 12px;
        }

        .rr-card h3 {
          margin: 0;
          font-size: 24px;
          line-height: 1.1;
        }

        .rr-card-title {
          margin-top: 7px;
          font-weight: 850;
          color: #425247;
        }

        .rr-card-copy {
          color: #657067;
          line-height: 1.55;
          margin: 16px 0 12px;
        }

        .rr-card-detail {
          color: #667067;
          font-size: 13px;
          line-height: 1.45;
          font-weight: 750;
          margin-bottom: 5px;
        }

        .rr-phone {
          display: inline-block;
          width: fit-content;
          color: #24362b;
          text-decoration: none;
          font-size: 14px;
          font-weight: 950;
          margin: 2px 0 16px;
        }

        .rr-card-bottom {
          margin-top: auto;
        }

        .rr-status {
          display: inline-block;
          margin-bottom: 12px;
          border-radius: 999px;
          padding: 7px 10px;
          background: rgba(216,183,95,.14);
          border: 1px solid rgba(135,110,45,.18);
          color: #705b25;
          font-size: 12px;
          font-weight: 850;
        }

        .rr-action {
          display: block;
          text-align: center;
          text-decoration: none;
          background: #24362b;
          color: white;
          padding: 13px 16px;
          border-radius: 13px;
          font-weight: 900;
        }

        .rr-watch {
          background: #fffaf0;
          border: 1px solid rgba(135,110,45,.22);
          border-radius: 24px;
          padding: 26px;
        }

        .rr-watch h3 {
          margin: 0 0 8px;
          font-size: 25px;
        }

        .rr-watch p {
          margin: 0;
          color: #667067;
          line-height: 1.6;
        }

        .rr-watch-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0,1fr));
          gap: 10px;
          margin-top: 18px;
        }

        .rr-watch-item {
          background: white;
          border: 1px solid rgba(23,35,27,.09);
          border-radius: 14px;
          padding: 13px;
          font-size: 13px;
          font-weight: 800;
          color: #435148;
        }

        .rr-coming {
          background: rgba(255,255,255,.6);
          border: 1px dashed rgba(23,35,27,.22);
          border-radius: 24px;
          padding: 28px;
        }

        .rr-coming h3 {
          margin: 0 0 8px;
          font-size: 25px;
        }

        .rr-coming p {
          margin: 0;
          color: #667067;
          line-height: 1.6;
        }

        .rr-footnote {
          padding: 30px 0 48px;
          color: #7a817b;
          font-size: 12px;
          line-height: 1.5;
        }

        @media (max-width: 720px) {
          .rr-shell {
            width: min(100% - 20px, 1120px);
          }

          .rr-hero {
            padding: 28px 22px;
            border-radius: 22px;
          }

          .rr-hero p {
            font-size: 16px;
          }

          .rr-grid,
          .rr-watch-grid {
            grid-template-columns: 1fr;
          }

          .rr-section {
            padding-top: 34px;
          }

          .rr-card {
            min-height: 0;
          }
        }
      `}</style>

      <div className="rr-shell">
        <div className="rr-topbar">
          <a
            className="rr-back"
            href="/planet/okeechobee/meat-market"
          >
            ← Back to Live Meat Market
          </a>

          <div className="rr-brand">
            Okeechobee Ranch Resources
          </div>
        </div>

        <section className="rr-hero">
          <div className="rr-kicker">
            Built for local producers
          </div>

          <h1>Feed &amp; Grain Around Okeechobee</h1>

          <p>
            Start with Okeechobee. Find local feed stores,
            mills, bulk sources, hay, minerals, and ranch
            supplies — then compare regional options when
            a larger order makes sense.
          </p>
        </section>

        <section className="rr-section">
          <div className="rr-section-head">
            <div className="rr-kicker">
              Start here
            </div>

            <h2>Local Feed &amp; Ranch Supply</h2>

            <p>
              Okeechobee-area sources first, so local ranchers
              can see what is close before driving somewhere else.
            </p>
          </div>

          <div className="rr-grid">
            {localSuppliers.map((supplier) => (
              <SupplierCard
                key={supplier.name}
                supplier={supplier}
              />
            ))}
          </div>
        </section>

        <section className="rr-section">
          <div className="rr-section-head">
            <div className="rr-kicker">
              Larger orders + more options
            </div>

            <h2>Regional &amp; Bulk Sources</h2>

            <p>
              Useful when a specific ration, commodity, bulk quantity,
              or regional supplier may beat the local option after the
              full cost is compared.
            </p>
          </div>

          <div className="rr-grid">
            {regionalSuppliers.map((supplier) => (
              <SupplierCard
                key={supplier.name}
                supplier={supplier}
              />
            ))}
          </div>
        </section>

        <section className="rr-section">
          <div className="rr-watch">
            <div className="rr-kicker">
              Building now
            </div>

            <h3>Best Price Watch</h3>

            <p>
              The next layer is the useful part: dated, verified
              prices compared on the same basis so ranchers can
              see whether a cheaper bag or ton is actually the
              better deal after quantity, delivery, and distance.
            </p>

            <div className="rr-watch-grid">
              <div className="rr-watch-item">
                Price per bag / lb / ton
              </div>

              <div className="rr-watch-item">
                Protein + formulation
              </div>

              <div className="rr-watch-item">
                Bulk minimum + delivery
              </div>

              <div className="rr-watch-item">
                Distance + last checked
              </div>
            </div>
          </div>
        </section>

        <section className="rr-section">
          <div className="rr-coming">
            <div className="rr-kicker">
              Coming next
            </div>

            <h3>Ranch Equipment &amp; Supplies</h3>

            <p>
              Hay rings, feeders, troughs, gates, fencing,
              mineral feeders, and other useful ranch equipment
              can live here as listings and sources are verified.
            </p>
          </div>
        </section>

        <div className="rr-footnote">
          Feed prices, inventory, formulations, package sizes,
          phone numbers, and delivery terms can change. Verify
          current details directly with the supplier before purchasing.
        </div>
      </div>
    </div>
  );
}