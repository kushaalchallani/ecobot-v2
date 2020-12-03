const Command = require("../../structures/bases/commandBase");

const Embed = require("../../structures/embed");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "gamble",
            description: "Search discord api documentation.",
            category: "Bot Owner",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
            bankSpace: 5,
            cooldown: 10,
            examples: ["docs Client", "docs Message", "docs ClientUser#setActivity --src=master"],
        });
    }

    async execute(message, args) {
        const botRoll = Math.floor(Math.random() * 13) + 1;
        const userChoice = Math.floor(Math.random() * 13) + 1;
        const userData = await this.client.fetchUser(message.author.id);
        if (userData.passive == true) return message.channel.send("You're in passive mode, turn it off to gamble");

        if (userData.coinsInWallet == 0) return message.channel.send("You don't have any coins to bet.");

        let betAmount = args[0];

        if (!betAmount || (isNaN(betAmount) && betAmount !== "all" && betAmount !== "max"))
            return message.channel.send("So how much coins are syou gambling again?");

        if (betAmount < 200) return message.channel.send("Sorry bud, you can only gamble **200+** coins");

        if (betAmount == "all" || betAmount == "max") betAmount = userData.coinsInWallet;
        else betAmount = parseInt(args[0]);

        if (betAmount > userData.coinsInWallet) {
            return message.channel.send("You don't have that much coins lol");
        }

        if (botRoll < userChoice) {
            const wonCoins = Math.round((Math.random() * userChoice + betAmount / 4) * 1.1);
            userData.coinsInWallet += parseInt(wonCoins);
            await userData.save();
            const wonEmbed = new Embed()
                .setColor("GREEN")
                .setDescription(
                    `Bot rolled: **${botRoll}**\nYou rolled: **${userChoice}**\nWin Rate: **${
                        Math.round(userChoice - botRoll) * 10
                    }%**\nYou won: **${wonCoins.toLocaleString()}** coins`
                )
                .setTitle("You Won!");
            message.channel.send(wonEmbed);
        } else if (botRoll == userChoice) {
            userData.coinsInWallet -= betAmount / 2;
            await userData.save();
            const tieEmbed = new Embed()
                .setColor("YELLOW")
                .setDescription(
                    `Bot rolled: **${botRoll}**\nYou rolled: **${userChoice}**\nYou lost: **${(
                        betAmount / 2
                    ).toLocaleString()}**`
                )
                .setTitle("Its a tie!");
            message.channel.send(tieEmbed);
        } else if (botRoll > userChoice) {
            const lostCoins = betAmount;
            userData.coinsInWallet -= parseInt(betAmount);
            await userData.save();
            const lostEmbed = new Embed()
                .setColor("RED")
                .setDescription(
                    `Bot rolled: **${botRoll}**\nYou rolled: **${userChoice}**\nYou lost: **${lostCoins.toLocaleString()}** coins`
                )
                .setTitle("You lost!");
            message.channel.send(lostEmbed);
        }
    }
};
