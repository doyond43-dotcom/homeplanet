export type SensorEvent =
  | "impact"
  | "fall"
  | "crash"
  | "movement"
  | "stop";

export function startGuardianSensors(
  onEvent: (event: SensorEvent, detail: string) => void
) {
  // MOTION SENSOR
  window.addEventListener("devicemotion", (e) => {
    const acc = e.accelerationIncludingGravity;

    if (!acc) return;

    const g =
      Math.sqrt(
        (acc.x ?? 0) ** 2 +
          (acc.y ?? 0) ** 2 +
          (acc.z ?? 0) ** 2
      ) / 9.8;

    if (g > 4) {
      onEvent("crash", `High impact detected (${g.toFixed(1)}g)`);
    } else if (g > 2.5) {
      onEvent("impact", `Impact spike (${g.toFixed(1)}g)`);
    }
  });

  // GPS SENSOR
  navigator.geolocation.watchPosition((pos) => {
    const speed = pos.coords.speed ?? 0;

    if (speed > 5) {
      const mph = Math.round(speed * 2.23694);
      onEvent("movement", `Movement detected (${mph} mph)`);
    }

    if (speed === 0) {
      onEvent("stop", "Device stopped moving");
    }
  });
}