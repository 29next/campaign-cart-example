#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Read campaigns from JSON
const campaignsPath = path.join(__dirname, '../_data/campaigns.json');
const campaignsData = JSON.parse(fs.readFileSync(campaignsPath, 'utf8'));
const campaigns = campaignsData.campaigns;

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('\n🚀 Campaign Development Server\n');
console.log('Available campaigns:\n');

campaigns.forEach((campaign, index) => {
    console.log(`  ${index + 1}. ${campaign.name} (/${campaign.slug}/)`);
    if (campaign.description) {
        console.log(`     ${campaign.description}`);
    }
    console.log('');
});

rl.question('Select a campaign (1-' + campaigns.length + '): ', (answer) => {
    const selection = parseInt(answer);

    if (isNaN(selection) || selection < 1 || selection > campaigns.length) {
        console.error('❌ Invalid selection');
        rl.close();
        process.exit(1);
    }

    const selectedCampaign = campaigns[selection - 1];
    console.log(`\n✅ Starting dev server for: ${selectedCampaign.name}`);
    console.log(`📂 Campaign directory: src/${selectedCampaign.slug}/`);
    console.log(`🌐 URL: http://localhost:8080/${selectedCampaign.slug}/\n`);

    rl.close();

    // Start Eleventy dev server
    try {
        execSync('npx eleventy --serve', {
            stdio: 'inherit',
            cwd: path.join(__dirname, '..')
        });
    } catch (error) {
        console.error('❌ Error starting dev server');
        process.exit(1);
    }
});
