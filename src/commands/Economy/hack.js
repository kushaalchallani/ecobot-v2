const Command = require("../../structures/bases/commandBase");
const { error, success } = require("../../utils/export/index");
const Embed = require("../../structures/embed");
const prettyMilliseconds = require("pretty-ms");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "hack",
            description: "Hack a random member.",
            category: "Economy",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
            bankSpace: 5,
            cooldown: 60,
            aliases: ["randomrob"],
        });
    }

    async execute(message) {
        const author = await this.client.util.fetchUser(message.author.id);

        if (Date.parse(author.hackStreak) + 3600000 > Date.now()) {
            const embed = new Embed()
                .setTitle("**Slow it down!**")
                .setDescription(
                    `Woah there, I cant give you so much money. Wait \`${prettyMilliseconds(
                        Date.parse(author.hackStreak) + 3600000 - Date.now()
                    )}\` before using this command again.
            
            The default cooldown on this command is \`1d\``
                )
                .setColor(0x3c54b4);
            return message.channel.send(embed);
        } else {
            if (author.coinsInWallet < 200)
                return error("You need atleast **200** coins to use this command.", message.channel);
            if (message.guild.members.cache == undefined)
                return error("Seems like members here aren't cached.", message.channel);
            if (message.guild.memberCount < 2)
                return error("This server has less than 5 members, you can't use this command.", message.channel);
            const members = message.guild.members.cache
                .filter((x) => x.user.id != message.author.id && !x.user.bot)
                .array();
            const random = Math.floor(Math.random() * members.length);
            const memberPicked = members[random];
            const target = await this.client.util.fetchUser(memberPicked.user.id);
            const randomNumber = Math.floor(Math.random() * 100) + 100;

            const msg = await message.channel.send("**Searching for a target to hack...**");

            setTimeout(async () => {
                if (target.coinsInWallet < randomNumber) {
                    author.coinsInWallet -= randomNumber;
                    target.coinsInWallet += randomNumber;
                    author.hackStreak = new Date(Date.now());

                    await author.save();
                    await target.save();
                    msg.delete();
                    success(
                        `Turns out **${memberPicked.user.tag}** Didn't have much coins so you end up paying them **${randomNumber}** coins...`,
                        message.channel
                    );
                } else {
                    author.coinsInWallet += randomNumber;
                    target.coinsInWallet -= randomNumber;
                    author.hackStreak = new Date(Date.now());

                    await author.save();
                    await target.save();
                    msg.delete();
                    success(
                        `You hacked **${memberPicked.user.tag}** and gained **${randomNumber}** coins.`,
                        message.channel
                    );
                }
            }, 5000);
            return true;
        }
    }
};
