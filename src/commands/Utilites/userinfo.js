const Command = require("../../structures/bases/commandBase");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const flags = require("../../json/flags.json");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "userinfo",
            description: "Display information about yourself or an user.",
            aliases: ["ui", "userstats"],
            category: "Utilites",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
            ownerOnly: false,
            cooldown: 10,
            examples: ["userinfo", "userinfo @Gogeta"],
            usage: "[user]",
        });
    }

    async execute(message, args) {
        const member = message.mentions.members.last() || message.guild.members.cache.get(args[0]) || message.member;
        const roles = member.roles.cache
            .sort((a, b) => b.position - a.position)
            .map((role) => role.toString())
            .slice(0, -1);
        const userFlags = member.user.flags.toArray();
        const embed = new MessageEmbed()
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setColor(member.displayHexColor || "BLUE")
            .addField("User", [
                `**❯ Username:** ${member.user.username}`,
                `**❯ Discriminator:** ${member.user.discriminator}`,
                `**❯ ID:** ${member.id}`,
                `**❯ Flags:** ${userFlags.length ? userFlags.map((flag) => flags[flag]).join(", ") : "None"}`,
                `**❯ Avatar:** [Link to avatar](${member.user.displayAvatarURL({ dynamic: true })})`,
                `**❯ Time Created:** ${moment(member.user.createdTimestamp).format("LT")} ${moment(
                    member.user.createdTimestamp
                ).format("LL")} ${moment(member.user.createdTimestamp).fromNow()}`,
                `**❯ Status:** ${member.user.presence.status}`,
                `**❯ Game:** ${member.user.presence.game || "Not playing a game."}`,
                "\u200b",
            ])
            .addField("Member", [
                `**❯ Highest Role:** ${
                    member.roles.highest.id === message.guild.id ? "None" : member.roles.highest.name
                }`,
                `**❯ Server Join Date:** ${moment(member.joinedAt).format("LL LTS")}`,
                `**❯ Hoist Role:** ${member.roles.hoist ? member.roles.hoist.name : "None"}`,
                `**❯ Roles [${roles.length}]:** ${
                    roles.length < 10
                        ? roles.join(", ")
                        : roles.length > 10
                        ? this.client.utils.trimArray(roles)
                        : "None"
                }`,
                "\u200b",
            ]);
        return message.channel.send(embed);
    }
};
