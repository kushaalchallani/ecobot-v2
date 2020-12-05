const Event = require("../structures/bases/eventBase");
const chalk = require("chalk");

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            name: "ready",
            once: true,
        });
    }

    async execute() {
        console.log(chalk.cyan("[EVENT] ") + this.client.user.tag + " is now online.");
        console.log(
            chalk.cyan("[EVENT] ") + this.client.user.tag + " is in " + this.client.guilds.cache.size + " servers!"
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
    }
};
