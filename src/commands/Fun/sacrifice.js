const Embed = require("../../structures/embed");
const { sacrifice } = require("../../json/exports/index");
const { incorrect } = require("../../utils/export/index");
const Command = require("../../structures/bases/commandBase");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "sacrifice",
            description: "Sacrifice someone",
            aliases: ["offer"],
            category: "Fun",
            cooldown: 3,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            usage: "<@user>",
            examples: ["sacrifice @Gogeta#0069"],
            ownerOnly: false,
            nsfw: false,
        });
    }

    async execute(message) {
        const target = message.mentions.members.first();

        if (!target) {
            return incorrect("Please mention who to sacrifice");
        }

        if (target) {
            const embed = new Embed()
                .setTitle("A User was Sacrificed")
                .setColor("RANDOM")
                .setDescription(
                    `${message.author.username} sacrificed **${target.user.username}** to **` +
                        sacrifice[Math.floor(Math.random() * sacrifice.length)] +
                        "**"
                );
            return message.channel.send(embed);
        }
    }
};
