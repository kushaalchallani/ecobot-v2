const Embed = require("../../structures/embed");
const Command = require("../../structures/bases/commandBase");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "avatar",
            description: "Get yours or an mentioned user's avatar",
            aliases: ["av", "profilepic", "icon"],
            category: "Fun",
            cooldown: 3,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            usage: "[@user]",
            examples: ["avatar", "avatar @Gogeta#0069"],
            ownerOnly: false,
            nsfw: false,
        });
    }

    async execute(message) {
        const user = message.mentions.users.first() || message.author;

        const userinfo = {};
        userinfo.avatar = user.displayAvatarURL({ dynamic: true, size: 1024 });

        const embed = new Embed()
            .setAuthor(user.tag, userinfo.avatar)
            .setImage(userinfo.avatar)
            .setTimestamp()
            .setColor("RANDOM");
        return message.channel.send(embed);
    }
};
