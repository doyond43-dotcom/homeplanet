import { Link, useLocation } from "react-router-dom";
import MarshallRosenbachFooter from "../components/MarshallRosenbachFooter";
import ShareMetadata from "../components/ShareMetadata";

const BASE_URL = "https://www.homeplanet.city/planet/marshall-rosenbach";
const META_IMAGE = "https://www.homeplanet.city/homeplanet-favicon.svg";
const EFFECTIVE_DATE = "August 20, 2026";

type LegalPage = {
  title: string;
  metaTitle: string;
  description: string;
  sections: { heading: string; paragraphs: string[] }[];
};

const pages: Record<string, LegalPage> = {
  privacy: {
    title: "Privacy Policy",
    metaTitle: "Privacy Policy | Law Offices of Marshall E. Rosenbach",
    description:
      "Privacy information for the Law Offices of Marshall E. Rosenbach website and Free Case Review.",
    sections: [
      {
        heading: "Information you provide",
        paragraphs: [
          "When you submit a Free Case Review, you may provide your name, phone number, email address, accident date, and a short summary of what happened. If the office later requests documents or you choose to provide them, those documents and the information they contain may also be collected.",
        ],
      },
      {
        heading: "How information may be used",
        paragraphs: [
          "Information may be used to review your inquiry, contact you about it, determine whether the matter is one the firm may consider, request additional information, and maintain records related to the inquiry.",
        ],
      },
      {
        heading: "HomePlanet systems and service providers",
        paragraphs: [
          "Information may be stored and processed through HomePlanet systems used by the Law Offices of Marshall E. Rosenbach. The site may also rely on third-party service providers that support hosting, data storage, site operations, document handling, email, or other communications. These providers may handle information as reasonably necessary to provide those services.",
        ],
      },
      {
        heading: "Security and privacy",
        paragraphs: [
          "Reasonable administrative, technical, and organizational measures are used with the aim of protecting submitted information. No online transmission or storage system can be guaranteed to be completely secure, and absolute security cannot be promised.",
        ],
      },
      {
        heading: "No sale of personal information",
        paragraphs: [
          "The Law Offices of Marshall E. Rosenbach and HomePlanet do not sell personal information submitted through this Marshall Rosenbach website.",
        ],
      },
      {
        heading: "Privacy questions",
        paragraphs: [
          "For questions about privacy or information submitted through this site, contact the Law Offices of Marshall E. Rosenbach by calling 1-888-679-9090.",
        ],
      },
    ],
  },
  terms: {
    title: "Terms of Use",
    metaTitle: "Terms of Use | Law Offices of Marshall E. Rosenbach",
    description:
      "Terms governing use of the Law Offices of Marshall E. Rosenbach website and Free Case Review.",
    sections: [
      {
        heading: "General information only",
        paragraphs: [
          "This site is provided for general informational purposes. Its content is not legal advice, and you should not rely on it as a substitute for advice about your particular circumstances.",
        ],
      },
      {
        heading: "No attorney-client relationship",
        paragraphs: [
          "Using this site or submitting a Free Case Review does not by itself create an attorney-client relationship and does not guarantee representation. The Law Offices of Marshall E. Rosenbach may accept or decline any matter. Representation begins only after the firm agrees to represent you.",
        ],
      },
      {
        heading: "No guarantee of outcomes",
        paragraphs: [
          "No statement on this site guarantees a particular result, recovery, case value, or outcome. Legal matters depend on their individual facts and applicable law.",
        ],
      },
      {
        heading: "Accurate information",
        paragraphs: [
          "You agree to provide truthful and accurate information when using forms or other features on this site and not to misuse or interfere with the site or its systems.",
        ],
      },
      {
        heading: "Availability and external links",
        paragraphs: [
          "The site may change and may not always be available without interruption or error. Links to third-party sites may be provided for convenience; the firm does not control and is not responsible for third-party content or availability.",
        ],
      },
      {
        heading: "Reasonable limitations",
        paragraphs: [
          "To the extent permitted by applicable law, the firm and the providers supporting this site are not responsible for indirect or consequential losses arising solely from use of, or inability to use, the site. Nothing here limits responsibility that cannot lawfully be limited.",
          "These terms are intended to be interpreted consistently with applicable law. To the extent a governing-law question applies to use of this Florida office website, Florida law may apply, subject to any other law that must govern.",
        ],
      },
    ],
  },
  disclaimer: {
    title: "Legal Disclaimer",
    metaTitle: "Legal Disclaimer | Law Offices of Marshall E. Rosenbach",
    description:
      "Important legal disclaimer for the Law Offices of Marshall E. Rosenbach website and Free Case Review.",
    sections: [
      {
        heading: "Not legal advice",
        paragraphs: [
          "Website content is general information only and is not legal advice. Viewing this site or submitting information does not by itself create an attorney-client relationship.",
        ],
      },
      {
        heading: "Representation requires agreement",
        paragraphs: [
          "Representation begins only after the Law Offices of Marshall E. Rosenbach agrees to represent you. A submitted inquiry may be reviewed, accepted, or declined, and no submission guarantees acceptance.",
        ],
      },
      {
        heading: "No promised result",
        paragraphs: [
          "Prior results do not guarantee similar outcomes. No case value, result, recovery, or acceptance is guaranteed, and each matter depends on its own facts and applicable law.",
        ],
      },
      {
        heading: "Do not delay",
        paragraphs: [
          "Deadlines and statutes of limitation may apply to legal claims. You should not delay seeking legal advice because of information viewed on this site or while waiting for a response to an inquiry.",
        ],
      },
    ],
  },
};

export default function MarshallRosenbachLegalPage() {
  const { pathname } = useLocation();
  const pageKey = pathname.split("/").filter(Boolean).at(-1) || "disclaimer";
  const page = pages[pageKey] || pages.disclaimer;

  return (
    <main className="min-h-screen bg-[#0c0d0f] text-white">
      <ShareMetadata
        title={page.metaTitle}
        description={page.description}
        image={META_IMAGE}
        url={`${BASE_URL}/${pageKey}`}
      />

      <article className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
        <Link
          to="/planet/marshall-rosenbach"
          className="text-sm font-bold text-[#ddb15f] hover:text-[#edcb8b]"
        >
          ← Back to Marshall Rosenbach
        </Link>

        <header className="mt-8 border-b border-white/10 pb-8">
          <div className="text-xs font-black uppercase tracking-[0.22em] text-[#c99a45]">
            Law Offices of Marshall E. Rosenbach
          </div>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.035em] sm:text-5xl">
            {page.title}
          </h1>
          <p className="mt-4 text-sm text-white/40">Effective date: {EFFECTIVE_DATE}</p>
        </header>

        {pageKey === "disclaimer" && (
          <aside className="mt-8 rounded-2xl border border-[#c99a45]/40 bg-[#c99a45]/10 p-5 text-base font-semibold leading-7 text-white/90 sm:p-6">
            This website provides general information, not legal advice. Viewing
            the site or submitting information does not by itself create an
            attorney-client relationship. Representation begins only after the
            firm agrees to represent you.
          </aside>
        )}

        <div className="mt-9 space-y-9 text-base leading-7 text-white/70">
          {page.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-black text-white">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-3">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </article>

      <MarshallRosenbachFooter />
    </main>
  );
}
