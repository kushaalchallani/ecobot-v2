const Command = require("../../structures/bases/commandBase");
const Embed = require("../../structures/embed");
const fetch = require("node-fetch");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "porn",
            description: "Basically a porn video but with gifs",
            category: "NSFW",
            ownerOnly: false,
            nsfw: true,
            cooldown: 3,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            aliases: ["porngif"],
            premium: false,
        });
    }

    async execute(message) {
        try {
            const avatar = message.author.displayAvatarURL({ format: "png", dynamic: true });
            const body = await fetch("https://nekobot.xyz/api/image?type=pgif").then((url) => url.json());
            const nsfwembed = new Embed()
                .setColor("RANDOM")
                .setTitle("Here take some GIf ;)")
                .setImage(body.message)
                .setFooter(`Requested by ${message.author.tag}`, avatar);
            message.channel.send(nsfwembed);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log(error);
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
