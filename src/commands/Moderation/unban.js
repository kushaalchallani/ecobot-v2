const Command = require("../../structures/bases/commandBase");
const { error, success, incorrect } = require("../../utils/export/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "unban",
            description: "Ban a user from the server for breaking rules",
            aliases: ["ub", "unbanish", "removeban"],
            category: "Moderation",
            cooldown: 5,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS", "BAN_MEMBERS"],
            memberPermission: ["SEND_MESSAGES", "BAN_MEMBERS"],
            usage: "<user ID>",
            ownerOnly: false,
            nsfw: false,
        });
    }

    async execute(message, args) {
        const user = args[0];

        if (!user) {
            return incorrect("You need to mention a user to Unban", message.channel);
        }
        const bannedMembers = await message.guild.fetchBans();

        if (!bannedMembers.find((user) => user.user.id)) {
            return error("The user is not banned from the server", message.channel);
        }

        message.guild.members.unban(user);

        success(`Unbanned **<@${user}>**`, message.channel);
    }
};
