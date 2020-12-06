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
        const member = message.mentions.members.first();
        try {
            member.roles.add("781103196348219402");
        } catch (err) {
            const errorChannel = this.client.channels.cache.get("784313737040756756");
            errorChannel.send(err.message);
        }
    }
};
