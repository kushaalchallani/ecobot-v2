/* eslint-disable no-undef */
const Command = require("../../structures/bases/commandBase");
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();
const { error, incorrect, success } = require("../../utils/export/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "use",
            description: "View the item you can buy",
            category: "Economy",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
            cooldown: 10,
        });
    }

    async execute(message, args) {
        const item = args[0];
        if (!item) return incorrect("What item you wanna use?", message.channel);
        let haveItem = false;
        const arr = await cs.getUserItems({
            user: message.author,
            guild: message.guild,
        });
        for (key of arr.inventory) {
            if (key.name.toLowerCase().includes(item.toLowerCase())) haveItem = true;
        }
        if (haveItem) {
            const money = Math.floor(Math.random() * 10 + 1) * 100; // 100 - 1000
            const result = await cs.addMoney({
                user: message.author,
                guild: message.guild,
                amount: money,
                wheretoPutMoney: "wallet",
            });
            if (result.error) {
                console.log(result);
                return error("Unknown error occured see console.", message.channel);
            } else return success("You've used " + item + " and earned $" + money, message.channel);
        } else return error("buy it first", message.channel);
    }
};
