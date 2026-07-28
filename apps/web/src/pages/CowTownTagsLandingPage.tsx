import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Check,
  Fence,
  MapPin,
  MessageCircle,
  Phone,
  QrCode,
  Radio,
  ScanLine,
  ShieldCheck,
  Tags,
} from "lucide-react";
import QRCode from "react-qr-code";
import { Link } from "react-router-dom";
import "./CowTownTagsLandingV2.css";

const demoTagUrl =
  "https://www.homeplanet.city/planet/cow-town-tags/tag/CT-0847";

export default function CowTownTagsLandingPage() {
  return (
    <div className="ctv2-page">
      <header className="ctv2-header">
        <div className="ctv2-shell ctv2-header-inner">
          <Link className="ctv2-brand" to="/planet/cow-town-tags">
            <span className="ctv2-brand-mark">CT</span>

            <span>
              <strong>Cow Town Tags</strong>
              <small>Livestock Recovery System</small>
            </span>
          </Link>

          <Link
            className="ctv2-small-action"
            to="/planet/cow-town-tags/tag/CT-0847"
          >
            See Live Tag
          </Link>
        </div>
      </header>

      <main>
        <section className="ctv2-hero">
          <div className="ctv2-shell">
            <div className="ctv2-hero-copy">
              <div className="ctv2-eyebrow">
                <ShieldCheck size={15} />
                Livestock identification connected to real recovery
              </div>

              <h1>
                Help your livestock
                <span>get home faster.</span>
              </h1>

              <p>
                If livestock gets out, someone can scan the ear tag, share the
                location and help the ranch take the right next action.
              </p>

              <div className="ctv2-actions">
                <Link
                  className="ctv2-button ctv2-button-primary"
                  to="/planet/cow-town-tags/tag/CT-0847"
                >
                  <QrCode size={19} />
                  See CT-0847 Live
                </Link>

                <a
                  className="ctv2-button ctv2-button-secondary"
                  href="#tag-options"
                >
                  <Tags size={19} />
                  Protect My Herd
                </a>
              </div>

              <div className="ctv2-trust">
                <span>
                  <BadgeCheck size={14} />
                  No public app needed
                </span>

                <span>
                  <BadgeCheck size={14} />
                  Scan and report
                </span>

                <span>
                  <BadgeCheck size={14} />
                  Reach the ranch fast
                </span>
              </div>
            </div>

            <div
              className="ctv2-hero-photo"
              role="img"
              aria-label="Cow wearing Cow Town Tag CT-0847 in a natural Florida ranch setting"
            >
              <div className="ctv2-hero-photo-copy">
                <span>Real livestock. Real recovery.</span>
                <strong>
                  One visible tag can change what happens next.
                </strong>
              </div>
            </div>
          </div>
        </section>

        <section className="ctv2-section ctv2-how">
          <div className="ctv2-shell">
            <div className="ctv2-centered-heading">
              <span>See how it works</span>

              <h2>
                If someone finds your livestock,
                <em>this is all they do.</em>
              </h2>

              <p>
                They see the tag, scan it with their phone and the animal’s
                public recovery page opens.
              </p>
            </div>

            <div className="ctv2-explainer">
              <article>
                <div className="ctv2-step-top">
                  <span>1</span>
                  <div>
                    <strong>They see the tag.</strong>
                    <p>A visible animal number and recovery QR code.</p>
                  </div>
                </div>

                <div className="ctv2-step-visual ctv2-real-step-photo">
                  <img
                    src="/images/cow-town-tags-tag-closeup.jpg"
                    alt="Close-up of Cow Town Tag CT-0847 attached to a cow's ear"
                  />
                </div>
              </article>

              <article>
                <div className="ctv2-step-top">
                  <span>2</span>
                  <div>
                    <strong>They scan it.</strong>
                    <p>The camera opens the public livestock page.</p>
                  </div>
                </div>

                <div className="ctv2-step-visual ctv2-step-photo">
                  <img
                    src="/images/cow-town-tags-scan.jpg"
                    alt="A person safely scanning the Cow Town QR tag on livestock"
                  />

                  <div className="ctv2-step-photo-label">
                    <ScanLine size={16} />
                    Scan the visible tag
                  </div>
                </div>
              </article>

              <article>
                <div className="ctv2-step-top">
                  <span>3</span>
                  <div>
                    <strong>The livestock page opens.</strong>
                    <p>The finder sees exactly what to do next.</p>
                  </div>
                </div>

                <div className="ctv2-step-visual ctv2-real-step-photo">
                  <img
                    src="/images/cow-town-tags-live-page.jpg"
                    alt="A phone displaying the CT-0847 livestock recovery page beside the tagged cow"
                  />
                </div>
              </article>

              <div className="ctv2-explainer-bottom">
                <div>
                  <strong>No app. No account. Just scan and help.</strong>
                  <p>
                    The finder gets the information and safe next action needed
                    to help the ranch.
                  </p>
                </div>

                <Link
                  className="ctv2-inline-action"
                  to="/planet/cow-town-tags/tag/CT-0847"
                >
                  Try the live tag
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="ctv2-section">
          <div className="ctv2-shell ctv2-split">
            <div className="ctv2-animal-story">
              <div
                className="ctv2-animal-scene"
                role="img"
                aria-label="Cow wearing active Cow Town livestock tag CT-0847"
              />

              <div className="ctv2-story-status">
                <span>
                  <Radio size={15} />
                  Active and ready
                </span>

                <strong>CT-0847</strong>
              </div>
            </div>

            <div className="ctv2-copy-block">
              <span className="ctv2-section-label">
                The tag is connected
              </span>

              <h2>
                One visible tag.
                <em>A live recovery page for your livestock.</em>
              </h2>

              <p>
                The ear tag connects directly to the animal’s public page. If
                the animal gets out, the person who finds it has one clear
                place to identify the livestock and help the ranch.
              </p>

              <div className="ctv2-feature-rows">
                <div>
                  <strong>Animal identity</strong>
                  <span>
                    Cow Town ID, animal number, species and identifying details.
                  </span>
                </div>

                <div>
                  <strong>Reach the ranch</strong>
                  <span>
                    Give the finder a direct way to call or text the ranch.
                  </span>
                </div>

                <div>
                  <strong>Report location</strong>
                  <span>
                    Share where the animal was seen and its direction of travel.
                  </span>
                </div>

                <div>
                  <strong>Lost mode</strong>
                  <span>
                    Show the last known location and the information that matters.
                  </span>
                </div>

                <div>
                  <strong>Keep it current</strong>
                  <span>
                    Update status, safety notes and recovery information.
                  </span>
                </div>
              </div>

              <Link
                className="ctv2-button ctv2-button-primary"
                to="/planet/cow-town-tags/tag/CT-0847"
              >
                See the Live Livestock Page
              </Link>
            </div>
          </div>
        </section>

        <section className="ctv2-section">
          <div className="ctv2-shell">
            <div className="ctv2-recovery-block">
              <div className="ctv2-copy-block">
                <span className="ctv2-section-label">
                  When livestock is found
                </span>

                <h2>
                  Scan the tag.
                  <em>Report the location right away.</em>
                </h2>

                <p>
                  The public page opens immediately with the information and
                  safe actions needed to help the ranch respond.
                </p>

                <ul className="ctv2-check-list">
                  <li>
                    <Check size={17} />
                    No app to download
                  </li>
                  <li>
                    <Check size={17} />
                    No finder account or login
                  </li>
                  <li>
                    <Check size={17} />
                    Call or text the ranch
                  </li>
                  <li>
                    <Check size={17} />
                    Report a current or earlier sighting
                  </li>
                  <li>
                    <Check size={17} />
                    Add movement, condition and safety details
                  </li>
                </ul>
              </div>

              <div className="ctv2-roadside-visual">
                <img
                  src="/images/cow-town-tags-roadside-report.jpg"
                  alt="A motorist safely reporting loose livestock near a rural roadway"
                />

                <div className="ctv2-roadside-overlay">
                  <span>
                    <MapPin size={15} />
                    Location reported
                  </span>

                  <strong>
                    The ranch now knows where to begin.
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="ctv2-section ctv2-activity-section">
          <div className="ctv2-shell ctv2-activity-layout">
            <div className="ctv2-copy-block">
              <span className="ctv2-section-label">
                More than a QR code
              </span>

              <h2>
                The scan is only
                <em>the beginning.</em>
              </h2>

              <p>
                A public scan or location report becomes active information
                inside the ranch system. The recovery can be reviewed,
                assigned, coordinated and preserved from beginning to outcome.
              </p>

              <div className="ctv2-proof-line">
                <Activity size={20} />
                Origin → action → recovery → outcome
              </div>
            </div>

            <div className="ctv2-timeline-card">
              <div className="ctv2-timeline-heading">
                <div>
                  <small>CT-0847 · LIVE ACTIVITY</small>
                  <strong>Loose livestock recovery</strong>
                </div>

                <span>LIVE</span>
              </div>

              <div className="ctv2-timeline">
                <div>
                  <time>10:42 AM</time>
                  <span />
                  <p>
                    <strong>Tag scanned</strong>
                    Public livestock page opened from a phone.
                  </p>
                </div>

                <div>
                  <time>10:43 AM</time>
                  <span />
                  <p>
                    <strong>Location reported</strong>
                    Animal seen near a roadway and moving east.
                  </p>
                </div>

                <div>
                  <time>10:45 AM</time>
                  <span />
                  <p>
                    <strong>Ranch notified</strong>
                    Report entered the recovery Live Board.
                  </p>
                </div>

                <div>
                  <time>10:51 AM</time>
                  <span />
                  <p>
                    <strong>Recovery underway</strong>
                    Ranch team dispatched to the reported location.
                  </p>
                </div>

                <div>
                  <time>11:18 AM</time>
                  <span />
                  <p>
                    <strong>Animal safely contained</strong>
                    Identity confirmed as CT-0847.
                  </p>
                </div>

                <div>
                  <time>11:42 AM</time>
                  <span />
                  <p>
                    <strong>Recovery complete</strong>
                    Animal returned and incident closed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="ctv2-section" id="tag-options">
          <div className="ctv2-shell">
            <div className="ctv2-centered-heading">
              <span>Two ways to begin</span>

              <h2>
                Start with new Cow Town Tags or
                <em>upgrade the tags already being worn.</em>
              </h2>

              <p>
                Ranchers should not have to discard a working identification
                system just to gain modern recovery capability.
              </p>
            </div>

            <div className="ctv2-products-photo">
              <img
                src="/images/cow-town-tags-two-ways-real-world.png"
                alt="A rancher holding the complete Cow Town livestock ear tag beside cattle wearing an existing numbered tag upgraded with a Scan for Ranch QR sticker"
              />
            </div>

            <div className="ctv2-products">
              <article>
                <div className="ctv2-product-visual ctv2-product-image-wrap">
                  <img
                    src="/images/cow-town-tag-retrofit.png"
                    alt="Complete Cow Town livestock ear tag with animal number 0847, QR code and Found Scan Me instruction"
                  />
                </div>

                <div className="ctv2-product-copy">
                  <span>Complete Cow Town ear tag</span>
                  <h3>Cow Town Tag</h3>

                  <p>
                    A brand-new oversized livestock ear tag built specifically
                    for identification and public recovery. The large animal
                    number can be read quickly, while the built-in QR code gives
                    anyone who finds the animal a clear next step: scan the tag,
                    identify the ranch and report the animal’s location.
                  </p>

                  <ul>
                    <li>
                      <Check size={16} />
                      Large animal number that can be read quickly
                    </li>
                    <li>
                      <Check size={16} />
                      Built-in QR code, not an added sticker
                    </li>
                    <li>
                      <Check size={16} />
                      Clear “FOUND? SCAN ME” instructions
                    </li>
                    <li>
                      <Check size={16} />
                      Permanent Cow Town recovery ID
                    </li>
                    <li>
                      <Check size={16} />
                      Designed for future RFID expansion
                    </li>
                  </ul>
                </div>
              </article>

              <article>
                <div className="ctv2-product-visual ctv2-product-image-wrap">
                  <img
                    src="/images/cow-town-tag-main.png"
                    alt="Existing livestock ear tag upgraded with a Cow Town QR sticker labeled Scan for Ranch"
                  />
                </div>

                <div className="ctv2-product-copy">
                  <span>Keep the tag. Add the recovery system.</span>
                  <h3>Cow Town Sticker Upgrade</h3>

                  <p>
                    A durable QR sticker applied directly to the livestock ear
                    tag the animal already wears. The ranch keeps its existing
                    animal number and numbering system, while the sticker adds a
                    unique Cow Town recovery ID and the clear instruction
                    “SCAN FOR RANCH.”
                  </p>

                  <ul>
                    <li>
                      <Check size={16} />
                      Attaches directly to the existing ear tag
                    </li>
                    <li>
                      <Check size={16} />
                      Keeps the original animal number in place
                    </li>
                    <li>
                      <Check size={16} />
                      Clearly labeled “SCAN FOR RANCH”
                    </li>
                    <li>
                      <Check size={16} />
                      Waterproof and UV-resistant QR sticker
                    </li>
                    <li>
                      <Check size={16} />
                      Each sticker opens that animal’s live recovery page
                    </li>
                    <li>
                      <Check size={16} />
                      Lower-cost way to activate an existing herd
                    </li>
                  </ul>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="ctv2-section">
          <div className="ctv2-shell">
            <div className="ctv2-final-block">
              <span>Built beyond the tag</span>

              <h2>
                A livestock recovery system that can grow into a complete ranch
                operating system.
              </h2>

              <p>
                Animal records, public sightings, lost and escaped livestock,
                safe recovery, ranch assignments, proof, activity timelines,
                Intelligence and future RFID support can remain connected.
              </p>

              <div className="ctv2-actions">
                <Link
                  className="ctv2-button ctv2-button-primary"
                  to="/planet/cow-town-tags/tag/CT-0847"
                >
                  <Radio size={19} />
                  See CT-0847 Live
                </Link>

                <a
                  className="ctv2-button ctv2-button-secondary"
                  href="#tag-options"
                >
                  <Fence size={19} />
                  Explore Tag Options
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="ctv2-footer">
        <div className="ctv2-shell">
          <span>Cow Town Tags</span>
          <span>Built on HomePlanet for real livestock recovery.</span>
        </div>
      </footer>
    </div>
  );
}






