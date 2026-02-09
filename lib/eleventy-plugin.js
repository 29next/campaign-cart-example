/**
 * Campaign Builder Eleventy Plugin
 * 
 * Provides filters and configuration for campaign-based static sites.
 */

module.exports = function campaignBuilderPlugin(eleventyConfig, options = {}) {
    // Default options
    const config = {
        campaignsPath: options.campaignsPath || '../_data/campaigns.json',
        ...options
    };

    // Load campaigns data
    const path = require('path');
    const campaigns = require(path.join(__dirname, config.campaignsPath));

    // ==========================================
    // Passthrough Copy for Campaign Assets
    // ==========================================

    campaigns.campaigns.forEach(campaign => {
        eleventyConfig.addPassthroughCopy(`src/${campaign.slug}/css`);
        eleventyConfig.addPassthroughCopy(`src/${campaign.slug}/images`);
        eleventyConfig.addPassthroughCopy(`src/${campaign.slug}/js`);
        eleventyConfig.addPassthroughCopy(`src/${campaign.slug}/config.js`);
    });

    // ==========================================
    // Collections
    // ==========================================

    // Create collections for each campaign
    campaigns.campaigns.forEach(campaign => {
        eleventyConfig.addCollection(campaign.slug, function (collection) {
            return collection.getFilteredByGlob(`src/${campaign.slug}/**/*.html`);
        });
    });

    // Create collection for all campaigns
    eleventyConfig.addCollection("allCampaigns", function (collection) {
        return campaigns.campaigns;
    });

    // ==========================================
    // Filters
    // ==========================================

    // campaign_asset filter - Resolves asset paths to campaign directory
    eleventyConfig.addFilter("campaign_asset", function (filename) {
        if (!filename) return "";

        // Get the current page URL from the context
        let url = this.page?.url || this.ctx?.page?.url;
        if (!url) return filename; // Fallback

        // Extract campaign slug from URL
        const parts = url.split('/').filter(Boolean);
        if (parts.length > 0) {
            const campaignSlug = parts[0];
            // Return absolute path to asset
            return `/${campaignSlug}/${filename}`;
        }

        return filename;
    });

    // campaign_link filter - Generates clean URLs for pages
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

    // ==========================================
    // Computed Data
    // ==========================================

    eleventyConfig.addGlobalData("eleventyComputed", {
        layout: data => {
            // Extract campaign slug from page URL
            const url = data.page?.url || '';
            const parts = url.split('/').filter(Boolean);

            if (parts.length > 0) {
                const campaignSlug = parts[0];

                // Use page_layout if specified in frontmatter, otherwise default to base.html
                const layoutFile = data.page_layout || 'base.html';

                // Return full path: campaign/_layouts/layoutFile
                return `${campaignSlug}/_layouts/${layoutFile}`;
            }

            // Fallback
            return null;
        },
        campaign: data => {
            // Extract campaign slug from page URL
            const url = data.page?.url || '';
            const parts = url.split('/').filter(Boolean);

            if (parts.length > 0) {
                const campaignSlug = parts[0];
                // Find and return the full campaign object
                return campaigns.campaigns.find(c => c.slug === campaignSlug);
            }

            return null;
        }
    });
};
