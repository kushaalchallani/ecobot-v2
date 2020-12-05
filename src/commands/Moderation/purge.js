const Command = require("../../structures/bases/commandBase");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "purge",
            description: "Get song lyrics. POG!",
            category: "Music",
            ownerOnly: false,
            nsfw: false,
            cooldown: 10,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            usage: "<song name>",
            examples: ["lyrics Despacito", "lyrics Alone"],
        });
    }

    async execute(message, args) {
        if (isNaN(args[0])) return message.channel.send("**Please Supply A Valid Amount To Delete Messages!**");

        if (args[0] > 100) return message.channel.send("**Please Supply A Number Less Than 100!**");

        if (args[0] < 1) return message.channel.send("**Please Supply A Number More Than 1!**");

        message.channel
            .bulkDelete(args[0])
            .then((messages) =>
                message.channel
                    .send(`**Succesfully deleted \`${messages.size}\` messages**`)
                    .then((msg) => msg.delete({ timeout: 2000 }))
            )
            .catch(() => null);
    }
};
