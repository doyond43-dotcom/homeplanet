import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SHARE_TITLE = "Only The Essentials Cleaning";
const SHARE_DESCRIPTION =
  "Book cleaning, ask questions, send home notes, or reschedule in one easy place.";
const SHARE_IMAGE =
  "https://www.homeplanet.city/images/only-the-essentials-preview.jpg";
const SHARE_URL = "https://www.homeplanet.city/planet/only-the-essentials";

export default function OnlyTheEssentialsLanding() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = SHARE_TITLE;

    const setMeta = (
      selector: string,
      attrName: "property" | "name",
      attrValue: string,
      content: string
    ) => {
      let tag = document.head.querySelector(selector) as HTMLMetaElement | null;

      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attrName, attrValue);
        document.head.appendChild(tag);
      }

      tag.setAttribute("content", content);
    };

    setMeta("meta[property='og:title']", "property", "og:title", SHARE_TITLE);
    setMeta(
      "meta[property='og:description']",
      "property",
      "og:description",
      SHARE_DESCRIPTION
    );
    setMeta("meta[property='og:image']", "property", "og:image", SHARE_IMAGE);
    setMeta("meta[property='og:url']", "property", "og:url", SHARE_URL);
    setMeta("meta[property='og:type']", "property", "og:type", "website");

    setMeta("meta[name='twitter:card']", "name", "twitter:card", "summary_large_image");
    setMeta("meta[name='twitter:title']", "name", "twitter:title", SHARE_TITLE);
    setMeta(
      "meta[name='twitter:description']",
      "name",
      "twitter:description",
      SHARE_DESCRIPTION
    );
    setMeta("meta[name='twitter:image']", "name", "twitter:image", SHARE_IMAGE);
  }, []);

  function go(type: "book" | "question" | "reschedule" | "notes") {
    navigate(`/planet/only-the-essentials/request?type=${type}`);
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-xl text-center mt-6">
        <div className="text-xs uppercase tracking-[0.28em] text-rose-300/80">
          Only The Essentials
        </div>

        <h1 className="text-3xl font-bold tracking-tight mt-3">
          Cleaning that keeps life moving.
        </h1>

        <p className="text-sm text-gray-400 mt-3 leading-6">
          Book, ask a question, reschedule, or leave job notes. Your request goes
          straight into the live organizer board so nothing gets lost.
        </p>
      </div>

      <div className="w-full max-w-xl mt-8 rounded-3xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-100">
        Simple, reliable cleaning help for the things that actually need done.
        No app confusion. No back and forth.
      </div>

      <div className="w-full max-w-xl flex flex-col gap-4 mt-6">
        <button
          onClick={() => go("book")}
          className="w-full bg-white text-black font-semibold py-4 rounded-2xl text-lg active:scale-[0.98] shadow-[0_0_0_1px_rgba(244,114,182,0.25),0_8px_30px_rgba(244,114,182,0.15)]"
        >
          Book a Cleaning
        </button>

        <button
          onClick={() => go("question")}
          className="w-full border border-gray-700 py-4 rounded-2xl text-lg active:scale-[0.98] hover:border-rose-400/40 hover:bg-rose-400/5"
        >
          Ask a Question
        </button>

        <button
          onClick={() => go("reschedule")}
          className="w-full border border-gray-700 py-4 rounded-2xl text-lg active:scale-[0.98] hover:border-rose-400/40 hover:bg-rose-400/5"
        >
          Reschedule / Update
        </button>

        <button
          onClick={() => go("notes")}
          className="w-full border border-gray-700 py-4 rounded-2xl text-lg active:scale-[0.98] hover:border-rose-400/40 hover:bg-rose-400/5"
        >
          Leave Job Notes
        </button>
      </div>

      <div className="w-full max-w-xl mt-8 grid grid-cols-1 gap-3 text-sm text-gray-400">
        <div className="rounded-2xl border border-gray-800 p-4">
          House cleaning, touch-ups, reminders, supplies, notes, and schedule changes in one place.
        </div>
        <div className="rounded-2xl border border-gray-800 p-4">
          Built for real work, not corporate fluff.
        </div>
      </div>

      <div className="text-xs text-gray-600 text-center mt-10">
        No apps. No confusion. Just real work.
      </div>
    </div>
  );
}