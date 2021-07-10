const Command = require("../../structures/bases/commandBase");
const { error, success, incorrect } = require("../../utils/export/index");
const Embed = require("../../structures/embed");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "ban",
            description: "Ban a user from the server for breaking rules",
            aliases: ["b", "banish"],
            category: "Moderation",
            cooldown: 5,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS", "BAN_MEMBERS"],
            memberPermission: ["SEND_MESSAGES", "BAN_MEMBERS"],
            usage: "<user> [reason]",
            examples: ["ban @Gogeta#0069", "ban @Gogeta#0069 DM Promos", "ban 485716273901338634 DM Promos"],
            ownerOnly: false,
            nsfw: false,
        });
    }

    async execute(message, args) {
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!user) {
            return incorrect("You need to mention a user to Ban", message.channel);
        }

        const mentionedPosition = user.roles.highest.position;
        const memberPosition = message.member.roles.highest.position;

        if (memberPosition <= mentionedPosition) {
            return error("You cant Ban this user as their role is higher/equal to yours", message.channel);
        }

        if (user.roles.highest.position >= message.guild.me.roles.highest.position) {
            return error("I can't Ban this member as their roles are higher/equal to mine", message.channel);
        }

        const reason = args.slice(1).join(" ");

        user.ban({ reason });

        try {
            success(`Banned **${user}** ${reason ? `for **Reason:** \`${reason}\`` : ""}`, message.channel);

            const embed = new Embed()
                .setColor("RED")
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setTimestamp(Date.now())
                .setDescription(
                    `You have been Banned from **${message.guild.name}** ${
                        reason ? `for **Reason:** \`${reason}\`` : ""
                    }`
                );
            user.send(embed);
        } catch {
            error(`${user}'s DM is closed could not send message`, message.channel);
        }
    }
};
