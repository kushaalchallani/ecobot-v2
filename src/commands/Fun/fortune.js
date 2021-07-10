const Embed = require("../../structures/embed");
const { fortune } = require("../../json/exports/index");
const Command = require("../../structures/bases/commandBase");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "fortune",
            description: "Know about your future",
            aliases: ["future", "life"],
            category: "Fun",
            cooldown: 3,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            ownerOnly: false,
            nsfw: false,
        });
    }

    async execute(message) {
        const avatar = message.author.displayAvatarURL({ format: "png" });

        const embed = new Embed()
            .setAuthor(`${message.author.username}'s fortune`, avatar)
            .setDescription(fortune[Math.round(Math.random() * (fortune.length - 1))])
            .setColor("#FAC193");
        return message.channel.send({ embed });
    }
};
