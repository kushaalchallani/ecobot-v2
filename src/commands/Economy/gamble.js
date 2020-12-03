const Command = require("../../structures/bases/commandBase");
const { error, incorrect } = require("../../utils/export/index");
const Embed = require("../../structures/embed");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "gamble",
            description: "Gamble Coins",
            category: "Economy",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            aliases: ["bet"],
            bankSpace: 5,
            cooldown: 60,
            usage: "<Amount>",
        });
    }

    async execute(message, args) {
        const botRoll = Math.floor(Math.random() * 13) + 1;
        const userChoice = Math.floor(Math.random() * 13) + 1;
        const userData = await this.client.util.fetchUser(message.author.id);
        if (userData.passive == true) return error("You're in passive mode, turn it off to gamble", message.channel);

        if (userData.coinsInWallet == 0) return error("You don't have any coins to bet.", message.channel);

        let betAmount = args[0];

        if (!betAmount || (isNaN(betAmount) && betAmount !== "all" && betAmount !== "max"))
            return incorrect("So how much coins are syou gambling again?", message.channel);

        if (betAmount < 200) return error("Sorry bud, you can only gamble **200+** coins", message.channel);

        if (betAmount == "all" || betAmount == "max") betAmount = userData.coinsInWallet;
        else betAmount = parseInt(args[0]);

        if (betAmount > userData.coinsInWallet) {
            return error("You don't have that much coins lol", message.channel);
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
