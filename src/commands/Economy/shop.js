const Command = require("../../structures/bases/commandBase");
const Embed = require("../../structures/embed");
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "shop",
            description: "View the item you can buy",
            category: "Economy",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
            cooldown: 10,
        });
    }

    async execute(message) {
        const result = await cs.getShopItems({
            guild: message.guild,
        });
        const inv = result.inventory;
        const embed = new Embed().setDescription("Shop!").setColor("RANDOM");
        for (const key in inv) {
            embed.addField(`${parseInt(key) + 1} - **${inv[key].name}:**`, `Price: ${inv[key].price}`);
        }
        message.channel.send(embed);
    }
};
