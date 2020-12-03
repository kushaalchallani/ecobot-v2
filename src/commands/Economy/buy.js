const Command = require("../../structures/bases/commandBase");
const { itemss, error, incorrect, success } = require("../../utils/export/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "buy",
            description: "mmmmm the shop",
            category: "Economy",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
            cooldown: 15,
            bankSpace: 0,
            examples: ["buy Brownie", "buy Brownie 2", "buy Axe"],
            usage: "<Item> [quantity]",
        });
    }

    async execute(message, args) {
        const user = await this.client.util.fetchUser(message.author.id);
        if (!args.join(" ")) {
            return incorrect("You need buy something! Noob", message.channel);
        }
        if (!args[1]) args[1] = "";
        const item = itemss.find(
            (x) =>
                x.name.toLowerCase() === args.join(" ").toString().toLowerCase() ||
                x.name.toLowerCase() === args[0].toString().toLowerCase() ||
                x.name.toLowerCase() === `${args[0].toString().toLowerCase()} ${args[1].toString().toLowerCase()}`
        );
        if (!item) {
            return error("You can't buy an item that doesn't exist", message.channel);
        }
        if (item.canBuy == false) {
            return error(":thinking: You can't buy this item", message.channel);
        }
        let buyAmount = args
            .join(" ")
            .toString()
            .match(/([1-9][0-9]*)/);
        if (!buyAmount) buyAmount = 1;
        else buyAmount = buyAmount[0];
        if (item.price > user.coinsInWallet || buyAmount * item.price > user.coinsInWallet) {
            return error("This is so sad, YOU'RE TOO POOR", message.channel);
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
        success(`You bought **${parseInt(buyAmount).toLocaleString()}** \`${item.name}\``, message.channel);
    }
};
