const Command = require("../../structures/bases/commandBase");
const { error } = require("../../utils/export/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "nuke",
            description: "Purge all messages in a channel. (Even Pins)",
            aliases: ["masspurge", "cleanchannel"],
            category: "Moderation",
            cooldown: 3,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_CHANNELS"],
            memberPermission: ["SEND_MESSAGES", "MANAGE_CHANNELS"],
            usage: "[channel]",
            examples: ["nuke", "nuke #general"],
            ownerOnly: false,
            nsfw: false,
        });
    }

    async execute(message, args) {
        message.delete();

        const channel =
            message.mentions.channels.last() || message.guild.channels.cache.get(args[0]) || message.channel;
        const posisi = channel.position;

        try {
            channel.clone().then((channel2) => {
                channel2.setPosition(posisi);
                channel.delete();
                channel2.send("✅ Nuked this channel", {
                    files: ["https://media.tenor.com/images/0754697c9c4dd44ca8504dbf1b36b927/tenor.gif"],
                });
            });
        } catch (err) {
            error(err, message.channel);
        }
    }
};
