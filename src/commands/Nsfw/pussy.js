const Command = require("../../structures/bases/commandBase");
const Embed = require("../../structures/embed");
const fetch = require("node-fetch");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "pussy",
            description: "Come get some pussy. :D",
            category: "NSFW",
            ownerOnly: false,
            nsfw: true,
            cooldown: 3,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            aliases: ["porngif"],
            premium: true,
        });
    }

    async execute(message) {
        try {
            const avatar = message.author.displayAvatarURL({ format: "png", dynamic: true });
            const body = await fetch("https://nekobot.xyz/api/image?type=pussy").then((url) => url.json());
            const nsfwembed = new Embed()
                .setColor("RANDOM")
                .setTitle("Here take some, :cat:")
                .setImage(body.message)
                .setFooter(`Requested by ${message.author.tag}`, avatar);
            message.channel.send(nsfwembed);
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
