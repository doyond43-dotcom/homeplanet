import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import BeautySalonLiveBoard from "./BeautySalonLiveBoard";
import CampAquaflowStandalone from "./CampAquaflowStandalone";
import AutoRepairLiveBoard from "./AutoRepairLiveBoard";

type LiveBoardLocationState = {
  businessType?: string;
  businessName?: string;
  boardSlug?: string;
  primaryGoal?: string;
};

type StarterBoardRow = {
  board_slug: string;
  business_name: string | null;
  business_type: string | null;
  city: string | null;
  owner_name: string | null;
  phone: string | null;
  presence_id: string | null;
  presence_key: string | null;
  starter_plan: string | null;
  is_active: boolean | null;
  claim_status: string | null;
  created_at?: string | null;
};

function normalize(value?: string | null) {
  return (value || "").toLowerCase().trim();
}

function looksLikeCamp(input: {
  businessType?: string | null;
  businessName?: string | null;
  boardSlug?: string | null;
  primaryGoal?: string | null;
}) {
  const haystack = [
    input.businessType,
    input.businessName,
    input.boardSlug,
    input.primaryGoal,
  ]
    .map(normalize)
    .join(" ");

  return (
    haystack.includes("camp") ||
    haystack.includes("summer camp") ||
    haystack.includes("kids camp") ||
    haystack.includes("daycare") ||
    haystack.includes("child") ||
    haystack.includes("children") ||
    haystack.includes("youth")
  );
}

function looksLikeAuto(input: {
  businessType?: string | null;
  businessName?: string | null;
  boardSlug?: string | null;
  primaryGoal?: string | null;
}) {
  const haystack = [
    input.businessType,
    input.businessName,
    input.boardSlug,
    input.primaryGoal,
  ]
    .map(normalize)
    .join(" ");

  return (
    haystack.includes("auto") ||
    haystack.includes("repair") ||
    haystack.includes("mechanic") ||
    haystack.includes("service shop") ||
    haystack.includes("diagnostic") ||
    haystack.includes("oil change") ||
    haystack.includes("tire") ||
    haystack.includes("alignment")
  );
}

function readStarterPayload() {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem("hp_starter_payload");
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export default function LiveBoardRouter() {
  const { boardSlug: routeBoardSlug } = useParams();
  const location = useLocation();
  const locationState = (location.state as LiveBoardLocationState | null) ?? {};
  const starterPayload = useMemo(() => readStarterPayload(), []);

  const resolvedBoardSlug = useMemo(() => {
    if (routeBoardSlug?.trim()) return routeBoardSlug.trim();
    if (locationState.boardSlug?.trim()) return locationState.boardSlug.trim();

    const fallbackBoardSlug =
      typeof starterPayload.boardSlug === "string"
        ? starterPayload.boardSlug.trim()
        : "";

    return fallbackBoardSlug;
  }, [routeBoardSlug, locationState.boardSlug, starterPayload]);

  const [starterBoard, setStarterBoard] = useState<StarterBoardRow | null>(null);
  const [loading, setLoading] = useState(Boolean(resolvedBoardSlug));

  useEffect(() => {
    let isMounted = true;

    async function loadStarterBoard() {
      if (!resolvedBoardSlug) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("starter_boards")
        .select("*")
        .eq("board_slug", resolvedBoardSlug)
        .limit(1)
        .maybeSingle<StarterBoardRow>();

      if (!isMounted) return;

      if (error) {
        console.error("starter_boards lookup failed:", error);
        setStarterBoard(null);
        setLoading(false);
        return;
      }

      setStarterBoard(data ?? null);
      setLoading(false);
    }

    void loadStarterBoard();

    return () => {
      isMounted = false;
    };
  }, [resolvedBoardSlug]);

  const routingInput = useMemo(
    () => ({
      businessType: starterBoard?.business_type ?? locationState.businessType ?? "",
      businessName:
        starterBoard?.business_name ??
        locationState.businessName ??
        (typeof starterPayload.businessName === "string" ? starterPayload.businessName : ""),
      boardSlug: resolvedBoardSlug ?? "",
      primaryGoal: locationState.primaryGoal ?? "",
    }),
    [starterBoard, locationState, starterPayload, resolvedBoardSlug],
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] text-white">
        <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6 py-16">
          <div className="w-full max-w-2xl rounded-[28px] border border-white/10 bg-white/[0.04] p-8 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-200">
              Live Board Router
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Loading the correct live board
            </h1>

            <p className="mt-3 text-sm leading-6 text-white/70 sm:text-base">
              Checking board identity and routing into the right HomePlanet system...
            </p>

            <div className="mt-8 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[72%] rounded-full bg-emerald-400 transition-all duration-500" />
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/65">
              <div className="font-medium text-white/80">Incoming live board</div>
              <div className="mt-2">
                <span className="text-white/45">Board slug:</span>{" "}
                {resolvedBoardSlug || "Not provided"}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (looksLikeCamp(routingInput)) {
    return <CampAquaflowStandalone />;
  }

  if (looksLikeAuto(routingInput)) {
    return <AutoRepairLiveBoard />;
  }

  return <BeautySalonLiveBoard />;
}