const Command = require("../../structures/bases/commandBase");
const { success } = require("../../utils/export/index");
const { warnModel } = require("../../database/models/export/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "warnings",
            description: "View the warnings of an user",
            aliases: ["punishments", "strikes"],
            category: "Moderation",
            cooldown: 3,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            usage: "[user]",
            examples: ["warnings", "warnings @Gogeta#0069", "warnings 784339106834415617"],
            ownerOnly: false,
            nsfw: false,
        });
    }

    async execute(message, args) {
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        const warnDoc = await warnModel
            .findOne({
                guildID: message.guild.id,
                memberID: user.id,
            })
            .catch((err) => console.log(err));

        if (!warnDoc || !warnDoc.warnings.length) {
            return success(`${user} does not have any warnings`, message.channel);
        }

        const data = [];

        for (let i = 0; warnDoc.warnings.length > i; i++) {
            data.push(`**ID:** ${i + 1}`);
            data.push(`**Warn:** ${warnDoc.warnings[i]}`);
            data.push(
                `**Moderator:** ${await message.client.users.fetch(warnDoc.moderator[i]).catch(() => "Deleted User")}`
            );
            data.push(`**Date:** ${new Date(warnDoc.date[i]).toLocaleDateString()}\n`);
        }

        const embed = {
            color: "BLUE",
            thumbnail: {
                url: user.user.displayAvatarURL({ dynamic: true }),
            },
            description: data.join("\n"),
        };

        message.channel.send({ embed: embed });
    }
};
