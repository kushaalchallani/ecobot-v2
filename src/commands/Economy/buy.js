const Command = require("../../structures/bases/commandBase");
const { itemss } = require("../../utils/export/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "buy",
            description: "Search discord api documentation.",
            category: "Bot Owner",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
            cooldown: 10,
            examples: ["docs Client", "docs Message", "docs ClientUser#setActivity --src=master"],
        });
    }

    async execute(message, args) {
        const user = await this.client.fetchUser(message.author.id);
        if (!args.join(" ")) {
            return message.channel.send("you can't buy nothing lmao");
        }
        if (!args[1]) args[1] = "";
        const item = itemss.find(
            (x) =>
                x.name.toLowerCase() === args.join(" ").toString().toLowerCase() ||
                x.name.toLowerCase() === args[0].toString().toLowerCase() ||
                x.name.toLowerCase() === `${args[0].toString().toLowerCase()} ${args[1].toString().toLowerCase()}`
        );
        if (!item) {
            return message.channel.send("You can't buy an item that doesn't exist");
        }
        if (item.canBuy == false) {
            return message.channel.send(":thinking: You can't buy this item");
        }
        let buyAmount = args
            .join(" ")
            .toString()
            .match(/([1-9][0-9]*)/);
        if (!buyAmount) buyAmount = 1;
        else buyAmount = buyAmount[0];
        if (item.price > user.coinsInWallet || buyAmount * item.price > user.coinsInWallet) {
            return message.channel.send("This is so sad, YOU'RE TOO POOR");
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
        message.channel.send(`You bought **${parseInt(buyAmount).toLocaleString()}** \`${item.name}\``);
    }
};
