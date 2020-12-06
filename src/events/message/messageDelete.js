require("dotenv/config");
const Event = require("../../structures/bases/eventBase");
const Embed = require("../../structures/embed");
const { logsModel } = require("../../database/models/export/index");

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            name: "messageDelete",
        });
    }

    async execute(message) {
        if (!message.guild) return;
        const getlogs = await message.guild.fetchAuditLogs({
            limit: 1,
            type: "MESSAGE_DELETE",
        });

        const LOG = getlogs.entries.first();

        if (!LOG) return;

        const { executor } = LOG;

        const data = await logsModel.findOne({
            guildId: message.guild.id,
        });

        if (!data) return;

        const channel = message.guild.channels.cache.find((channel) => channel.id === data.channelId);

        if (!channel) return;

        const embed = new Embed()
            .setColor("#FF0000")
            .setAuthor(
                `${executor.username}#${executor.discriminator} (${executor.id})`,
                executor.avatarURL({ dynamic: true })
            )
            .setDescription(
                `Message ${message.id} deleted from ${message.channel}
                    **Content:** ${message.content}
                    **Deleted By:** ${executor.username}#${executor.discriminator}`
            )
            .setTimestamp(Date.now());

        channel.send(embed);
    }
};
