import { getSupabase } from "../lib/supabase";

export type PhotoSlot = "logo" | "hero" | "about" | "services" | "footer-logo" | `gallery-${1 | 2 | 3 | 4 | 5 | 6}`;
type LocalPhoto = { key: string; file: Blob; name: string; type: string };
const BUCKET = "homeplanet-business-photos";
const DB = "hp-business-photo-drafts-v1";
const STORE = "photos";

function openDrafts(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: "key" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Photo draft storage is unavailable."));
  });
}
async function transact<T>(mode: IDBTransactionMode, callback: (store: IDBObjectStore, resolve: (v: T) => void, reject: (e: unknown) => void) => void): Promise<T> {
  const db = await openDrafts();
  return new Promise<T>((resolve, reject) => {
    const transaction = db.transaction(STORE, mode);
    let settled = false;
    const ok = (value: T) => { if (!settled) { settled = true; resolve(value); } };
    const fail = (error: unknown) => { if (!settled) { settled = true; reject(error); } };
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => { db.close(); fail(transaction.error); };
    try { callback(transaction.objectStore(STORE), ok, fail); } catch (error) { db.close(); fail(error); }
  });
}
const makeKey = (slug: string, slot: PhotoSlot) => `${slug}::${slot}`;
async function localSave(slug: string, slot: PhotoSlot, file: Blob, name: string) {
  await transact<void>("readwrite", (store, resolve, reject) => {
    const request = store.put({ key: makeKey(slug, slot), file, name, type: file.type } satisfies LocalPhoto);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
async function localDelete(slug: string, slot: PhotoSlot) {
  await transact<void>("readwrite", (store, resolve, reject) => {
    const request = store.delete(makeKey(slug, slot));
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
async function localAll(slug: string): Promise<LocalPhoto[]> {
  return transact<LocalPhoto[]>("readonly", (store, resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve((request.result as LocalPhoto[]).filter(photo => photo.key.startsWith(`${slug}::`)));
    request.onerror = () => reject(request.error);
  });
}
function filePreview(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Photo could not be read."));
    reader.onerror = () => reject(reader.error || new Error("Photo could not be read."));
    reader.readAsDataURL(file);
  });
}
async function ownedBusiness(slug: string) {
  const supabase = getSupabase();
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) return null;
  const { data, error } = await supabase.from("homeplanet_businesses")
    .select("id").eq("slug", slug).eq("owner_id", auth.user.id).maybeSingle();
  if (error) throw error;
  return data?.id as string | undefined || null;
}
async function pushCloud(slug: string, slot: PhotoSlot, file: Blob, name: string, businessId: string) {
  const type = file.type || "image/jpeg";
  const extByMime: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" };
  const ext = extByMime[type];
  if (!ext) throw new Error("Use a JPG, PNG, WebP, or GIF image.");
  if (file.size > 8 * 1024 * 1024) throw new Error("Photo exceeds the 8 MB limit.");
  const supabase = getSupabase();
  const path = `${businessId}/${slot}/${crypto.randomUUID()}.${ext}`;
  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: type, upsert: false });
  if (uploadError) throw uploadError;
  const url = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  const { error: recordError } = await supabase.from("homeplanet_business_photos").upsert(
    { business_id: businessId, slot, storage_path: path, photo_url: url }, { onConflict: "business_id,slot" }
  );
  if (recordError) throw recordError;
  void name;
  return url;
}
export async function storeBusinessPhoto(slug: string, slot: PhotoSlot, file: File): Promise<"browser" | "cloud"> {
  if (!slug) throw new Error("Missing business address.");
  if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) throw new Error("Use JPG, PNG, WebP or GIF.");
  if (file.size > 8 * 1024 * 1024) throw new Error("Choose a photo smaller than 8 MB.");
  await localSave(slug, slot, file, file.name);
  const businessId = await ownedBusiness(slug);
  if (!businessId) return "browser";
  await pushCloud(slug, slot, file, file.name, businessId);
  await localDelete(slug, slot);
  return "cloud";
}
export async function restoreBusinessPhotos(slug: string): Promise<Partial<Record<PhotoSlot, string>>> {
  const result: Partial<Record<PhotoSlot, string>> = {};
  const saved = await localAll(slug);
  for (const item of saved) {
    const slot = item.key.slice(`${slug}::`.length) as PhotoSlot;
    result[slot] = await filePreview(item.file);
  }
  const businessId = await ownedBusiness(slug);
  if (businessId) {
    const supabase = getSupabase();
    const { data, error } = await supabase.from("homeplanet_business_photos").select("slot,photo_url").eq("business_id", businessId);
    if (error) throw error;
    for (const photo of data || []) {
      const slot = photo.slot as PhotoSlot;
      if (!result[slot]) result[slot] = photo.photo_url;
    }
    // Draft photos take priority; sync them to the owner account when returning after sign-in.
    for (const item of saved) {
      const slot = item.key.slice(`${slug}::`.length) as PhotoSlot;
      try { await pushCloud(slug, slot, item.file, item.name, businessId); await localDelete(slug, slot); }
      catch (error) { console.warn("[HomePlanet photo] Cloud sync will retry:", error); }
    }
  }
  return result;
}
export async function removeBusinessPhoto(slug: string, slot: PhotoSlot) {
  await localDelete(slug, slot);
  const businessId = await ownedBusiness(slug);
  if (!businessId) return;
  const supabase = getSupabase();
  const { data, error } = await supabase.from("homeplanet_business_photos")
    .select("storage_path").eq("business_id", businessId).eq("slot", slot).maybeSingle();
  if (error) throw error;
  if (!data) return;
  const { error: deleteError } = await supabase.from("homeplanet_business_photos")
    .delete().eq("business_id", businessId).eq("slot", slot);
  if (deleteError) throw deleteError;
  const { error: objectError } = await supabase.storage.from(BUCKET).remove([data.storage_path]);
  if (objectError) console.warn("[HomePlanet photo] Old storage object cleanup failed:", objectError);
}
