require("dotenv/config");
const Event = require("../../structures/bases/eventBase");
const Embed = require("../../structures/embed");
const { logsModel } = require("../../database/models/export/index");

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            name: "messageUpdate",
        });
    }

    async execute(oldMessage, newMessage) {
        if (!oldMessage.guild) return;
        if (!oldMessage.content) return;

        const { author } = oldMessage;

        const data = await logsModel.findOne({
            guildId: oldMessage.guild.id,
        });

        if (!data) return;

        const channel = oldMessage.guild.channels.cache.find((channel) => channel.id === data.channelId);

        channel.send(
            new Embed()
                .setColor("#FFFF00")
                .setAuthor(
                    `${author.username}#${author.discriminator} (${author.id})`,
                    author.avatarURL({ dynamic: true })
                )
                .setDescription(
                    `Message ${oldMessage.id} edited in ${oldMessage.channel}
                **Before:** ${oldMessage.content}
                **After:** ${newMessage.content}`
                )
                .setTimestamp(Date.now())
        );
    }
};
