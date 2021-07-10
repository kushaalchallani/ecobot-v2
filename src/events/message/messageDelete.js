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
            .setColor("RED")
            .setAuthor(`${executor.username}#${executor.discriminator}`, executor.avatarURL({ dynamic: true }))
            .setDescription(
                `**Message Sent By <@${executor.id}> deleted in ${message.channel}**
                ${message.content}`
            )
            .setTimestamp(Date.now())
            .setFooter(`Author: ${executor.id} | Messsage ID: ${message.id}`);

        channel.send(embed);
    }
};
