const Command = require("../../structures/bases/commandBase");
const { incorrect, error, success } = require("../../utils/export/index");
const { warnModel } = require("../../database/models/export/index");
const Embed = require("../../structures/embed");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "warn",
            description: "Warn a user for breaking server rules",
            aliases: ["punish", "strike"],
            category: "Moderation",
            cooldown: 3,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_ROLES"],
            memberPermission: ["SEND_MESSAGES", "MANAGE_ROLES"],
            usage: "<user> [reason]",
            examples: ["warn @Gogeta#0069", "warn @Gogeta#0069 Spamming", "warn 485716273901338634 Spamming"],
            ownerOnly: false,
            nsfw: false,
        });
    }

    async execute(message, args) {
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!user) {
            return incorrect("You need to mention a member you wan to warn", message.channel);
        }

        const mentionedPosition = user.roles.highest.position;
        const memberPosition = message.member.roles.highest.position;

        if (memberPosition <= mentionedPosition) {
            return error("You cant warn this user as their role is higher/equal to yours", message.channel);
        }

        const reason = args.slice(1).join(" ");

        let warnDoc = await warnModel
            .findOne({
                guildID: message.guild.id,
                memberID: user.id,
            })
            .catch((err) => console.log(err));

        if (!warnDoc) {
            warnDoc = new warnModel({
                guildID: message.guild.id,
                memberID: user.id,
                warnings: [reason],
                moderator: [message.member.id],
                date: [Date.now()],
            });

            await warnDoc.save().catch((err) => console.log(err));
        } else {
            warnDoc.warnings.push(reason);
            warnDoc.moderator.push(message.member.id);
            warnDoc.date.push(Date.now());

            await warnDoc.save().catch((err) => console.log(err));
        }

        try {
            success(`Successfully warned ${user} ${reason ? `for **Reason:** \`${reason}\`` : ""}`, message.channel);

            const embed = new Embed()
                .setColor("ORANGE")
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setTimestamp(Date.now())
                .setDescription(
                    `You have been warned in **${message.guild.name}** ${reason ? `for **Reason:** \`${reason}\`` : ""}`
                );
            user.send(embed);
        } catch {
            error(`${user}'s DM is closed could not send message`, message.channel);
        }
    }
};
