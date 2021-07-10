const Command = require("../../structures/bases/commandBase");
const { error, success, incorrect } = require("../../utils/export/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "purge",
            description: "Delete many messages quickly. The maximum limit is 100",
            aliases: ["clear", "massdelete", "prune"],
            category: "Moderation",
            cooldown: 3,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_MESSAGES"],
            memberPermission: ["SEND_MESSAGES", "MANAGE_MESSAGES"],
            usage: "<Amount>",
            examples: ["purge 50", "purge 30 #general"],
            ownerOnly: false,
            nsfw: false,
        });
    }

    async execute(message, args) {
        message.delete();

        const channel = message.mentions.channels.last() || message.channel;

        if (isNaN(args[0])) return incorrect("Please Supply A Valid Amount To Delete Messages!", message.channel);

        if (args[0] > 100) return error("Please Supply A Number Less Than 100!", message.channel);

        if (args[0] < 1) return error("Please Supply A Number More Than 1!", message.channel);

        try {
            channel
                .bulkDelete(args[0], true)
                .then((messages) => success(`Succesfully deleted **\`${messages.size}\`** messages!`, message.channel))
                .catch(console.log);
        } catch (err) {
            return error(err, message.channel);
        }
    }
};
