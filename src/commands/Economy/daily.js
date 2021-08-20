const Embed = require("../../structures/embed");
const Command = require("../../structures/bases/commandBase");
const tick = "<:big_tick:876015832617086986>";
const warn = "<:haze_red:876015832554164244>";
const prettyMilliseconds = require("pretty-ms");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "daily",
            description: "Get your coins rewards",
            category: "Economy",
            cooldown: 1,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            ownerOnly: false,
            nsfw: false,
            bankspace: 30,
        });
    }

    async execute(message) {
        const user = await this.client.util.fetchUser(message.author.id);
        if (Date.parse(user.dailyStreak) + 86400000 > Date.now()) {
            const embed = new Embed()
                .setDescription(
                    `${warn} This command is on Cooldown\n\n Woah there, you need to wait \`${prettyMilliseconds(
                        Date.parse(user.dailyStreak) + 86400000 - Date.now()
                    )}\` before using this command again.\n\nThe default cooldown on this command is \`1d\`.`
                )
                .setColor("RED");
            return message.channel.send(embed);
        } else {
            const claimed = new Embed()
                .setDescription(
                    `${tick} You were given \`2500\` coins! Use this command in \`24h\` to claim your daily reward again!`
                )
                .setColor("GREEN");
            message.channel.send(claimed);
            user.coinsInWallet += 2500;
            user.save().then((user.dailyStreak = new Date(Date.now())));
        }
    }
};
