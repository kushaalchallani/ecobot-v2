const Command = require("../../structures/bases/commandBase");
const Embed = require("../../structures/embed");
const moment = require("moment");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "channelinfo",
            description: "View all the information about a channel",
            aliases: ["ci", "channelstats", "info"],
            category: "Utilites",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
            ownerOnly: false,
            cooldown: 10,
            examples: ["channelinfo", "channelinfo #general"],
        });
    }

    async execute(message, args) {
        const channel = this.client.util.getMentions().channel(args[0], message.guild) || message.channel;

        const embed = new Embed()
            .setColor("BLUE")
            .setDescription(`Info on **${channel.name}** (ID: ${channel.id})`)
            .setThumbnail(channel.guild.iconURL({ dynamic: true, format: "png" }))
            .addField("❯ Info", [
                `**• Type:** \`${this.client.util.capitalise(channel.type)}\``,
                `**• Topic:** \`${
                    channel.topic
                        ? channel.topic.length > 50
                            ? channel.topic.substring(0, 50) + "..."
                            : channel.topic
                        : "None"
                }\``,
                `**• NSFW:** \`${channel.nsfw ? "Yes" : "No"}\``,
                `**• Creation Date:** \`${moment(channel.createdAt).format("L")}, ${moment(
                    channel.createdAt
                ).fromNow()}\``,
                `**• Last Message ID:** \`${message.channel.lastMessageID}\``,
                `**• Last Message Pinned:** \`${message.channel.lastPinAt || "none"}\``,
            ]);

        message.channel.send(embed);
    }
};
