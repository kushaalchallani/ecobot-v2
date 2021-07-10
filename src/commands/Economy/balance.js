const Command = require("../../structures/bases/commandBase");
const CurrencySystem = require("currency-system");
const Embed = require("../../structures/embed");
const cs = new CurrencySystem();

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "balance",
            description: "A way to know the amount  of money in your bank or in your wallet.",
            category: "Economy",
            aliases: ["bal", "money", "bankbalance"],
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
            usage: "[user]",
            cooldown: 3,
            ownerOnly: false,
            examples: ["balance", "balance @Gogeta#0069", "balance 485716273901338634"],
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

        message.channel.send(
            new Embed()
                .setTitle(`${user.username}'s Balance`)
                .setDescription(`**Wallet:** $${result.wallet}\n**Bank:** $${result.bank}`)
                .setColor("RANDOM")
                .setFooter("💰")
                .setTimestamp(Date.now())
        );
    }
};
