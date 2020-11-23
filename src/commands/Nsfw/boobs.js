const Command = require("../../structures/bases/commandBase");
const Embed = require("../../structures/embed");
const { nsfw } = require("../../json/exports/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "boobs",
            description: "See some cute ~~birbs~~ boobs!",
            category: "NSFW",
            ownerOnly: false,
            nsfw: true,
            cooldown: 3,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            aliases: ["boobies", "tits"],
            premium: true,
        });
    }

    async execute(message) {
        const boobs = nsfw.boobs;
        const image = boobs[Math.round(Math.random() * (boobs.length - 1))];
        const avatar = message.author.displayAvatarURL({ format: "png", dynamic: true });

        const embed = new Embed()
            .setColor("RANDOM")
            .setTitle("Here, take some boobs.")
            .setImage(image)
            .setFooter(`Requested by ${message.author.tag}`, avatar);
        return message.channel.send(embed);
    }
};
