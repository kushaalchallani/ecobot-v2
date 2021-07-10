const Command = require("../../structures/bases/commandBase");
const { error, success, incorrect } = require("../../utils/export/index");
const { warnModel } = require("../../database/models/export/index");
const Embed = require("../../structures/embed");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "delwarn",
            description: "Delete a warning from a user who was previous warned for",
            aliases: ["delpunishment", "unwarn"],
            category: "Moderation",
            cooldown: 3,
            botPermission: ["SEND_MESSAGES"],
            memberPermission: ["SEND_MESSAGES", "MANAGE_ROLES"],
            usage: "<warn Id> [reason]",
            examples: [
                "delwarn @Gogeta#0069 1",
                "delwarn @Gogeta#0069 3 By Mistake (Wrong user)",
                "delwarn 485716273901338634 4 By Mistake (Wrong user)",
            ],
            ownerOnly: false,
            nsfw: false,
        });
    }

    async execute(message, args) {
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!user) {
            return incorrect("You need to mentiona a user to unwarn", message.channel);
        }
        const mentionedPosition = user.roles.highest.position;
        const memberPosition = message.member.roles.highest.position;

        if (memberPosition <= mentionedPosition) {
            return error("You cant warn this user as their role is higher/equal to yours", message.channel);
        }

        const reason = args.slice(2).join(" ");

        const warnDoc = await warnModel
            .findOne({
                guildID: message.guild.id,
                memberID: user.id,
            })

            .catch((err) => console.log(err));

        if (!warnDoc || !warnDoc.warnings.length) {
            return success(`${user} does not have any warnings`, message.channel);
        }

        const warningID = parseInt(args[1]);

        if (warningID <= 0 || warningID > warnDoc.warnings.length) {
            return error("This is an invalid warning ID", message.channel);
        }

        warnDoc.warnings.splice(warningID - 1, warningID !== 1 ? warningID - 1 : 1);

        await warnDoc.save().catch((err) => console.log(err));

        try {
            success(`Unwarned ${user} ${reason ? `for **${reason}**` : ""}`, message.channel);

            const embed = new Embed()
                .setColor("ORANGE")
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setTimestamp(Date.now())
                .setDescription(
                    `You have been unwarned once in **${message.guild.name}** ${
                        reason ? `for **Reason:** \`${reason}\`` : ""
                    }`
                );
            user.send(embed);
        } catch {
            error(`${user}'s DM is closed could not send message`, message.channel);
        }
    }
};
