const { success, error, incorrect } = require("../../utils/export/index");
const Command = require("../../structures/bases/commandBase");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "deposit",
            description: "Deposit all the money from your wallet to bank",
            aliases: ["dep"],
            category: "Economy",
            cooldown: 10,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            ownerOnly: false,
            nsfw: false,
            bankspace: 0,
            usage: "<max || amount>",
            example: ["deposit max", "deposit all", "deposit 1000"],
        });
    }

    async execute(message, args) {
        const data = await this.client.util.fetchUser(message.author.id);

        if (!args[0]) {
            return incorrect("You need to enter a value", message.channel).catch();
        }

        if (args.join(" ") === "all" || args.join(" ") === "max") {
            if (data.coinsInWallet > data.bankSpace) {
                const max_deposit = data.coinsInWallet + data.coinsInBank - data.bankSpace;

                if (data.coinsInBank - data.bankSpace === 0) {
                    return error("Your bank is full.", message.channel).catch();
                }

                data.coinsInWallet = max_deposit;
                await success(
                    `Deposited **${(data.bankSpace - data.coinsInBank).toLocaleString()}** coins.`,
                    message.channel
                ).catch();

                data.coinsInBank = data.coinsInWallet + data.bankSpace - max_deposit;

                await data.save();
            } else if (data.coinsInWallet + data.coinsInBank > data.bankSpace) {
                const left = data.coinsInWallet + data.coinsInBank - data.bankSpace;

                await success(
                    ` Deposited **${(data.coinsInWallet - left).toLocaleString()}** coins`,
                    message.channel
                ).catch();

                data.coinsInBank += data.coinsInWallet - left;
                data.coinsInWallet = left;

                await data.save();
            } else {
                await success(`Deposited **${data.coinsInWallet.toLocaleString()}** coins`, message.channel).catch();

                data.coinsInBank += data.coinsInWallet;
                data.coinsInWallet = 0;

                await data.save();
            }
        } else {
            if (isNaN(args[0])) {
                return error("That's not a number.", message.channel).catch();
            }
            if (data.bankSpace - data.coinsInBank < parseInt(args[0])) {
                return error("Your bank is not big enough.", message.channel).catch();
            }
            if (parseInt(args[0]) > data.coinsInWallet) {
                return error("You don't have that much money.", message.channel);
            }

            data.coinsInBank += parseInt(args[0]);

            await success(` Deposited **${parseInt(args[0]).toLocaleString()}** coins.`, message.channel).catch();

            data.coinsInWallet -= parseInt(args[0]);

            await data.save();
        }
    }
};
