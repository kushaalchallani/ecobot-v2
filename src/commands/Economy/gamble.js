const Command = require("../../structures/bases/commandBase");
const { error, incorrect, success } = require("../../utils/export/index");
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "gamble",
            description: "Gamble Coins",
            category: "Economy",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            aliases: ["bet", "gambling"],
            usage: "<Amount>",
        });
    }

    async execute(message, args) {
        const money = args.join(" ");
        if (isNaN(money)) return incorrect("Amount is not a number.", message.channel);

        const result = await cs.gamble({
            user: message.author,
            guild: message.guild,
            amount: money,
            minAmount: 30,
            cooldown: 1,
        });
        if (result.error) {
            if (result.type == "amount") return incorrect("Please insert an amount first.", message.channel);
            if (result.type == "nan") return error("The amount was not a number.", message.channel);
            if (result.type == "low-money")
                return error(
                    `You don't have enough money. You need \`$${result.neededMoney}\` more to perform the action. `,
                    message.channel
                );
            if (result.type == "gamble-limit")
                return error(
                    `You don't have enough money for gambling. The minimum was \`$${result.minAmount}\`.`,
                    message.channel
                );
            if (result.type == "time")
                return error(
                    `Wooo that is too fast. You need to wait \`${result.second} second(s)\` before you can gamble again.`,
                    message.channel
                );
        } else {
            if (result.type == "lost")
                return success(
                    `Ahh, no. You lose \`$${result.amount}\`. You've \`$${result.wallet}\` left. Good luck next time.`,
                    message.channel
                );
            if (result.type == "won")
                return success(
                    `Woohoo! You won \`$${result.amount}\`! You've \`$${result.wallet}\`. Good luck, have fun!`,
                    message.channel
                );
        }
    }
};
