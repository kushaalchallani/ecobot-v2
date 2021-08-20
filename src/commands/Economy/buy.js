const Command = require("../../structures/bases/commandBase");
const { incorrect, error, success, items } = require("../../utils/export/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "buy",
            description:
                "Some items are useful and give extended functionality, some are made just for selling/collecting, and some are only to FLEX. Not all the items are available in the shop",
            aliases: ["purchase"],
            category: "Economy",
            cooldown: 5,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            ownerOnly: false,
            nsfw: false,
            usage: "<item ID> [amount]",
            examples: ["buy cookie", "buy axe", "buy rifle 2"],
            bankspace: 0,
        });
    }

    async execute(message, args) {
        const user = await this.client.util.fetchUser(message.author.id);
        if (!args.join(" ")) {
            return incorrect("You can't buy nothing, please enter the correct item `id`.", message.channel).catch();
        }
        if (!args[1]) args[1] = "";
        const item = items.find(
            (x) =>
                x.name.toLowerCase() === args.join(" ").toString().toLowerCase() ||
                x.name.toLowerCase() === args[0].toString().toLowerCase() ||
                x.name.toLowerCase() === `${args[0].toString().toLowerCase()} ${args[1].toString().toLowerCase()}`
        );
        if (!item) {
            return error(
                "You can't buy an item that doesn't exist please use the correct item `id`.",
                message.channel
            ).catch();
        }
        if (item.canBuy == false) {
            return error("You can't buy this item.", message.channel).catch();
        }
        let buyAmount = args
            .join(" ")
            .toString()
            .match(/([1-9][0-9]*)/);
        if (!buyAmount) buyAmount = 1;
        else buyAmount = buyAmount[0];
        if (item.price > user.coinsInWallet || buyAmount * item.price > user.coinsInWallet) {
            return error("You dont have the funds to buy this item.", message.channel).catch();
        }
        const founditem = user.items.find((x) => x.name.toLowerCase() === item.name.toLowerCase());
        let array = [];
        array = user.items.filter((x) => x.name !== item.name);
        if (founditem) {
            array.push({
                name: item.name,
                amount: parseInt(founditem.amount) + parseInt(buyAmount),
                description: item.description,
            });
            user.items = array;
            await user.save();
        } else {
            user.items.push({
                name: item.name,
                amount: buyAmount,
                description: item.description,
            });
            await user.save();
        }
        user.coinsInWallet -= parseInt(item.price) * parseInt(buyAmount);
        await user.save();

        success(`You bought **${parseInt(buyAmount).toLocaleString()}** \`${item.name}\`.`, message.channel).catch();
    }
};
