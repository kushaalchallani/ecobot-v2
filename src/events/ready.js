const Event = require("../structures/bases/eventBase");
const chalk = require("chalk");
const express = require("express");
const app = express();
const port = 3000 || 3001;

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

        const clientDetails = {
            guilds: this.client.guilds.cache.size,
            users: this.client.users.cache.size,
            channels: this.client.channels.cache.size,
        };

        // ---------------------------------------------------------------------------------------------------------------------------------
        // --------------------------------------------Website------------------------------------------------------------------
        // ---------------------------------------------------------------------------------------------------------------------------------

        app.get("/", (req, res) => {
            res.status(200).send("Main Page");
        });

        app.get("/info", (req, res) => {
            res.status(200).send(clientDetails);
        });

        app.listen(port);
    }
};
