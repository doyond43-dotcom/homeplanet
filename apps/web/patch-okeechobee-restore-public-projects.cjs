const fs = require("fs");

const path = "src/pages/OkeechobeeTogetherPage.tsx";
let text = fs.readFileSync(path, "utf8");

text = text.replace(
`      const { data, error } = await supabase
        .from("okeechobee_events")
        .select("*")
        .in("status", ["Active", "Resolved"])
        .order("created_at", { ascending: false });`,
`      const { data, error } = await supabase
        .from("okeechobee_events")
        .select("*")
        .order("created_at", { ascending: false });`
);

text = text.replace(
`  const activeEvents = publicEvents.filter((event: any) => event.status !== "Resolved");
  const completedEvents = publicEvents.filter((event: any) => event.status === "Resolved");`,
`  const activeEvents = publicEvents.filter((event: any) => String(event.status || "").toLowerCase() === "active");
  const completedEvents = publicEvents.filter((event: any) => String(event.status || "").toLowerCase() === "resolved");`
);

fs.writeFileSync(path, text);
console.log("Restored active/resolved project filtering on Okeechobee Together page.");
