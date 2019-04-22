const path = require("path");

module.exports = {
    entry: {
        // background_scripts: "./background_scripts/background.js",
        popup: path.resolve(__dirname, "extension", "js", "content_script.js" )
    },
    output: {
        path: path.resolve(__dirname, "extension"),
        filename: "[name]/index.js"
    }
};
