const Command = require("../../structures/bases/commandBase");
const { success } = require("../../utils/export/index");
const { thanksModel } = require("../../database/models/export");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "myThanks",
            description: "View How much times you have been thanked",
            category: "Utilites",
            ownerOnly: false,
            nsfw: false,
            cooldown: 60,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
        });
    }

    async execute(message) {
        const target = message.member;

        const targetID = target.id;

        const thanks = (await thanksModel.findOne({ guildId: message.guild.id, userId: targetID }))
            ? (await thanksModel.findOne({ guildId: message.guild.id, userId: targetID })).received
            : "0";

        return success(`**${target.user.username}** has **${thanks}** thanks.`, message.channel);
    }
};
