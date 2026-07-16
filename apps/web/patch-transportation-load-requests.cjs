const fs = require("fs");
const path = "src/pages/HomePlanetTransportationPage.tsx";
let text = fs.readFileSync(path, "utf8");

text = text.replace(
  'import React, { useMemo, useState } from "react";',
  'import React, { useEffect, useMemo, useState } from "react";'
);

text = text.replace(
  '  const [rides, setRides] = useState<Ride[]>(starterRides);',
  `  const [rides, setRides] = useState<Ride[]>(() => {
    const saved = localStorage.getItem("hp_transportation_requests");
    if (!saved) return starterRides;

    try {
      const requests = JSON.parse(saved) as Ride[];
      return [...requests, ...starterRides];
    } catch {
      return starterRides;
    }
  });`
);

text = text.replace(
  '  const stats = useMemo(',
  `  useEffect(() => {
    const saved = localStorage.getItem("hp_transportation_requests");
    if (!saved) return;

    try {
      const requests = JSON.parse(saved) as Ride[];
      setRides([...requests, ...starterRides]);
      if (requests[0]) {
        setSelectedRide(requests[0]);
      }
    } catch {
      // keep starter rides
    }
  }, []);

  const stats = useMemo(`
);

fs.writeFileSync(path, text);
console.log("Transportation board now loads customer ride requests.");
