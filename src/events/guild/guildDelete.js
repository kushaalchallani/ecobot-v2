require("dotenv/config");
const Event = require("../../structures/bases/eventBase");
const { WebhookClient } = require("discord.js");

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            name: "guildCreate",
        });
    }

    async execute(guild) {
        const webhook = new WebhookClient(
            "786081465124913172",
            "QOuo03B-oflDzhgpiNEdSi5Lm-ep4ayYEd5iq1QfZylyUUy1LSauTK2nGb2gt3owfnl8"
        );

        webhook.send(`**[BOT Removed]:** ${guild.name}`);
    }
};
