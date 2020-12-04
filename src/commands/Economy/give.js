const Command = require("../../structures/bases/commandBase");
const { error, incorrect, success } = require("../../utils/export/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "give",
            description: "Give your coins to a user",
            category: "Economy",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            cooldown: 20,
            bankSpace: 0,
            examples: ["give @Gogeta#2869 420", "give @Gogeta#2869 69", "give @Gogeta#2869 all"],
            usage: "<user> <Amount || All>",
            aliases: ["share", "sharecoins"],
        });
    }

    async execute(message, args) {
        const authorData = await this.client.util.fetchUser(message.author.id);
        if (authorData.passive == true)
            return error("You're in passive mode, turn it off to give others coins", message.channel);
        const member =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]) ||
            message.guild.members.cache.find(
                (member) => member.user.username === args.slice(0).join(" ") || member.user.username === args[0]
            );

        if (!member || !args[0]) {
            return incorrect("Who are you giving the coins to?", message.channel);
        }

        if (member.user.id == message.author.id)
            return error("Lol you can't give yourself coins u crazy.", message.channel);

        if (!args[1]) {
            return incorrect("How much coins are you giving them?", message.channel);
        }

        if (isNaN(args[1]) && args[1] != "all") {
            return error("Thats not a valid option", message.channel);
        }
        const userData = await this.client.util.fetchUser(member.user.id);
        if (userData.passive == true)
            return error("That user is in passive mode, they can't recive any coins", message.channel);
        if (args[1] == "all") {
            const toGive = authorData.coinsInWallet;

            authorData.coinsInWallet = 0;

            await authorData.save();

            userData.coinsInWallet = userData.coinsInWallet + toGive;

            userData.save();

            success(`You gave ${member} **${parseInt(toGive).toLocaleString()}** coins`, message.channel);
        } else {
            const toGive = args[1];

            if (toGive > authorData.coinsInWallet) return error("You don't have that much coins", message.channel);

            authorData.coinsInWallet = authorData.coinsInWallet - parseInt(toGive);
            userData.coinsInWallet = userData.coinsInWallet + parseInt(toGive);

            await authorData.save();
            await userData.save();

            success(`You gave ${member} **${parseInt(toGive).toLocaleString()}** coins`), message.channel;
        }
    }
};
