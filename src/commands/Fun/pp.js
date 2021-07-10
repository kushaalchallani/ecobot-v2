const Embed = require("../../structures/embed");
const { pp } = require("../../json/exports/index");
const { ppsize } = pp;
const Command = require("../../structures/bases/commandBase");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "pp",
            description: "how big peepee",
            aliases: ["penis", "howbig", "peepee", "pickle"],
            category: "Fun",
            cooldown: 3,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            usage: "[user]",
            examples: ["pp"],
            ownerOnly: false,
            nsfw: false,
        });
    }

    async execute(message) {
        const fact = Math.floor(Math.random() * ppsize.length);
        const ppuser = message.mentions.users.first() || message.author;
        const embed = new Embed()
            .setTitle("PP Generator")
            .setDescription(
                `${ppuser.username}'s PP Size 
      8${ppsize[fact]}D`
            )
            .setColor("RANDOM");

        message.channel.send(embed);
    }
};
