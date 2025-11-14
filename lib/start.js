const fs = require("fs");
const path = require("path");
const prompts = require("prompts");
const { spawn } = require("child_process");
const chalk = require("chalk"); // Use chalk@4 for CommonJS

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

  const campaign = campaigns.find(c => c.path === response.site);
  const startPage = campaign && campaign.start_page ? campaign.start_page : "";

  const siteDir = path.join(process.cwd(), response.site);

  const proc = spawn("npx", ["eleventy", "--serve"], {
    cwd: siteDir,
    stdio: ["ignore", "pipe", "pipe"]
  });

  proc.stdout.on("data", data => {
    let str = data.toString().replace(/\[11ty\]/g, chalk.cyan("[NEXT]"));
    process.stdout.write(str);
  });

  proc.stderr.on("data", data => {
    let str = data.toString().replace(/\[11ty\]/g, chalk.red("[NEXT]"));
    process.stderr.write(str);
  });

  // Print campaign preview link after a short delay
  setTimeout(() => {
    const previewPath = `/${response.site}/${startPage}/`;
    console.log(chalk.cyan(`[NEXT] Campaign preview at: http://localhost:8080${previewPath}\n`));
  }, 1500);

  proc.on("close", code => {
    console.log(chalk.yellow(`[NEXT] Process exited with code ${code}`));
  });
})();