const Command = require("../../structures/bases/commandBase");
const Embed = require("../../structures/embed");
const fetch = require("node-fetch");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "hentai",
            description: "take some real hentai.",
            category: "NSFW",
            ownerOnly: false,
            nsfw: true,
            cooldown: 3,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            aliases: ["animeporn"],
            premium: true,
        });
    }

    async execute(message) {
        const body = await fetch("https://nekos.life/api/v2/img/Random_hentai_gif").then((url) => url.json());

        const avatar = message.author.displayAvatarURL({ format: "png", dynamic: true });
        const hentaiEmbed = new Embed()
            .setColor("RANDOM")
            .setTitle("Take Your Hentai Gif Sir!")
            .setImage(body.url)
            .setFooter(`Requested by ${message.author.tag}`, avatar);

        message.channel.send(hentaiEmbed);
    }
};
