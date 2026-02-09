const campaigns = require('../_data/campaigns.json');

module.exports = {
    eleventyComputed: {
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
    }
};
