const Command = require("../../structures/bases/commandBase");
const CurrencySystem = require("currency-system");
const { error, success, incorrect } = require("../../utils/export/index");
const cs = new CurrencySystem();

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "addmoney",
            description: "A way to add the amount of money in your bank or wallet.",
            category: "Economy",
            aliases: ["am"],
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES", "ADMINISTRATOR"],
            nsfw: false,
            cooldown: 3,
            ownerOnly: false,
            usage: "<user> <money> <bank/wallet>",
            examples: [
                "addmoney @Gogeta#0069 1000 bank",
                "addmoney @Gogeta#0069 2500 wallet",
                "addmoney 485716273901338634 500 bank",
            ],
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
            return incorrect("Specify a user!", message.channel);
        }
        const wheretoPutMoney = args[2] || "wallet";
        const amount = parseInt(args[1]);
        if (!amount) return incorrect("Enter amount of money to add.", message.channel);
        const money = parseInt(amount);
        const result = await cs.addMoney({
            user: user,
            guild: message.guild,
            amount: money,
            wheretoPutMoney: wheretoPutMoney,
        });
        if (result.error) return error("You cant add negitive money", message.channel);
        else
            success(
                `Successfully added \`$${money}\` to **${user.username}**, (in ${wheretoPutMoney} )`,
                message.channel
            );
    }
};
