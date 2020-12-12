const Command = require("../../structures/bases/commandBase");
const { itemss } = require("../../utils/export/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "use",
            description: "Use the items you bought from the shop",
            category: "Economy",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
            cooldown: 10,
            bankSpace: 0,
            examples: ["use Brownie", "use Axe"],
        });
    }

    async execute(message, args) {
        const user = await this.client.util.fetchUser(message.author.id);
        if (!args.join(" ")) {
            return message.channel.send("you can't use nothing lmao");
        }
        const item = itemss.find((x) => x.name.toLowerCase() === args.join(" ").toString().toLowerCase());
        if (!item) {
            return message.channel.send("can't use this item");
        }
        if (!item.canUse) {
            return message.channel.send(":thinking: You can't use this item");
        }
        const founditem = user.items.find((x) => x.name.toLowerCase() === item.name.toLowerCase());
        let array = [];
        array = user.items.filter((x) => x.name !== item.name);
        if (!founditem) {
            return message.channel.send("you don't have this item");
        }

        if (item.keep == false) {
            if (founditem.amount === 1) {
                user.items = user.items.filter((x) => x.name.toLowerCase() != item.name.toLowerCase());
                await user.save();
            } else {
                array.push({
                    name: item.name,
                    amount: founditem.amount - 1,
                    description: item.description,
                });
                user.items = array;
                await user.save();
            }
        }
        await item.run(this.client, message, args);
    }
};
