const Command = require("../../structures/bases/commandBase");
const { itemss, error, incorrect, success } = require("../../utils/export/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "gift",
            description: "Gift an item to a user.",
            category: "Bot Owner",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
            bankSpace: 5,
            cooldown: 20,
            examples: ["gift Brownie", "gift Axe", "gift Brownie 3"],
            usage: "<Item> [Amount]",
        });
    }

    async execute(message, args) {
        const member =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]) ||
            message.guild.members.cache.find(
                (member) => member.user.username === args.slice(0).join(" ") || member.user.username === args[0]
            );
        if (!member) return incorrect("Who are you giving items to huh?", message.channel);
        if (member.user.id == message.author.id) return error("Lol you can't gift your self.", message.channel);
        if (!args[1]) return incorrect("So you are giving nothing to them???", message.channel);
        const userData = await this.client.util.fetchUser(member.user.id);
        const authoData = await this.client.util.fetchUser(message.author.id);
        if (authoData.passive == true) {
            return error("You're in passive mode, turn it off to give others coins", message.channel);
        }

        if (userData.passive == true) {
            return error("That user is in passive mode, they can't recive any coins", message.channel);
        }

        if (!args[1]) args[1] = "";
        if (!args[2]) args[2] = "";
        const itemToGive = itemss.find(
            (x) =>
                x.name.toLowerCase() === args.join(" ").toString().toLowerCase() ||
                x.name.toLowerCase() === args[1].toString().toLowerCase() ||
                x.name.toLowerCase() === `${args[1].toString().toLowerCase()} ${args[2].toString().toLowerCase()}`
        );

        if (!itemToGive) return error("That items doesn't even exist lol", message.channel);

        const authoItem = authoData.items.find((i) => i.name.toLowerCase() == itemToGive.name.toLowerCase());

        const userItem = userData.items.find((i) => i.name.toLowerCase() == itemToGive.name.toLowerCase());

        if (!authoItem) return error("You don't own that item.", message.channel);

        let giveAmount = args
            .slice(1)
            .join(" ")
            .toString()
            .match(/([1-9][0-9]*)/);

        if (!giveAmount) giveAmount = 1;
        else giveAmount = giveAmount[0];

        if (parseInt(giveAmount) > parseInt(authoItem.amount))
            return error(
                `You only have **${parseInt(authoItem.amount).toLocaleString()}** of that item`,
                message.channel
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

        success(
            `You gave **${parseInt(giveAmount).toLocaleString()}** \`${itemToGive.name}\` to ${member.user}`,
            message.channel
        );
    }
};
