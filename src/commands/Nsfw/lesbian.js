const Command = require("../../structures/bases/commandBase");
const Embed = require("../../structures/embed");
const { nsfw } = require("../../json/exports/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "lesbian",
            description: "Have some girls. Coz guys aren't enought for you?",
            category: "NSFW",
            ownerOnly: false,
            nsfw: true,
            cooldown: 3,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            aliases: ["girlongirl"],
            premium: true,
        });
    }

    async execute(message) {
        const lesbian = nsfw.lesbian;
        const image = lesbian[Math.round(Math.random() * (lesbian.length - 1))];
        const avatar = message.author.displayAvatarURL({ format: "png", dynamic: true });

        const embed = new Embed()
            .setColor("RANDOM")
            .setTitle("Here, take some lesbian porn.")
            .setImage(image)
            .setFooter(`Requested by ${message.author.tag}`, avatar);
        return message.channel.send(embed);
    }
};
