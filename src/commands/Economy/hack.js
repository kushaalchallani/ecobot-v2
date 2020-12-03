const Command = require("../../structures/bases/commandBase");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "hack",
            description: "Search discord api documentation.",
            category: "Bot Owner",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
            cooldown: 10,
            bankSpace: 5,
            examples: ["docs Client", "docs Message", "docs ClientUser#setActivity --src=master"],
        });
    }

    async execute(message) {
        const author = await this.client.fetchUser(message.author.id);
        if (author.coinsInWallet < 200)
            return message.channel.send("You need atleast **200** coins to use this command.");
        if (message.guild.members.cache == undefined)
            return message.channel.send("Seems like members here aren't cached.");
        if (message.guild.memberCount < 2)
            return message.channel.send("This server has less than 5 members, you can't use this command.");
        const members = message.guild.members.cache
            .filter((x) => x.user.id != message.author.id && !x.user.bot)
            .array();
        const random = Math.floor(Math.random() * members.length);
        const memberPicked = members[random];
        const target = await this.client.fetchUser(memberPicked.user.id);
        const randomNumber = Math.floor(Math.random() * 100) + 100;

        const msg = await message.channel.send("**Searching for a target to hack...**");

        setTimeout(async () => {
            if (target.coinsInWallet < randomNumber) {
                author.coinsInWallet -= randomNumber;
                target.coinsInWallet += randomNumber;

                await author.save();
                await target.save();
                msg.delete();
                message.channel.send(
                    `Turns out **${memberPicked.user.tag}** Didn't have much coins so you end up paying them **${randomNumber}** coins...`
                );
            } else {
                author.coinsInWallet += randomNumber;
                target.coinsInWallet -= randomNumber;

                await author.save();
                await target.save();
                msg.delete();
                message.channel.send(`You hacked **${memberPicked.user.tag}** and gained **${randomNumber}** coins.`);
            }
        }, 5000);
        return true;
    }
};
