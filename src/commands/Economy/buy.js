const Command = require("../../structures/bases/commandBase");
const { error, incorrect, success } = require("../../utils/export/index");
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "buy",
            description: "Buy Items from the shop",
            category: "Economy",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
            cooldown: 15,
        });
    }

    async execute(message, args) {
        const thing = args[0];
        if (!thing) return incorrect("Please provide item number", message.channel);
        if (isNaN(thing)) return incorrect("Please provide valid item number", message.channel);
        success("Please type `yes` to confirm paying", message.channel);
        const col = await message.channel.awaitMessages((msg) => msg.author.id == message.author.id, {
            max: 1,
        });
        if (col.first().content.toLowerCase() === "yes") {
            const result = await cs.buy({
                user: message.author,
                guild: message.guild,
                item: parseInt(args[0]),
            });
            if (result.error) {
                if (result.type === "No-Item") return error("Please provide valid item number", message.channel);
                if (result.type === "Invalid-Item") return error("item does not exists", message.channel);
                if (result.type === "low-money")
                    return error("**You don't have enough balance to buy this item!**", message.channel);
            } else
                return success(
                    `Successfully bought  **${result.inventory.name}** for \`$${result.inventory.price}\``,
                    message.channel
                );
        } else success("**Purchase Cancelled!**", message.channel);
    }
};
