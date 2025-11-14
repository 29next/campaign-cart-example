const fs = require("fs");
const path = require("path");
const prompts = require("prompts");

// Read campaigns from campaigns.json
const campaignsPath = path.join(process.cwd(), "campaigns.json");
const campaigns = JSON.parse(fs.readFileSync(campaignsPath));
const sites = campaigns.map(c => c.path);

(async () => {
  // Prompt for source campaign
  const { source } = await prompts({
    type: "select",
    name: "source",
    message: "Which campaign do you want to copy?",
    choices: sites.map(site => ({ title: site, value: site }))
  });

  if (!source) {
    console.error("No campaign selected. Exiting.");
    process.exit(1);
  }

  // Prompt for new campaign name
  const { target } = await prompts({
    type: "text",
    name: "target",
    message: "Enter the name for the new campaign directory:"
  });

  if (!target) {
    console.error("No target name provided. Exiting.");
    process.exit(1);
  }

  const srcDir = path.join(process.cwd(), source);
  const targetDir = path.join(process.cwd(), target);

  if (!fs.existsSync(srcDir)) {
    console.error(`Source directory "${source}" does not exist.`);
    process.exit(1);
  }

  if (fs.existsSync(targetDir)) {
    console.error(`Target directory "${target}" already exists.`);
    process.exit(1);
  }

  // Copy directory recursively
  function copyDir(src, dest) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(item => {
      const srcPath = path.join(src, item);
      const destPath = path.join(dest, item);
      if (fs.lstatSync(srcPath).isDirectory()) {
        copyDir(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    });
  }

  copyDir(srcDir, targetDir);
  console.log(`Copied funnel from "${source}" to "${target}".`);

  // Update front matter permalinks in .html files
  function updatePermalinks(dir, oldBase, newBase) {
    fs.readdirSync(dir).forEach(item => {
      const itemPath = path.join(dir, item);
      if (fs.lstatSync(itemPath).isDirectory()) {
        updatePermalinks(itemPath, oldBase, newBase);
      } else if (item.endsWith(".html")) {
        let content = fs.readFileSync(itemPath, "utf8");
        // Regex to match permalink in YAML front matter
        content = content.replace(
          /permalink:\s*\/?([a-zA-Z0-9_-]+)\//,
          `permalink: /${newBase}/`
        );
        fs.writeFileSync(itemPath, content, "utf8");
      }
    });
  }

  updatePermalinks(targetDir, source, target);
  console.log(`Updated permalinks in .html files to use base "${target}".`);

  // Update next_url base paths
  function updateNextUrlBase(dir, oldBase, newBase) {
    const nextUrlRegex = new RegExp(`(next_url[\"']?\\s*[:=]\\s*[\"']?/?)${oldBase}(/)`, "g");
    fs.readdirSync(dir).forEach(item => {
      const itemPath = path.join(dir, item);
      if (fs.lstatSync(itemPath).isDirectory()) {
        updateNextUrlBase(itemPath, oldBase, newBase);
      } else if (item.endsWith(".html") || item.endsWith(".js")) {
        let content = fs.readFileSync(itemPath, "utf8");
        // Replace next_url base paths
        content = content.replace(nextUrlRegex, `$1${newBase}$2`);
        fs.writeFileSync(itemPath, content, "utf8");
      }
    });
  }

  updateNextUrlBase(targetDir, source, target);
  console.log(`Updated next_url base paths in .html and .js files to use base "${target}".`);

  // Update campaigns.json
  const sourceCampaign = campaigns.find(c => c.path === source);
  const start_page = sourceCampaign && sourceCampaign.start_page ? sourceCampaign.start_page : "";

  campaigns.push({ path: target, start_page });
  fs.writeFileSync(campaignsPath, JSON.stringify(campaigns, null, 2));
  console.log(`Added "${target}" to campaigns.json.`);
})();