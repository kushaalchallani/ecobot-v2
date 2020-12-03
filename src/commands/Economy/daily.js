const Command = require("../../structures/bases/commandBase");
const prettyMilliseconds = require("pretty-ms");
const Embed = require("../../structures/embed");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "daily",
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
        const user = await this.client.fetchUser(message.author.id);
        if (Date.parse(user.dailyStreak) + 86400000 > Date.now()) {
            const embed = new Embed()
                .setTitle("Cooldown")
                .setDescription(
                    `Woah there, I cant give you so much money \`${prettyMilliseconds(
                        Date.parse(user.dailyStreak) + 86400000 - Date.now()
                    )}\` before using this command again.
                
                The default cooldown on this command is \`1d\``
                )
                .setColor(0x3c54b4);
            return message.channel.send(embed);
        } else {
            user.dailyStreak = new Date(Date.now());
            user.coinsInWallet += 1000;
            await user.save();
            const claimed = new Embed()
                .setTitle("Gave you 1000 coins.")
                .setDescription("Use this command in `24h` to claim your daily reward again!")
                .setColor("RANDOM");
            message.channel.send(claimed);
        }
    }
};
