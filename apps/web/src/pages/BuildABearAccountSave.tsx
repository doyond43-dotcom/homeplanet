import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { getSupabase } from "../lib/supabase";

type Props = {
  slug: string;
  businessName: string;
  businessType: string;
  businessCategory: string;
  selectedModules: string[];
  livePageSlug: string;
};

export default function BuildABearAccountSave({
  slug,
  businessName,
  businessType,
  businessCategory,
  selectedModules,
  livePageSlug,
}: Props) {
  const { user, loading } = useAuth();
  const returnTo = `/planet/system/${encodeURIComponent(slug)}`;
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function linkVerifiedLivePage() {
    if (!livePageSlug.trim()) return;

    const token =
      window.localStorage.getItem(
        `hp-starter-admin:${livePageSlug}`
      )?.trim() || "";

    if (!token) {
      throw new Error(
        "Business saved, but Live Page ownership could not be verified on this device."
      );
    }

    const { error } = await getSupabase().rpc(
      "link_homeplanet_business_live_page",
      {
        p_business_slug: slug,
        p_live_page_slug: livePageSlug,
        p_admin_access_token: token,
      }
    );

    if (error) {
      throw new Error(
        `Business saved, but Live Page linking failed: ${error.message}`
      );
    }
  }
  async function saveBusiness() {
    if (!user || saving || saved) return;

    setSaving(true);
    setErrorMessage("");

    try {
      const supabase = getSupabase();

      const { data: existing, error: lookupError } = await supabase
        .from("homeplanet_businesses")
        .select("id, owner_id")
        .eq("slug", slug)
        .maybeSingle();

      if (lookupError) throw lookupError;

      if (existing) {
        if (existing.owner_id !== user.id) {
          throw new Error("This business address is already in use.");
        }

        const { error: updateError } = await supabase
          .from("homeplanet_businesses")
          .update({
            business_name: businessName,
            business_type: businessType,
            business_category: businessCategory,
            selected_modules: selectedModules,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id)
          .eq("owner_id", user.id);

        if (updateError) throw updateError;

        await linkVerifiedLivePage();
      setSaved(true);
        return;
      }

      const { error } = await supabase
        .from("homeplanet_businesses")
        .insert({
          owner_id: user.id,
          slug,
          business_name: businessName,
          business_type: businessType,
          business_category: businessCategory,
          selected_modules: selectedModules,
          workspace_version: "build-a-bear-v1",
        });

      if (error) {
        if (error.code === "23505") {
          throw new Error("This business address is already in use.");
        }
        throw error;
      }

      await linkVerifiedLivePage();
      setSaved(true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Could not save your business."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-[#64776B]">Checking your account...</p>;
  }

  if (!user) {
    return (
      <div className="mt-5 rounded-2xl border border-[#DCE5DA] bg-white p-5">
        <p className="font-bold">Keep your HomePlanet</p>
        <p className="mt-2 text-sm text-[#64776B]">
          Connect an account to save your business beyond this browser.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            to="/login"
            state={{ from: returnTo }}
            className="rounded-xl bg-[#193C2B] px-5 py-3 font-bold text-white"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="rounded-xl border border-[#DCE5DA] px-5 py-3 font-bold"
          >
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 rounded-2xl border border-[#DCE5DA] bg-white p-5">
      <p className="font-bold">
        {saved ? "Saved to your account" : "Keep this HomePlanet"}
      </p>

      <p className="mt-2 text-sm text-[#64776B]">
        {saved
          ? "Your business record is stored in your HomePlanet account."
          : "Save this business and its selected tools to your account."}
      </p>

      {!saved && (
        <button
          type="button"
          disabled={saving}
          onClick={() => void saveBusiness()}
          className="mt-4 rounded-xl bg-[#193C2B] px-5 py-3 font-bold text-white disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save to My Account"}
        </button>
      )}

      {errorMessage && (
        <p className="mt-3 text-sm text-[#9A4B37]">{errorMessage}</p>
      )}
    </div>
  );
}
