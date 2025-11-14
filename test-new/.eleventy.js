const path = require("path");
const siteDir = path.basename(__dirname);
module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "css": `${siteDir}/css` });
  eleventyConfig.addPassthroughCopy({ "images": `${siteDir}/images` });
  eleventyConfig.addPassthroughCopy({ "js": `${siteDir}/js` });
  eleventyConfig.addPassthroughCopy({ "config.js": `${siteDir}/config.js` });
  return {
    dir: {
        input: ".",
        layouts: "_layouts",
        includes: "_includes",
        output: path.join("..", "_site")
    }
  };
};