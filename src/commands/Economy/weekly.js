const Command = require("../../structures/bases/commandBase");
const Embed = require("../../structures/embed");
const prettyMilliseconds = require("pretty-ms");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "weekly",
            description: "Get your weekly coins",
            category: "Economy",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
            premium: true,
            bankSpace: 0,
        });
    }

    async execute(message, prefix) {
        const user = await this.client.util.fetchUser(message.author.id);
        if (Date.parse(user.weeklyStreak) + 604800000 > Date.now()) {
            const embed = new Embed()
                .setTitle("**Slow it down!**")
                .setDescription(
                    `Woah there, Your wifi is down. Wait \`${prettyMilliseconds(
                        Date.parse(user.weeklyStreak) + 604800000 - Date.now()
                    )}\` before hacking again.
            
            The default cooldown on this command is \`1w\``
                )
                .setColor(0x3c54b4);
            return message.channel.send(embed);
        } else {
            user.weeklyStreak = new Date(Date.now());
            user.coinsInWallet += 15000;
            await user.save();
            const claimed = new Embed()
                .setTitle(`Here are your daily coins, **${message.author.username}**`)
                .setDescription(
                    `**15000 Coins** were placed in your wallet\n\nYou can get your weekly and monthly coins by buying premium. Use \`${prefix}patreon\` and view the perks. [Click here](https://www.patreon.com/Ecoobot) to go patreon`
                )
                .setColor("RANDOM");
            message.channel.send(claimed);
        }
    }
};
