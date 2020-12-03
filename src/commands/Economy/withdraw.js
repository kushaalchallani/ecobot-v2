const Command = require("../../structures/bases/commandBase");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "withdraw",
            description: "Search discord api documentation.",
            category: "Bot Owner",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
            bankSpace: 0,
            cooldown: 10,
            examples: ["docs Client", "docs Message", "docs ClientUser#setActivity --src=master"],
        });
    }

    async execute(message, args) {
        const data = await this.client.fetchUser(message.author.id);

        if (args.join(" ") === "all" || args.join(" ") === "max") {
            data.coinsInWallet += data.coinsInBank;

            await message.channel.send(`Withdrawed **${data.coinsInBank}** coins.`);

            data.coinsInBank -= data.coinsInBank;

            await data.save();
        } else {
            if (isNaN(args[0])) {
                return message.channel.send("That's not a number.");
            }

            if (parseInt(args[0]) > data.coinsInBank) {
                return message.channel.send("You do not have that much coins.");
            }

            data.coinsInWallet += parseInt(args[0]);

            await message.channel.send(`Withdrawed **${args[0]}** coins.`);

            data.coinsInBank -= parseInt(args[0]);

            await data.save();
        }
    }
};
