import { supabase } from "./supabase";

export type CreatorMomentClip = {
  id?: string;
  title?: string;
  label?: string;
  text?: string;
  note?: string;
  url?: string;
  mediaUrl?: string;
  type?: string;
  createdAt?: string;
};

export type CreatorMomentPayload = {
  slug: string;
  title?: string;
  subtitle?: string;
  status?: string;
  nextStep?: string;
  clips?: CreatorMomentClip[];
  payload?: Record<string, unknown>;
};

function getCreatorMomentWriteKey(slug: string) {
  const key = `creator-studio:${slug}:write-key`;
  const existing = localStorage.getItem(key);

  if (existing) return existing;

  const created =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  localStorage.setItem(key, created);
  return created;
}

export async function saveCreatorMoment(moment: CreatorMomentPayload) {
  const writeKey = getCreatorMomentWriteKey(moment.slug);

  const { data, error } = await supabase.rpc("save_creator_moment", {
    p_slug: moment.slug,
    p_write_key: writeKey,
    p_title: moment.title ?? "",
    p_subtitle: moment.subtitle ?? "",
    p_status: moment.status ?? "Drafted",
    p_next_step: moment.nextStep ?? "",
    p_clips: moment.clips ?? [],
    p_payload: moment.payload ?? {},
  });

  if (error) {
    console.error("Creator moment Supabase save failed:", error);
    return null;
  }

  return data;
}

export async function loadCreatorMoment(slug: string) {
  const { data, error } = await supabase
    .from("creator_moments")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Creator moment Supabase load failed:", error);
    return null;
  }

  return data;
}