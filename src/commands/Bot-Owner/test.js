const Command = require("../../structures/bases/commandBase");
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();

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

    async execute(message, args) {
        let user;
        if (message.mentions.users.first()) {
            user = message.mentions.users.first();
        } else if (args[0]) {
            user = message.guild.members.cache.get(args[0]);
            if (user) user = user.user;
        } else if (!args[0]) {
            user = message.author;
        }

        const result = await cs.balance({
            user: user,
            guild: message.guild,
        });
        message.channel.send(`${user.tag}, \n have $${result.wallet} in you wallet and $${result.bank} in there bank.`);
    }
};
