const fs = require("fs");

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function write(file, text) {
  fs.writeFileSync(file, text);
}

function backup(file) {
  fs.copyFileSync(file, `${file}.before-ridgeline-hpevent-tracking`);
}

function ensureHpEventImport(file) {
  let text = read(file);
  if (text.includes('from "../lib/hpEvent"')) return text;

  const lines = text.split(/\r?\n/);
  let lastImport = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("import ")) lastImport = i;
  }
  if (lastImport === -1) throw new Error(`No import block found in ${file}`);

  lines.splice(lastImport + 1, 0, 'import { hpEvent } from "../lib/hpEvent";');
  return lines.join("\n");
}

function save(file, text) {
  backup(file);
  write(file, text);
  console.log(`patched ${file}`);
}

// 1) Ridgeline landing/live page service clicks + board clicks
{
  const file = "src/pages/HomeServicesLiveDemoFlow.tsx";
  let text = ensureHpEventImport(file);

  text = text.replace(
    /to=\{`\/planet\/home-services\/request\?service=\$\{encodeURIComponent\(problem\.service\)\}`\}/,
    `to={\`/planet/home-services/request?service=\${encodeURIComponent(problem.service)}\`}
                  onClick={() =>
                    hpEvent({
                      event: "ridgeline_service_click",
                      board: "homeplanet-live-pages",
                      entityId: problem.service,
                      meta: {
                        company: "RIDGELINE Pro Wash",
                        service: problem.service,
                        path: window.location.pathname,
                      },
                    })
                  }`
  );

  text = text.replace(
    /to="\/planet\/home-services\/request\?service=House%20Wash"/,
    `to="/planet/home-services/request?service=House%20Wash"
              onClick={() =>
                hpEvent({
                  event: "ridgeline_primary_cta_click",
                  board: "homeplanet-live-pages",
                  entityId: "house-wash",
                  meta: {
                    company: "RIDGELINE Pro Wash",
                    service: "House Wash",
                    path: window.location.pathname,
                  },
                })
              }`
  );

  text = text.replace(
    /href="\/planet\/home-services\/leads"/,
    `href="/planet/home-services/leads"
              onClick={() =>
                hpEvent({
                  event: "ridgeline_live_board_click",
                  board: "homeplanet-live-pages",
                  entityId: "ridgeline-live-business-board",
                  meta: {
                    company: "RIDGELINE Pro Wash",
                    path: window.location.pathname,
                  },
                })
              }`
  );

  save(file, text);
}

// 2) Ridgeline live business board drawer opens + drawer actions
{
  const file = "src/pages/HomeServicesLeadBoard.tsx";
  let text = ensureHpEventImport(file);

  text = text.replace(
    /function handleDrawerWorkflow\(button: string\) \{/,
    `function handleDrawerWorkflow(button: string) {
    hpEvent({
      event: "ridgeline_drawer_action",
      board: "homeplanet-live-pages",
      entityId: activeAction?.customer || button,
      meta: {
        company: "RIDGELINE Pro Wash",
        button,
        customer: activeAction?.customer,
        service: activeAction?.service,
        status: activeAction?.status,
        path: window.location.pathname,
      },
    });`
  );

  text = text.replace(
    /setDrawerResult\(null\);\s*setActiveAction\(job\);/,
    `setDrawerResult(null);
                      setActiveAction(job);
                      hpEvent({
                        event: "ridgeline_job_drawer_opened",
                        board: "homeplanet-live-pages",
                        entityId: job.customer,
                        meta: {
                          company: "RIDGELINE Pro Wash",
                          customer: job.customer,
                          service: job.service,
                          status: job.status,
                          path: window.location.pathname,
                        },
                      });`
  );

  save(file, text);
}
