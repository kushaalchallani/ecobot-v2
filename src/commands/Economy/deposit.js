const Command = require("../../structures/bases/commandBase");
const { error, incorrect, success } = require("../../utils/export/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "deposit",
            description: "Deposit coins to your bank account.",
            category: "Economy",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
            cooldown: 15,
            bankSpace: 0,
            examples: ["deposit 100", "deposit max", "deposit all"],
            usage: "<Amount>",
            aliases: ["dep"],
        });
    }

    async execute(message, args) {
        const data = await this.client.util.fetchUser(message.author.id);

        if (args.join(" ") === "max" || args.join(" ") === "all") {
            if (data.coinsInWallet > data.bankSpace) {
                const max_deposit = data.coinsInWallet + data.coinsInBank - data.bankSpace;

                data.coinsInWallet = max_deposit;

                await success(`Deposited **${data.bankSpace - data.coinsInBank}** coins.`, message.channel);

                data.coinsInBank = data.coinsInWallet + data.bankSpace - max_deposit;

                await data.save();
            } else if (data.coinsInWallet + data.coinsInBank > data.bankSpace) {
                const left = data.coinsInWallet + data.coinsInBank - data.bankSpace;

                success(`Deposited **${(data.coinsInWallet - left).toLocaleString()}** coins`, message.channel);

                data.coinsInBank += data.coinsInWallet - left;
                data.coinsInWallet = left;

                await data.save();
            } else {
                success(`Deposited **${data.coinsInWallet.toLocaleString()}** coins`, message.channel);

                data.coinsInBank += data.coinsInWallet;
                data.coinsInWallet = 0;

                await data.save();
            }
        } else {
            if (isNaN(args[0])) {
                return incorrect("Please provide the amount you want to deposit", message.channel);
            }

            if (parseInt(args[0]) > data.bankSpace) {
                return error("Your bank is not big enough.", message.channel);
            }
            if (parseInt(args[0]) > data.coinsInWallet) {
                return error("You don't have that much money.", message.channel);
            }

            data.coinsInBank += parseInt(args[0]);

            await success(`Deposited **${args[0]}** coins.`, message.channel);

            data.coinsInWallet -= parseInt(args[0]);

            await data.save();
        }
    }
};
