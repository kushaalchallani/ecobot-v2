const Command = require("../../structures/bases/commandBase");
const Embed = require("../../structures/embed");
const { nsfw } = require("../../json/exports/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "blowjob",
            description: "Ok. I like blowjob",
            category: "NSFW",
            ownerOnly: false,
            nsfw: true,
            cooldown: 3,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            aliases: ["bjb"],
            premium: true,
        });
    }

    async execute(message) {
        const blowjob = nsfw.blowjob;
        const image = blowjob[Math.round(Math.random() * (blowjob.length - 1))];
        const avatar = message.author.displayAvatarURL({ format: "png", dynamic: true });

        const embed = new Embed()
            .setColor("RANDOM")
            .setTitle("Blowjob! I will take it :D")
            .setImage(image)
            .setFooter(`Requested by ${message.author.tag}`, avatar);
        return message.channel.send(embed);
    }
};
