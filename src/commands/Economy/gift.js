const Command = require("../../structures/bases/commandBase");

const itemss = require("../../structures/items");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "gift",
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
        const member =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]) ||
            message.guild.members.cache.find(
                (member) => member.user.username === args.slice(0).join(" ") || member.user.username === args[0]
            );
        if (!member) return message.channel.send("Who are you giving items to huh?");
        if (member.user.id == message.author.id) return message.channel.send("Lol you can't gift your self.");
        if (!args[1]) return message.channel.send("So you are giving nothing to them???");
        const userData = await this.client.fetchUser(member.user.id);
        const authoData = await this.client.fetchUser(message.author.id);
        if (!args[1]) args[1] = "";
        if (!args[2]) args[2] = "";
        const itemToGive = itemss.find(
            (x) =>
                x.name.toLowerCase() === args.join(" ").toString().toLowerCase() ||
                x.name.toLowerCase() === args[1].toString().toLowerCase() ||
                x.name.toLowerCase() === `${args[1].toString().toLowerCase()} ${args[2].toString().toLowerCase()}`
        );

        if (!itemToGive) return message.channel.send("That items doesn't even exist lol");

        const authoItem = authoData.items.find((i) => i.name.toLowerCase() == itemToGive.name.toLowerCase());

        const userItem = userData.items.find((i) => i.name.toLowerCase() == itemToGive.name.toLowerCase());

        if (!authoItem) return message.channel.send("You don't own that item.");

        let giveAmount = args
            .slice(1)
            .join(" ")
            .toString()
            .match(/([1-9][0-9]*)/);

        if (!giveAmount) giveAmount = 1;
        else giveAmount = giveAmount[0];

        if (parseInt(giveAmount) > parseInt(authoItem.amount))
            return message.channel.send(
                `You only have **${parseInt(authoItem.amount).toLocaleString()}** of that item`
            );

        const authorArray = authoData.items.filter((i) => i.name.toLowerCase() !== authoItem.name.toLowerCase());

        const userArray = userData.items.filter((i) => i.name.toLowerCase() !== authoItem.name.toLowerCase());

        if (!userItem) {
            userArray.push({
                name: itemToGive.name.toString(),
                amount: parseInt(giveAmount),
                description: itemToGive.description,
            });
            userData.items = userArray;
        } else {
            userArray.push({
                name: itemToGive.name.toString(),
                amount: parseInt(userItem.amount) + parseInt(giveAmount),
                description: itemToGive.description,
            });
            userData.items = userArray;
        }
        await userData.save();
        if (authoItem.amount - parseInt(giveAmount) == 0) {
            authoData.items = authorArray;
        } else {
            authorArray.push({
                name: itemToGive.name.toString(),
                amount: parseInt(authoItem.amount) - parseInt(giveAmount),
                description: itemToGive.description,
            });
            authoData.items = authorArray;
        }
        await authoData.save();

        message.channel.send(
            `You gave **${parseInt(giveAmount).toLocaleString()}** \`${itemToGive.name}\` to ${member.user}`
        );
    }
};
