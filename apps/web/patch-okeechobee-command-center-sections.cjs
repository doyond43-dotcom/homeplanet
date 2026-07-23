const fs = require("fs");

const path = "src/pages/OkeechobeeCommandCenter.tsx";
let text = fs.readFileSync(path, "utf8");

// Add grouped event sections before totals.
if (!text.includes("const pendingEvents = events.filter")) {
  text = text.replace(
`  const totals = useMemo(() => {
    const activeProjects = events.length;`,
`  const publicEvents = events.filter((event: any) => {
    const title = String(event.title || "").toLowerCase();
    return !title.includes("test project") && !title.includes("coordinator test");
  });

  const pendingEvents = publicEvents.filter(
    (event: any) => String(event.status || "").toLowerCase() === "pending review"
  );

  const activeEvents = publicEvents.filter(
    (event: any) => String(event.status || "").toLowerCase() === "active"
  );

  const completedEvents = publicEvents.filter(
    (event: any) => String(event.status || "").toLowerCase() === "resolved"
  );

  const totals = useMemo(() => {
    const activeProjects = activeEvents.length;`
  );
}

// Make totals use public project groups instead of all events.
text = text.replace(
`    const totalViews = events.reduce(`,
`    const totalViews = activeEvents.reduce(`
);

text = text.replace(
`    const totalShares = events.reduce(`,
`    const totalShares = activeEvents.reduce(`
);

text = text.replace(
`    const totalHelpers = events.reduce((sum, event) => {`,
`    const totalHelpers = activeEvents.reduce((sum, event) => {`
);

text = text.replace(
`    const needsAttention = events.filter((event) => {`,
`    const needsAttention = activeEvents.filter((event) => {`
);

text = text.replace(
`    const strongResponse = events.filter((event) => {`,
`    const strongResponse = activeEvents.filter((event) => {`
);

text = text.replace(
`  }, [events]);`,
`  }, [activeEvents]);`
);

// Replace stat labels.
text = text.replace(
`            <strong>Active Projects</strong>
            <div>{totals.activeProjects}</div>`,
`            <strong>Pending Review</strong>
            <div>{pendingEvents.length}</div>`
);

text = text.replace(
`            <strong>Total Helpers</strong>
            <div>{totals.totalHelpers}</div>`,
`            <strong>Active Projects</strong>
            <div>{totals.activeProjects}</div>`
);

text = text.replace(
`            <strong>Total Views</strong>
            <div>{totals.totalViews}</div>`,
`            <strong>Completed</strong>
            <div>{completedEvents.length}</div>`
);

text = text.replace(
`            <strong>Total Shares</strong>
            <div>{totals.totalShares}</div>`,
`            <strong>Total Helpers</strong>
            <div>{totals.totalHelpers}</div>`
);

// Replace single mixed card list with grouped board sections.
const oldList = `        <div style={styles.cards}>
          {[...events]
            .sort((a, b) => responseRate(a) - responseRate(b))
            .map((event) => (
            <div key={event.id} style={styles.card}>
              <h2 style={styles.cardTitle}>{event.title}</h2>

              <p>{responseLabel(event)}</p>

              <p>Views: {event.views || 0}</p>
              <p>Shares: {event.shares || 0}</p>
              <p>Helpers: {helperCount(event)}</p>
              <p>Response Rate: {responseRate(event)}%</p>

              <Link
                to={\`/planet/okeechobee/project/\${event.slug}\`}
                style={styles.button}
              >
                View Project
              </Link>
            </div>
          ))}
        </div>`;

const newList = `        <div style={styles.cards}>
          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Needs Inbox</h2>
              <span style={styles.sectionCount}>{pendingEvents.length}</span>
            </div>

            {pendingEvents.length === 0 ? (
              <div style={styles.emptyCard}>No pending requests right now.</div>
            ) : (
              pendingEvents.map((event) => (
                <div key={event.id || event.slug} style={{ ...styles.card, borderColor: "rgba(250, 204, 21, 0.35)" }}>
                  <div style={styles.statusPill}>Pending Review</div>
                  <h3 style={styles.cardTitle}>{event.title}</h3>
                  <p style={styles.cardText}>{String(event.description || "").slice(0, 220)}{String(event.description || "").length > 220 ? "..." : ""}</p>
                  <p style={styles.smallText}>Type: {event.type || "Need"}</p>
                  <p style={styles.smallText}>Location: {event.location || "Okeechobee"}</p>

                  <Link
                    to={\`/planet/okeechobee/event/\${event.slug}\`}
                    style={styles.button}
                  >
                    Review Public Page
                  </Link>
                </div>
              ))
            )}
          </section>

          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Active Projects</h2>
              <span style={styles.sectionCount}>{activeEvents.length}</span>
            </div>

            {activeEvents.length === 0 ? (
              <div style={styles.emptyCard}>No active projects right now.</div>
            ) : (
              [...activeEvents]
                .sort((a, b) => responseRate(a) - responseRate(b))
                .map((event) => (
                  <div key={event.id || event.slug} style={styles.card}>
                    <h3 style={styles.cardTitle}>{event.title}</h3>
                    <p>{responseLabel(event)}</p>
                    <p>Views: {event.views || 0}</p>
                    <p>Shares: {event.shares || 0}</p>
                    <p>Helpers: {helperCount(event)}</p>
                    <p>Response Rate: {responseRate(event)}%</p>

                    <Link
                      to={\`/planet/okeechobee/project/\${event.slug}\`}
                      style={styles.button}
                    >
                      View Project Workspace
                    </Link>
                  </div>
                ))
            )}
          </section>

          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Completed Projects</h2>
              <span style={styles.sectionCount}>{completedEvents.length}</span>
            </div>

            {completedEvents.length === 0 ? (
              <div style={styles.emptyCard}>No completed projects yet.</div>
            ) : (
              completedEvents.map((event) => (
                <div key={event.id || event.slug} style={{ ...styles.card, borderColor: "rgba(250, 204, 21, 0.35)" }}>
                  <div style={styles.completedPill}>Resolved</div>
                  <h3 style={styles.cardTitle}>{event.title}</h3>
                  <p style={styles.cardText}>{String(event.description || "").slice(0, 220)}{String(event.description || "").length > 220 ? "..." : ""}</p>
                  <p>Helpers: {helperCount(event)}</p>

                  <Link
                    to={\`/planet/okeechobee/project/\${event.slug}\`}
                    style={styles.button}
                  >
                    View Workspace
                  </Link>
                </div>
              ))
            )}
          </section>
        </div>`;

if (!text.includes(oldList)) {
  throw new Error("Original command center card list block not found.");
}

text = text.replace(oldList, newList);

// Add styles.
if (!text.includes("sectionHeader:")) {
  text = text.replace(
`  cards: {
    display: "grid",
    gap: 16,
  },`,
`  cards: {
    display: "grid",
    gap: 22,
  },
  section: {
    display: "grid",
    gap: 14,
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    paddingBottom: 8,
    borderBottom: "1px solid #222",
  },
  sectionTitle: {
    margin: 0,
    color: "#39FF14",
    fontSize: 24,
    fontWeight: 900,
  },
  sectionCount: {
    minWidth: 36,
    textAlign: "center",
    borderRadius: 999,
    padding: "6px 10px",
    background: "rgba(57, 255, 20, 0.12)",
    border: "1px solid rgba(57, 255, 20, 0.35)",
    color: "#39FF14",
    fontWeight: 900,
  },
  emptyCard: {
    background: "#111",
    border: "1px solid #222",
    borderRadius: 18,
    padding: 20,
    color: "#aaa",
  },`
  );
}

if (!text.includes("statusPill:")) {
  text = text.replace(
`  cardTitle: {
    marginTop: 0,
  },`,
`  cardTitle: {
    marginTop: 0,
  },
  cardText: {
    color: "#bbb",
    lineHeight: 1.5,
  },
  smallText: {
    color: "#aaa",
    margin: "6px 0",
  },
  statusPill: {
    display: "inline-flex",
    width: "fit-content",
    marginBottom: 10,
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(250, 204, 21, 0.12)",
    border: "1px solid rgba(250, 204, 21, 0.45)",
    color: "#fde68a",
    fontWeight: 900,
    fontSize: 12,
  },
  completedPill: {
    display: "inline-flex",
    width: "fit-content",
    marginBottom: 10,
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(250, 204, 21, 0.12)",
    border: "1px solid rgba(250, 204, 21, 0.45)",
    color: "#fde68a",
    fontWeight: 900,
    fontSize: 12,
  },`
  );
}

fs.writeFileSync(path, text);
console.log("Command center now has Needs Inbox, Active Projects, and Completed Projects.");
