import { useEffect, useMemo, useRef, useState } from "react";
import { getSupabase } from "../lib/supabase";

type VibeKey = "blue" | "emerald" | "sunset" | "midnight";
type BackgroundKey = "black" | "charcoal" | "white" | "gray" | "cream";
type BlockType = "whoWeAre" | "contactInfo" | "pricingNote" | "servicePills" | "requestForm" | "livePhotoWall" | "localNote" | "paymentBlock" | "bookNow";

type LiveBlock = {
  id: string;
  type: BlockType;
  label: string;
};

const vibes = {
  blue: {
    name: "Ocean Blue",
    accent: "from-blue-500 to-cyan-400",
    primary: "bg-blue-500",
    soft: "border-blue-400/20 bg-blue-500/10",
    text: "text-blue-100",
    location: "text-blue-300",
    ring: "ring-blue-400/60",
  },
  emerald: {
    name: "Emerald",
    accent: "from-emerald-500 to-green-400",
    primary: "bg-emerald-500",
    soft: "border-emerald-400/20 bg-emerald-500/10",
    text: "text-emerald-100",
    location: "text-emerald-300",
    ring: "ring-emerald-400/60",
  },
  sunset: {
    name: "Sunset Red",
    accent: "from-rose-500 to-orange-400",
    primary: "bg-rose-500",
    soft: "border-rose-400/20 bg-rose-500/10",
    text: "text-rose-100",
    location: "text-rose-300",
    ring: "ring-rose-400/60",
  },
  midnight: {
    name: "Midnight",
    accent: "from-slate-700 to-slate-900",
    primary: "bg-slate-700",
    soft: "border-slate-400/20 bg-slate-500/10",
    text: "text-slate-100",
    location: "text-slate-300",
    ring: "ring-slate-300/50",
  },
};

const backgroundChoices: Record<BackgroundKey, { name: string; preview: string; sample: string }> = {
  black: {
    name: "Black",
    preview: "bg-[#05070d] border-white/15",
    sample: "text-white",
  },
  charcoal: {
    name: "Charcoal",
    preview: "bg-[#15171c] border-white/15",
    sample: "text-white",
  },
  white: {
    name: "White",
    preview: "bg-white border-slate-200",
    sample: "text-slate-950",
  },
  gray: {
    name: "Soft Gray",
    preview: "bg-[#f1f3f5] border-slate-300",
    sample: "text-slate-950",
  },
  cream: {
    name: "Warm Cream",
    preview: "bg-[#f4eddf] border-stone-300",
    sample: "text-stone-900",
  },
};

const defaultPhotos = [
  "/images/sebastian-softwash-hero.jpg",
  "/images/sebastian-softwash-action-1.jpg",
  "/images/sebastian-softwash-action-2.jpg",
];

const availableBlocks: LiveBlock[] = [
  { id: "whoWeAre", type: "whoWeAre", label: "Who We Are" },
  { id: "contactInfo", type: "contactInfo", label: "Contact Info" },
  { id: "pricingNote", type: "pricingNote", label: "Pricing Note" },
  { id: "servicePills", type: "servicePills", label: "Services" },
  { id: "requestForm", type: "requestForm", label: "Request Form" },
  { id: "livePhotoWall", type: "livePhotoWall", label: "Photo Gallery" },
  { id: "localNote", type: "localNote", label: "Local Note" },
  { id: "paymentBlock", type: "paymentBlock", label: "Payment Link" },
];

export default function StarterLivePageCreatorPage() {
  const sourceSystemSlug =
    new URLSearchParams(window.location.search).get("system")?.trim() || "";

  const sourceSystem = useMemo(() => {
    if (!sourceSystemSlug) return null;

    try {
      const raw = localStorage.getItem(`hp-system:${sourceSystemSlug}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [sourceSystemSlug]);

  const cameFromBuildMySystem = Boolean(sourceSystemSlug && sourceSystem);

  const freshDraftStorageKey = "hp-starter-creator-draft:v1";
  const freshDraftRestoredRef = useRef(false);
  const skipFirstDraftSaveRef = useRef(true);
  const [vibe, setVibe] = useState<VibeKey>("blue");
  const [pageBackground, setPageBackground] = useState<BackgroundKey>("black");
  const [activeBlockId, setActiveBlockId] = useState("whoWeAre");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  const [name, setName] = useState(
    sourceSystem?.businessName?.trim() || ""
  );
  const [city, setCity] = useState(
    ""
  );
  const [service, setService] = useState(
    sourceSystem?.businessType?.trim() || ""
  );
  const [phone, setPhone] = useState(
    ""
  );

  const [notificationEmail, setNotificationEmail] = useState("");
  const [notificationPhone, setNotificationPhone] = useState("");
  const [emailAlertsEnabled, setEmailAlertsEnabled] = useState(true);
  const [smsAlertsEnabled, setSmsAlertsEnabled] = useState(false);

  const [slug, setSlug] = useState(
    sourceSystemSlug || ""
  );

  const [pageAddressCustomized, setPageAddressCustomized] = useState(false);

  const [whoWeAre, setWhoWeAre] = useState(
    cameFromBuildMySystem
      ? `${sourceSystem?.businessName?.trim() || "This business"} helps customers with ${sourceSystem?.businessType?.trim() || "the work they need"}.`
      : ""
  );

  const [pricingTitle, setPricingTitle] = useState(cameFromBuildMySystem ? "Simple estimates." : "");
  const [pricingText, setPricingText] = useState(
    cameFromBuildMySystem
      ? "Tell us what you need and we will help you with the next step."
      : ""
  );

  const [servicesText, setServicesText] = useState(
    cameFromBuildMySystem ? (sourceSystem?.businessType?.trim() || "") : ""
  );

  const [localNoteTitle, setLocalNoteTitle] = useState(cameFromBuildMySystem ? "About Us" : "");
  const [localNoteText, setLocalNoteText] = useState(
    cameFromBuildMySystem
      ? ""
      : ""
  );

  const [paymentTitle, setPaymentTitle] = useState("Payment Link");
  const [paymentPrice, setPaymentPrice] = useState("");
  const [paymentNote, setPaymentNote] = useState("");
  const [paymentUrl, setPaymentUrl] = useState("");

  const [blocks, setBlocks] = useState<LiveBlock[]>(availableBlocks);
  const [heroPhoto, setHeroPhoto] = useState("");
  const [wallPhotos, setWallPhotos] = useState<string[]>([]);
  const [whoWeAreImage, setWhoWeAreImage] = useState("");
  const [servicesImage, setServicesImage] = useState("");
  const [logoImage, setLogoImage] = useState("");
  const [footerLogoImage, setFooterLogoImage] = useState("");
  const [tagline, setTagline] = useState("");
  const [headerButtonText, setHeaderButtonText] = useState("Get a Quote");
  const [footerMessage, setFooterMessage] = useState("");
  const [whoWeAreLabel, setWhoWeAreLabel] = useState("Who We Are");
  const [whoWeAreHeadline, setWhoWeAreHeadline] = useState("");
  const [servicesLabel, setServicesLabel] = useState("Services");
  const [servicesHeadline, setServicesHeadline] = useState("");
  const [servicesIntro, setServicesIntro] = useState("");
  const [galleryLabel, setGalleryLabel] = useState("Photo Gallery");
  const [galleryHeadline, setGalleryHeadline] = useState("");
  const [galleryText, setGalleryText] = useState("");
  const [whyLabel, setWhyLabel] = useState("Why Choose Us");
  const [whyHeadline, setWhyHeadline] = useState("");
  const [ctaLabel, setCtaLabel] = useState("Ready to Get Started?");
  const [ctaHeadline, setCtaHeadline] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaButtonText, setCtaButtonText] = useState("Get Started");

  useEffect(() => {
    if (sourceSystemSlug || pageAddressCustomized) return;

    const generatedAddress = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setSlug(generatedAddress);
  }, [name, sourceSystemSlug, pageAddressCustomized]);
  useEffect(() => {
    if (sourceSystemSlug || freshDraftRestoredRef.current) return;

    freshDraftRestoredRef.current = true;

    try {
      const raw = window.localStorage.getItem(freshDraftStorageKey);
      if (!raw) return;

      const draft = JSON.parse(raw) as Record<string, any>;

      if (typeof draft.name === "string") setName(draft.name);
      if (typeof draft.city === "string") setCity(draft.city);
      if (typeof draft.service === "string") setService(draft.service);
      if (typeof draft.phone === "string") setPhone(draft.phone);

      if (typeof draft.notificationEmail === "string")
        setNotificationEmail(draft.notificationEmail);

      if (typeof draft.notificationPhone === "string")
        setNotificationPhone(draft.notificationPhone);

      if (typeof draft.emailAlertsEnabled === "boolean")
        setEmailAlertsEnabled(draft.emailAlertsEnabled);

      if (typeof draft.smsAlertsEnabled === "boolean")
        setSmsAlertsEnabled(draft.smsAlertsEnabled);

      if (typeof draft.slug === "string") setSlug(draft.slug);
      if (typeof draft.pageAddressCustomized === "boolean")
        setPageAddressCustomized(draft.pageAddressCustomized);

      if (typeof draft.whoWeAre === "string") setWhoWeAre(draft.whoWeAre);
      if (typeof draft.pricingTitle === "string") setPricingTitle(draft.pricingTitle);
      if (typeof draft.pricingText === "string") setPricingText(draft.pricingText);
      if (typeof draft.localNoteTitle === "string") setLocalNoteTitle(draft.localNoteTitle);
      if (typeof draft.localNoteText === "string") setLocalNoteText(draft.localNoteText);

      if (typeof draft.paymentTitle === "string") setPaymentTitle(draft.paymentTitle);
      if (typeof draft.paymentPrice === "string") setPaymentPrice(draft.paymentPrice);
      if (typeof draft.paymentNote === "string") setPaymentNote(draft.paymentNote);
      if (typeof draft.paymentUrl === "string") setPaymentUrl(draft.paymentUrl);

      if (typeof draft.servicesText === "string") setServicesText(draft.servicesText);

      if (typeof draft.heroPhoto === "string") setHeroPhoto(draft.heroPhoto);
      if (Array.isArray(draft.wallPhotos)) setWallPhotos(draft.wallPhotos);
      if (typeof draft.whoWeAreImage === "string") setWhoWeAreImage(draft.whoWeAreImage);
      if (typeof draft.servicesImage === "string") setServicesImage(draft.servicesImage);
      if (typeof draft.logoImage === "string") setLogoImage(draft.logoImage);
      if (typeof draft.footerLogoImage === "string") setFooterLogoImage(draft.footerLogoImage);

      if (typeof draft.tagline === "string") setTagline(draft.tagline);
      if (typeof draft.headerButtonText === "string") setHeaderButtonText(draft.headerButtonText);
      if (typeof draft.footerMessage === "string") setFooterMessage(draft.footerMessage);

      if (typeof draft.whoWeAreLabel === "string") setWhoWeAreLabel(draft.whoWeAreLabel);
      if (typeof draft.whoWeAreHeadline === "string") setWhoWeAreHeadline(draft.whoWeAreHeadline);

      if (typeof draft.servicesLabel === "string") setServicesLabel(draft.servicesLabel);
      if (typeof draft.servicesHeadline === "string") setServicesHeadline(draft.servicesHeadline);
      if (typeof draft.servicesIntro === "string") setServicesIntro(draft.servicesIntro);

      if (typeof draft.galleryLabel === "string") setGalleryLabel(draft.galleryLabel);
      if (typeof draft.galleryHeadline === "string") setGalleryHeadline(draft.galleryHeadline);
      if (typeof draft.galleryText === "string") setGalleryText(draft.galleryText);

      if (typeof draft.whyLabel === "string") setWhyLabel(draft.whyLabel);
      if (typeof draft.whyHeadline === "string") setWhyHeadline(draft.whyHeadline);

      if (typeof draft.ctaLabel === "string") setCtaLabel(draft.ctaLabel);
      if (typeof draft.ctaHeadline === "string") setCtaHeadline(draft.ctaHeadline);
      if (typeof draft.ctaText === "string") setCtaText(draft.ctaText);
      if (typeof draft.ctaButtonText === "string") setCtaButtonText(draft.ctaButtonText);

      if (typeof draft.vibe === "string" && draft.vibe in vibes)
        setVibe(draft.vibe as VibeKey);

      if (
        typeof draft.pageBackground === "string" &&
        draft.pageBackground in backgroundChoices
      ) {
        setPageBackground(draft.pageBackground as BackgroundKey);
      }

      if (Array.isArray(draft.blocks)) setBlocks(draft.blocks);

      setSaveStatus("saved");
      window.setTimeout(() => setSaveStatus("idle"), 1800);
    } catch (error) {
      console.error("[starter_creator_draft] restore error:", error);
    }
  }, [sourceSystemSlug]);

  useEffect(() => {
    if (sourceSystemSlug) return;

    if (skipFirstDraftSaveRef.current) {
      skipFirstDraftSaveRef.current = false;
      return;
    }

    const timer = window.setTimeout(() => {
      try {
        const draft = {
          name,
          city,
          service,
          phone,
          notificationEmail,
          notificationPhone,
          emailAlertsEnabled,
          smsAlertsEnabled,
          slug,
          pageAddressCustomized,
          whoWeAre,
          pricingTitle,
          pricingText,
          localNoteTitle,
          localNoteText,
          paymentTitle,
          paymentPrice,
          paymentNote,
          paymentUrl,
          servicesText,
          heroPhoto,
          wallPhotos,
          whoWeAreImage,
          servicesImage,
          logoImage,
          footerLogoImage,
          tagline,
          headerButtonText,
          footerMessage,
          whoWeAreLabel,
          whoWeAreHeadline,
          servicesLabel,
          servicesHeadline,
          servicesIntro,
          galleryLabel,
          galleryHeadline,
          galleryText,
          whyLabel,
          whyHeadline,
          ctaLabel,
          ctaHeadline,
          ctaText,
          ctaButtonText,
          vibe,
          pageBackground,
          blocks,
          savedAt: new Date().toISOString(),
        };

        window.localStorage.setItem(
          freshDraftStorageKey,
          JSON.stringify(draft)
        );

        setSaveStatus("saved");
        window.setTimeout(() => setSaveStatus("idle"), 1400);
      } catch (error) {
        console.error("[starter_creator_draft] autosave error:", error);
      }
    }, 500);

    return () => window.clearTimeout(timer);
  }, [
    sourceSystemSlug,
    name,
    city,
    service,
    phone,
    notificationEmail,
    notificationPhone,
    emailAlertsEnabled,
    smsAlertsEnabled,
    slug,
    pageAddressCustomized,
    whoWeAre,
    pricingTitle,
    pricingText,
    localNoteTitle,
    localNoteText,
    paymentTitle,
    paymentPrice,
    paymentNote,
    paymentUrl,
    servicesText,
    heroPhoto,
    wallPhotos,
    whoWeAreImage,
    servicesImage,
    logoImage,
    footerLogoImage,
    tagline,
    headerButtonText,
    footerMessage,
    whoWeAreLabel,
    whoWeAreHeadline,
    servicesLabel,
    servicesHeadline,
    servicesIntro,
    galleryLabel,
    galleryHeadline,
    galleryText,
    whyLabel,
    whyHeadline,
    ctaLabel,
    ctaHeadline,
    ctaText,
    ctaButtonText,
    vibe,
    pageBackground,
    blocks,
  ]);


  useEffect(() => {
    const livePageSlug = sourceSystem?.livePageSlug?.trim();
    if (!livePageSlug) return;

    let cancelled = false;

    async function restoreLivePage() {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("starter_live_pages")
        .select("page_data")
        .eq("slug", livePageSlug)
        .maybeSingle();

      if (cancelled || error || !data?.page_data) return;

      const saved = data.page_data as Record<string, any>;

      if (typeof saved.name === "string") setName(saved.name);
      if (typeof saved.city === "string") setCity(saved.city);
      if (typeof saved.service === "string") setService(saved.service);
      if (typeof saved.phone === "string") setPhone(saved.phone);
      if (typeof saved.whoWeAre === "string") setWhoWeAre(saved.whoWeAre);
      if (typeof saved.pricingTitle === "string") setPricingTitle(saved.pricingTitle);
      if (typeof saved.pricingText === "string") setPricingText(saved.pricingText);
      if (typeof saved.localNoteTitle === "string") setLocalNoteTitle(saved.localNoteTitle);
      if (typeof saved.localNoteText === "string") setLocalNoteText(saved.localNoteText);
      if (typeof saved.paymentTitle === "string") setPaymentTitle(saved.paymentTitle);
      if (typeof saved.paymentPrice === "string") setPaymentPrice(saved.paymentPrice);
      if (typeof saved.paymentNote === "string") setPaymentNote(saved.paymentNote);
      if (typeof saved.paymentUrl === "string") setPaymentUrl(saved.paymentUrl);
      if (Array.isArray(saved.services)) setServicesText(saved.services.join(", "));
      if (typeof saved.heroPhoto === "string") setHeroPhoto(saved.heroPhoto);
      if (Array.isArray(saved.wallPhotos)) setWallPhotos(saved.wallPhotos);
      if (typeof saved.whoWeAreImage === "string") setWhoWeAreImage(saved.whoWeAreImage);
      if (typeof saved.servicesImage === "string") setServicesImage(saved.servicesImage);
      if (typeof saved.logoImage === "string") setLogoImage(saved.logoImage);
      if (typeof saved.footerLogoImage === "string") setFooterLogoImage(saved.footerLogoImage);
      if (typeof saved.tagline === "string") setTagline(saved.tagline);
      if (typeof saved.headerButtonText === "string") setHeaderButtonText(saved.headerButtonText);
      if (typeof saved.footerMessage === "string") setFooterMessage(saved.footerMessage);
      if (typeof saved.whoWeAreLabel === "string") setWhoWeAreLabel(saved.whoWeAreLabel);
      if (typeof saved.whoWeAreHeadline === "string") setWhoWeAreHeadline(saved.whoWeAreHeadline);
      if (typeof saved.servicesLabel === "string") setServicesLabel(saved.servicesLabel);
      if (typeof saved.servicesHeadline === "string") setServicesHeadline(saved.servicesHeadline);
      if (typeof saved.servicesIntro === "string") setServicesIntro(saved.servicesIntro);
      if (typeof saved.galleryLabel === "string") setGalleryLabel(saved.galleryLabel);
      if (typeof saved.galleryHeadline === "string") setGalleryHeadline(saved.galleryHeadline);
      if (typeof saved.galleryText === "string") setGalleryText(saved.galleryText);
      if (typeof saved.whyLabel === "string") setWhyLabel(saved.whyLabel);
      if (typeof saved.whyHeadline === "string") setWhyHeadline(saved.whyHeadline);
      if (typeof saved.ctaLabel === "string") setCtaLabel(saved.ctaLabel);
      if (typeof saved.ctaHeadline === "string") setCtaHeadline(saved.ctaHeadline);
      if (typeof saved.ctaText === "string") setCtaText(saved.ctaText);
      if (typeof saved.ctaButtonText === "string") setCtaButtonText(saved.ctaButtonText);
      if (Array.isArray(saved.blocks)) {
        setBlocks(
          saved.blocks.map((block: LiveBlock) => {
            if (block.type === "servicePills") {
              return { ...block, label: "Services" };
            }

            if (block.type === "livePhotoWall") {
              return { ...block, label: "Photo Gallery" };
            }

            return block;
          })
        );
      }
      if (typeof saved.vibe === "string" && saved.vibe in vibes) setVibe(saved.vibe as VibeKey);
      if (typeof saved.pageBackground === "string" && saved.pageBackground in backgroundChoices) setPageBackground(saved.pageBackground as BackgroundKey);
      setSlug(livePageSlug);
    }

    restoreLivePage();

    return () => {
      cancelled = true;
    };
  }, [sourceSystem?.livePageSlug]);

  const active = vibes[vibe];

  function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Could not read image file."));
      }
    };

    reader.onerror = () => reject(reader.error || new Error("Could not read image file."));
    reader.readAsDataURL(file);
  });
}

async function handleHeroUpload(event: React.ChangeEvent<HTMLInputElement>) {
  const file = event.target.files?.[0];
  if (!file) return;

  setHeroPhoto(await fileToDataUrl(file));

  event.target.value = "";
}

  async function handleWhoWeAreImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setWhoWeAreImage(await fileToDataUrl(file));
    event.target.value = "";
  }

  async function handleServicesImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setServicesImage(await fileToDataUrl(file));
    event.target.value = "";
  }

  async function handleLogoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setLogoImage(await fileToDataUrl(file));
    event.target.value = "";
  }

  async function handleFooterLogoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setFooterLogoImage(await fileToDataUrl(file));
    event.target.value = "";
  }

  async function handleWallUpload(event: React.ChangeEvent<HTMLInputElement>) {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;

  const newPhotos = await Promise.all(files.map(fileToDataUrl));
  setWallPhotos((current) => [...current, ...newPhotos].slice(0, 6));

  event.target.value = "";
}
  const selectedBlock = blocks.find((block) => block.id === activeBlockId);

  
  const cleanPhone = phone.replace(/\D/g, "");
  const smsPhone = cleanPhone.length === 10 ? `+1${cleanPhone}` : `+${cleanPhone}`;
  const requestBody = encodeURIComponent(
    `Hey, I saw ${name}'s live page and wanted to request work. I can send a photo now.`
  );
const servicePills = useMemo(
    () =>
      servicesText
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 6),
    [servicesText]
  );

  function removeBlock(id: string) {
    setBlocks((current) => current.filter((block) => block.id !== id));
    if (activeBlockId === id) {
      const next = blocks.find((block) => block.id !== id);
      setActiveBlockId(next?.id || "");
    }
  }

  function addBlock(block: LiveBlock) {
    setBlocks((current) => {
      if (current.some((item) => item.id === block.id)) return current;
      return [...current, block];
    });
    setActiveBlockId(block.id);
  }

  function moveBlock(id: string, direction: "up" | "down") {
    setBlocks((current) => {
      const index = current.findIndex((block) => block.id === id);
      if (index === -1) return current;

      const nextIndex = direction === "up" ? index - 1 : index + 1;
      if (nextIndex < 0 || nextIndex >= current.length) return current;

      const copy = [...current];
      const [item] = copy.splice(index, 1);
      copy.splice(nextIndex, 0, item);
      return copy;
    });
  }

  function previewWrap(block: LiveBlock, children: React.ReactNode) {
    const isActive = activeBlockId === block.id;

    return (
      <div
        key={block.id}
        onClick={() => setActiveBlockId(block.id)}
        className={`cursor-pointer rounded-[1.75rem] transition ${isActive ? `ring-2 ${active.ring} ring-offset-2 ring-offset-[#07101d]` : "hover:ring-1 hover:ring-white/20"}`}
      >
        {children}
      </div>
    );
  }

  function renderPreviewBlock(block: LiveBlock) {
    if (block.type === "whoWeAre") {
      return previewWrap(
        block,
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-4">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
            Who We Are
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-200">{whoWeAre}</p>
        </div>
      );
    }

    if (block.type === "pricingNote") {
      return previewWrap(
        block,
        <div className={`rounded-[1.5rem] border ${active.soft} p-4`}>
          <p className={`text-sm font-black ${active.text}`}>{pricingTitle}</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-200">{pricingText}</p>
        </div>
      );
    }

    if (block.type === "servicePills") {
      return previewWrap(
        block,
        <div className="rounded-[1.5rem] p-3">          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-slate-500">            Services
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {servicePills.map((item) => (
              <div
                key={item}
                className={`rounded-[1.2rem] border ${active.soft} px-3 py-4 text-center text-xs font-semibold ${active.text}`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (block.type === "requestForm") {
      return previewWrap(
        block,
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-4">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
            Request Form
          </p>

          <p className="mt-2 text-lg font-black text-white">
            Tell us what you need.
          </p>

          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Customers can send their name, phone, service, location, and project details directly from the Live Page.
          </p>

          <div className={`mt-4 flex h-12 items-center justify-center rounded-2xl ${active.primary} text-sm font-black text-white`}>
            Send Request
          </div>
        </div>
      );
    }
    if (block.type === "paymentBlock") {
      if (!paymentPrice.trim() && !paymentNote.trim() && !paymentUrl.trim()) return null;
      return previewWrap(
        block,
        <div className={`rounded-[1.5rem] border ${active.soft} p-4`}>
          <p className={`text-xs font-black uppercase tracking-[0.2em] ${active.location}`}>
            {paymentTitle}
          </p>
          <p className="mt-3 text-3xl font-black text-white">{paymentPrice}</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-200">{paymentNote}</p>
          <div className="mt-4 flex h-12 items-center justify-center rounded-2xl bg-white text-sm font-black text-black">
            Pay Now
          </div>
        </div>
      );
    }

    if (block.type === "localNote") {
      return previewWrap(
        block,
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-4">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
            {localNoteTitle}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-200">{localNoteText}</p>
        </div>
      );
    }

    if (block.type === "livePhotoWall") {
      if (wallPhotos.length === 0) return null;
      return previewWrap(
        block,
        <div className="rounded-[1.5rem]">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-slate-500">
            Photo Gallery
          </p>
          <div className="grid grid-cols-2 gap-3">
            {wallPhotos.map((image) => (
              <div key={image} className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black">
                <img src={image} alt="live wall" className="h-44 w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      );
    }

    return previewWrap(
      block,
      <a href={`sms:${smsPhone}?&body=${requestBody}`} className="flex h-16 w-full items-center justify-between rounded-[1.6rem] bg-white px-6 text-left text-black">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Ready?
          </p>
          <p className="mt-1 text-lg font-black">Request Work</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
          ?
        </div>
      </a>
    );
  }
  async function saveNotificationSettings(livePageSlug: string) {
    const cleanNotificationEmail = notificationEmail.trim();
    const cleanNotificationPhone = notificationPhone.trim();

    if (!emailAlertsEnabled && !smsAlertsEnabled) {
      throw new Error("Turn on at least one request notification method.");
    }

    if (emailAlertsEnabled && !cleanNotificationEmail) {
      throw new Error("Add the email address that should receive new requests.");
    }

    if (smsAlertsEnabled && !cleanNotificationPhone) {
      throw new Error("Add the mobile number that should receive text alerts.");
    }

    const supabase = getSupabase();

    const accessStorageKey = `hp-starter-admin:${livePageSlug}`;
    let adminAccessToken = "";

    try {
      adminAccessToken =
        window.localStorage.getItem(accessStorageKey)?.trim() || "";

      if (!adminAccessToken) {
        adminAccessToken = crypto.randomUUID();
        window.localStorage.setItem(accessStorageKey, adminAccessToken);
      }
    } catch {
      adminAccessToken = crypto.randomUUID();
    }

    const { error } = await supabase.rpc(
      "save_starter_notification_settings_v2",
      {
        p_live_page_slug: livePageSlug,
        p_notification_email: cleanNotificationEmail,
        p_notification_phone: cleanNotificationPhone,
        p_email_enabled: emailAlertsEnabled,
        p_sms_enabled: smsAlertsEnabled,
        p_admin_access_token: adminAccessToken,
      }
    );

    if (error) {
      console.error("[starter_notification_settings] save error:", error);
      throw new Error(error.message);
    }
  }

  async function saveLivePageChanges() {
    const livePageSlug = sourceSystem?.livePageSlug?.trim();
    if (!livePageSlug) {
      alert("Launch this Live Page once before saving changes.");
      return;
    }

    setSaveStatus("saving");

    const pagePatch = {
      name,
      city,
      service,
      phone,
      whoWeAre,
      pricingTitle,
      pricingText,
      localNoteTitle,
      localNoteText,
      paymentTitle,
      paymentPrice,
      paymentNote,
      paymentUrl,
      services: servicePills,
      tagline,
      headerButtonText,
      footerMessage,
      whoWeAreLabel,
      whoWeAreHeadline,
      servicesLabel,
      servicesHeadline,
      servicesIntro,
      galleryLabel,
      galleryHeadline,
      galleryText,
      whyLabel,
      whyHeadline,
      ctaLabel,
      ctaHeadline,
      ctaText,
      ctaButtonText,
      vibe,
      pageBackground,
      blocks: blocks.filter((block) => block.type !== "bookNow"),
    };

    const supabase = getSupabase();
    const { error } = await supabase.rpc("patch_starter_live_page", {
      p_slug: livePageSlug,
      p_patch: pagePatch,
    });
    if (error) {
      console.error("[starter_live_pages] save changes error:", error);
      setSaveStatus("idle");
      alert(`Could not save changes: ${error.message}`);
      return;
    }

    try {
      await saveNotificationSettings(livePageSlug);
    } catch (notificationError) {
      console.error(
        "[starter_notification_settings] save changes error:",
        notificationError
      );

      setSaveStatus("idle");

      alert(
        notificationError instanceof Error
          ? notificationError.message
          : "Could not save request notification settings."
      );

      return;
    }

    setSaveStatus("saved");
    window.setTimeout(() => setSaveStatus("idle"), 1800);
  }

  async function launchLivePage() {
    if (cameFromBuildMySystem) {
      if (!city.trim()) { alert("Add your city or service area before launching."); return; }
      if (!phone.trim()) { alert("Add a phone number before launching."); return; }
      if (!heroPhoto) { alert("Add a real hero photo before launching your Live Page."); return; }
    }
    const cleanSlug =
      slug
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") || "starter-live-page";

    const pageData = {
      name,
      city,
      service,
      phone,
      whoWeAre,
      pricingTitle,
      pricingText,
      localNoteTitle,
      localNoteText,
      paymentTitle,
      paymentPrice,
      paymentNote,
      paymentUrl,
      services: servicePills,
      heroPhoto,
      wallPhotos,
      whoWeAreImage,
      servicesImage,
      logoImage,
      footerLogoImage,
      tagline,
      headerButtonText,
      footerMessage,
      whoWeAreLabel,
      whoWeAreHeadline,
      servicesLabel,
      servicesHeadline,
      servicesIntro,
      galleryLabel,
      galleryHeadline,
      galleryText,
      whyLabel,
      whyHeadline,
      ctaLabel,
      ctaHeadline,
      ctaText,
      ctaButtonText,
      vibe,
      pageBackground,
      blocks: blocks.filter((block) => block.type !== "bookNow"),
    };

    const supabase = getSupabase();

    const { error } = await supabase.from("starter_live_pages").upsert(
      {
        slug: cleanSlug,
        page_data: pageData,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "slug" }
    );

    if (error) {
      console.error("[starter_live_pages] save error:", error);
      alert(`Could not launch live page: ${error.message}`);
      return;
    }

    try {
      await saveNotificationSettings(cleanSlug);
    } catch (notificationError) {
      console.error(
        "[starter_notification_settings] launch save error:",
        notificationError
      );

      alert(
        notificationError instanceof Error
          ? notificationError.message
          : "Live Page was created, but request notification settings could not be saved."
      );

      return;
    }

    if (sourceSystemSlug) {
      try {
        const currentRaw = localStorage.getItem(
          `hp-system:${sourceSystemSlug}`
        );

        const currentSystem = currentRaw
          ? JSON.parse(currentRaw)
          : {};

        localStorage.setItem(
          `hp-system:${sourceSystemSlug}`,
          JSON.stringify({
            ...currentSystem,
            livePageSlug: cleanSlug,
          })
        );
      } catch (error) {
        console.error(
          "[Build My System] Could not link Live Page:",
          error
        );
      }
    }

    window.location.href = `/planet/starter/${cleanSlug}`;
  }


  function renderSettings() {
    if (!selectedBlock) {
      return (
        <p className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-slate-400">
          Select a Live Block to edit it.
        </p>
      );
    }

    if (selectedBlock.type === "whoWeAre") {
      return (
        <div className="space-y-3">
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm outline-none" />
          <input value={city} onChange={(event) => setCity(event.target.value)} placeholder="City" className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm outline-none" />
          <input value={service} onChange={(event) => setService(event.target.value)} placeholder="What do you do?" className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm outline-none" />

          <div className="space-y-2">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
              Your Page Address
            </p>

            <div className="flex items-center rounded-2xl border border-white/10 bg-black/40 px-4">
              <span className="text-xs text-slate-500">
                homeplanet.city/planet/starter/
              </span>

              <input
                value={slug}
                onChange={(event) => {
                  setPageAddressCustomized(true);
                  setSlug(
                    event.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]+/g, "-")
                      .replace(/-+/g, "-")
                      .replace(/^-+|-+$/g, "")
                  );
                }}
                placeholder="created automatically"
                className="h-12 flex-1 bg-transparent px-2 text-sm outline-none"
              />
            </div>
          </div>
          <textarea value={whoWeAre} onChange={(event) => setWhoWeAre(event.target.value)} rows={4} placeholder="Who We Are" className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm outline-none" />
        </div>
      );
    }

    if (selectedBlock.type === "contactInfo") {
      return (
        <div className="space-y-3">
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Phone number"
            className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm outline-none"
          />

          <p className="rounded-2xl border border-white/10 bg-black/30 p-4 text-xs leading-relaxed text-slate-400">
            This number powers Message, Call, and Request Work on the launched live page.
          </p>
        </div>
      );
    }

    if (selectedBlock.type === "pricingNote") {
      return (
        <div className="space-y-3">
          <input value={pricingTitle} onChange={(event) => setPricingTitle(event.target.value)} placeholder="Pricing note title" className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm outline-none" />
          <textarea value={pricingText} onChange={(event) => setPricingText(event.target.value)} rows={4} placeholder="Pricing note text" className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm outline-none" />
        </div>
      );
    }

    if (selectedBlock.type === "servicePills") {
      return (
        <div className="space-y-3">
          <p className="text-xs leading-relaxed text-slate-400">
            Separate each service with a comma. HomePlanet keeps the pills clean.
          </p>
          <textarea value={servicesText} onChange={(event) => setServicesText(event.target.value)} rows={4} placeholder="Driveways, Patios, Sidewalks" className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm outline-none" />
        </div>
      );
    }

    if (selectedBlock.type === "paymentBlock") {
      return (
        <div className="space-y-3">
          <input value={paymentTitle} onChange={(event) => setPaymentTitle(event.target.value)} placeholder="Payment title" className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm outline-none" />
          <input value={paymentPrice} onChange={(event) => setPaymentPrice(event.target.value)} placeholder="$75" className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm outline-none" />
          <textarea value={paymentNote} onChange={(event) => setPaymentNote(event.target.value)} rows={3} placeholder="Payment note" className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm outline-none" />
          <input value={paymentUrl} onChange={(event) => setPaymentUrl(event.target.value)} placeholder="Payment link: Cash App, Venmo, Square, Stripe..." className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm outline-none" />
          <p className="rounded-2xl border border-white/10 bg-black/30 p-4 text-xs leading-relaxed text-slate-400">
            Keep this simple. Use a payment link they already have. Full invoice tracking belongs in Gold.
          </p>
        </div>
      );
    }

    if (selectedBlock.type === "localNote") {
      return (
        <div className="space-y-3">
          <input value={localNoteTitle} onChange={(event) => setLocalNoteTitle(event.target.value)} placeholder="Local Note title" className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm outline-none" />
          <textarea value={localNoteText} onChange={(event) => setLocalNoteText(event.target.value)} rows={4} placeholder="Write a quick local note" className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm outline-none" />
          <p className="rounded-2xl border border-white/10 bg-black/30 p-4 text-xs leading-relaxed text-slate-400">
            Use this for a human note, local context, summer goal, family-owned message, or quick background.
          </p>
        </div>
      );
    }

    if (selectedBlock.type === "livePhotoWall") {
      return (
        <div className="space-y-3">
          <p className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-relaxed text-slate-400">
            Add photos to the Photo Gallery. The hero photo is controlled from Photos & Media above.
          </p>

          {wallPhotos.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {wallPhotos.map((photo, index) => (
                <div key={`${photo}-${index}`} className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                  <img src={photo} alt={`Photo wall ${index + 1}`} className="h-32 w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setWallPhotos((current) => current.filter((_, photoIndex) => photoIndex !== index))}
                    className="w-full border-t border-white/10 px-3 py-2 text-xs font-bold text-rose-300 transition hover:bg-rose-500/10"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <label className="flex h-12 w-full cursor-pointer items-center justify-center rounded-2xl border border-dashed border-white/20 bg-black/30 text-sm font-semibold text-slate-300">
            Add Photos to Photo Wall
            <input type="file" accept="image/*" multiple onChange={handleWallUpload} className="hidden" />
          </label>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Phone number" className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm outline-none" />
        <p className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-relaxed text-slate-400">
          This number powers Message, Call, and Request Work on the launched live page.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060b14] text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-8 lg:flex-row lg:items-start">
        <div className="w-full lg:w-[42%]">
          <div className="sticky top-6 space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-blue-300">
                HomePlanet Creator
              </p>
              <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
                Build your live page.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300">
                Choose the look, add your business details, photos, and services.
                HomePlanet handles the design while you control what customers see.
              </p>
            </div>

            <div className="space-y-4 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${active.primary} font-black`}>
                  1
                </div>
                <div>
                  <p className="font-semibold">Page Style</p>
                  <p className="text-sm text-slate-400">Choose your accent colors and page background.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(vibes) as VibeKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setVibe(key)}
                    className={`rounded-[1.5rem] border p-3 text-left transition ${
                      vibe === key ? "border-white/40 bg-white/10" : "border-white/10 bg-black/40 hover:border-white/20"
                    }`}
                  >
                    <div className={`h-20 rounded-2xl bg-gradient-to-br ${vibes[key].accent}`} />
                    <p className="mt-3 font-semibold">{vibes[key].name}</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">
                      Tap to preview this style.
                    </p>
                  </button>
                ))}
              </div>
              <div className="border-t border-white/10 pt-5">
                <div className="mb-3">
                  <p className="font-semibold">Page Background</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Choose the page surface. Your theme colors stay the same.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {(Object.keys(backgroundChoices) as BackgroundKey[]).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setPageBackground(key)}
                      className={`rounded-[1.25rem] border p-3 text-left transition ${
                        pageBackground === key
                          ? "border-white/40 bg-white/10 ring-1 ring-white/20"
                          : "border-white/10 bg-black/30 hover:border-white/20"
                      }`}
                    >
                      <div
                        className={`flex h-16 items-end rounded-xl border p-3 ${backgroundChoices[key].preview}`}
                      >
                        <span className={`text-xs font-black ${backgroundChoices[key].sample}`}>
                          Aa
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-semibold">
                        {backgroundChoices[key].name}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-500 font-black text-black">
                  2
                </div>
                <div>
                  <p className="font-semibold">Business & Brand</p>
                  <p className="text-sm text-slate-400">Add the core details customers need to know.</p>
                </div>
              </div>

              <div className="space-y-3">

                <div className="space-y-3 pb-2">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                    Business Details
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Business name"
                      className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm outline-none"
                    />

                    <input
                      value={city}
                      onChange={(event) => setCity(event.target.value)}
                      placeholder="City / service area"
                      className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm outline-none"
                    />
                  </div>

                  <input
                    value={service}
                    onChange={(event) => setService(event.target.value)}
                    placeholder="What does your business do?"
                    className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm outline-none"
                  />

                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="Business phone"
                    className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm outline-none"
                  />

                  <div className="space-y-3 rounded-2xl border border-white/10 bg-black/25 p-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                        Request Notifications
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        Choose where HomePlanet should send new customer requests.
                      </p>
                    </div>

                    <input
                      type="email"
                      value={notificationEmail}
                      onChange={(event) => setNotificationEmail(event.target.value)}
                      placeholder="Notification email"
                      className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm outline-none"
                    />

                    <input
                      value={notificationPhone}
                      onChange={(event) => setNotificationPhone(event.target.value)}
                      placeholder="Notification mobile number"
                      className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm outline-none"
                    />

                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                        <input
                          type="checkbox"
                          checked={emailAlertsEnabled}
                          onChange={(event) =>
                            setEmailAlertsEnabled(event.target.checked)
                          }
                        />
                        <span className="text-sm font-bold text-white">
                          Email alerts
                        </span>
                      </label>

                      <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                        <input
                          type="checkbox"
                          checked={smsAlertsEnabled}
                          onChange={(event) =>
                            setSmsAlertsEnabled(event.target.checked)
                          }
                        />
                        <span className="text-sm font-bold text-white">
                          Text alerts
                        </span>
                      </label>
                    </div>

                    <p className="text-xs leading-5 text-slate-500">
                      At least one notification method is required before launch.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                      Your Page Address
                    </p>

                    <div className="flex items-center rounded-2xl border border-white/10 bg-black/40 px-4">
                      <span className="shrink-0 text-xs text-slate-500">
                        homeplanet.city/planet/starter/
                      </span>

                      <input
                        value={slug}
                        onChange={(event) => {
                  setPageAddressCustomized(true);
                  setSlug(
                    event.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]+/g, "-")
                      .replace(/-+/g, "-")
                      .replace(/^-+|-+$/g, "")
                  );
                }}
                        placeholder="created automatically"
                        className="h-12 min-w-0 flex-1 bg-transparent px-2 text-sm outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                    Logo & Navigation
                  </p>
                </div>
                {logoImage && (
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 p-3">
                    <img src={logoImage} alt="Business logo preview" className="h-12 max-w-[180px] object-contain object-left" />
                    <button type="button" onClick={() => setLogoImage("")} className="rounded-xl border border-red-400/20 px-3 py-2 text-xs font-bold text-red-200">
                      Remove
                    </button>
                  </div>
                )}

                <label className="flex h-12 w-full cursor-pointer items-center justify-center rounded-2xl border border-dashed border-white/20 bg-black/30 text-sm font-semibold text-slate-300">
                  Upload Business Logo
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>

                {footerLogoImage && (
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 p-3">
                    <img src={footerLogoImage} alt="Footer logo preview" className="h-12 max-w-[180px] object-contain object-left" />
                    <button type="button" onClick={() => setFooterLogoImage("")} className="rounded-xl border border-red-400/20 px-3 py-2 text-xs font-bold text-red-200">
                      Remove
                    </button>
                  </div>
                )}

                <label className="flex h-12 w-full cursor-pointer items-center justify-center rounded-2xl border border-dashed border-white/20 bg-black/30 text-sm font-semibold text-slate-300">
                  Upload Footer Logo
                  <input type="file" accept="image/*" onChange={handleFooterLogoUpload} className="hidden" />
                </label>

                <input
                  value={tagline}
                  onChange={(event) => setTagline(event.target.value)}
                  placeholder="Business tagline"
                  className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm outline-none"
                />

                <input
                  value={headerButtonText}
                  onChange={(event) => setHeaderButtonText(event.target.value)}
                  placeholder="Header button text"
                  className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm outline-none"
                />

                <textarea
                  value={footerMessage}
                  onChange={(event) => setFooterMessage(event.target.value)}
                  placeholder="Short footer message"
                  className="min-h-[90px] w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm outline-none"
                />
              </div>
            </div>
            <div className="space-y-5 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500 text-sm font-black">
                  3
                </div>
                <div>
                  <p className="font-black text-white">Section Copy</p>
                  <p className="text-xs text-slate-400">Control the words people see as they move down the page.</p>
                </div>
              </div>

              <div className="space-y-3 border-t border-white/10 pt-5">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Who We Are</p>
                <input value={whoWeAreLabel} onChange={(event) => setWhoWeAreLabel(event.target.value)} placeholder="Small label" className="h-11 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-sm outline-none" />
                <input value={whoWeAreHeadline} onChange={(event) => setWhoWeAreHeadline(event.target.value)} placeholder="Headline" className="h-11 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-sm outline-none" />
                <textarea value={whoWeAre} onChange={(event) => setWhoWeAre(event.target.value)} placeholder="Supporting text" className="min-h-[100px] w-full rounded-xl border border-white/10 bg-black/40 p-4 text-sm outline-none" />
              </div>

              <div className="space-y-3 border-t border-white/10 pt-5">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Services</p>
                <input value={servicesLabel} onChange={(event) => setServicesLabel(event.target.value)} placeholder="Small label" className="h-11 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-sm outline-none" />
                <input value={servicesHeadline} onChange={(event) => setServicesHeadline(event.target.value)} placeholder="Headline" className="h-11 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-sm outline-none" />
                <textarea value={servicesIntro} onChange={(event) => setServicesIntro(event.target.value)} placeholder="Supporting text" className="min-h-[90px] w-full rounded-xl border border-white/10 bg-black/40 p-4 text-sm outline-none" />
              </div>

              <div className="space-y-3 border-t border-white/10 pt-5">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Photo Gallery</p>
                <input value={galleryLabel} onChange={(event) => setGalleryLabel(event.target.value)} placeholder="Small label" className="h-11 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-sm outline-none" />
                <input value={galleryHeadline} onChange={(event) => setGalleryHeadline(event.target.value)} placeholder="Headline" className="h-11 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-sm outline-none" />
                <textarea value={galleryText} onChange={(event) => setGalleryText(event.target.value)} placeholder="Supporting text" className="min-h-[90px] w-full rounded-xl border border-white/10 bg-black/40 p-4 text-sm outline-none" />
              </div>

              <div className="space-y-3 border-t border-white/10 pt-5">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Why Us</p>
                <input value={whyLabel} onChange={(event) => setWhyLabel(event.target.value)} placeholder="Small label" className="h-11 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-sm outline-none" />
                <textarea value={whyHeadline} onChange={(event) => setWhyHeadline(event.target.value)} placeholder="Headline" className="min-h-[80px] w-full rounded-xl border border-white/10 bg-black/40 p-4 text-sm outline-none" />
              </div>

              <div className="space-y-3 border-t border-white/10 pt-5">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Final Call to Action</p>
                <input value={ctaLabel} onChange={(event) => setCtaLabel(event.target.value)} placeholder="Small label" className="h-11 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-sm outline-none" />
                <textarea value={ctaHeadline} onChange={(event) => setCtaHeadline(event.target.value)} placeholder="Headline" className="min-h-[80px] w-full rounded-xl border border-white/10 bg-black/40 p-4 text-sm outline-none" />
                <textarea value={ctaText} onChange={(event) => setCtaText(event.target.value)} placeholder="Supporting text" className="min-h-[80px] w-full rounded-xl border border-white/10 bg-black/40 p-4 text-sm outline-none" />
                <input value={ctaButtonText} onChange={(event) => setCtaButtonText(event.target.value)} placeholder="Button text" className="h-11 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-sm outline-none" />
              </div>
            </div>
            <div className="space-y-3 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500 font-black">
                  4
                </div>
                <div>
                  <p className="font-semibold">Photos & Media</p>
                  <p className="text-sm text-slate-400">Add the images that tell the story of your business.</p>
                </div>
              </div>

              <label className="flex h-12 w-full cursor-pointer items-center justify-center rounded-2xl border border-dashed border-white/20 bg-black/30 text-sm font-semibold text-slate-300">
                Upload Hero Photo
                <input type="file" accept="image/*" onChange={handleHeroUpload} className="hidden" />
              </label>

              <label className="flex h-12 w-full cursor-pointer items-center justify-center rounded-2xl border border-dashed border-white/20 bg-black/30 text-sm font-semibold text-slate-300">
                Upload Who We Are Image
                <input type="file" accept="image/*" onChange={handleWhoWeAreImageUpload} className="hidden" />
              </label>

              <label className="flex h-12 w-full cursor-pointer items-center justify-center rounded-2xl border border-dashed border-white/20 bg-black/30 text-sm font-semibold text-slate-300">
                Upload Services Image
                <input type="file" accept="image/*" onChange={handleServicesImageUpload} className="hidden" />
              </label>

              <label className="flex h-12 w-full cursor-pointer items-center justify-center rounded-2xl border border-dashed border-white/20 bg-black/30 text-sm font-semibold text-slate-300">
                Upload Photo Wall
                <input type="file" accept="image/*" multiple onChange={handleWallUpload} className="hidden" />
              </label>
            </div>

            <div className="space-y-4 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 font-black text-black">
                  5
                </div>

                <div>
                  <p className="font-semibold">Services</p>
                  <p className="text-sm text-slate-400">
                    Add up to 6 featured services for the main page.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <textarea
                  value={servicesText}
                  onChange={(event) => setServicesText(event.target.value)}
                  rows={5}
                  placeholder="Soft Washing, House Washing, Driveways, Patios"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm outline-none"
                />

                <p className="text-xs leading-relaxed text-slate-400">
                  Separate each service with a comma. HomePlanet displays the first 6 and keeps the layout clean.
                </p>

                <div className="flex flex-wrap gap-2">
                  {servicePills.map((item) => (
                    <span
                      key={item}
                      className={`rounded-full border px-3 py-1.5 text-xs font-bold ${active.soft}`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 font-black">
                  6
                </div>
                <div>
                  <p className="font-semibold">Page Sections</p>
                  <p className="text-sm text-slate-400">Choose what appears on the page. Add, remove, or reorder sections.</p>
                </div>
              </div>

              <div className="space-y-2">
                {blocks.map((block) => {
                  const isActive = activeBlockId === block.id;

                  return (
                    <div
                      key={block.id}
                      onClick={() => setActiveBlockId(block.id)}
                      className={`flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 transition ${
                        isActive ? `border-white/30 bg-white/10 ring-1 ${active.ring}` : "border-white/10 bg-black/40 hover:border-white/20"
                      }`}
                    >
                      <p className="text-sm font-bold">{block.label}</p>
                      <div className="flex items-center gap-2">
                        <button onClick={(event) => { event.stopPropagation(); moveBlock(block.id, "up"); }} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                          Up
                        </button>
                        <button onClick={(event) => { event.stopPropagation(); moveBlock(block.id, "down"); }} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                          Down
                        </button>
                        <button onClick={(event) => { event.stopPropagation(); removeBlock(block.id); }} className="rounded-full border border-red-400/20 px-3 py-1 text-xs text-red-200">
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                {availableBlocks.map((block) => (
                  <button
                    key={block.id}
                    onClick={() => addBlock(block)}
                    className="rounded-2xl border border-dashed border-white/20 px-3 py-3 text-xs font-bold text-slate-300 hover:border-white/40"
                  >
                    + {block.label}
                  </button>
                ))}
              </div>

              {selectedBlock &&
                ["pricingNote", "localNote", "paymentBlock", "livePhotoWall"].includes(selectedBlock.type) && (
                  <div className="mt-5 border-t border-white/10 pt-5">
                    <div className="mb-3">
                      <p className="text-sm font-black text-white">
                        {selectedBlock.label} Details
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-400">
                        These controls only apply to this section.
                      </p>
                    </div>

                    {renderSettings()}
                  </div>
                )}
            </div>



            {sourceSystem?.livePageSlug ? (
              <div className="space-y-3">
                <button
                  onClick={saveLivePageChanges}
                  disabled={saveStatus === "saving"}
                  className="flex h-14 w-full items-center justify-center rounded-[1.6rem] border border-white/15 bg-white/10 text-base font-black text-white disabled:cursor-wait disabled:opacity-70"
                >
                  {saveStatus === "saving"
                    ? "Saving..."
                    : saveStatus === "saved"
                      ? "Saved"
                      : "Save Changes"}
                </button>

                <a
                  href={`/planet/starter/${sourceSystem.livePageSlug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-14 w-full items-center justify-center rounded-[1.6rem] bg-white text-base font-black text-black"
                >
                  View Live Page
                </a>
              </div>
            ) : (
              <button
                onClick={launchLivePage}
                className="flex h-16 w-full items-center justify-center rounded-[1.6rem] bg-white text-lg font-black text-black"
              >
                Launch Live Page
              </button>
            )}
          </div>
        </div>

        <div className="w-full lg:w-[58%]">
          <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0b1220] shadow-2xl shadow-black/40">
            <div className="border-b border-white/10 px-5 py-4">
              <p className="text-sm font-medium text-slate-400">Interactive Live Preview</p>
            </div>

            <div className="p-4 sm:p-6">
              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#07101d]">
                <div className="relative overflow-hidden">
                  {heroPhoto ? (<img src={heroPhoto} alt="Hero" className="h-[360px] w-full object-cover" />) : (<div className="flex h-[360px] items-center justify-center bg-slate-950 px-6 text-center"><div><p className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">Hero Photo</p><p className="mt-3 text-xl font-black text-white">Add a real photo of your business or work.</p></div></div>)}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className={`text-sm uppercase tracking-[0.3em] ${active.location}`}>{city}</p>
                    <h2 className="mt-3 text-4xl font-black leading-tight">{name || "Your Live Page"}</h2>
                    <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-200">{service}</p>
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  <div className="grid grid-cols-2 gap-3">
                    <a href={`sms:${smsPhone}`} className={`flex h-14 items-center justify-center rounded-2xl ${active.primary} font-bold`}>
                      Message
                    </a>
                    <a href={`tel:${smsPhone}`} className="flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] font-bold">
                      Call
                    </a>
                  </div>

                  <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-5">
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">Who We Are</p>
                    {whoWeAreImage && (<img src={whoWeAreImage} alt="About the business" className="mt-4 h-48 w-full rounded-2xl object-cover" />)}
                    <p className="mt-3 text-sm leading-relaxed text-slate-300">{whoWeAre}</p>
                  </section>

                  <section className="space-y-3">
                    <div>
                      <p className={`text-xs font-black uppercase tracking-[0.25em] ${active.location}`}>Services</p>
                      <p className="mt-2 text-xl font-black text-white">How we can help</p>
                      {servicesImage && (<img src={servicesImage} alt="Services" className="mt-4 h-48 w-full rounded-2xl object-cover" />)}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {servicePills.map((item) => (
                        <div key={item} className={`rounded-[1.4rem] border p-4 ${active.soft}`}>
                          <p className={`font-black ${active.text}`}>{item}</p>
                          <p className="mt-2 text-xs text-slate-400">Tap to ask about this service.</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className={`rounded-[1.8rem] border p-5 ${active.soft}`}>
                    <p className={`text-xs font-black uppercase tracking-[0.25em] ${active.location}`}>Ready to get started?</p>
                    <p className="mt-3 text-2xl font-black text-white">Tell us what you need.</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">Send a quick message and we can take it from there.</p>
                    <a href={`sms:${smsPhone}?&body=${requestBody}`} className="mt-5 flex h-14 w-full items-center justify-center rounded-2xl bg-white text-sm font-black text-black">
                      Get a Quote
                    </a>
                  </section>

                  {wallPhotos.length > 0 && (
                    <section className="space-y-3">
                      <div>
                        <p className={`text-xs font-black uppercase tracking-[0.25em] ${active.location}`}>Our Work</p>
                        <p className="mt-2 text-xl font-black text-white">Recent work</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {wallPhotos.map((image, index) => (
                          <div key={`${image}-${index}`} className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-black">
                            <img src={image} alt="Recent work" className="h-44 w-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {localNoteText.trim() && (
                    <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-5">
                      <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">{localNoteTitle || "About Us"}</p>
                      <p className="mt-3 text-sm leading-relaxed text-slate-300">{localNoteText}</p>
                    </section>
                  )}

                  <div className="mt-10 border-t border-white/10 pt-6 text-center">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                      Fueled by HomePlanet
                    </p>
                    <button className="mt-3 inline-flex items-center rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-300">
                      Launch your own live page.
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-slate-500">
            Live Blocks v3: click blocks in the editor or preview to edit them.
          </p>
        </div>
      </div>
    </div>
  );
}






























