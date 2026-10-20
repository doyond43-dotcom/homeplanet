import { CloudUpload, ArrowRight, CheckCircle2, CircleDot, Globe2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { getSupabase } from "../lib/supabase";
import { buildMySystemModules } from "../lib/homePlanetRegistry";
import BuildABearRequestsPanel from "./BuildABearRequestsPanel";
import BuildABearUpcomingJobs from "./BuildABearUpcomingJobs";
import BuildABearAccountSave from "./BuildABearAccountSave";

type StoredSystem = {
  businessName?: string;
  businessType?: string;
  businessCategory?: string;
  selectedModules?: string[];
  livePageSlug?: string;
  workspaceVersion?: string;
};

export default function BuildABearWorkspacePage() {
  const { slug = "" } = useParams();
  const [upcomingJobId, setUpcomingJobId] = useState("");

  const { user, loading: authLoading } = useAuth();
  const [remoteSystem, setRemoteSystem] = useState<StoredSystem | null>(null);
  const [remoteLoading, setRemoteLoading] = useState(false);
  const [remoteCheckedKey, setRemoteCheckedKey] = useState("");
  const [remoteError, setRemoteError] = useState(false);
  const [paypalMessage, setPaypalMessage] = useState("");
  const [paypalChecking, setPaypalChecking] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paypalResult = params.get("paypal");

    if (paypalResult !== "return" && paypalResult !== "cancel") return;

    if (paypalResult === "cancel") {
      setPaypalMessage("PayPal setup was canceled. Your HomePlanet is still saved.");
      return;
    }

    let cancelled = false;

    async function confirmPaypal() {
      setPaypalChecking(true);

      try {
        let adminAccessToken = "";

        try {
          adminAccessToken =
            window.localStorage
              .getItem(`hp-starter-admin:${slug}`)
              ?.trim() || "";
        } catch {
          // Account recovery can still work without browser storage.
        }

        if (!adminAccessToken) {
          adminAccessToken = params.get("access")?.trim() || "";
        }

        if (!adminAccessToken) {
          const { data: recoveredToken, error: recoveryError } =
            await getSupabase().rpc(
              "get_homeplanet_owner_live_page_token",
              { p_live_page_slug: slug }
            );

          if (cancelled) return;

          if (
            recoveryError ||
            typeof recoveredToken !== "string" ||
            !recoveredToken.trim()
          ) {
            throw new Error(
              "Please sign in to your HomePlanet account to confirm your PayPal subscription."
            );
          }

          adminAccessToken = recoveredToken.trim();

          try {
            window.localStorage.setItem(
              `hp-starter-admin:${slug}`,
              adminAccessToken
            );
          } catch {
            // Continue with recovered access for this session.
          }
        }

        const { data, error } = await getSupabase().functions.invoke(
          "paypal-confirm-starter-subscription",
          {
            body: {
              live_page_slug: slug,
              admin_access_token: adminAccessToken,
              paypal_subscription_id: params.get("subscription_id") || undefined,
            },
          }
        );

        if (error) throw error;
        if (!data?.ok) {
          throw new Error(data?.error || "PayPal confirmation failed.");
        }

        if (cancelled) return;

        if (String(data.status).toLowerCase() === "active") {
          setPaypalMessage(
            "Your HomePlanet is activated! Your 30-day free trial is active."
          );

          const cleanUrl = new URL(window.location.href);
          cleanUrl.searchParams.delete("paypal");
          cleanUrl.searchParams.delete("subscription_id");
          window.history.replaceState({}, "", cleanUrl.toString());
        } else {
          setPaypalMessage(
            "PayPal returned successfully. Your subscription is awaiting confirmation."
          );
        }
      } catch (error) {
        if (!cancelled) {
          setPaypalMessage(
            error instanceof Error
              ? error.message
              : "Could not confirm your PayPal subscription."
          );
        }
      } finally {
        if (!cancelled) setPaypalChecking(false);
      }
    }

    void confirmPaypal();

    return () => {
      cancelled = true;
    };
  }, [slug]);


  let localSystem: StoredSystem = {};
  try {
    const raw = localStorage.getItem(`hp-system:${slug}`);
    if (raw) localSystem = JSON.parse(raw) as StoredSystem;
  } catch {
    // Preserve the existing anonymous builder experience.
  }

  const hasLocal = Boolean(localSystem.businessName);
  const lookupKey = `${user?.id || ""}:${slug}`;

  useEffect(() => {
    let cancelled = false;

    setRemoteSystem(null);
    setRemoteCheckedKey("");
    setRemoteError(false);

    if (hasLocal || !user || !slug) {
      setRemoteLoading(false);
      return;
    }

    setRemoteLoading(true);

    async function loadBusiness() {
      try {
        const { data, error } = await getSupabase()
          .from("homeplanet_businesses")
          .select(
            "business_name, business_type, business_category, selected_modules, workspace_version, live_page_slug"
          )
          .eq("slug", slug)
          .eq("owner_id", user!.id)
          .maybeSingle();

        if (cancelled) return;

        if (error) throw error;

        if (data?.workspace_version === "build-a-bear-v1") {
          setRemoteSystem({
            businessName: data.business_name,
            businessType: data.business_type,
            businessCategory: data.business_category,
            selectedModules: Array.isArray(data.selected_modules)
              ? data.selected_modules.filter(
                  (item: unknown): item is string => typeof item === "string"
                )
              : [],
            workspaceVersion: data.workspace_version,
            livePageSlug: data.live_page_slug ?? "",
          });
        }
      } catch (error) {
        if (!cancelled) {
          console.error("[Build-A-Bear] Business recovery failed:", error);
          setRemoteError(true);
        }
      } finally {
        if (!cancelled) {
          setRemoteCheckedKey(lookupKey);
          setRemoteLoading(false);
        }
      }
    }

    void loadBusiness();

    return () => {
      cancelled = true;
    };
  }, [slug, user?.id, hasLocal, lookupKey]);

  const waitingForRemote =
    !hasLocal &&
    (authLoading ||
      (Boolean(user) &&
        (remoteLoading || remoteCheckedKey !== lookupKey)));

  if (waitingForRemote) {
    return (
      <main className="min-h-screen bg-[#F7F6F0] p-8 text-[#193C2B]">
        Opening My HomePlanet...
      </main>
    );
  }

  const system = hasLocal ? localSystem : remoteSystem ?? {};

  const businessName = system.businessName?.trim() || "My HomePlanet";
  const description = system.businessType?.trim() || "";
  const livePageSlug = system.livePageSlug?.trim() || "";
  const selectedIds = system.selectedModules ?? [];
  const selectedTools = buildMySystemModules.filter((module) =>
    selectedIds.includes(module.id)
  );
  const otherTools = selectedTools.filter(
    (module) => module.id !== "live-page"
  );

  return (
    <main className="min-h-screen bg-[#F7F6F0] text-[#193C2B]">
      {(paypalChecking || paypalMessage) && (
        <div className="mx-auto max-w-5xl px-5 pt-5 sm:px-8">
          <div role="status" className="rounded-xl border border-[#DCE5DA] bg-white p-4 text-sm font-semibold text-[#193C2B]">
            {paypalChecking ? "Confirming your PayPal subscription..." : paypalMessage}
          </div>
        </div>
      )}
      <div className="mx-auto max-w-5xl px-5 pt-7 pb-24 sm:px-8 sm:pb-32">
        <header className="flex items-center justify-between rounded-3xl border border-[#DCE5DA] bg-white p-5 shadow-sm">
          <Link to="/planet/home" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#193C2B] text-white">
              <Globe2 size={23} />
            </span>
            <span className="text-lg font-black">HomePlanet</span>
          </Link>
          <span className="text-sm font-bold text-[#267344]">
            My HomePlanet
          </span>
        </header>

        {!system.businessName ? (

          <section className="mt-10 rounded-3xl border border-[#DCE5DA] bg-white p-8">
            <h1 className="text-3xl font-black">Let's start your HomePlanet.</h1>
            <p className="mt-3 text-[#526658]">
              {remoteError
                ? "We couldn't load your saved business. Please try refreshing."
                : "Your starting plan wasn't found in this browser or account."}
            </p>
            <Link
              to="/planet/build-your-live-system"
              className="mt-6 inline-flex rounded-2xl bg-[#193C2B] px-6 py-4 font-bold text-white"
            >
              Open Builder
            </Link>
          </section>
        ) : (
          <>
            <section className="py-5 sm:py-7">
              <p className="text-sm font-bold uppercase tracking-widest text-[#267344]">
                My HomePlanet
              </p>
              <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
                {businessName}
              </h1>
              {description && (
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[#526658]">
                  {description}
                </p>
              )}
              <p className="mt-2 text-xs text-[#64776B]">
                {hasLocal
                  ? "Your starting plan is saved in this browser."
                  : "Your business was loaded from your HomePlanet account."}
              </p>

            </section>

            <section className="rounded-[2rem] border border-[#DCE5DA] bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#267344]">
                    BUSINESS TOOLS
                  </p>
                  <h2 className="mt-1 text-xl font-black">Your Live Page</h2>
                  <p className="mt-1 text-sm text-[#64776B]">
                    {livePageSlug ? "Published and ready to manage." : "Ready for setup."}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    to={
                      livePageSlug
                        ? `/planet/starter/${livePageSlug}`
                        : `/planet/creator/starter?system=${encodeURIComponent(slug)}`
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#193C2B] px-4 py-3 text-sm font-bold text-white"
                  >
                    {livePageSlug ? "View Live Page" : "Set Up Live Page"}
                    <ArrowRight size={16} />
                  </Link>
                  {livePageSlug && (
                    <Link
                      to={`/planet/creator/starter?system=${encodeURIComponent(slug)}`}
                      className="inline-flex items-center justify-center rounded-xl border border-[#193C2B] px-4 py-3 text-sm font-bold text-[#193C2B]"
                    >
                      Edit Live Page
                    </Link>
                  )}
                </div>
              </div>

              <details className="mt-4 border-t border-[#DCE5DA] pt-4">
                <summary className="flex cursor-pointer items-center gap-2 text-sm font-bold text-[#193C2B]">
                  <CloudUpload size={18} />
                  Account &amp; Settings
                </summary>
                <div className="mt-4 rounded-xl bg-[#F7F8F4] p-4">
                  <h3 className="font-black">Keep your HomePlanet</h3>
                  <p className="mt-1 text-sm text-[#526658]">
                    Save your business to your account so you can access it from another device.
                  </p>
                  <details className="mt-3">
                    <summary className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#267344] bg-white px-4 py-3 text-sm font-bold text-[#193C2B]">
                      Save My HomePlanet
                      <ArrowRight size={16} />
                    </summary>
                    <BuildABearAccountSave
                      key={`${slug}:${user?.id || "anonymous"}`}
                      slug={slug}
                      businessName={businessName}
                      businessType={description}
                      businessCategory={system.businessCategory ?? ""}
                      selectedModules={selectedIds}
                      livePageSlug={livePageSlug}
                    />
                  </details>
                </div>
              </details>
            </section>
            {selectedIds.includes("requests") && (
              <section className="mt-8 rounded-[2rem] border border-[#C9DDCE] bg-white p-6 shadow-sm sm:p-8">
                <p className="text-sm font-bold uppercase tracking-widest text-[#267344]">
                  YOUR DAILY WORK
                </p>
                <h2 className="mt-2 text-2xl font-black">Needs Your Attention</h2>
                <p className="mt-2 text-[#64776B]">
                  Customer requests, follow-ups, and next actions in one place.
                </p>
                <div className="mt-5">

                  <BuildABearRequestsPanel
                    livePageSlug={livePageSlug}
                    openRequestId={upcomingJobId}
                  />
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
