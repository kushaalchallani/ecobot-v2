const Command = require("../../structures/bases/commandBase");
const { thanksModel } = require("../../database/models/export/index");
const { error, success, incorrect } = require("../../utils/export/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "reset-thanks",
            usage: "<user>",
            description: "reset the thanks of an user",
            category: "Settings",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS", "ADMINISTRATOR"],
            memberPermission: ["ADMINISTRATOR", "MANAGE_SERVER"],
            nsfw: false,
            ownerOnly: false,
            cooldown: 15,
            aliases: ["rt"],
        });
    }

    async execute(message, args) {
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!user) {
            return incorrect("Please provide an user whose thanks you want to reset", message.channel);
        }

        thanksModel.findOneAndDelete({ guildId: message.guild.id, userId: user.id }, async (err, data) => {
            if (err) throw err;
            if (data) {
                return success(`Successfully cleared the thanks of **${user.user.username}**`, message.channel);
            } else if (!data) {
                return error(`**${user.tag}** does not have any thanks`, message.channel);
            }
        });
    }
};
