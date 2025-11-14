const fs = require("fs");
const path = require("path");
const prompts = require("prompts");
const { spawn } = require("child_process");

// Read campaigns from campaigns.json
const campaigns = JSON.parse(fs.readFileSync("campaigns.json"));
const sites = campaigns.map(c => c.path);

(async () => {
  const response = await prompts({
    type: "select",
    name: "site",
    message: "Which site to run?",
    choices: sites.map(site => ({ title: site, value: site }))
  });

  if (!response.site) {
    console.error("No site selected. Exiting.");
    process.exit(1);
  }

  // Find the selected campaign object
  const campaign = campaigns.find(c => c.path === response.site);
  const startPage = campaign && campaign.start_page ? campaign.start_page : "";

  const siteDir = path.join(process.cwd(), response.site);
  const proc = spawn("npx", ["eleventy", "--serve"], {
    cwd: siteDir,
    stdio: "inherit"
  });

  proc.on("spawn", () => {
    const pagePath = startPage ? `${response.site}/${startPage}/` : `${response.site}/`;
    console.log(`\nYour campaign is available at: http://localhost:8080/${pagePath}\n`);
  });

  proc.on("close", code => {
    console.log(`Process exited with code ${code}`);
  });
})();