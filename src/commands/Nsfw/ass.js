const Command = require("../../structures/bases/commandBase");
const Embed = require("../../structures/embed");
const fetch = require("node-fetch");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "ass",
            description: "Come get you some ass.",
            category: "NSFW",
            ownerOnly: false,
            nsfw: true,
            cooldown: 3,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            aliases: ["booty", "thicc", "butt"],
            premium: false,
        });
    }

    async execute(message) {
        try {
            const avatar = message.author.displayAvatarURL({ format: "png", dynamic: true });
            const body = await fetch("https://nekobot.xyz/api/image?type=ass").then((url) => url.json());
            const fourk = new Embed()
                .setColor("RANDOM")
                .setTitle("Takes some Thicc & Fresh Ass")
                .setImage(body.message)
                .setFooter(`Requested by ${message.author.tag}`, avatar);
            message.channel.send(fourk);
        } catch (error) {
            message.channel.send(
                new Embed()
                    .setTitle("An Error Occured!")
                    .setDescription(`**Error: ${error}**`)
                    .setColor(0xff0000)
                    .setFooter(message.guild.me.displayName)
                    .setTimestamp()
            );
        }
    }
};
