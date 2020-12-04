const Command = require("../../structures/bases/commandBase");
const Embed = require("../../structures/embed");
const { error } = require("../../utils/export/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "inventory",
            description: "Sends your inventory.",
            category: "Economy",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
            cooldown: 10,
            bankSpace: 0,
            aliases: ["inv"],
        });
    }

    async execute(message, args) {
        const user = await this.client.util.fetchUser(message.author.id);
        let number = 5 * parseInt(args[0]);
        let page;
        if (user.items.length <= 5) page = 1;
        else if (user.items.length <= 10) page = 2;
        else if (user.items.length <= 15) page = 3;
        else if (user.items.length <= 20) page = 4;
        if (!args[0]) {
            number = 5;
        }
        const item = user.items.slice(number - 5, number);
        if (item.length < 1) {
            return error("You have no items.", message.channel);
        }
        const items = item.map((x) => `**${x.name}** - ${x.amount.toLocaleString()}\n${x.description}`);
        const embed = new Embed()
            .setTitle(`${message.author.username}'s Inventory`)
            .setDescription(`${items.join("\n\n")}`)
            .setFooter(`Page ${args[0] || 1} of ${page}`)
            .setColor("RANDOM");
        message.channel.send(embed);
    }
};
