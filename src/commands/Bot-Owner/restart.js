const Command = require("../../structures/bases/commandBase");
const { success } = require("../../utils/export/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "restart",
            description: "Restart the bot",
            category: "Bot Owner",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["ADMINISTRATOR"],
            nsfw: false,
            ownerOnly: true,
            cooldown: 30,
        });
    }

    async execute(message) {
        await success("Restarting the bot...", message.channel);
        process.exit();
    }
};
