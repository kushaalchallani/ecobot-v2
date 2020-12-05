const Embed = require("../../structures/embed");
const { statusMessages, suggestionCache } = require("../../features/feature/suggestion");
const Command = require("../../structures/bases/commandBase");
const { incorrect, error } = require("../../utils/export/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "suggestion",
            description: "Accept or Deny any suggestion",
            category: "Utilites",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["MANAGE_ROLES", "ADMINISTRATOR"],
            nsfw: false,
            ownerOnly: false,
            cooldown: 15,
            usage: "<message ID> <Status> [reason]",
            examples: [
                "suggestion 775212078201176076 ACCEPT",
                "suggestion 775212078201176076 DENY",
                "suggestion 775212078201176076 DENY Already Suggested",
                "suggestion 775212078201176076 WAITING",
            ],
            subcommands: ["ACCEPT", "DENY", "WAITING"],
        });
    }

    async execute(message, args) {
        const { guild } = message;

        const messageId = args.slice(0).shift();
        if (!messageId) {
            return incorrect("Please Provide an Message ID", message.channel);
        }

        if (!args[1]) {
            return incorrect("Please `ACCEPT` or `DENY` a suggestion", message.channel);
        }
        const status = args.slice(1).shift().toUpperCase();
        const reason = args.slice(2).join(" ");

        message.delete();

        const newStatus = statusMessages[status];

        if (!newStatus) {
            error(`Unknown status **${status}**, please use **${Object.keys(statusMessages)}**`, message.channel);
            return;
        }

        const channelId = suggestionCache()[guild.id];
        if (!channelId) {
            error("An error occurred, please report this", message.channel);
            return;
        }

        const channel = guild.channels.cache.get(channelId);
        if (!channel) {
            error("The suggestion channel no longer exists", message.channel);
            return;
        }

        try {
            const targetMessage = await channel.messages.fetch(messageId, false, true);

            const oldEmbed = targetMessage.embeds[0];
            const embed = new Embed()
                .setAuthor(oldEmbed.author.name, oldEmbed.author.iconURL)
                .setDescription(oldEmbed.description)
                .setColor(newStatus.color)
                .setFooter("Want to suggest something? Simply type it in this channel");

            if (oldEmbed.fields.length === 2) {
                embed.addFields(oldEmbed.fields[0], {
                    name: "Status",
                    value: `${newStatus.text}${reason ? ` Reason: ${reason}` : ""}`,
                });
            } else {
                embed.addFields({
                    name: "Status",
                    value: `${newStatus.text}${reason ? ` Reason: ${reason}` : ""}`,
                });
            }

            targetMessage.edit(embed);
        } catch {
            error("The message does not exists. Try another message", message.channel);
        }
    }
};
