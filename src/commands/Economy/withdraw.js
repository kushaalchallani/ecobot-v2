const Command = require("../../structures/bases/commandBase");
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();
const { error, incorrect, success } = require("../../utils/export/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "withdraw",
            description: "Get money into your wallet from your bank",
            category: "Economy",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
            cooldown: 15,
            examples: ["withdraw 100", "withdraw max", "withdraw all"],
            usage: "<Amount>",
            aliases: ["with"],
        });
    }

    async execute(message, args) {
        const money = args.join(" ");
        if (!money) return incorrect("Enter the amount you want to withdraw.", message.channel);

        const result = await cs.withdraw({
            user: message.author,
            guild: message.guild,
            amount: money,
        });
        if (result.error) {
            if (result.type === "money") return incorrect("Specify an amount to withdraw", message.channel);
            if (result.type === "negative-money")
                return error("You can't withdraw negative money, please use deposit command", message.channel);
            if (result.type === "low-money") return error("You don't have that much money in bank.", message.channel);
            if (result.type === "no-money") return error("You don't have any money to withdraw", message.channel);
        } else {
            if (result.type === "all-success")
                return success("You have withdraw'd all your money from your bank", message.channel);
            if (result.type === "success")
                return success(`You have withdraw \`$${result.amount}\` money from your bank.`, message.channel);
        }
    }
};
