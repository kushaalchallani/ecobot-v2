/* eslint-disable no-undef */
const Command = require("../../structures/bases/commandBase");
const Embed = require("../../structures/embed");
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "inventory",
            description: "Check your inventory.",
            category: "Economy",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
            cooldown: 5,
            aliases: ["inv"],
        });
    }

    async execute(message) {
        const result = await cs.getUserItems({
            user: message.author,
            guild: message.guild,
        });
        const inv = result.inventory.slice(0, 10);
        const embed = new Embed().setDescription("Your Inventory in Empty!").setColor("BLUE");
        for (key of inv) {
            embed.addField(`**${key.name}:**`, `Amount: ${key.amount}`);
            embed.setDescription("Your Inventory!");
        }
        message.channel.send(embed);
    }
};
