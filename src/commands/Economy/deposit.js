const Command = require("../../structures/bases/commandBase");
const { error, incorrect, success } = require("../../utils/export/index");
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();

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
            examples: ["deposit 100", "deposit max", "deposit all"],
            usage: "<Amount>",
            aliases: ["dep"],
        });
    }

    async execute(message, args) {
        const money = args.join(" ");
        if (!money) return incorrect("Enter the amount you want to deposit.", message.channel);

        const result = await cs.deposite({
            user: message.author,
            guild: message.guild,
            amount: money,
        });
        if (result.error) {
            if (result.type === "money") return incorrect("Specify an amount to deposit", message.channel);
            if (result.type === "negative-money") return error("You can't deposite negative money", message.channel);
            if (result.type === "low-money") return error("You don't have that much money in wallet.", message.channel);
            if (result.type === "no-money") return error("You don't have any money to deposite", message.channel);
        } else {
            if (result.type === "all-success")
                return success("You have deposited `all` your money to your bank", message.channel);
            if (result.type === "success")
                return success(`You have deposited \`$${result.amount}\` money to your bank.`, message.channel);
        }
    }
};
