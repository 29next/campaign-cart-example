const campaignPlugin = require('./lib/campaign-plugin');

module.exports = function (eleventyConfig) {

    // Ignore README.md and _layouts directories from being processed/copied
    eleventyConfig.ignores.add("README.md");
    eleventyConfig.ignores.add("**/_layouts/**");
    eleventyConfig.ignores.add("**/_includes/**");

    // Add campaign builder plugin
    eleventyConfig.addPlugin(campaignPlugin);

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
