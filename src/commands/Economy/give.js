const Command = require("../../structures/bases/commandBase");
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();
const { error, incorrect, success } = require("../../utils/export/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "give",
            description: "Give your coins to a user",
            category: "Economy",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            cooldown: 20,
            examples: ["give @Gogeta#2869 420", "give @Gogeta#2869 69", "give @Gogeta#2869 all"],
            usage: "<user> <Amount || All>",
            aliases: ["share", "transfer"],
        });
    }

    async execute(message, args) {
        let user;
        if (message.mentions.users.first()) {
            user = message.mentions.users.first();
        } else if (args[0]) {
            user = message.guild.members.cache.get(args[0]);
            if (user) user = user.user;
        } else {
            user.id = "1";
        }

        if (user.bot || user === this.client.user) return error("This user is a bot.", message.channel);
        if (!this.client.users.cache.get(user.id) || !user)
            return incorrect("Sorry, you forgot to mention somebody.", message.channel);
        if (user === message.author) return error("You can't transfer money to yourself", message.channel);

        const amount = parseInt(args[1]);
        if (!amount) return incorrect("Enter amount of money to add.", message.channel);
        if (amount.includes("-")) return error("You can't send negitive money.", message.channel);
        const money = parseInt(amount);

        const result = await cs.transferMoney({
            user: message.author,
            user2: user,
            guild: message.guild,
            amount: money,
        });
        if (result.error) return error("You don't have enough money in your wallet.", message.channel);
        else
            success(
                `**${message.author.username}**, Successfully transfered \`$${result.money}\` to **${result.user2.username}**`,
                message.channel
            );
    }
};
