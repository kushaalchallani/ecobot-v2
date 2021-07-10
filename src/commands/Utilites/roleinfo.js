const Command = require("../../structures/bases/commandBase");
const Embed = require("../../structures/embed");
const moment = require("moment");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "roleinfo",
            description: "Display information about a role.",
            aliases: ["ri", "rolestats"],
            category: "Utilites",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
            ownerOnly: false,
            cooldown: 10,
            examples: ["roleinfo", "roleinfo @verified"],
            usage: "[role]",
        });
    }

    async execute(message, args) {
        const role =
            this.client.util.getMentions().role(args[0], message.guild) ||
            message.member.roles.highest ||
            message.guild.roles.cache.get(args[0]);

        const embed = new Embed()
            .setColor(role.hexColor)
            .setDescription(`Info on **${role.name}** (ID: ${role.id})`)
            .setThumbnail(role.guild.iconURL({ dynamic: true, format: "png" }))
            .addField("❯ Info", [
                `• Colour: \`${role.color.toString(16)}\``,
                `• Hoisted: \`${role.hoist ? "Yes" : "No"}\``,
                `• Mentionable: \`${role.mentionable ? "Yes" : "No"}\``,
                `• Creation Date: \`${moment(role.createdAt).format("L")}, ${moment(role.createdAt).fromNow()}\``,
            ])
            .addField(
                "❯ Permissions",
                role.permissions
                    .toArray()
                    .map((perm) => "• " + this.client.util.capitalise(perm.toLowerCase().replace(/_/g, " ")))
            );

        message.channel.send({ embed: embed });
    }
};
