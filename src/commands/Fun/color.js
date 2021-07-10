const Embed = require("../../structures/embed");
const { incorrect } = require("../../utils/export/index");
const Command = require("../../structures/bases/commandBase");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "color",
            description: "Get a random color or know the color using an hex code",
            aliases: ["colour"],
            category: "Fun",
            cooldown: 3,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            usage: "[hex code]]",
            examples: ["color", "color #00ff00"],
            ownerOnly: false,
            nsfw: false,
        });
    }

    async execute(message) {
        const color = message.content.split(/\s+/g).slice(1).join(" ");

        if (!color) {
            const genColour = "#" + Math.floor(Math.random() * 16777215).toString(16);
            const embed = new Embed()
                .setColor(genColour)
                .setImage(`https://dummyimage.com/50/${genColour.slice(1)}/&text=%20`)
                .setFooter(genColour);
            return message.channel.send("Here's an random color!", { embed: embed });
        }

        if (
            (color.indexOf("#") === 0 && color.length === 7) ||
            (!isNaN(color) && color.length <= 8 && color < 16777215)
        ) {
            const embed = await new Embed()
                .setColor(color)
                .setImage(`https://dummyimage.com/50/${color.slice(1)}/&text=%20`)
                .setFooter(color);
            return message.channel.send({ embed });
        } else {
            return incorrect("Invalid Parameters!", message.channel);
        }
    }
};
