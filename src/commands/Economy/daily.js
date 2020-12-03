const Command = require("../../structures/bases/commandBase");
const prettyMilliseconds = require("pretty-ms");
const Embed = require("../../structures/embed");
const { prefixModel } = require("../../database/models/export/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "daily",
            description: "Get your Daily coins and spend em!",
            category: "Economy",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
            premium: false,
            bankSpace: 0,
        });
    }

    async execute(message) {
        const prefix = (await prefixModel.findOne({ guildID: message.guild.id }))
            ? (await prefixModel.findOne({ guildID: message.guild.id })).prefix
            : this.client.prefix;

        const user = await this.client.util.fetchUser(message.author.id);
        if (Date.parse(user.dailyStreak) + 86400000 > Date.now()) {
            const embed = new Embed()
                .setTitle("**Slow it down!**")
                .setDescription(
                    `Woah there, I cant give you so much money. Wait \`${prettyMilliseconds(
                        Date.parse(user.dailyStreak) + 86400000 - Date.now()
                    )}\` before using this command again.
                
                The default cooldown on this command is \`1d\``
                )
                .setColor(0x3c54b4);
            return message.channel.send(embed);
        } else {
            user.dailyStreak = new Date(Date.now());
            user.coinsInWallet += 2000;
            await user.save();
            const claimed = new Embed()
                .setTitle(`Here are your daily coins, **${message.author.username}**`)
                .setDescription(
                    `**2000 Coins** were placed in your wallet\n\nYou can get your weekly and monthly coins by buying premium. Use \`${prefix}patreon\` and view the perks. [Click here](https://www.patreon.com/Ecoobot) to go patreon`
                )
                .setColor("RANDOM");
            message.channel.send(claimed);
        }
    }
};
