const campaigns = require('./_data/campaigns.json');

module.exports = function (eleventyConfig) {

    // Dynamically add passthrough copy for each campaign's assets
    campaigns.campaigns.forEach(campaign => {
        eleventyConfig.addPassthroughCopy(`src/${campaign.slug}/css`);
        eleventyConfig.addPassthroughCopy(`src/${campaign.slug}/images`);
        eleventyConfig.addPassthroughCopy(`src/${campaign.slug}/js`);
        eleventyConfig.addPassthroughCopy(`src/${campaign.slug}/config.js`);
    });

    // Create collections for each campaign
    campaigns.campaigns.forEach(campaign => {
        eleventyConfig.addCollection(campaign.slug, function (collection) {
            return collection.getFilteredByGlob(`src/${campaign.slug}/**/*.html`);
        });
    });

    // Add a collection for all campaigns
    eleventyConfig.addCollection("allCampaigns", function (collection) {
        return campaigns.campaigns;
    });

    // Add campaign_asset filter
    eleventyConfig.addFilter("campaign_asset", function (filename) {
        if (!filename) return "";
        // If filename already starts with /, return it as is (absolute path)
        if (filename.startsWith("/")) return filename;
        // If filename is a URL, return it as is
        if (filename.match(/^(http|https):\/\//)) return filename;

        let url = this.page?.url || this.ctx?.page?.url;
        if (!url) return filename; // Fallback

        const parts = url.split('/').filter(Boolean);
        if (parts.length > 0) {
            const campaignSlug = parts[0];
            return `/${campaignSlug}/${filename}`;
        }

        return filename;
    });

    // Add campaign_link filter
    eleventyConfig.addFilter("campaign_link", function (filename) {
        if (!filename) return "";
        // If filename starts with #, return as is (anchor link)
        if (filename.startsWith("#")) return filename;
        // If filename is already an absolute path starting with /, return as is
        if (filename.startsWith("/")) return filename;
        // If filename is a URL, return it as is
        if (filename.match(/^(http|https):\/\//)) return filename;

        // Get the current page URL from the context
        let url = this.page?.url || this.ctx?.page?.url;
        if (!url) return filename; // Fallback

        const parts = url.split('/').filter(Boolean);
        if (parts.length > 0) {
            const campaignSlug = parts[0];

            // Remove .html extension and add trailing slash
            let cleanFilename = filename.replace(/\.html$/, '');

            // If it's just 'index', make it empty for root
            if (cleanFilename === 'index') {
                return `/${campaignSlug}/`;
            }

            return `/${campaignSlug}/${cleanFilename}/`;
        }

        return filename;
    });

    return {
        dir: {
            input: "src",
            output: "_site",
            includes: ".", // Allow includes from anywhere in src
            data: "../_data"
        },
        // Allow campaign-specific includes to override global ones
        templateFormats: ["html", "md", "njk", "liquid"]
    };
};
