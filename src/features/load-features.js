const path = require("path");
const fs = require("fs");
const chalk = require("chalk");

module.exports = () => {
    const readFeatures = (dir) => {
        const files = fs.readdirSync(path.join(__dirname, dir));
        for (const file of files) {
            const stat = fs.lstatSync(path.join(__dirname, dir, file));
            if (stat.isDirectory()) {
                readFeatures(path.join(dir, file));
            } else if (file !== "load-features.js" && file !== "index.js") {
                console.log(chalk.yellow("[FEATURE] ") + `"${file}" is enabled`);
            }
        }
    };

    readFeatures(".");
};
