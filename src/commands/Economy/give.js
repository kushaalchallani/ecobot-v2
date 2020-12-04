const Command = require("../../structures/bases/commandBase");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "give",
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

    async execute(message, args) {
        const authorData = await this.client.util.fetchUser(message.author.id);
        if (authorData.passive == true)
            return message.channel.send("You're in passive mode, turn it off to give others coins");
        const member =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]) ||
            message.guild.members.cache.find(
                (member) => member.user.username === args.slice(0).join(" ") || member.user.username === args[0]
            );

        if (!member || !args[0]) {
            return message.channel.send("Who are you giving the coins to?");
        }

        if (member.user.id == message.author.id)
            return message.channel.send("Lol you can't give yourself coins u crazy.");

        if (!args[1]) {
            return message.channel.send("How much coins are you giving them?");
        }

        if (isNaN(args[1]) && args[1] != "all") {
            return message.channel.send("Thats not a valid option");
        }
        const userData = await this.client.fetchUser(member.user.id);
        if (userData.passive == true)
            return message.channel.send("That user is in passive mode, they can't recive any coins");
        if (args[1] == "all") {
            const toGive = authorData.coinsInWallet;

            authorData.coinsInWallet = 0;

            await authorData.save();

            userData.coinsInWallet = userData.coinsInWallet + toGive;

            userData.save();

            message.channel.send(`You gave ${member} **${parseInt(toGive).toLocaleString()}** coins`);
        } else {
            const toGive = args[1];

            if (toGive > authorData.coinsInWallet) return message.reply("You don't have that much coins");

            authorData.coinsInWallet = authorData.coinsInWallet - parseInt(toGive);
            userData.coinsInWallet = userData.coinsInWallet + parseInt(toGive);

            await authorData.save();
            await userData.save();

            message.channel.send(`You gave ${member} **${parseInt(toGive).toLocaleString()}** coins`);
        }
    }
};
