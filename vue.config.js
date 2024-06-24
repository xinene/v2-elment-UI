const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  pages: {
    index: {
      entry: "src/main/index.js",
      template: "public/index.html",
      filename: "index.html",
    },
  },
  lintOnSave: true,
  productionSourceMap: false,
  chainWebpack: (config) => {
    config.resolve.alias.set("@", resolve("src"));
  },
  // 将 CSS 内联到 HTML
  css: {
    extract: false,
  },
};
