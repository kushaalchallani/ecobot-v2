const Command = require("../../structures/bases/commandBase");
const Embed = require("../../structures/embed");
const { economyModel } = require("../../database/models/export/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "rich",
            description: "Search discord api documentation.",
            category: "Bot Owner",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
            cooldown: 10,
            bankSpace: 0,
            examples: ["docs Client", "docs Message", "docs ClientUser#setActivity --src=master"],
        });
    }

    async execute(message) {
        let data = await economyModel.find().sort([["coinsInWallet", "descending"]]);
        data = data
            .filter(
                (x) =>
                    message.guild.members.cache.get(x.userId) && message.guild.members.cache.get(x.userId).bot != true
            )
            .slice(0, 6);
        if (data.length == 0) return message.channel.send("No rich people in this server lmao");

        const emojis = [":first_place:", ":second_place:", ":third_place:"];
        data = data.map(
            (x, i) =>
                `${emojis[i] || "🔹"} **${x.coinsInWallet.toLocaleString()}** - ${
                    this.client.users.cache.get(x.userId).tag || "Unkown#0000"
                }`
        );

        const embed = new Embed()
            .setAuthor(`Richest people in ${message.guild.name}`)
            .setDescription(`${data.join("\n")}`)
            .setColor("RANDOM")
            .setFooter("wish I had that much money");
        message.channel.send(embed);
    }
};
