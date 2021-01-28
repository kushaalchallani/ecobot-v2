const Event = require("../structures/bases/eventBase");
const chalk = require("chalk");
const express = require("express");
const app = express();
const port = 3000 || 3001;
const path = require("path");

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            name: "ready",
            once: true,
        });
    }

    async execute() {
        console.log(chalk.cyan("[BOT] ") + this.client.user.tag + " is now online.");
        console.log(
            chalk.cyan("[BOT] ") + this.client.user.tag + " is in " + this.client.guilds.cache.size + " servers!"
        );

        const statuses = [
            { name: "eb!help | @EcoBot for more Info", options: { type: "PLAYING" } },
            { name: `eb!help | ${this.client.users.cache.size} users`, options: { type: "PLAYING" } },
            { name: `eb!help | ${this.client.guilds.cache.size} servers`, options: { type: "PLAYING" } },
        ];

        setInterval(() => {
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            this.client.user.setActivity(status.name, status.options);
        }, 30000);

        // ---------------------------------------------------------------------------------------------------------------------------------
        // --------------------------------------------Website------------------------------------------------------------------
        // ---------------------------------------------------------------------------------------------------------------------------------

        app.use(express.static(path.join(__dirname, "..", "website")));

        app.get("/", (req, res) => {
            res.status(200).sendFile(path.join(__dirname, "..", "website", "index.html"));
        });

        app.get("*", (req, res) => {
            res.sendFile(path.join(__dirname, "..", "website", "404.html"));
        });

        app.get("/error", (req, res) => {
            res.status(200).sendFile(path.join(__dirname, "..", "website", "404.html"));
        });

        app.listen(port, () => {
            console.log(chalk.green("[WEBSITE] ") + "Website in now Online at " + `localhost:${port}`);
        });
    }
};
