const Command = require("../../structures/bases/commandBase");
const itemss = require("../../structures/items");
const Embed = require("../../structures/embed");

module.exports = class extends (
    Command
) {
    constructor(...args) {
        super(...args, {
            name: "shop",
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
        if (!args.join(" ") || !isNaN(args.join(" "))) {
            let amount = 5 * parseInt(args[0]);
            let page;
            if (!args[0]) {
                amount = 5;
            }
            let items = this.client.items.list().filter((x) => x.canBuy === true);
            items = items.slice(amount - 5, amount);
            items = items.map((x) => `**${x.name}** -- __${x.price.toLocaleString()} coins__\n${x.description}`);
            if (itemss.length <= 5) page = 1;
            else if (itemss.length <= 10) page = 2;
            else if (itemss.length <= 15) page = 3;
            else if (itemss.length <= 20) page = 4;
            const shopEmbed = new Embed()
                .setTitle("Air Shop")
                .setDescription(`${items.join("\n\n")}`)
                .setColor("RANDOM")
                .setFooter(`Page ${args[0] || 1} of ${page}`);
            message.channel.send(shopEmbed);
        } else {
            const item = itemss.find((x) => x.name.toLowerCase() === args.join(" ").toString().toLowerCase());
            if (!item) {
                return message.channel.send("Can't send an item that doesn't exist lmao");
            }
            let e;
            if (!item.canBuy) e = "Can't buy this item.";
            else {
                e = `**${item.price.toLocaleString()}** coins`;
            }
            const embed = new Embed()
                .setTitle(item.name)
                .setDescription(
                    `${
                        item.description
                    }\n\n**Price**: ${e}\n**Sell Amount**: **${item.sellAmount.toLocaleString()}** coins`
                )
                .setColor("RANDOM");
            message.channel.send(embed);
        }
    }
};
