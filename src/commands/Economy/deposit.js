const Command = require("../../structures/bases/commandBase");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "deposit",
            description: "Search discord api documentation.",
            category: "Bot Owner",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
            cooldown: 10,
            bankSpace: 0,
            examples: ["docs Client", "docs Message", "docs ClientUser#setActivity --src=master"],
        });
    }

    async execute(message, args) {
        const data = await this.client.fetchUser(message.author.id);

        if (args.join(" ") === "max" || args.join(" ") === "all") {
            if (data.coinsInWallet > data.bankSpace) {
                const max_deposit = data.coinsInWallet + data.coinsInBank - data.bankSpace;

                data.coinsInWallet = max_deposit;

                await message.channel.send(`Deposited **${data.bankSpace - data.coinsInBank}** coins.`);

                data.coinsInBank = data.coinsInWallet + data.bankSpace - max_deposit;

                await data.save();
            } else if (data.coinsInWallet + data.coinsInBank > data.bankSpace) {
                const left = data.coinsInWallet + data.coinsInBank - data.bankSpace;

                message.channel.send(`Deposited **${(data.coinsInWallet - left).toLocaleString()}** coins`);

                data.coinsInBank += data.coinsInWallet - left;
                data.coinsInWallet = left;

                await data.save();
            } else {
                message.channel.send(`Deposited **${data.coinsInWallet.toLocaleString()}** coins`);

                data.coinsInBank += data.coinsInWallet;
                data.coinsInWallet = 0;

                await data.save();
            }
        } else {
            if (isNaN(args[0])) {
                return message.channel.send("That's not a number.");
            }

            if (parseInt(args[0]) > data.bankSpace) {
                return message.channel.send("Your bank is not big enough.");
            }
            if (parseInt(args[0]) > data.coinsInWallet) {
                return message.channel.send("You don't have that much money.");
            }

            data.coinsInBank += parseInt(args[0]);

            await message.channel.send(`Deposited **${args[0]}** coins.`);

            data.coinsInWallet -= parseInt(args[0]);

            await data.save();
        }
    }
};
