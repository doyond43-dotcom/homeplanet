import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { getSupabase } from "../lib/supabase";
import SystemHomePage from "./SystemHomePage";
import BuildABearWorkspacePage from "./BuildABearWorkspacePage";

export default function HomePlanetSystemWorkspaceRouter() {
  const { slug = "" } = useParams();
  const { user, loading: authLoading } = useAuth();

  const [remoteMatch, setRemoteMatch] = useState(false);
  const [checking, setChecking] = useState(true);

  let localMatch = false;

  try {
    const raw = localStorage.getItem(`hp-system:${slug}`);
    const system = raw ? JSON.parse(raw) : null;

    localMatch =
      system?.workspaceVersion === "build-a-bear-v1" ||
      (slug === "homeplanet-builder-test" &&
        system?.businessName === "HomePlanet Builder Test");
  } catch {
    localMatch = false;
  }

  useEffect(() => {
    let cancelled = false;

    setRemoteMatch(false);

    if (localMatch || !slug || !user) {
      setChecking(false);
      return;
    }

    setChecking(true);

    async function checkOwnership() {
      const { data, error } = await getSupabase()
        .from("homeplanet_businesses")
        .select("id, workspace_version")
        .eq("slug", slug)
        .eq("owner_id", user!.id)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        console.error("[homeplanet_businesses] ownership check failed:", error);
        setRemoteMatch(false);
      } else {
        setRemoteMatch(
          Boolean(data && data.workspace_version === "build-a-bear-v1")
        );
      }

      setChecking(false);
    }

    void checkOwnership();

    return () => {
      cancelled = true;
    };
  }, [slug, user?.id, localMatch]);

  if (localMatch || remoteMatch) {
    return <BuildABearWorkspacePage />;
  }

  if (authLoading || checking) {
    return (
      <main className="min-h-screen bg-[#F7F6F0] p-8 text-[#193C2B]">
        Opening My HomePlanet...
      </main>
    );
  }

  return <SystemHomePage />;
}
