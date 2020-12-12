const Command = require("../../structures/bases/commandBase");
const { itemss } = require("../../utils/export/index");
const Embed = require("../../structures/embed");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "sell",
            description: "Sell the item that is in your inventory",
            category: "Economy",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
            cooldown: 20,
            bankSpace: 0,
            examples: ["sell Brownie", "sell Axe"],
        });
    }

    async execute(message, args) {
        const user = await this.client.util.fetchUser(message.author.id);
        if (!args.join(" ")) {
            return message.channel.send("you can't sell nothing lmao");
        }
        if (!args[1]) args[1] = "";
        const item = itemss.find(
            (x) =>
                x.name.toLowerCase() === args.join(" ").toString().toLowerCase() ||
                x.name.toLowerCase() === args[0].toString().toLowerCase() ||
                x.name.toLowerCase() === `${args[0].toString().toLowerCase()} ${args[1].toString().toLowerCase()}`
        );
        let sellAmount = args
            .join(" ")
            .toString()
            .match(/([1-9][0-9]*)/);
        if (!sellAmount) sellAmount = 1;
        else sellAmount = sellAmount[0];
        if (!item) {
            return message.channel.send("can't sell this item");
        }
        const founditem = user.items.find((x) => x.name.toLowerCase() === item.name.toLowerCase());
        let array = [];
        array = user.items.filter((x) => x.name !== item.name);
        if (!founditem) {
            return message.channel.send("you don't have this item");
        }
        if (args[1] == "all" || args[2] == "all") {
            sellAmount = Math.floor(founditem.amount * item.sellAmount);
            user.items = array;
            user.coinsInWallet += sellAmount;
            user.save();
            const embed = new Embed()
                .setAuthor("Sold")
                .setDescription(
                    `You sold ${parseInt(sellAmount / item.sellAmount).toLocaleString()} **${
                        item.name
                    }** for \`${sellAmount.toLocaleString()}\` coins`
                )
                .setColor("RANDOM");
            return message.channel.send(embed);
        }
        if (founditem.amount < parseInt(sellAmount))
            return message.channel.send(`You only have ${founditem.amount} of this item`);
        if (founditem.amount === 1) {
            user.items = array;
            await user.save();
        } else if (founditem.amount - parseInt(sellAmount) == 0) {
            user.items = array;
            await user.save();
        } else {
            array.push({
                name: item.name,
                amount: founditem.amount - parseInt(sellAmount),
                description: item.description,
            });
            user.items = array;
            await user.save();
        }
        user.coinsInWallet += item.sellAmount * parseInt(sellAmount);
        await user.save();
        const embed = new Embed()
            .setAuthor("Sold")
            .setDescription(
                `You sold ${parseInt(sellAmount).toLocaleString()} **${item.name}** for \`${parseInt(
                    item.sellAmount * sellAmount
                ).toLocaleString()}\` coins`
            )
            .setColor("RANDOM");
        message.channel.send(embed);
    }
};
