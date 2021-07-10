require("dotenv/config");
const Event = require("../../structures/bases/eventBase");
const Embed = require("../../structures/embed");
const { WebhookClient } = require("discord.js");

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            name: "guildCreate",
        });
    }

    async execute(guild) {
        const channel = guild.channels.cache.find(
            (channel) => channel.type === "text" && channel.permissionsFor(guild.me).has("SEND_MESSAGES")
        );

        channel.send(
            new Embed()
                .setTitle("Thanks for adding me to your server! :blush:")
                .setDescription(
                    "To know what all I can do just type `eb!help`.\n\nEcobot is an Multipurpose Discord Bot with many features. It has Economy, Moderation, Music, Images, Fun & Utilites Commands. You can customize the bot for yourself using the `eb!help` command.\n\nIf you have any questions or need help with Ecobot, [click here](https://discord.gg/5E7enQfVJW) to talk to our support team!\n\nFor exclusive features like **Economy exclusive commands**, **NSFW commands**, **More customization**, and **Access to beta features**, check out [Ecobot Premium](https://www.patreon.com/Ecoobot)."
                )
                .setColor("BLUE")
        );

        const webhook = new WebhookClient(
            "786081465124913172",
            "QOuo03B-oflDzhgpiNEdSi5Lm-ep4ayYEd5iq1QfZylyUUy1LSauTK2nGb2gt3owfnl8"
        );

        webhook.send(`**[BOT ADDED]:** ${guild.name}`);
    }
};
