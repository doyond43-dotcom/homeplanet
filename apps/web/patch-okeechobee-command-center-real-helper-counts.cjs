const fs = require("fs");

const path = "src/pages/OkeechobeeCommandCenter.tsx";
let text = fs.readFileSync(path, "utf8");

if (!text.includes("const [projectHelpers, setProjectHelpers]")) {
  text = text.replace(
    `  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);`,
    `  const [events, setEvents] = useState<any[]>([]);
  const [projectHelpers, setProjectHelpers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);`
  );
}

if (!text.includes('from("okeechobee_project_helpers")')) {
  text = text.replace(
    `    if (error) {
      console.error(error);
    } else {
      setEvents(data || []);
    }

    setLoading(false);`,
    `    if (error) {
      console.error(error);
    } else {
      setEvents(data || []);
    }

    const { data: helperData, error: helperError } = await supabase
      .from("okeechobee_project_helpers")
      .select("*")
      .order("created_at", { ascending: true });

    if (helperError) {
      console.error(helperError);
    } else {
      setProjectHelpers(helperData || []);
    }

    setLoading(false);`
  );
}

if (!text.includes("function realHelperCount")) {
  text = text.replace(
    `  function helperCount(event: any) {
    return (event.timeline || []).filter((item: any) =>
      String(item.label || "").toLowerCase().includes("joined")
    ).length;
  }`,
    `  function realHelperCount(event: any) {
    return projectHelpers.filter((helper: any) => helper.event_slug === event.slug).length;
  }

  function helperCount(event: any) {
    return realHelperCount(event);
  }`
  );
}

text = text.replace(
  `    const totalHelpers = activeEvents.reduce((sum, event) => {
      const helpers = (event.timeline || []).filter((item: any) =>
        String(item.label || "").toLowerCase().includes("joined")
      ).length;

      return sum + helpers;
    }, 0);`,
  `    const totalHelpers = activeEvents.reduce((sum, event) => {
      return sum + realHelperCount(event);
    }, 0);`
);

text = text.replace(
  `    const needsAttention = activeEvents.filter((event) => {
      const helpers = (event.timeline || []).filter((item: any) =>
        String(item.label || "").toLowerCase().includes("joined")
      ).length;

      return helpers === 0;
    }).length;`,
  `    const needsAttention = activeEvents.filter((event) => {
      return realHelperCount(event) === 0;
    }).length;`
);

text = text.replace(
  `      const helpers = (event.timeline || []).filter((item: any) =>
        String(item.label || "").toLowerCase().includes("joined")
      ).length;`,
  `      const helpers = realHelperCount(event);`
);

text = text.replace(
  `  }, [activeEvents]);`,
  `  }, [activeEvents, projectHelpers]);`
);

fs.writeFileSync(path, text);
console.log("Command center now counts real helper records from okeechobee_project_helpers.");
