/* eslint-disable no-unused-vars */
const Command = require("../../structures/bases/commandBase");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "test",
            description: "A Test command for the bot",
            category: "Bot Owner",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["ADMINISTRATOR"],
            nsfw: false,
            ownerOnly: true,
        });
    }

    async execute(message) {
        // const member = message.mentions.members.first();
        // const role = message.guild.roles.cache.get("781103196348219402");
        // if (role.position >= message.guild.me.roles.highest.position) return;
        // member.roles.add(role);
    }
};
