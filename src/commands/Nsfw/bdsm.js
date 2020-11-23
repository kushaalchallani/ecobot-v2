const Command = require("../../structures/bases/commandBase");
const Embed = require("../../structures/embed");
const { nsfw } = require("../../json/exports/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "bdsm",
            description: "I do not like to be dominated, but these people do",
            category: "NSFW",
            ownerOnly: false,
            nsfw: true,
            cooldown: 3,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            premium: true,
        });
    }

    async execute(message) {
        const bdsm = nsfw.bdsm;
        const image = bdsm[Math.round(Math.random() * (bdsm.length - 1))];
        const avatar = message.author.displayAvatarURL({ format: "png", dynamic: true });

        const embed = new Embed()
            .setColor("RANDOM")
            .setTitle("I bet you like that 🤔")
            .setImage(image)
            .setFooter(`Requested by ${message.author.tag}`, avatar);
        return message.channel.send(embed);
    }
};
