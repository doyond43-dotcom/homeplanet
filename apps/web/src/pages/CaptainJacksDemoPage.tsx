import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Clock3,
  Gamepad2,
  Gift,
  IceCreamBowl,
  MapPin,
  Menu,
  PartyPopper,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";

type ExperienceKey = "golf" | "birthday" | "group" | "arcade";
type Flow = ExperienceKey | null;

const logo = "/images/captain-jacks/captain-jacks-logo-transparent.png";

const experiences = [
  {
    key: "golf" as const,
    label: "MINI GOLF",
    title: "18-Hole Mini Golf",
    text: "A tropical Florida course with winding greens, family competition, and just enough pirate adventure.",
    icon: Sparkles,
    image: "/images/pirate_island_mini_golf_at_sunset.png",
    flow: "golf" as const,
    theme: "green",
  },
  {
    key: "birthday" as const,
    label: "PARTIES",
    title: "Birthday Parties",
    text: "Mini golf, party space, arcade fun, treats, and a celebration built around the guest of honor.",
    icon: Gift,
    image: "/images/pirate_sunset_birthday_celebration.png",
    flow: "birthday" as const,
    theme: "coral",
  },
  {
    key: "group" as const,
    label: "GROUPS",
    title: "Group Events",
    text: "Schools, churches, teams, camps, businesses, and private groups can plan the whole experience.",
    icon: Users,
    image: "/images/sunset_pirate_mini_golf_celebration.png",
    flow: "group" as const,
    theme: "blue",
  },
  {
    key: "arcade" as const,
    label: "ARCADE",
    title: "Arcade & Games",
    text: "Keep the adventure going with games, prizes, friendly competition, and more ways to play.",
    icon: Gamepad2,
    image: "/images/pirate_arcade_at_sunset.png",
    flow: null,
    theme: "purple",
  },
];

const categoryExperiences: Record<
  ExperienceKey,
  {
    eyebrow: string;
    title: string;
    intro: string;
    image: string;
    highlights: string[];
    details: string;
    action: string;
  }
> = {
  golf: {
    eyebrow: "18-HOLE MINI GOLF",
    title: "A Florida Adventure Around Every Turn",
    intro:
      "Wind through tropical greens, waterfalls, pirate landmarks, and family-friendly challenges built for every age.",
    image: "/images/pirate_island_mini_golf_at_sunset.png",
    highlights: [
      "18 themed holes",
      "Family-friendly competition",
      "Tropical pirate atmosphere",
      "Walk-ins and planned visits",
    ],
    details:
      "Come for a relaxed family round, a date night, friendly competition, or the first stop in a complete Captain Jack's adventure.",
    action: "Reserve a Tee Time",
  },
  birthday: {
    eyebrow: "BIRTHDAY PARTIES",
    title: "Give Them a Birthday Worth Remembering",
    intro:
      "Bring mini golf, party space, arcade fun, treats, and the guest of honor together in one easy celebration.",
    image: "/images/pirate_sunset_birthday_celebration.png",
    highlights: [
      "Mini golf party options",
      "Dedicated celebration space",
      "Arcade and treat add-ons",
      "Guided party planning",
    ],
    details:
      "Captain Jack's helps families move from choosing the experience to planning the details without juggling scattered messages.",
    action: "View Party Options",
  },
  group: {
    eyebrow: "GROUP EVENTS",
    title: "Bring the Whole Crew Together",
    intro:
      "Schools, churches, teams, camps, businesses, and private groups can build a visit around the size and purpose of the event.",
    image: "/images/sunset_pirate_mini_golf_celebration.png",
    highlights: [
      "School and camp outings",
      "Team and church events",
      "Business gatherings",
      "Custom group planning",
    ],
    details:
      "Tell Captain Jack's who is coming, what the occasion is, and what the group needs. The planning flow handles the next step.",
    action: "Plan a Group Event",
  },
  arcade: {
    eyebrow: "ARCADE & GAMES",
    title: "The Adventure Does Not End at the Final Hole",
    intro:
      "Step inside for games, prizes, friendly competition, and another reason to stay together after mini golf.",
    image: "/images/pirate_arcade_at_sunset.png",
    highlights: [
      "Games for multiple ages",
      "Prize and redemption play",
      "Party-friendly arcade time",
      "Easy mini golf add-on",
    ],
    details:
      "Visit the arcade on its own, add it to mini golf, or make it part of a birthday or group experience.",
    action: "Plan an Arcade Visit",
  },
};

function CaptainJacksFooter({
  openExperience,
  bookNow,
}: {
  openExperience: (experience: ExperienceKey) => void;
  bookNow: () => void;
}) {
  return (
    <footer className="cj-footer">
      <div className="cj-footer-cta">
        <div>
          <span>YOUR NEXT ADVENTURE STARTS HERE</span>
          <h2>Play More. Celebrate Bigger. Stay Together.</h2>
          <p>
            Choose the experience that fits your day and Captain Jack's will
            guide the next step.
          </p>
        </div>

        <button onClick={bookNow}>
          Book Your Adventure
          <ArrowRight size={19} />
        </button>
      </div>

      <div className="cj-footer-main">
        <div className="cj-footer-brand">
          <img src={logo} alt="Captain Jack's Putt & Play" />

          <p>
            Tropical mini golf, birthday parties, group events, arcade games,
            and family memories—all in one Florida adventure.
          </p>

          <div className="cj-footer-photo-wall">
            <Sparkles size={18} />

            <div>
              <strong>Captain Jack's Photo Wall</strong>
              <span>
                Guest memories and attraction QR experiences coming soon.
              </span>
            </div>
          </div>
        </div>

        <div className="cj-footer-column">
          <span>EXPLORE</span>

          <button onClick={() => openExperience("golf")}>
            Mini Golf
          </button>

          <button onClick={() => openExperience("birthday")}>
            Birthday Parties
          </button>

          <button onClick={() => openExperience("group")}>
            Group Events
          </button>

          <button onClick={() => openExperience("arcade")}>
            Arcade & Games
          </button>
        </div>

        <div className="cj-footer-column">
          <span>PLAN YOUR VISIT</span>

          <div className="cj-footer-detail">
            <Clock3 size={18} />

            <div>
              <small>HOURS</small>
              <strong>Open daily until 9:00 PM</strong>
            </div>
          </div>

          <div className="cj-footer-detail">
            <MapPin size={18} />

            <div>
              <small>LOCATION</small>
              <strong>Florida location coming soon</strong>
            </div>
          </div>

          <div className="cj-footer-detail">
            <CalendarDays size={18} />

            <div>
              <small>VISIT STYLE</small>
              <strong>Walk-ins and planned visits</strong>
            </div>
          </div>
        </div>

        <div className="cj-footer-column">
          <span>CONNECT</span>

          <a href="tel:+10000000000">Phone coming soon</a>
          <a href="mailto:hello@example.com">Email coming soon</a>
          <a href="#captain-jacks-social">Facebook</a>
          <a href="#captain-jacks-social">Instagram</a>

          <button className="cj-footer-book" onClick={bookNow}>
            Book Now
          </button>
        </div>
      </div>

      <div className="cj-footer-bottom">
        <span>
          © {new Date().getFullYear()} Captain Jack's Putt & Play
        </span>

        <div>
          <a href="#captain-jacks-privacy">Privacy</a>
          <a href="#captain-jacks-terms">Terms</a>
          <a href="#captain-jacks-accessibility">Accessibility</a>
        </div>

        <span>Powered by HomePlanet</span>
      </div>
    </footer>
  );
}
function CategoryExperiencePage({
  experience,
  close,
  startBooking,
  openExperience,
}: {
  experience: ExperienceKey;
  close: () => void;
  startBooking: (flow: ExperienceKey) => void;
  openExperience: (experience: ExperienceKey) => void;
}) {
  const content = categoryExperiences[experience];

  return (
    <div className="cj-category-page" role="dialog" aria-modal="true">
      <div className="cj-category-topbar">
        <button onClick={close} aria-label="Return to homepage">
          <X size={22} />
          <span>Back</span>
        </button>

        <img src={logo} alt="Captain Jack's Putt & Play" />

        <button
          className="cj-category-book-top"
          onClick={() => startBooking(experience)}
        >
          Book Now
        </button>
      </div>

      <section className="cj-category-hero">
        <img src={content.image} alt="" />

        <div className="cj-category-overlay" />

        <div className="cj-category-hero-copy">
          <span>{content.eyebrow}</span>
          <h1>{content.title}</h1>
          <p>{content.intro}</p>

          <button onClick={() => startBooking(experience)}>
            {content.action}
            <ArrowRight size={19} />
          </button>
        </div>
      </section>

      <section className="cj-category-content">
        <div className="cj-category-story">
          <span>THE EXPERIENCE</span>
          <h2>Everything You Need for a Better Day Out</h2>
          <p>{content.details}</p>
        </div>

        <div className="cj-category-highlights">
          {content.highlights.map((highlight) => (
            <div key={highlight}>
              <ShieldCheck size={20} />
              <span>{highlight}</span>
            </div>
          ))}
        </div>

        <div className="cj-category-final">
          <div>
            <span>READY WHEN YOU ARE</span>
            <h2>Turn the Idea Into a Real Visit</h2>
            <p>
              Choose the experience and Captain Jack's will guide the next step.
            </p>
          </div>

          <button onClick={() => startBooking(experience)}>
            {content.action}
            <ArrowRight size={19} />
          </button>
        </div>
      </section>

      <CaptainJacksFooter
        openExperience={openExperience}
        bookNow={() => startBooking(experience)}
      />
    </div>
  );
}

function BookingDrawer({
  flow,
  close,
}: {
  flow: Exclude<Flow, null>;
  close: () => void;
}) {
  const content = {
    golf: {
      eyebrow: "PLAY MINI GOLF",
      title: "Plan Your Round",
      text: "Choose a day, group size, and preferred starting time.",
      choices: ["Today", "Tomorrow", "Choose Another Day"],
      action: "See Available Times",
      confirmationTitle: "Your Round Is Ready for the Next Step",
      confirmationText:
        "Captain Jack's would now show available tee times for your selected day.",
    },
    birthday: {
      eyebrow: "BOOK A BIRTHDAY PARTY",
      title: "Make Their Day Unforgettable",
      text: "Explore party experiences, guest options, arcade credits, treats, and add-ons.",
      choices: ["Mini Golf Party", "Putt & Play Party", "Captain's Party"],
      action: "Check Party Availability",
      confirmationTitle: "Your Party Choice Is Ready",
      confirmationText:
        "Captain Jack's would now collect the preferred date, guest count, and celebration details.",
    },
    group: {
      eyebrow: "PLAN A GROUP EVENT",
      title: "Bring the Whole Crew",
      text: "Tell Captain Jack's what kind of group you are bringing and what the day needs.",
      choices: ["School or Camp", "Church or Team", "Business or Private Group"],
      action: "Request Group Availability",
      confirmationTitle: "Your Group Request Is Ready",
      confirmationText:
        "Captain Jack's would now collect the group size, preferred date, and event needs.",
    },
    arcade: {
      eyebrow: "PLAN YOUR ARCADE VISIT",
      title: "Keep the Adventure Going",
      text: "Choose how you want to enjoy the arcade and Captain Jack's can guide the next step.",
      choices: ["Arcade Visit", "Arcade With Mini Golf", "Arcade Party Add-On"],
      action: "Plan My Arcade Visit",
      confirmationTitle: "Your Arcade Experience Is Ready",
      confirmationText:
        "Captain Jack's would now guide you into the matching visit or add-on options.",
    },
  }[flow];

  const [selectedChoice, setSelectedChoice] = useState(
    content.choices[0]
  );
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="cj-drawer-shell" role="dialog" aria-modal="true">
      <button
        className="cj-drawer-backdrop"
        onClick={close}
        aria-label="Close"
      />

      <section className="cj-drawer">
        <div className="cj-drawer-handle" />

        <div className="cj-drawer-heading">
          <div>
            <span>{content.eyebrow}</span>
            <h2>
              {submitted
                ? content.confirmationTitle
                : content.title}
            </h2>
          </div>

          <button onClick={close} aria-label="Close">
            <X size={21} />
          </button>
        </div>

        {submitted ? (
          <div className="cj-drawer-confirmation">
            <div className="cj-drawer-confirmation-icon">
              <ShieldCheck size={29} />
            </div>

            <span>YOUR SELECTION</span>
            <strong>{selectedChoice}</strong>

            <p>{content.confirmationText}</p>

            <div className="cj-drawer-confirmation-actions">
              <button
                className="cj-drawer-secondary"
                onClick={() => setSubmitted(false)}
              >
                Change Selection
              </button>

              <button
                className="cj-drawer-action"
                onClick={close}
              >
                Done
                <ArrowRight size={18} />
              </button>
            </div>

            <small>
              This is a working demo. Final pricing, scheduling, payment,
              confirmation, and customer communication will connect to the
              completed Captain Jack's operating system.
            </small>
          </div>
        ) : (
          <>
            <p>{content.text}</p>

            <div className="cj-drawer-choices">
              {content.choices.map((choice) => (
                <button
                  key={choice}
                  className={
                    selectedChoice === choice ? "selected" : ""
                  }
                  onClick={() => setSelectedChoice(choice)}
                >
                  <span>{choice}</span>

                  {selectedChoice === choice && (
                    <ShieldCheck size={18} />
                  )}
                </button>
              ))}
            </div>

            <button
              className="cj-drawer-action"
              onClick={() => setSubmitted(true)}
            >
              {content.action}
              <ArrowRight size={18} />
            </button>

            <small>
              Demo pricing and availability will be configured with the final
              business details.
            </small>
          </>
        )}
      </section>
    </div>
  );
}

export default function CaptainJacksDemoPage() {
  const [flow, setFlow] = useState<Flow>(null);
  const [experienceView, setExperienceView] =
    useState<ExperienceKey | null>(null);

  useEffect(() => {
    document.title =
      "Captain Jack's Putt & Play | Mini Golf, Parties & Family Fun";
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      flow || experienceView ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [flow, experienceView]);

  return (
    <main className="cj-page">
      <section className="cj-hero">
        <img
          className="cj-hero-image"
          src="/images/pirate_mini_golf_at_sunset.png"
          alt=""
        />

        <header className="cj-header">
          <button className="cj-menu" aria-label="Open menu">
            <Menu size={27} />
          </button>

          <img
            src={logo}
            alt="Captain Jack's Putt & Play"
            className="cj-logo"
          />

          <button
            className="cj-book"
            onClick={() => setFlow("golf")}
          >
            <CalendarDays size={17} />
            Book Now
          </button>

          <nav className="cj-desktop-nav" aria-label="Main navigation">
            <button onClick={() => setExperienceView("golf")}>
              Mini Golf
            </button>

            <button onClick={() => setExperienceView("birthday")}>
              Parties
            </button>

            <button onClick={() => setExperienceView("group")}>
              Groups
            </button>

            <button onClick={() => setExperienceView("arcade")}>
              Arcade
            </button>

            <button
              className="cj-desktop-book"
              onClick={() => setFlow("golf")}
            >
              <CalendarDays size={16} />
              Book Now
            </button>
          </nav>
        </header>

        <div className="cj-hero-content">
          <div className="cj-hero-kicker">
            Florida adventure · family fun
          </div>

          <h1>
            Play. Party.
            <span>Make Memories.</span>
          </h1>

          <p>
            Mini golf, birthday parties, group events, arcade games, and ice cream
            — all in one unforgettable adventure.
          </p>

          <div className="cj-actions">
            <button
              className="cj-action cj-action-gold"
              onClick={() => setFlow("golf")}
            >
              <span className="cj-action-icon">
                <Sparkles size={23} />
              </span>

              <span className="cj-action-copy">
                <small>PLAY MINI GOLF</small>
                <strong>Reserve a Tee Time</strong>
              </span>

              <ChevronRight size={22} />
            </button>

            <button
              className="cj-action cj-action-coral"
              onClick={() => setFlow("birthday")}
            >
              <span className="cj-action-icon">
                <PartyPopper size={23} />
              </span>

              <span className="cj-action-copy">
                <small>BOOK A BIRTHDAY PARTY</small>
                <strong>Make Their Day Unforgettable</strong>
              </span>

              <ChevronRight size={22} />
            </button>

            <button
              className="cj-action cj-action-navy"
              onClick={() => setFlow("group")}
            >
              <span className="cj-action-icon">
                <Users size={23} />
              </span>

              <span className="cj-action-copy">
                <small>PLAN A GROUP EVENT</small>
                <strong>Perfect for Schools, Teams & More</strong>
              </span>

              <ChevronRight size={22} />
            </button>
          </div>

          <div className="cj-trust">
            <div>
              <ShieldCheck size={18} />
              <span>
                <strong>Family Fun</strong>
                <small>All ages welcome</small>
              </span>
            </div>

            <div>
              <Users size={18} />
              <span>
                <strong>Group Friendly</strong>
                <small>Any size adventure</small>
              </span>
            </div>

            <div>
              <IceCreamBowl size={18} />
              <span>
                <strong>Ice Cream</strong>
                <small>Treats and more</small>
              </span>
            </div>

            <div>
              <MapPin size={18} />
              <span>
                <strong>Easy Parking</strong>
                <small>Right at the door</small>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="cj-experiences">
        <div className="cj-section-heading">
          <span>WHAT YOU CAN DO</span>
          <h2 id="choose-your-adventure">Choose Your Adventure</h2>
          <p>
            Play a round, celebrate something big, bring the whole group, or stay
            for the complete Captain Jack's experience.
          </p>
        </div>

        <div className="cj-experience-grid">
          {experiences.map((experience) => {
            const Icon = experience.icon;

            return (
              <article
                className={`cj-experience cj-experience-${experience.theme}`}
                key={experience.title}
                onClick={() => setExperienceView(experience.key)}
              >
                <div className="cj-experience-visual">
                  <img
                    src={experience.image}
                    alt=""
                  />

                  <div className="cj-experience-shade" />

                  <div className="cj-experience-icon">
                    <Icon size={24} />
                  </div>

                  <span className="cj-experience-label">
                    {experience.label}
                  </span>
                </div>

                <div className="cj-experience-body">
                  <h3>{experience.title}</h3>
                  <p>{experience.text}</p>

                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      setFlow(experience.key);
                    }}
                  >
                    {experience.flow
                      ? experience.title === "18-Hole Mini Golf"
                        ? "Plan Your Round"
                        : experience.title === "Birthday Parties"
                          ? "View Party Options"
                          : "Plan a Group Event"
                      : "Explore the Arcade"}

                    <ArrowRight size={15} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <section className="cj-plan">
          <div className="cj-plan-copy">
            <span>PLAN YOUR VISIT</span>
            <h2>Everything Starts With One Clear Choice</h2>
            <p>
              Choose mini golf, a birthday adventure, or a group event. The guided
              flow handles the next step.
            </p>
          </div>

          <div className="cj-plan-facts">
            <div>
              <Clock3 size={19} />
              <span>
                <small>OPEN TODAY</small>
                <strong>Until 9:00 PM</strong>
              </span>
            </div>

            <div>
              <CalendarDays size={19} />
              <span>
                <small>TYPICAL VISIT</small>
                <strong>60–90 Minutes</strong>
              </span>
            </div>

            <div>
              <MapPin size={19} />
              <span>
                <small>VISIT STYLE</small>
                <strong>Walk-Ins Welcome</strong>
              </span>
            </div>
          </div>

          <button onClick={() => setFlow("golf")}>
            Plan Your Visit
            <ArrowRight size={18} />
          </button>
        </section>
      </section>

      <CaptainJacksFooter
        openExperience={setExperienceView}
        bookNow={() => setFlow("golf")}
      />

      {experienceView && (
        <CategoryExperiencePage
          experience={experienceView}
          close={() => setExperienceView(null)}
          startBooking={(nextFlow) => {
            setExperienceView(null);
            setFlow(nextFlow);
          }}
          openExperience={(nextExperience) => {
            setExperienceView(nextExperience);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}

      {flow && (
        <BookingDrawer
          flow={flow}
          close={() => setFlow(null)}
        />
      )}

      <style>{`
        :root {
          --cj-navy: #0e2a47;
          --cj-deep: #071d32;
          --cj-gold: #c89a2e;
          --cj-gold-bright: #f2c94f;
          --cj-green: #277d4a;
          --cj-sand: #f2e9d6;
          --cj-coral: #eb684a;
          --cj-white: #fffdf8;
          --cj-ink: #16304a;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
        }

        button {
          font: inherit;
        }

        .cj-page {
          min-height: 100vh;
          overflow-x: hidden;
          background: var(--cj-white);
          color: white;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .cj-hero {
          position: relative;
          min-height: 880px;
          overflow: hidden;
          isolation: isolate;
          background: #071d32;
        }

        .cj-hero-image {
          position: absolute;
          inset: 0;
          z-index: -7;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          filter: saturate(1.04) contrast(1.04);
        }

        .cj-hero::after {
          position: absolute;
          inset: 0;
          z-index: -1;
          content: "";
          background:
            linear-gradient(
              180deg,
              rgba(5, 18, 31, .18) 0%,
              rgba(5, 18, 31, .28) 30%,
              rgba(5, 18, 31, .58) 62%,
              rgba(5, 18, 31, .94) 100%
            ),
            radial-gradient(
              circle at 50% 35%,
              transparent 0 18%,
              rgba(3, 15, 27, .26) 68%
            );
        }

        .cj-sunset {
          position: absolute;
          inset: 0;
          z-index: -6;
          background:
            repeating-linear-gradient(
              166deg,
              rgba(255, 255, 255, .025) 0 1px,
              transparent 1px 38px
            );
        }

        .cj-sun {
          position: absolute;
          top: 120px;
          left: 50%;
          z-index: -5;
          width: 285px;
          height: 285px;
          transform: translateX(-50%);
          border-radius: 50%;
          background:
            radial-gradient(
              circle,
              rgba(255, 226, 141, .72) 0%,
              rgba(242, 170, 84, .35) 42%,
              transparent 72%
            );
          filter: blur(4px);
        }

        .cj-horizon {
          position: absolute;
          right: -8%;
          bottom: 290px;
          left: -8%;
          z-index: -4;
          height: 210px;
          border-radius: 50%;
          background: #0d3d3a;
          opacity: .85;
          transform: rotate(-3deg);
        }

        .cj-palms {
          position: absolute;
          z-index: -2;
          bottom: 245px;
          width: 220px;
          height: 260px;
          opacity: .88;
        }

        .cj-palms::before {
          position: absolute;
          bottom: 0;
          left: 69px;
          width: 13px;
          height: 220px;
          content: "";
          border-radius: 999px;
          background: #03131d;
          transform: rotate(8deg);
          transform-origin: bottom;
        }

        .cj-palms::after {
          position: absolute;
          top: 9px;
          left: 22px;
          width: 115px;
          height: 80px;
          content: "";
          border-radius: 60% 40% 65% 35%;
          background:
            radial-gradient(
              ellipse at center,
              #03131d 0 22%,
              transparent 24%
            );
          box-shadow:
            -48px 22px 0 -24px #03131d,
            46px 20px 0 -22px #03131d,
            -25px -19px 0 -22px #03131d,
            31px -25px 0 -23px #03131d;
        }

        .cj-palms-left {
          left: -28px;
        }

        .cj-palms-right {
          right: -28px;
          transform: scaleX(-1);
        }

        .cj-course {
          position: absolute;
          right: 0;
          bottom: 0;
          left: 0;
          z-index: -3;
          height: 470px;
          overflow: hidden;
        }

        .cj-course::before {
          position: absolute;
          inset: 95px -10% -100px;
          content: "";
          border-radius: 50% 50% 0 0;
          background:
            linear-gradient(180deg, #246a4d, #0d463a 55%, #082c2d);
          transform: rotate(1deg);
        }

        .cj-course-path {
          position: absolute;
          bottom: -165px;
          left: 50%;
          width: 145px;
          height: 575px;
          border-radius: 50%;
          background: #e8d9ae;
          transform: translateX(-50%) rotate(24deg);
          box-shadow: 0 0 0 18px rgba(129, 171, 96, .75);
        }

        .cj-course-green {
          position: absolute;
          border-radius: 50%;
          background: #4f915a;
          box-shadow:
            inset 0 -20px 40px rgba(8, 59, 45, .28),
            0 0 0 10px rgba(27, 83, 60, .45);
        }

        .cj-course-green-one {
          right: 7%;
          bottom: 52px;
          width: 265px;
          height: 140px;
          transform: rotate(-10deg);
        }

        .cj-course-green-two {
          bottom: 28px;
          left: 3%;
          width: 225px;
          height: 125px;
          transform: rotate(9deg);
        }

        .cj-course-water {
          position: absolute;
          right: -35px;
          bottom: 0;
          width: 260px;
          height: 145px;
          border-radius: 65% 0 0 0;
          background:
            linear-gradient(
              145deg,
              rgba(97, 205, 207, .76),
              rgba(7, 65, 84, .95)
            );
          box-shadow: inset 18px 15px 35px rgba(255, 255, 255, .14);
        }

        .cj-course-flag {
          position: absolute;
          right: 18%;
          bottom: 140px;
          width: 5px;
          height: 105px;
          border-radius: 999px;
          background: #f7e6c4;
        }

        .cj-course-flag::after {
          position: absolute;
          top: 0;
          left: 3px;
          width: 47px;
          height: 27px;
          content: "";
          clip-path: polygon(0 0, 100% 25%, 0 100%);
          background: var(--cj-coral);
        }

        .cj-lighthouse {
          position: absolute;
          right: 11%;
          bottom: 244px;
          width: 42px;
          height: 122px;
          border-radius: 11px 11px 3px 3px;
          background:
            repeating-linear-gradient(
              180deg,
              #f3e7ca 0 25px,
              #be5744 25px 42px
            );
          box-shadow: 0 11px 25px rgba(0, 0, 0, .25);
        }

        .cj-lighthouse::before {
          position: absolute;
          top: -22px;
          left: -6px;
          width: 54px;
          height: 28px;
          content: "";
          clip-path: polygon(50% 0, 100% 100%, 0 100%);
          background: #183048;
        }

        .cj-header {
          position: relative;
          z-index: 4;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          width: min(1160px, calc(100% - 28px));
          margin: 0 auto;
          padding: 14px 0;
        }

        .cj-menu {
          display: none;
          width: 52px;
          height: 52px;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, .28);
          border-radius: 16px;
          background: rgba(6, 25, 42, .74);
          color: white;
          cursor: pointer;
          box-shadow: 0 10px 28px rgba(0, 0, 0, .26);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        .cj-logo {
          width: 210px;
          max-height: 190px;
          object-fit: contain;
          filter: drop-shadow(0 9px 20px rgba(0, 0, 0, .42));
        }

        .cj-book {
          display: none;
          align-items: center;
          justify-content: center;
          gap: 7px;
          min-height: 48px;
          padding: 0 16px;
          border: 0;
          border-radius: 15px;
          background:
            linear-gradient(180deg, #f6d566, #e5ae2c);
          color: #192b3b;
          font-size: 12px;
          font-weight: 950;
          cursor: pointer;
          box-shadow: 0 10px 26px rgba(215, 161, 43, .25);
        }

        .cj-desktop-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          padding: 6px;
          border: 1px solid rgba(255, 255, 255, .2);
          border-radius: 999px;
          background: rgba(6, 25, 42, .72);
          box-shadow: 0 12px 34px rgba(0, 0, 0, .28);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
        }

        .cj-desktop-nav a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 42px;
          padding: 0 17px;
          border-radius: 999px;
          color: rgba(255, 255, 255, .94);
          font-size: 13px;
          font-weight: 850;
          letter-spacing: .025em;
          text-decoration: none;
        }

        .cj-desktop-nav a:hover {
          background: rgba(255, 255, 255, .11);
          color: #ffffff;
        }

        .cj-desktop-book {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          min-height: 42px;
          padding: 0 19px;
          border: 0;
          border-radius: 999px;
          background:
            linear-gradient(180deg, #f6d566, #e5ae2c);
          color: #192b3b;
          font: inherit;
          font-size: 13px;
          font-weight: 950;
          cursor: pointer;
          box-shadow: 0 9px 24px rgba(215, 161, 43, .28);
        }

        .cj-hero-content {
          position: relative;
          z-index: 3;
          width: min(620px, calc(100% - 26px));
          margin: 52px auto 0;
          text-align: center;
        }

        .cj-hero-kicker {
          display: inline-flex;
          padding: 7px 11px;
          border: 1px solid rgba(255, 224, 141, .36);
          border-radius: 999px;
          background: rgba(5, 22, 37, .52);
          color: #ffe196;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: .14em;
          text-transform: uppercase;
          backdrop-filter: blur(10px);
        }

        .cj-hero-content h1 {
          margin: 17px 0 0;
          color: white;
          font-family: Georgia, serif;
          font-size: clamp(49px, 12vw, 78px);
          font-weight: 900;
          letter-spacing: -.035em;
          line-height: .96;
          text-shadow:
            0 4px 10px rgba(0, 0, 0, .75),
            0 12px 34px rgba(0, 0, 0, .48);
        }

        .cj-hero-content h1 span {
          display: block;
          margin-top: .12em;
          color: var(--cj-gold-bright);
        }

        .cj-hero-content > p {
          max-width: 515px;
          margin: 16px auto 0;
          color: rgba(255, 255, 255, .87);
          font-size: 16px;
          font-weight: 600;
          line-height: 1.55;
          text-shadow:
            0 2px 7px rgba(0, 0, 0, .9),
            0 7px 20px rgba(0, 0, 0, .5);
        }

        .cj-actions {
          display: grid;
          gap: 9px;
          max-width: 500px;
          margin: 23px auto 0;
        }

        .cj-action {
          display: grid;
          grid-template-columns: 43px minmax(0, 1fr) 22px;
          align-items: center;
          gap: 11px;
          min-height: 69px;
          padding: 10px 14px;
          border: 1px solid transparent;
          border-radius: 14px;
          text-align: left;
          cursor: pointer;
          box-shadow: 0 13px 30px rgba(0, 0, 0, .22);
        }

        .cj-action-gold {
          border-color: rgba(255, 240, 183, .45);
          background:
            linear-gradient(135deg, #f4ca4f, #dfa629);
          color: #192b3a;
        }

        .cj-action-coral {
          border-color: rgba(255, 213, 202, .35);
          background:
            linear-gradient(135deg, #ef6f51, #cc4332);
          color: white;
        }

        .cj-action-navy {
          border-color: rgba(142, 193, 211, .24);
          background:
            linear-gradient(135deg, #174e6c, #0a2b48);
          color: white;
        }

        .cj-action-icon {
          display: grid;
          width: 42px;
          height: 42px;
          place-items: center;
          border-radius: 11px;
          background: rgba(255, 255, 255, .17);
        }

        .cj-action-copy {
          display: flex;
          flex-direction: column;
        }

        .cj-action-copy small {
          font-size: 8px;
          font-weight: 950;
          letter-spacing: .14em;
          opacity: .8;
        }

        .cj-action-copy strong {
          margin-top: 2px;
          font-family: Georgia, serif;
          font-size: 17px;
          line-height: 1.05;
        }

        .cj-trust {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 5px;
          max-width: 525px;
          margin: 14px auto 0;
          padding: 12px 6px;
          border-top: 1px solid rgba(255, 255, 255, .14);
          border-bottom: 1px solid rgba(255, 255, 255, .14);
          background: rgba(4, 18, 31, .44);
          backdrop-filter: blur(10px);
        }

        .cj-trust > div {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          min-width: 0;
        }

        .cj-trust svg {
          flex: 0 0 auto;
          color: var(--cj-gold-bright);
        }

        .cj-trust span {
          display: flex;
          flex-direction: column;
          min-width: 0;
          text-align: left;
        }

        .cj-trust strong {
          font-size: 8px;
          text-transform: uppercase;
        }

        .cj-trust small {
          margin-top: 1px;
          color: rgba(255, 255, 255, .62);
          font-size: 7px;
        }

        .cj-experiences {
          position: relative;
          z-index: 5;
          margin-top: -36px;
          padding: 49px 14px 76px;
          border-radius: 31px 31px 0 0;
          background:
            radial-gradient(
              circle at 10% 2%,
              rgba(246, 225, 186, .48),
              transparent 22%
            ),
            linear-gradient(
              180deg,
              #fffdf8 0%,
              #fffaf1 46%,
              #f5ead6 100%
            );
          color: var(--cj-ink);
          box-shadow: 0 -18px 42px rgba(0, 0, 0, .22);
        }

        .cj-section-heading {
          max-width: 650px;
          margin: 0 auto 22px;
          text-align: center;
        }

        .cj-section-heading > span,
        .cj-plan-copy > span {
          color: #986716;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: .16em;
        }

        .cj-section-heading h2,
        .cj-plan-copy h2 {
          margin: 7px 0 0;
          color: var(--cj-navy);
          font-family: Georgia, serif;
          font-size: clamp(32px, 7vw, 49px);
          line-height: .98;
        }

        .cj-section-heading p {
          max-width: 560px;
          margin: 11px auto 0;
          color: rgba(22, 48, 74, .64);
          font-size: 12px;
          line-height: 1.55;
        }

        .cj-experience-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          width: min(1080px, 100%);
          margin: 0 auto;
        }

        .cj-experience {
          overflow: hidden;
          border: 1px solid rgba(21, 45, 68, .11);
          border-radius: 17px;
          background: white;
          box-shadow: 0 14px 30px rgba(73, 50, 20, .09);
        }

        .cj-experience-visual {
          position: relative;
          height: 145px;
          overflow: hidden;
          background:
            linear-gradient(155deg, #17616b, #0b3047);
        }

        .cj-experience-visual > img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transform: scale(1.015);
        }

        .cj-experience-shade {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              180deg,
              rgba(4, 18, 30, .02) 25%,
              rgba(4, 18, 30, .72) 100%
            );
        }

        .cj-experience-coral .cj-experience-visual {
          background:
            linear-gradient(155deg, #eb7658, #aa3e36);
        }

        .cj-experience-blue .cj-experience-visual {
          background:
            linear-gradient(155deg, #218293, #0b405f);
        }

        .cj-experience-purple .cj-experience-visual {
          background:
            linear-gradient(155deg, #543a79, #20214e);
        }

        .cj-mini-scene {
          position: absolute;
          inset: 0;
        }

        .cj-mini-sun {
          position: absolute;
          top: 21px;
          right: 26px;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: rgba(255, 218, 115, .53);
          box-shadow: 0 0 26px rgba(255, 215, 107, .34);
        }

        .cj-mini-hill {
          position: absolute;
          bottom: -35px;
          border-radius: 50%;
          background: rgba(54, 130, 78, .86);
        }

        .cj-mini-hill-one {
          left: -25px;
          width: 190px;
          height: 125px;
          transform: rotate(8deg);
        }

        .cj-mini-hill-two {
          right: -30px;
          width: 180px;
          height: 110px;
          transform: rotate(-8deg);
        }

        .cj-mini-path {
          position: absolute;
          bottom: -44px;
          left: 50%;
          width: 49px;
          height: 145px;
          border-radius: 50%;
          background: rgba(239, 222, 176, .87);
          transform: translateX(-50%) rotate(18deg);
        }

        .cj-mini-flag {
          position: absolute;
          right: 49px;
          bottom: 38px;
          width: 3px;
          height: 58px;
          background: white;
        }

        .cj-mini-flag::after {
          position: absolute;
          top: 0;
          left: 3px;
          width: 28px;
          height: 17px;
          content: "";
          clip-path: polygon(0 0, 100% 25%, 0 100%);
          background: var(--cj-coral);
        }

        .cj-experience-icon {
          position: absolute;
          bottom: 12px;
          left: 12px;
          display: grid;
          width: 40px;
          height: 40px;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, .2);
          border-radius: 12px;
          background: rgba(3, 18, 30, .44);
          color: white;
          backdrop-filter: blur(7px);
        }

        .cj-experience-label {
          position: absolute;
          right: 11px;
          bottom: 12px;
          padding: 6px 8px;
          border: 1px solid rgba(255, 255, 255, .16);
          border-radius: 999px;
          background: rgba(3, 18, 30, .42);
          color: white;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: .13em;
        }

        .cj-experience-body {
          padding: 14px;
        }

        .cj-experience-body h3 {
          margin: 0;
          color: var(--cj-navy);
          font-family: Georgia, serif;
          font-size: 19px;
          line-height: 1.02;
        }

        .cj-experience-body p {
          min-height: 82px;
          margin: 8px 0 0;
          color: rgba(22, 48, 74, .65);
          font-size: 11px;
          line-height: 1.5;
        }

        .cj-experience-body button {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 10px;
          padding: 0;
          border: 0;
          background: transparent;
          color: #986716;
          font-size: 10px;
          font-weight: 950;
          cursor: pointer;
        }

        .cj-plan {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 285px;
          gap: 23px;
          width: min(1080px, 100%);
          margin: 18px auto 0;
          padding: 25px;
          border: 1px solid rgba(255, 255, 255, .13);
          border-radius: 21px;
          background:
            radial-gradient(
              circle at 12% 12%,
              rgba(240, 190, 64, .14),
              transparent 29%
            ),
            linear-gradient(145deg, #104458, #08233a);
          color: white;
          box-shadow: 0 18px 40px rgba(4, 24, 39, .18);
        }

        .cj-plan-copy > span {
          color: var(--cj-gold-bright);
        }

        .cj-plan-copy h2 {
          max-width: 550px;
          color: white;
        }

        .cj-plan-copy p {
          max-width: 520px;
          margin: 11px 0 0;
          color: rgba(255, 255, 255, .68);
          font-size: 12px;
          line-height: 1.55;
        }

        .cj-plan-facts {
          display: grid;
          gap: 8px;
        }

        .cj-plan-facts > div {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px;
          border: 1px solid rgba(255, 255, 255, .1);
          border-radius: 11px;
          background: rgba(255, 255, 255, .055);
        }

        .cj-plan-facts svg {
          color: var(--cj-gold-bright);
        }

        .cj-plan-facts span {
          display: flex;
          flex-direction: column;
        }

        .cj-plan-facts small {
          color: rgba(255, 255, 255, .5);
          font-size: 8px;
        }

        .cj-plan-facts strong {
          margin-top: 2px;
          font-size: 11px;
        }

        .cj-plan > button {
          grid-column: 1 / -1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 48px;
          border: 0;
          border-radius: 12px;
          background:
            linear-gradient(180deg, #f5d25d, #e4ad2d);
          color: #172b3a;
          font-size: 12px;
          font-weight: 950;
          cursor: pointer;
        }

        .cj-desktop-nav > button:not(.cj-desktop-book) {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 42px;
          padding: 0 17px;
          border: 0;
          border-radius: 999px;
          background: transparent;
          color: rgba(255, 255, 255, .94);
          font: inherit;
          font-size: 13px;
          font-weight: 850;
          letter-spacing: .025em;
          cursor: pointer;
        }

        .cj-desktop-nav > button:not(.cj-desktop-book):hover {
          background: rgba(255, 255, 255, .11);
          color: #ffffff;
        }

        .cj-experience {
          cursor: pointer;
          transition:
            transform .2s ease,
            box-shadow .2s ease;
        }

        .cj-experience:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 38px rgba(73, 50, 20, .15);
        }

        .cj-category-page {
          position: fixed;
          inset: 0;
          z-index: 120;
          overflow-y: auto;
          background: var(--cj-sand);
          color: var(--cj-ink);
        }

        .cj-category-topbar {
          position: sticky;
          top: 0;
          z-index: 5;
          display: grid;
          grid-template-columns: 120px minmax(0, 1fr) 120px;
          align-items: center;
          min-height: 82px;
          padding: 10px 24px;
          border-bottom: 1px solid rgba(255, 255, 255, .12);
          background: rgba(5, 22, 36, .94);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
        }

        .cj-category-topbar > img {
          justify-self: center;
          width: 112px;
          max-height: 72px;
          object-fit: contain;
        }

        .cj-category-topbar > button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          min-height: 44px;
          padding: 0 15px;
          border: 1px solid rgba(255, 255, 255, .16);
          border-radius: 13px;
          background: rgba(255, 255, 255, .08);
          color: white;
          font: inherit;
          font-size: 12px;
          font-weight: 900;
          cursor: pointer;
        }

        .cj-category-topbar .cj-category-book-top {
          justify-self: end;
          border: 0;
          background:
            linear-gradient(180deg, #f6d566, #e5ae2c);
          color: #192b3b;
        }

        .cj-category-hero {
          position: relative;
          display: grid;
          min-height: 590px;
          place-items: end center;
          overflow: hidden;
        }

        .cj-category-hero > img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cj-category-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              180deg,
              rgba(5, 18, 31, .12) 0%,
              rgba(5, 18, 31, .42) 48%,
              rgba(5, 18, 31, .94) 100%
            );
        }

        .cj-category-hero-copy {
          position: relative;
          z-index: 1;
          width: min(760px, calc(100% - 32px));
          padding: 90px 0 66px;
          text-align: center;
        }

        .cj-category-hero-copy > span,
        .cj-category-story > span,
        .cj-category-final span {
          color: var(--cj-gold-bright);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .15em;
        }

        .cj-category-hero-copy h1 {
          max-width: 720px;
          margin: 12px auto 0;
          color: white;
          font-family: Georgia, serif;
          font-size: clamp(48px, 6vw, 84px);
          line-height: .98;
          text-shadow: 0 10px 34px rgba(0, 0, 0, .5);
        }

        .cj-category-hero-copy p {
          max-width: 650px;
          margin: 20px auto 0;
          color: rgba(255, 255, 255, .88);
          font-size: 17px;
          line-height: 1.6;
        }

        .cj-category-hero-copy button,
        .cj-category-final button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          min-height: 54px;
          margin-top: 25px;
          padding: 0 23px;
          border: 0;
          border-radius: 14px;
          background:
            linear-gradient(180deg, #f6d566, #e5ae2c);
          color: #192b3b;
          font: inherit;
          font-size: 13px;
          font-weight: 950;
          cursor: pointer;
          box-shadow: 0 12px 30px rgba(215, 161, 43, .28);
        }

        .cj-category-content {
          width: min(1080px, calc(100% - 28px));
          margin: 0 auto;
          padding: 68px 0 86px;
        }

        .cj-category-story {
          max-width: 720px;
          margin: 0 auto;
          text-align: center;
        }

        .cj-category-story > span {
          color: #9a6d16;
        }

        .cj-category-story h2,
        .cj-category-final h2 {
          margin: 10px 0 0;
          color: var(--cj-navy);
          font-family: Georgia, serif;
          font-size: clamp(36px, 5vw, 58px);
          line-height: 1;
        }

        .cj-category-story p,
        .cj-category-final p {
          margin: 18px 0 0;
          color: rgba(22, 48, 74, .7);
          font-size: 16px;
          line-height: 1.7;
        }

        .cj-category-highlights {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 13px;
          margin-top: 42px;
        }

        .cj-category-highlights > div {
          display: flex;
          align-items: center;
          gap: 11px;
          min-height: 82px;
          padding: 18px;
          border: 1px solid rgba(22, 48, 74, .1);
          border-radius: 16px;
          background: white;
          box-shadow: 0 12px 28px rgba(73, 50, 20, .07);
        }

        .cj-category-highlights svg {
          flex: 0 0 auto;
          color: #b7831d;
        }

        .cj-category-highlights span {
          color: var(--cj-navy);
          font-size: 13px;
          font-weight: 850;
          line-height: 1.35;
        }

        .cj-category-final {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          margin-top: 54px;
          padding: 34px;
          border-radius: 24px;
          background:
            linear-gradient(135deg, #123d4d, #092c48);
          box-shadow: 0 22px 44px rgba(7, 29, 50, .18);
        }

        .cj-category-final > div {
          max-width: 640px;
        }

        .cj-category-final h2 {
          color: white;
          font-size: clamp(34px, 4vw, 50px);
        }

        .cj-category-final p {
          color: rgba(255, 255, 255, .72);
        }

        .cj-category-final button {
          flex: 0 0 auto;
          margin-top: 0;
        }
        .cj-footer {
          position: relative;
          z-index: 2;
          padding: 0 28px 24px;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 15% 10%,
              rgba(242, 201, 79, .1),
              transparent 28%
            ),
            linear-gradient(180deg, #092942 0%, #061c30 100%);
          color: white;
        }

        .cj-footer-cta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          width: min(1080px, 100%);
          margin: 0 auto;
          padding: 42px 0;
          border-bottom: 1px solid rgba(255, 255, 255, .12);
        }

        .cj-footer-cta > div {
          max-width: 720px;
        }

        .cj-footer-cta span,
        .cj-footer-column > span {
          color: var(--cj-gold-bright);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .15em;
        }

        .cj-footer-cta h2 {
          margin: 10px 0 0;
          font-family: Georgia, serif;
          font-size: clamp(34px, 4.5vw, 55px);
          line-height: 1;
        }

        .cj-footer-cta p {
          max-width: 620px;
          margin: 15px 0 0;
          color: rgba(255, 255, 255, .7);
          font-size: 14px;
          line-height: 1.65;
        }

        .cj-footer-cta > button,
        .cj-footer-book {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          min-height: 52px;
          padding: 0 21px;
          border: 0;
          border-radius: 14px;
          background:
            linear-gradient(180deg, #f6d566, #e5ae2c);
          color: #192b3b;
          font: inherit;
          font-size: 12px;
          font-weight: 950;
          cursor: pointer;
          box-shadow: 0 12px 30px rgba(215, 161, 43, .24);
        }

        .cj-footer-main {
          display: grid;
          grid-template-columns: 1.45fr .75fr 1fr .75fr;
          gap: 45px;
          width: min(1080px, 100%);
          margin: 0 auto;
          padding: 50px 0 44px;
        }

        .cj-footer-brand > img {
          width: 165px;
          max-height: 145px;
          object-fit: contain;
          filter: drop-shadow(0 10px 24px rgba(0, 0, 0, .4));
        }

        .cj-footer-brand > p {
          max-width: 390px;
          margin: 17px 0 0;
          color: rgba(255, 255, 255, .67);
          font-size: 13px;
          line-height: 1.65;
        }

        .cj-footer-photo-wall {
          display: flex;
          align-items: flex-start;
          gap: 11px;
          max-width: 410px;
          margin-top: 23px;
          padding: 15px;
          border: 1px solid rgba(242, 201, 79, .2);
          border-radius: 15px;
          background: rgba(242, 201, 79, .07);
        }

        .cj-footer-photo-wall svg {
          flex: 0 0 auto;
          color: var(--cj-gold-bright);
        }

        .cj-footer-photo-wall strong,
        .cj-footer-photo-wall span {
          display: block;
        }

        .cj-footer-photo-wall strong {
          font-size: 12px;
        }

        .cj-footer-photo-wall span {
          margin-top: 5px;
          color: rgba(255, 255, 255, .62);
          font-size: 10px;
          line-height: 1.45;
        }

        .cj-footer-column {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
          padding-top: 14px;
        }

        .cj-footer-column > span {
          margin-bottom: 5px;
        }

        .cj-footer-column > button:not(.cj-footer-book),
        .cj-footer-column > a {
          padding: 0;
          border: 0;
          background: transparent;
          color: rgba(255, 255, 255, .72);
          font: inherit;
          font-size: 12px;
          font-weight: 700;
          line-height: 1.4;
          text-align: left;
          text-decoration: none;
          cursor: pointer;
        }

        .cj-footer-column > button:not(.cj-footer-book):hover,
        .cj-footer-column > a:hover {
          color: white;
        }

        .cj-footer-detail {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .cj-footer-detail svg {
          flex: 0 0 auto;
          color: var(--cj-gold-bright);
        }

        .cj-footer-detail small,
        .cj-footer-detail strong {
          display: block;
        }

        .cj-footer-detail small {
          color: rgba(255, 255, 255, .42);
          font-size: 8px;
          font-weight: 900;
          letter-spacing: .1em;
        }

        .cj-footer-detail strong {
          margin-top: 4px;
          color: rgba(255, 255, 255, .78);
          font-size: 11px;
          line-height: 1.4;
        }

        .cj-footer-book {
          min-height: 44px;
          margin-top: 6px;
          padding: 0 18px;
        }

        .cj-footer-bottom {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 18px;
          width: min(1080px, 100%);
          margin: 0 auto;
          padding: 21px 0 0;
          border-top: 1px solid rgba(255, 255, 255, .1);
          color: rgba(255, 255, 255, .42);
          font-size: 9px;
        }

        .cj-footer-bottom > div {
          display: flex;
          justify-content: center;
          gap: 15px;
        }

        .cj-footer-bottom > span:last-child {
          text-align: right;
        }

        .cj-footer-bottom a {
          color: inherit;
          text-decoration: none;
        }

        .cj-footer-bottom a:hover {
          color: white;
        }
        .cj-drawer-shell {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .cj-drawer-backdrop {
          position: absolute;
          inset: 0;
          border: 0;
          background: rgba(2, 11, 20, .76);
          backdrop-filter: blur(7px);
        }

        .cj-drawer {
          position: relative;
          z-index: 1;
          width: min(620px, 100%);
          max-height: 88vh;
          padding: 12px 18px 24px;
          overflow-y: auto;
          border-radius: 24px 24px 0 0;
          background: var(--cj-white);
          color: var(--cj-ink);
          box-shadow: 0 -22px 60px rgba(0, 0, 0, .42);
        }

        .cj-drawer-handle {
          width: 42px;
          height: 5px;
          margin: 0 auto 15px;
          border-radius: 999px;
          background: rgba(20, 43, 66, .18);
        }

        .cj-drawer-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
        }

        .cj-drawer-heading span {
          color: #966718;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: .14em;
        }

        .cj-drawer-heading h2 {
          margin: 6px 0 0;
          color: var(--cj-navy);
          font-family: Georgia, serif;
          font-size: 31px;
          line-height: 1;
        }

        .cj-drawer-heading > button {
          display: grid;
          width: 40px;
          height: 40px;
          place-items: center;
          border: 1px solid rgba(20, 43, 66, .12);
          border-radius: 11px;
          background: rgba(20, 43, 66, .05);
          color: var(--cj-ink);
          cursor: pointer;
        }

        .cj-drawer > p {
          margin: 14px 0 0;
          color: rgba(20, 43, 66, .67);
          font-size: 13px;
          line-height: 1.55;
        }

        .cj-drawer-choices {
          display: grid;
          gap: 8px;
          margin-top: 19px;
        }

        .cj-drawer-choices button {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          min-height: 50px;
          padding: 10px 13px;
          border: 1px solid rgba(20, 43, 66, .12);
          border-radius: 12px;
          background: white;
          color: var(--cj-ink);
          font-size: 12px;
          font-weight: 850;
          text-align: left;
          cursor: pointer;
          transition:
            border-color .18s ease,
            background .18s ease,
            transform .18s ease;
        }

        .cj-drawer-choices button:hover {
          border-color: rgba(215, 166, 53, .55);
          transform: translateY(-1px);
        }

        .cj-drawer-choices button.selected {
          border-color: #d7a635;
          background: #fff0b8;
          color: #65470f;
          box-shadow: inset 0 0 0 1px rgba(215, 166, 53, .16);
        }

        .cj-drawer-choices button svg {
          flex: 0 0 auto;
          color: #9b6d17;
        }

        .cj-drawer-action {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          min-height: 53px;
          margin-top: 20px;
          border: 0;
          border-radius: 13px;
          background:
            linear-gradient(180deg, #f5d15b, #e4ad2e);
          color: #172b3a;
          font-size: 12px;
          font-weight: 950;
          cursor: pointer;
        }

        .cj-drawer-confirmation {
          padding-top: 20px;
          text-align: center;
        }

        .cj-drawer-confirmation-icon {
          display: grid;
          width: 62px;
          height: 62px;
          margin: 0 auto 16px;
          place-items: center;
          border: 1px solid rgba(215, 166, 53, .32);
          border-radius: 20px;
          background:
            linear-gradient(
              180deg,
              #fff4c7 0%,
              #ffe99b 100%
            );
          color: #8a6116;
          box-shadow: 0 12px 28px rgba(180, 128, 29, .14);
        }

        .cj-drawer-confirmation > span,
        .cj-drawer-confirmation > strong {
          display: block;
        }

        .cj-drawer-confirmation > span {
          color: #966718;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: .14em;
        }

        .cj-drawer-confirmation > strong {
          margin-top: 7px;
          color: var(--cj-navy);
          font-family: Georgia, serif;
          font-size: 25px;
          line-height: 1.1;
        }

        .cj-drawer-confirmation > p {
          max-width: 470px;
          margin: 15px auto 0;
          color: rgba(20, 43, 66, .67);
          font-size: 13px;
          line-height: 1.6;
        }

        .cj-drawer-confirmation-actions {
          display: grid;
          grid-template-columns: 1fr 1.35fr;
          gap: 9px;
          margin-top: 22px;
        }

        .cj-drawer-confirmation-actions .cj-drawer-action {
          margin-top: 0;
        }

        .cj-drawer-secondary {
          min-height: 53px;
          padding: 0 14px;
          border: 1px solid rgba(20, 43, 66, .14);
          border-radius: 13px;
          background: white;
          color: var(--cj-ink);
          font: inherit;
          font-size: 12px;
          font-weight: 900;
          cursor: pointer;
        }

        .cj-drawer-confirmation > small {
          display: block;
          max-width: 470px;
          margin: 13px auto 0;
          color: rgba(20, 43, 66, .47);
          font-size: 9px;
          line-height: 1.5;
        }

        .cj-drawer > small {
          display: block;
          max-width: 450px;
          margin: 11px auto 0;
          color: rgba(20, 43, 66, .47);
          font-size: 9px;
          line-height: 1.45;
          text-align: center;
        }

        @media (max-width: 760px) {
          .cj-footer {
            padding-right: 18px;
            padding-left: 18px;
          }

          .cj-footer-cta {
            display: grid;
            padding: 34px 0;
          }

          .cj-footer-cta > button {
            width: 100%;
          }

          .cj-footer-main {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 30px 24px;
            padding: 38px 0;
          }

          .cj-footer-brand {
            grid-column: 1 / -1;
          }

          .cj-footer-bottom {
            grid-template-columns: 1fr;
            justify-items: center;
            text-align: center;
          }

          .cj-footer-bottom > span:last-child {
            text-align: center;
          }

          .cj-category-topbar {
            grid-template-columns: 90px minmax(0, 1fr) 90px;
            min-height: 72px;
            padding: 8px 10px;
          }

          .cj-category-topbar > img {
            width: 92px;
            max-height: 60px;
          }

          .cj-category-topbar > button {
            min-height: 44px;
            padding: 0 11px;
            font-size: 11px;
          }

          .cj-category-hero {
            min-height: 570px;
          }

          .cj-category-hero-copy {
            padding-bottom: 48px;
          }

          .cj-category-hero-copy h1 {
            font-size: 49px;
          }

          .cj-category-hero-copy p {
            font-size: 14px;
          }

          .cj-category-content {
            padding: 48px 0 64px;
          }

          .cj-category-highlights {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .cj-category-final {
            display: grid;
            padding: 25px 20px;
          }

          .cj-category-final button {
            width: 100%;
          }

          .cj-hero {
            min-height: 790px;
          }

          .cj-header {
            display: grid;
            grid-template-columns: 52px minmax(0, 1fr) auto;
            align-items: center;
            gap: 12px;
            width: calc(100% - 20px);
          }

          .cj-desktop-nav {
            display: none;
          }

          .cj-menu {
            display: grid;
          }

          .cj-logo {
            justify-self: center;
            width: 180px;
          }

          .cj-book {
            display: inline-flex;
            min-height: 48px;
            padding: 0 15px;
            font-size: 12px;
          }

          .cj-hero-content {
            margin-top: 28px;
          }

          .cj-experience-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .cj-plan {
            grid-template-columns: 1fr;
          }

          .cj-plan > button {
            grid-column: auto;
          }
        }

        @media (max-width: 470px) {
          .cj-drawer-confirmation-actions {
            grid-template-columns: 1fr;
          }

          .cj-footer-main {
            grid-template-columns: 1fr;
          }

          .cj-footer-brand {
            grid-column: auto;
          }

          .cj-footer-column {
            padding-top: 0;
          }

          .cj-hero {
            min-height: 770px;
          }

          .cj-header {
            grid-template-columns: 48px minmax(0, 1fr) auto;
            gap: 8px;
          }

          .cj-menu {
            width: 48px;
            height: 48px;
            border-radius: 15px;
          }

          .cj-menu svg {
            width: 26px;
            height: 26px;
            stroke-width: 2.4;
          }

          .cj-logo {
            width: 160px;
            max-height: 145px;
          }

          .cj-book {
            min-height: 46px;
            padding: 0 12px;
            border-radius: 14px;
            font-size: 11px;
          }

          .cj-hero-content {
            width: calc(100% - 20px);
            margin-top: 23px;
          }

          .cj-hero-content h1 {
            font-size: 47px;
          }

          .cj-hero-content > p {
            font-size: 13px;
          }

          .cj-action {
            min-height: 64px;
          }

          .cj-action-copy strong {
            font-size: 15px;
          }

          .cj-trust > div {
            flex-direction: column;
          }

          .cj-trust span {
            text-align: center;
          }

          .cj-experiences {
            margin-top: -27px;
            padding-right: 10px;
            padding-left: 10px;
          }

          .cj-experience-grid {
            gap: 8px;
          }

          .cj-experience-visual {
            height: 116px;
          }

          .cj-experience-body {
            padding: 11px;
          }

          .cj-experience-body h3 {
            font-size: 16px;
          }

          .cj-experience-body p {
            min-height: 88px;
            font-size: 10px;
          }

          .cj-plan {
            padding: 20px 15px;
          }
        }
      `}</style>
    </main>
  );
}







