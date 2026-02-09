const campaignBuilderPlugin = require('./lib/eleventy-plugin');

module.exports = function (eleventyConfig) {

    // Ignore README.md from being processed/copied
    eleventyConfig.ignores.add("README.md");

    // Add campaign builder plugin
    eleventyConfig.addPlugin(campaignBuilderPlugin);

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
