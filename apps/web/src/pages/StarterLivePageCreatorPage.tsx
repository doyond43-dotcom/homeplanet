import { useEffect, useMemo, useRef, useState } from "react";

import { getSupabase } from "../lib/supabase";
// HP_GUIDED_PHOTO_PERSISTENCE_V1
import { restoreBusinessPhotos, removeBusinessPhoto, storeBusinessPhoto, type PhotoSlot } from "../lib/homeplanetBusinessPhotoDraft";



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



function suggestInitialServices(description: string): string {
  const text = description.trim();
  if (!text) return "";

  // Don't invent service names from a general business description.
  if (!text.includes(",")) {
    const words = text.split(/\s+/);
    return words.length <= 5 && !/[.!?]/.test(text) ? text : "";
  }

  return text
    .split(",")
    .map(item =>
      item.trim()
        .replace(/^(and|or)\s+/i, "")
        .replace(/[.!?]+$/, "")
        .replace(/\s+services$/i, "")
        .trim()
    )
    .filter(Boolean)
    .join(", ");
}
export default function StarterLivePageCreatorPage() {

  const sourceSystemSlug =

    new URLSearchParams(window.location.search).get("system")?.trim() || "";



  const sourceAccessToken =

    new URLSearchParams(window.location.search).get("access")?.trim() || "";



  const paypalTrialCancelled =

    new URLSearchParams(window.location.search).get("paypal") === "cancel";



  useEffect(() => {

    if (!sourceSystemSlug || !sourceAccessToken) return;



    try {

      window.localStorage.setItem(

        `hp-starter-admin:${sourceSystemSlug}`,

        sourceAccessToken

      );

    } catch {

      // Continue without storage if unavailable.

    }



    const cleanUrl = new URL(window.location.href);

    cleanUrl.searchParams.delete("access");



    window.history.replaceState(

      {},

      "",

      `${cleanUrl.pathname}${cleanUrl.search}${cleanUrl.hash}`

    );

  }, [sourceSystemSlug, sourceAccessToken]);



  const sourceSystem = useMemo(() => {

    if (!sourceSystemSlug) return null;



    try {

      const raw = localStorage.getItem(`hp-system:${sourceSystemSlug}`);



      if (raw) {

        const savedSystem = JSON.parse(raw);



        return {

          ...savedSystem,

          livePageSlug:

            savedSystem?.livePageSlug?.trim() || sourceSystemSlug,

        };

      }



      return {

        livePageSlug: sourceSystemSlug,

      };

    } catch {

      return {

        livePageSlug: sourceSystemSlug,

      };

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



  const [launchResult, setLaunchResult] = useState<{

    slug: string;

    adminAccessToken: string;

  } | null>(() => {

    if (!paypalTrialCancelled || !sourceSystemSlug) return null;



    try {

      const storedAccessToken =

        window.localStorage.getItem(

          `hp-starter-admin:${sourceSystemSlug}`

        )?.trim() || "";



      if (!storedAccessToken) return null;



      return {

        slug: sourceSystemSlug,

        adminAccessToken: storedAccessToken,

      };

    } catch {

      return null;

    }

  });

  const [isLaunching, setIsLaunching] = useState(false);

  // HP_GUIDED_CREATOR_V1

  const [guideStep, setGuideStep] = useState(0);

  const [showAdvanced, setShowAdvanced] = useState(false);

  const isNewBuildABear = (() => {

    if (!sourceSystemSlug) return false;

    try {

      const stored = localStorage.getItem(`hp-system:${sourceSystemSlug}`);

      const data = stored ? JSON.parse(stored) : null;

      return data?.workspaceVersion === "build-a-bear-v1" && !data?.livePageSlug;

    } catch { return false; }

  })();



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

      ? sourceSystem?.businessType?.trim() || ""

      : ""

  );



  const [pricingTitle, setPricingTitle] = useState(cameFromBuildMySystem ? "Simple estimates." : "");

  const [pricingText, setPricingText] = useState(

    cameFromBuildMySystem

      ? "Tell us what you need and we will help you with the next step."

      : ""

  );



  const [servicesText, setServicesText] = useState(

    cameFromBuildMySystem ? suggestInitialServices(sourceSystem?.businessType || "") : ""

  );

  // HP_GUIDED_SERVICES_CARDS_V1

  const [newServiceName, setNewServiceName] = useState("");



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
  const [photoStatus, setPhotoStatus] = useState("");
  const [photosRestoring, setPhotosRestoring] = useState(false);
  const gallerySlotsRef = useRef(new Map<string, PhotoSlot>());

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



  // HP_STARTER_NOTIFICATION_RESTORE_V1
  // Load saved notification preferences only with the existing owner token.
  useEffect(() => {
    const livePageSlug = sourceSystem?.livePageSlug?.trim();
    if (!livePageSlug) return;

    let cancelled = false;

    async function restoreNotifications() {
      const adminAccessToken =
        window.localStorage.getItem(`hp-starter-admin:${livePageSlug}`)?.trim() || "";

      if (!adminAccessToken) return;

      const supabase = getSupabase();
      const { data, error } = await supabase.rpc(
        "get_starter_notification_settings",
        {
          p_live_page_slug: livePageSlug,
          p_admin_access_token: adminAccessToken,
        }
      );

      if (cancelled) return;

      if (error) {
        console.error("[starter_notification_settings] restore error:", error);
        return;
      }

      const settings = Array.isArray(data) ? data[0] : data;
      if (!settings) return;

      if (typeof settings.notification_email === "string")
        setNotificationEmail(settings.notification_email);

      if (typeof settings.notification_phone === "string")
        setNotificationPhone(settings.notification_phone);

      if (typeof settings.email_enabled === "boolean")
        setEmailAlertsEnabled(settings.email_enabled);

      if (typeof settings.sms_enabled === "boolean")
        setSmsAlertsEnabled(settings.sms_enabled);
    }

    void restoreNotifications();

    return () => {
      cancelled = true;
    };
  }, [sourceSystem?.livePageSlug]);
  // Save guided text progress for this device without touching account or launch data.

  const guidedDraftKey = `hp-guided-live-page:${sourceSystemSlug}`;

  const guidedLoadedRef = useRef(false);

  useEffect(() => {

    if (!isNewBuildABear || guidedLoadedRef.current) return;

    guidedLoadedRef.current = true;

    try {

      const raw = localStorage.getItem(guidedDraftKey);

      if (!raw) return;

      const d = JSON.parse(raw) as Record<string, unknown>;

      if (typeof d.step === "number") setGuideStep(Math.min(4, Math.max(0, d.step)));

      if (typeof d.name === "string") setName(d.name);

      if (typeof d.service === "string") setService(d.service);

      if (typeof d.servicesText === "string") setServicesText(d.servicesText);

      if (typeof d.city === "string") setCity(d.city);

      if (typeof d.phone === "string") setPhone(d.phone);

      if (typeof d.tagline === "string") setTagline(d.tagline);

      if (typeof d.whoWeAre === "string") setWhoWeAre(d.whoWeAre);

      if (typeof d.whyHeadline === "string") setWhyHeadline(d.whyHeadline);

      if (typeof d.ctaHeadline === "string") setCtaHeadline(d.ctaHeadline);

      if (typeof d.ctaText === "string") setCtaText(d.ctaText);

      if (typeof d.ctaButtonText === "string") setCtaButtonText(d.ctaButtonText);

      if (typeof d.footerMessage === "string") setFooterMessage(d.footerMessage);

      if (typeof d.notificationEmail === "string") setNotificationEmail(d.notificationEmail);

      if (typeof d.notificationPhone === "string") setNotificationPhone(d.notificationPhone);

      if (typeof d.emailAlertsEnabled === "boolean") setEmailAlertsEnabled(d.emailAlertsEnabled);

      if (typeof d.smsAlertsEnabled === "boolean") setSmsAlertsEnabled(d.smsAlertsEnabled);

    } catch { /* Use initial draft values. */ }

  }, [isNewBuildABear, guidedDraftKey]);

  useEffect(() => {

    if (!isNewBuildABear || !guidedLoadedRef.current) return;

    const timer = setTimeout(() => {

      try { localStorage.setItem(guidedDraftKey, JSON.stringify({

        step: guideStep, name, service, servicesText, city, phone, tagline,

        whoWeAre, whyHeadline, ctaHeadline, ctaText, ctaButtonText, footerMessage,

        notificationEmail, notificationPhone, emailAlertsEnabled, smsAlertsEnabled

      })); } catch { /* Storage unavailable. */ }

    }, 450);

    return () => clearTimeout(timer);

  }, [isNewBuildABear, guidedDraftKey, guideStep, name, service, servicesText, city,

    phone, tagline, whoWeAre, whyHeadline, ctaHeadline, ctaText, ctaButtonText,

    footerMessage, notificationEmail, notificationPhone, emailAlertsEnabled, smsAlertsEnabled]);



    // Store originals in IndexedDB until the signed-in business owns them in Supabase.
  useEffect(() => {
    if (!isNewBuildABear || !sourceSystemSlug) return;
    let cancelled = false;
    setPhotosRestoring(true);
    restoreBusinessPhotos(sourceSystemSlug).then(photos => {
      if (cancelled) return;
      if (photos.logo) setLogoImage(photos.logo);
      if (photos.hero) setHeroPhoto(photos.hero);
      if (photos.about) setWhoWeAreImage(photos.about);
      if (photos.services) setServicesImage(photos.services);
      if (photos["footer-logo"]) setFooterLogoImage(photos["footer-logo"]);
      const gallery: string[] = [];
      gallerySlotsRef.current.clear();
      for (let i = 1; i <= 6; i++) {
        const slot = `gallery-${i}` as PhotoSlot;
        const photo = photos[slot];
        if (!photo) continue;
        gallery.push(photo);
        gallerySlotsRef.current.set(photo, slot);
      }
      setWallPhotos(gallery);
    }).catch(error => {
      if (!cancelled) setPhotoStatus(`Could not restore photos: ${error instanceof Error ? error.message : String(error)}`);
    }).finally(() => { if (!cancelled) setPhotosRestoring(false); });
    return () => { cancelled = true; };
  }, [isNewBuildABear, sourceSystemSlug]);

  async function persistPhoto(slot: PhotoSlot, file: File) {
    if (!isNewBuildABear) return;
    setPhotoStatus("Saving photo...");
    try {
      const location = await storeBusinessPhoto(sourceSystemSlug, slot, file);
      setPhotoStatus(location === "cloud"
        ? "Photo saved to your HomePlanet business."
        : "Photo saved in this browser. Sign in and save your HomePlanet to sync across devices.");
    } catch (error) {
      setPhotoStatus(`Photo is not fully saved: ${error instanceof Error ? error.message : String(error)}. Keep your original file.`);
    }
  }

  async function removeGuidedPhoto(slot: PhotoSlot) {
    try {
      await removeBusinessPhoto(sourceSystemSlug, slot);
      setPhotoStatus("Photo removed from saved draft.");
    } catch (error) {
      setPhotoStatus(`Could not remove saved photo: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

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
  await persistPhoto("hero", file);



  event.target.value = "";

}



  async function handleWhoWeAreImageUpload(event: React.ChangeEvent<HTMLInputElement>) {

    const file = event.target.files?.[0];

    if (!file) return;

      setWhoWeAreImage(await fileToDataUrl(file));
  await persistPhoto("about", file);

    event.target.value = "";

  }



  async function handleServicesImageUpload(event: React.ChangeEvent<HTMLInputElement>) {

    const file = event.target.files?.[0];

    if (!file) return;

      setServicesImage(await fileToDataUrl(file));
  await persistPhoto("services", file);

    event.target.value = "";

  }



  async function handleLogoUpload(event: React.ChangeEvent<HTMLInputElement>) {

    const file = event.target.files?.[0];

    if (!file) return;



      setLogoImage(await fileToDataUrl(file));
  await persistPhoto("logo", file);

    event.target.value = "";

  }



  async function handleFooterLogoUpload(event: React.ChangeEvent<HTMLInputElement>) {

    const file = event.target.files?.[0];

    if (!file) return;



      setFooterLogoImage(await fileToDataUrl(file));
  await persistPhoto("footer-logo", file);

    event.target.value = "";

  }



  async function handleWallUpload(event: React.ChangeEvent<HTMLInputElement>) {

  const files = Array.from(event.target.files || []);

  if (!files.length) return;



    const newPhotos = await Promise.all(files.map(fileToDataUrl));
  if (isNewBuildABear) {
    const taken = new Set(gallerySlotsRef.current.values());
    for (let index = 0; index < newPhotos.length; index++) {
      const slot = ([1, 2, 3, 4, 5, 6].map(i => `gallery-${i}` as PhotoSlot)).find(candidate => !taken.has(candidate));
      if (!slot) break;
      taken.add(slot);
      gallerySlotsRef.current.set(newPhotos[index], slot);
      setWallPhotos(current => [...current, newPhotos[index]].slice(0, 6));
      await persistPhoto(slot, files[index]);
    }
  } else {
    setWallPhotos((current) => [...current, ...newPhotos].slice(0, 6));
  }



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



    return adminAccessToken;

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
      heroPhoto,
      wallPhotos,
      whoWeAreImage,
      servicesImage,
      logoImage,
      footerLogoImage,

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

    const accessStorageKey = `hp-starter-admin:${livePageSlug}`;

    const adminAccessToken =

      window.localStorage.getItem(accessStorageKey)?.trim() || "";



    if (!adminAccessToken) {

      setSaveStatus("idle");

      alert("Owner access is required before saving changes.");

      return;

    }



    const { error } = await supabase.rpc("patch_starter_live_page", {

      p_slug: livePageSlug,

      p_patch: pagePatch,

      p_admin_access_token: adminAccessToken,

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

    setIsLaunching(true);



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



    const cleanNotificationEmail = notificationEmail.trim();
    const cleanNotificationPhone = notificationPhone.trim();

    if (
      (!emailAlertsEnabled && !smsAlertsEnabled) ||
      (emailAlertsEnabled && !cleanNotificationEmail) ||
      (smsAlertsEnabled && !cleanNotificationPhone)
    ) {
      alert("Enable email or text notifications and enter the required contact details.");
      setIsLaunching(false);
      return;
    }

    const accessStorageKey = `hp-starter-admin:${cleanSlug}`;
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
      "launch_starter_live_page_secure",
      {
        p_slug: cleanSlug,
        p_page_data: pageData,
        p_admin_access_token: adminAccessToken,
        p_notification_email: cleanNotificationEmail,
        p_notification_phone: cleanNotificationPhone,
        p_email_enabled: emailAlertsEnabled,
        p_sms_enabled: smsAlertsEnabled,
      }
    );

    if (error) {
      console.error("[starter_live_pages] secure launch error:", error);
      alert(`Could not launch Live Page: ${error.message}`);
      setIsLaunching(false);
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



    setLaunchResult({

      slug: cleanSlug,

      adminAccessToken,

    });

    setIsLaunching(false);

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



  if (isNewBuildABear && !showAdvanced) {

    const steps = ["Business & Services", "Photos & Logos", "Words & Branding", "Contact & Requests", "Preview & Launch"];

    const input = "mt-2 w-full rounded-xl border border-[#CBDDCE] bg-white px-4 py-3 text-[#193C2B] outline-none focus:border-[#267344]";

    const label = "block text-sm font-bold text-[#193C2B]";

    const primary = "rounded-xl bg-[#193C2B] px-6 py-3 font-bold text-white disabled:opacity-40";

    const secondary = "rounded-xl border border-[#CBDDCE] bg-white px-5 py-3 font-bold text-[#193C2B] disabled:opacity-40";

    const colors: Record<VibeKey, string> = {blue: "#2563eb", emerald: "#16834a", sunset: "#dc4753", midnight: "#334155"};

    const surfaces: Record<BackgroundKey, string> = {black: "#05070d", charcoal: "#15171c", white: "#ffffff", gray: "#f1f3f5", cream: "#f4eddf"};

    const dark = pageBackground === "black" || pageBackground === "charcoal";

    const missing = [!name.trim() && "business name", !city.trim() && "service area", !phone.trim() && "business phone",

      !heroPhoto && "real hero photo", !emailAlertsEnabled && !smsAlertsEnabled && "a notification method",

      emailAlertsEnabled && !notificationEmail.trim() && "notification email", smsAlertsEnabled && !notificationPhone.trim() && "notification phone"].filter(Boolean);

    return <main className="min-h-screen bg-[#F7F6F0] px-4 py-8 text-[#193C2B] sm:py-12">

      <div className="mx-auto max-w-3xl space-y-6">

        <header className="space-y-3">

          <a className="text-sm font-bold text-[#267344]" href={`/planet/system/${encodeURIComponent(sourceSystemSlug)}`}>← My HomePlanet</a>

          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#267344]">HomePlanet Creator</p>

          <h1 className="text-3xl font-black sm:text-4xl">Build Your Live Page</h1>

          <p className="text-[#526B58]">A few easy steps. Your business information is already here.</p>

        </header>

        <section className="rounded-3xl border border-[#D7E3D8] bg-white p-5 shadow-sm sm:p-8">

          <div className="flex flex-wrap items-center justify-between gap-3">

            <span className="text-sm font-bold text-[#267344]">{guideStep === 4 ? "Final Review" : `Step ${guideStep + 1} of 4`}</span>

            <button type="button" onClick={() => setShowAdvanced(true)} className="text-sm font-bold text-[#267344] underline">Advanced Editing</button>

          </div>

          <div className="mt-4 grid grid-cols-5 gap-1.5" aria-label="Setup progress">

            {steps.map((step,i) => <div key={step} title={step} className={`h-2 rounded-full ${i <= guideStep ? "bg-[#193C2B]" : "bg-[#E1EBE2]"}`} />)}

          </div>

          <h2 className="mb-6 mt-7 text-2xl font-black">{steps[guideStep]}</h2>

          {guideStep === 0 && <div className="space-y-5">

            <label className={label}>Business name<input className={input} value={name} onChange={e => setName(e.target.value)} /></label>

            <label className={label}>What your business does<textarea rows={3} className={input} value={service} onChange={e => setService(e.target.value)} /></label>

            <div className="space-y-3">

              <div>

                <h3 className="text-base font-extrabold text-[#193C2B]">Your services</h3>

                <p className="mt-1 text-sm text-[#526B58]">What can customers hire you for? Edit or remove any service below.</p>

              </div>

              {servicesText.split(",").map(x => x.trim()).filter(Boolean).map((item, index, list) => (

                <div key={index} className="flex items-center gap-2">

                  <input aria-label={`Service ${index + 1}`} className={`${input} mt-0 min-w-0 flex-1`} value={item}

                    onChange={e => setServicesText(list.map((value, i) => i === index ? e.target.value : value).join(", "))} />

                  <button type="button" aria-label={`Remove ${item}`} title="Remove service"

                    className="shrink-0 rounded-xl border border-[#CBDDCE] px-4 py-3 font-bold text-[#193C2B] hover:bg-[#F1F6F0]"

                    onClick={() => setServicesText(list.filter((_, i) => i !== index).join(", "))}>Remove</button>

                </div>

              ))}

              <div className="flex flex-wrap items-center gap-2">

                <input aria-label="New service" placeholder="Add another service" className={`${input} mt-0 min-w-[180px] flex-1`}

                  value={newServiceName} onChange={e => setNewServiceName(e.target.value)}

                  onKeyDown={e => {

                    if (e.key !== "Enter") return;

                    e.preventDefault();

                    const next = newServiceName.trim();

                    if (!next) return;

                    setServicesText(current => [...current.split(",").map(x => x.trim()).filter(Boolean), next].join(", "));

                    setNewServiceName("");

                  }} />

                <button type="button" className={secondary} disabled={!newServiceName.trim()}

                  onClick={() => {

                    const next = newServiceName.trim();

                    if (!next) return;

                    setServicesText(current => [...current.split(",").map(x => x.trim()).filter(Boolean), next].join(", "));

                    setNewServiceName("");

                  }}>+ Add</button>

              </div>

              <p className="text-xs text-[#526B58]">Add as many services as you need. Your Live Page features the first six.</p>

              <button type="button" className="text-sm font-bold text-[#267344] underline"

                onClick={() => setServicesText(service.split(/,|\band\b/i).map(x => x.trim().replace(/^(and|or)\s+/i, "").replace(/[.!]+$/, "").replace(/\s+services$/i, "").trim()).filter(Boolean).join(", "))}>

                Suggest services from my description

              </button>

            </div>

          </div>}

          {guideStep === 1 && <div className="space-y-5">

                        <p className="text-sm text-[#526B58]">Use real photos. You can skip optional images for now; a hero photo is required to launch.</p>
            {photosRestoring && <p role="status" className="text-sm font-semibold text-[#267344]">Restoring your photos...</p>}
            {photoStatus && <p role="status" className="text-sm text-[#526B58]">{photoStatus}</p>}

            <label className={label}>Business logo<input className={input} type="file" accept="image/*" onChange={handleLogoUpload} />{logoImage && <img alt="Business logo" src={logoImage} className="mt-3 h-24 max-w-full object-contain" />}</label>

            <label className={label}>Hero photo<input className={input} type="file" accept="image/*" onChange={handleHeroUpload} />{heroPhoto && <img alt="Hero" src={heroPhoto} className="mt-3 h-36 w-full rounded-xl object-cover" />}</label>

            {/* HP_GUIDED_PHOTO_FEEDBACK_V1 */}
            <label className={label}>About Us photo (optional)<input className={input} type="file" accept="image/*" onChange={handleWhoWeAreImageUpload} /></label>
            {whoWeAreImage && <div className="space-y-2"><p className="text-sm font-semibold text-[#267344]">Photo added</p><img alt="About Us selection" src={whoWeAreImage} className="h-36 w-full rounded-xl object-cover" /><button type="button" onClick={() => {setWhoWeAreImage(""); void removeGuidedPhoto("about");}} className="text-sm font-semibold text-[#267344] underline">Remove photo</button></div>}

            <label className={label}>Services photo (optional)<input className={input} type="file" accept="image/*" onChange={handleServicesImageUpload} /></label>
            {servicesImage && <div className="space-y-2"><p className="text-sm font-semibold text-[#267344]">Photo added</p><img alt="Services selection" src={servicesImage} className="h-36 w-full rounded-xl object-cover" /><button type="button" onClick={() => {setServicesImage(""); void removeGuidedPhoto("services");}} className="text-sm font-semibold text-[#267344] underline">Remove photo</button></div>}

            <label className={label}>Work photo gallery (optional)<input className={input} type="file" multiple accept="image/*" onChange={handleWallUpload} /><span className="mt-2 block text-xs text-[#526B58]">{wallPhotos.length} photos selected (up to 6)</span></label>
            {wallPhotos.length > 0 && <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{wallPhotos.map((photo, index) => <div key={`${index}-${photo.length}`} className="overflow-hidden rounded-xl border border-[#CBDDCE]"><img alt={`Work photo ${index+1}`} src={photo} className="h-28 w-full object-cover" /><button type="button" onClick={() => { const slot = gallerySlotsRef.current.get(photo); gallerySlotsRef.current.delete(photo); setWallPhotos(current => current.filter((_, i) => i !== index)); if (slot) void removeGuidedPhoto(slot); }} className="w-full bg-white p-2 text-xs font-bold text-[#267344]">Remove</button></div>)}</div>}

            <label className={label}>Footer logo (optional)<input className={input} type="file" accept="image/*" onChange={handleFooterLogoUpload} /></label>
            {footerLogoImage && <div className="space-y-2"><p className="text-sm font-semibold text-[#267344]">Logo added</p><img alt="Footer logo selection" src={footerLogoImage} className="h-24 max-w-full object-contain" /><button type="button" onClick={() => {setFooterLogoImage(""); void removeGuidedPhoto("footer-logo");}} className="text-sm font-semibold text-[#267344] underline">Remove footer logo</button></div>}

          </div>}

          {guideStep === 2 && <div className="space-y-5">

            <p className="text-sm text-[#526B58]">Make it sound like your business. You can change these words anytime.</p>

            <label className={label}>Tagline<input className={input} value={tagline} onChange={e => setTagline(e.target.value)} placeholder="Local. Reliable. Friendly." /></label>

            <label className={label}>Who We Are<textarea rows={4} className={input} value={whoWeAre} onChange={e => setWhoWeAre(e.target.value)} /></label>

            <label className={label}>Why Choose Us<textarea rows={3} className={input} value={whyHeadline} onChange={e => setWhyHeadline(e.target.value)} placeholder="How you help customers" /></label>

            <label className={label}>Final invitation headline<input className={input} value={ctaHeadline} onChange={e => setCtaHeadline(e.target.value)} placeholder="Ready to get started?" /></label>

            <label className={label}>Final invitation message<textarea rows={2} className={input} value={ctaText} onChange={e => setCtaText(e.target.value)} placeholder="Tell us about your project" /></label>

            <label className={label}>Button text<input className={input} value={ctaButtonText} onChange={e => setCtaButtonText(e.target.value)} /></label>

            <label className={label}>Footer message (optional)<textarea rows={2} className={input} value={footerMessage} onChange={e => setFooterMessage(e.target.value)} placeholder="Proudly serving our community" /></label>

          </div>}

          {guideStep === 3 && <div className="space-y-5">

            <label className={label}>City or service area<input className={input} value={city} onChange={e => setCity(e.target.value)} placeholder="Where you work" /></label>

            <label className={label}>Business phone<input type="tel" className={input} value={phone} onChange={e => setPhone(e.target.value)} /></label>

            <div className="rounded-xl bg-[#F1F6F0] p-4"><h3 className="font-bold">Customer request notifications</h3><p className="mt-1 text-sm text-[#526B58]">Choose at least one method before launching.</p>

              <label className="mt-4 flex items-center gap-2 font-bold"><input type="checkbox" checked={emailAlertsEnabled} onChange={e=>setEmailAlertsEnabled(e.target.checked)} /> Email alerts</label>

              {emailAlertsEnabled && <input type="email" className={input} value={notificationEmail} onChange={e=>setNotificationEmail(e.target.value)} placeholder="Notification email" />}

              <label className="mt-4 flex items-center gap-2 font-bold"><input type="checkbox" checked={smsAlertsEnabled} onChange={e=>setSmsAlertsEnabled(e.target.checked)} /> Text alerts</label>

              {smsAlertsEnabled && <input type="tel" className={input} value={notificationPhone} onChange={e=>setNotificationPhone(e.target.value)} placeholder="Notification mobile" />}

            </div>

          </div>}

          {guideStep === 4 && <div className="space-y-5">

            <p className="text-sm text-[#526B58]">These choices affect the customer page only. HomePlanet stays cream and green.</p>

            <h3 className="font-bold">Buttons and highlights</h3><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{(Object.keys(vibes) as VibeKey[]).map(key => <button type="button" key={key} onClick={()=>setVibe(key)} aria-pressed={vibe===key} className={`rounded-xl border p-3 text-left text-sm font-bold ${vibe===key ? "border-[#193C2B] ring-2 ring-[#D7E3D8]" : "border-[#D7E3D8]"}`}><div className={`mb-2 h-10 rounded-lg bg-gradient-to-br ${vibes[key].accent}`} />{vibes[key].name}</button>)}</div>

            <h3 className="font-bold">Background</h3><div className="flex flex-wrap gap-2">{(Object.keys(backgroundChoices) as BackgroundKey[]).map(key => <button type="button" key={key} onClick={()=>setPageBackground(key)} aria-pressed={pageBackground===key} className={`rounded-xl border px-3 py-2 text-sm font-bold ${pageBackground===key ? "border-[#193C2B] bg-[#E7F0E8]" : "border-[#D7E3D8]"}`}>{backgroundChoices[key].name}</button>)}</div>

            <div className="overflow-hidden rounded-2xl border border-[#D7E3D8] p-5" style={{backgroundColor:surfaces[pageBackground],color:dark?"white":"#193C2B"}}>

              {heroPhoto && <img className="mb-4 h-36 w-full rounded-xl object-cover" src={heroPhoto} alt="Hero preview" />}

              <p className="text-xs font-bold" style={{color:colors[vibe]}}>{city || "YOUR AREA"}</p><h3 className="mt-2 text-2xl font-black">{name || "Your business"}</h3><p className="mt-2 text-sm opacity-80">{tagline || service}</p><p className="mt-4 text-sm">{whoWeAre}</p>

              <div className="mt-3 flex flex-wrap gap-2">{servicePills.map(item=><span key={item} className="rounded-lg border px-3 py-2 text-xs" style={{borderColor:colors[vibe]}}>{item}</span>)}</div>

              <span className="mt-5 inline-block rounded-xl px-4 py-3 text-sm font-bold text-white" style={{backgroundColor:colors[vibe]}}>{headerButtonText}</span>

            </div><p className="text-xs text-[#526B58]">Simplified preview. The launched page uses the full Live Page layout.</p>

            {missing.length > 0 && <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">Before launch, please add: {missing.join(", ")}.</p>}

            {launchResult ? <div className="rounded-xl bg-[#E7F0E8] p-4"><strong>Live Page created!</strong><div className="mt-3"><a className="underline" href={`/planet/starter/${launchResult.slug}`} target="_blank" rel="noreferrer">View My Live Page</a></div><button type="button" className="mt-3 underline" onClick={()=>setShowAdvanced(true)}>Launch & trial options</button></div> : <button type="button" className={`${primary} w-full`} disabled={isLaunching || photosRestoring || missing.length > 0} onClick={launchLivePage}>{isLaunching ? "Launching..." : "Launch My Live Page"}</button>}

          </div>}

          <div className="mt-8 flex justify-between gap-3 border-t border-[#E1EBE2] pt-5">

            <button type="button" className={secondary} disabled={guideStep===0} onClick={()=>{setGuideStep(n=>Math.max(0,n-1));window.scrollTo(0,0)}}>Back</button>

            {guideStep<4 && <button type="button" className={primary} onClick={()=>{setGuideStep(n=>Math.min(4,n+1));window.scrollTo(0,0)}}>{guideStep===3 ? "Preview & Launch" : "Continue"} →</button>}

          </div>

        </section>

        <p className="text-center text-xs text-[#526B58]">Your progress is saved on this device. Sign in and save your HomePlanet to sync photos across devices.</p>

      </div>

    </main>;

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

              {isNewBuildABear && <button type="button" className="rounded-xl border border-emerald-300 px-4 py-2 text-sm font-bold text-emerald-200" onClick={()=>setShowAdvanced(false)}>← Guided Setup</button>}

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







            {sourceSystem?.livePageSlug && !paypalTrialCancelled ? (

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



                <a

                  href={`/planet/system/${encodeURIComponent(sourceSystemSlug)}`}

                  className="flex h-14 w-full items-center justify-center rounded-[1.6rem] border border-white/15 bg-white/[0.06] text-base font-black text-white"

                >

                  Back to My System

                </a>

              </div>

            ) : launchResult ? (

              <div className="space-y-4 rounded-[2rem] border border-emerald-400/20 bg-emerald-400/[0.06] p-5">

                <div>

                  <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400">

                    Launch Complete

                  </p>



                  <h3 className="mt-2 text-2xl font-black text-white">

                    Your Live Page is ready.

                  </h3>



                  <p className="mt-2 text-sm leading-6 text-slate-400">

                    {paypalTrialCancelled

                      ? "Trial setup canceled. Your Live Page is still ready. Start your free trial whenever you're ready."

                      : "Take a look at what you just built. When you're ready, start your 30-day free trial to unlock your HomePlanet System and Work Drawer."}

                  </p>

                </div>



                <a

                  href={`/planet/starter/${launchResult.slug}`}

                  target="_blank"

                  rel="noreferrer"

                  className="flex h-14 w-full items-center justify-center rounded-[1.4rem] bg-white text-base font-black text-black"

                >

                  View My Live Page

                </a>



                <button

                  type="button"

                  onClick={async () => {

                    try {

                      setIsLaunching(true);



                      window.localStorage.setItem(

                        `hp-starter-admin:${launchResult.slug}`,

                        launchResult.adminAccessToken

                      );



                      const returnUrl = new URL(

                        `/planet/system/${encodeURIComponent(launchResult.slug)}`,

                        window.location.origin

                      );

                      returnUrl.searchParams.set("paypal", "return");



                      const cancelUrl = new URL(

                        `/planet/creator/starter`,

                        window.location.origin

                      );

                      cancelUrl.searchParams.set(

                        "system",

                        launchResult.slug

                      );

                      cancelUrl.searchParams.set("paypal", "cancel");



                      const supabase = getSupabase();



                      const { data, error } = await supabase.functions.invoke(

                        "paypal-create-starter-subscription",

                        {

                          body: {

                            live_page_slug: launchResult.slug,

                            admin_access_token:

                              launchResult.adminAccessToken,

                            return_url: returnUrl.toString(),

                            cancel_url: cancelUrl.toString(),

                          },

                        }

                      );



                      if (error) throw error;



                      if (!data?.ok || !data?.approval_url) {

                        throw new Error(

                          data?.error ||

                            "PayPal did not return a subscription approval link."

                        );

                      }



                      window.location.assign(data.approval_url);

                    } catch (error) {

                      console.error(

                        "[starter subscription] Could not start PayPal:",

                        error

                      );



                      alert(

                        error instanceof Error && error.message

                          ? error.message

                          : "Could not start your free trial."

                      );



                      setIsLaunching(false);

                    }

                  }}

                  disabled={isLaunching}

                  className="flex min-h-16 w-full flex-col items-center justify-center rounded-[1.4rem] bg-emerald-400 px-4 py-3 text-black disabled:opacity-60"

                >

                  <span className="text-base font-black">

                    {isLaunching

                      ? "Opening PayPal..."

                      : "Start My 30-Day Free Trial"}

                  </span>



                  <span className="mt-1 text-xs font-black text-black/65">

                    $0 today · then $29.99/month · cancel anytime

                  </span>

                </button>



                <p className="text-center text-xs font-bold leading-5 text-slate-500">

                  Your secure owner access, HomePlanet System, Work Drawer, and business tools unlock after your trial is activated.

                </p>

              </div>

            ) : (

              <button

                onClick={launchLivePage}

                disabled={isLaunching}

                className="flex h-16 w-full items-center justify-center rounded-[1.6rem] bg-white text-lg font-black text-black"

              >

                {isLaunching ? "Launching Your System..." : "Launch Live Page"}

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
