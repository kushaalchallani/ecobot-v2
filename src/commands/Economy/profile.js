const Command = require("../../structures/bases/commandBase");
const Embed = require("../../structures/embed");
const moment = require("moment");
const pm = require("pretty-ms");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "profile",
            description: "See your profile",
            category: "Economy",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
            bankSpace: 0,
            cooldown: 15,
            usage: "[user]",
        });
    }

    async execute(message, args) {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        const user = await this.client.util.fetchUser(member.user.id);

        if (member.presence.status === "dnd") member.presence.status = "Do Not Disturb";
        if (member.presence.status === "online") member.presence.status = "Online";
        if (member.presence.status === "idle") member.presence.status = "Idle";
        if (member.presence.status === "offline") member.presence.status = "Offline";

        const createDays = Math.floor((Date.now() - member.user.createdAt) / 86400000);
        const joinDays = Math.floor((Date.now() - member.joinedAt) / 86400000);
        const profileEmbed = new Embed()
            .setAuthor(member.user.tag, member.user.avatarURL())
            .setThumbnail(member.user.displayAvatarURL({ format: "png", size: 256, dynamic: true }))
            .addFields(
                {
                    name: "Account created at",
                    value:
                        moment.utc(member.user.createdAt).format("ddd, MMM Do YYYY, HH mm A") +
                        ` **${createDays}** Day(s) ago`,
                    inline: true,
                },
                {
                    name: "Joined server at",
                    value:
                        moment.utc(member.joinedAt).format("ddd, MMM Do YYYY, HH mm A") + ` **${joinDays}** Day(s) ago`,
                    inline: true,
                },
                { name: "Status", value: `${member.presence.status}`, inline: true },
                {
                    name: "Economy",
                    value: `
            • Total Coins: **${(user.coinsInBank + user.coinsInWallet).toLocaleString()}**
            • Bank Coins: **${user.coinsInBank.toLocaleString()}**
            • Bank Space: **${user.bankSpace.toLocaleString()}**
            • Wallet Coins: **${user.coinsInWallet.toLocaleString()}**
            • Total Items: **${user.items.length.toLocaleString()}**
            • Passive mode: \`${user.passive}\`
            • Next daily reward in: ${pm(Date.parse(user.dailyStreak) + 86400000 - Date.now())}
            • Next weekly reward in: ${pm(Date.parse(user.weeklyStreak) + 604800000 - Date.now())}
            • Next monthly reward in: ${pm(Date.parse(user.monthlyStreak) + 2592000000 - Date.now())}
            • Can hack in: ${pm(Date.parse(user.hackStreak) + 3600000 - Date.now())}
            • Can Rob in: ${pm(Date.parse(user.robStreak) + 3600000 - Date.now())}
            `,
                }
            )
            .setFooter("IF the value is in - you can use the command")
            .setColor("RANDOM");

        message.channel.send(profileEmbed);
    }
};
