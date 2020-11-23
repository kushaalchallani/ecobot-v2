const Command = require("../../structures/bases/commandBase");
const Embed = require("../../structures/embed");
const moment = require("moment");
const { region, verification, filterlevels } = require("../../json/exports/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "serverinfo",
            description: "Display information about the server.",
            aliases: ["si", "serverstats"],
            category: "Utilites",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
            ownerOnly: false,
            cooldown: 10,
        });
    }

    async execute(message) {
        const roles = message.guild.roles.cache.sort((a, b) => b.position - a.position).map((role) => role.toString());
        const members = message.guild.members.cache;
        const channels = message.guild.channels.cache;
        const emojis = message.guild.emojis.cache;

        const embed = new Embed()
            .setDescription(`**Guild information for __${message.guild.name}__**`)
            .setColor("BLUE")
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .addField("General", [
                `**❯ Name:** ${message.guild.name}`,
                `**❯ ID:** ${message.guild.id}`,
                `**❯ Owner:** ${message.guild.owner.user.tag} (${message.guild.ownerID})`,
                `**❯ Region:** ${region[message.guild.region]}`,
                `**❯ Boost Tier:** ${message.guild.premiumTier ? `Tier ${message.guild.premiumTier}` : "None"}`,
                `**❯ Explicit Filter:** ${filterlevels[message.guild.explicitContentFilter]}`,
                `**❯ Verification Level:** ${verification[message.guild.verificationLevel]}`,
                `**❯ Time Created:** ${moment(message.guild.createdTimestamp).format("LT")} ${moment(
                    message.guild.createdTimestamp
                ).format("LL")} ${moment(message.guild.createdTimestamp).fromNow()}`,
                "\u200b",
            ])
            .addField("Statistics", [
                `**❯ Role Count:** ${roles.length}`,
                `**❯ Emoji Count:** ${emojis.size}`,
                `**❯ Regular Emoji Count:** ${emojis.filter((emoji) => !emoji.animated).size}`,
                `**❯ Animated Emoji Count:** ${emojis.filter((emoji) => emoji.animated).size}`,
                `**❯ Member Count:** ${message.guild.memberCount}`,
                `**❯ Humans:** ${members.filter((member) => !member.user.bot).size}`,
                `**❯ Bots:** ${members.filter((member) => member.user.bot).size}`,
                `**❯ Text Channels:** ${channels.filter((channel) => channel.type === "text").size}`,
                `**❯ Voice Channels:** ${channels.filter((channel) => channel.type === "voice").size}`,
                `**❯ Boost Count:** ${message.guild.premiumSubscriptionCount || "0"}`,
                "\u200b",
            ])
            .addField("Presence", [
                `**❯ Online:** ${members.filter((member) => member.presence.status === "online").size}`,
                `**❯ Idle:** ${members.filter((member) => member.presence.status === "idle").size}`,
                `**❯ Do Not Disturb:** ${members.filter((member) => member.presence.status === "dnd").size}`,
                `**❯ Offline:** ${members.filter((member) => member.presence.status === "offline").size}`,
                "\u200b",
            ])
            .addField(
                `Roles [${roles.length - 1}]`,
                roles.length < 10 ? roles.join(", ") : roles.length > 10 ? this.client.util.trimArray(roles) : "None"
            )
            .setTimestamp();
        message.channel.send(embed);
    }
};
