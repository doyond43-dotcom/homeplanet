type SoundKey =
  | "chime"
  | "success"
  | "alert"
  | "panic";

const SOUND_MAP: Record<SoundKey, string> = {
  chime: "/sounds/homeplanet-chime.wav",
  success: "/sounds/homeplanet-success.wav",
  alert: "/sounds/homeplanet-alert.wav",
  panic: "/sounds/homeplanet-panic.wav",
};

let unlocked = false;

export function unlockSound() {
  if (unlocked) return;

  try {
    const audio = new Audio();
    audio.play().catch(() => {});
    unlocked = true;
  } catch {
    // ignore
  }
}

export function playSound(key: SoundKey) {
  try {
    const src = SOUND_MAP[key];
    const audio = new Audio(src);
    audio.currentTime = 0;
    audio.play().catch(() => {});
  } catch (e) {
    console.log("Sound failed:", key);
  }
}