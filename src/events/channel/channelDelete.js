require("dotenv/config");
const Event = require("../../structures/bases/eventBase");
const Embed = require("../../structures/embed");
const { channellogsModel } = require("../../database/models/export/index");

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            name: "channelCreate",
        });
    }

    async execute(channel) {
        const data = await channellogsModel.findOne({
            guildId: channel.guild.id,
        });

        if (!data) return;

        const sendchannel = channel.guild.channels.cache.find((channel) => channel.id === data.channelId);

        if (!sendchannel) return;

        try {
            const fetchLogs = await channel.guild.fetchAuditLogs({
                limit: 1,
                type: "CHANNEL_DELETE",
            });

            const log = fetchLogs.entries.first();

            const { executor } = log;

            if (channel.type === "text") {
                sendchannel.send(
                    new Embed()
                        .setColor("#FF0000")
                        .setAuthor(
                            `${executor.username}#${executor.discriminator} (${executor.id})`,
                            executor.avatarURL({ dynamic: true })
                        )
                        .setDescription(`Text Channel \`${channel.name}\` has been deleted`)
                        .setTimestamp(Date.now())
                );
            }

            if (channel.type === "news") {
                sendchannel.send(
                    new Embed()
                        .setColor("#FF0000")
                        .setAuthor(
                            `${executor.username}#${executor.discriminator} (${executor.id})`,
                            executor.avatarURL({ dynamic: true })
                        )
                        .setDescription(`Announcement Channel \`${channel.name}\` has been deleted`)
                        .setTimestamp(Date.now())
                );
            }

            if (channel.type === "voice") {
                sendchannel.send(
                    new Embed()
                        .setColor("#FF0000")
                        .setAuthor(
                            `${executor.username}#${executor.discriminator} (${executor.id})`,
                            executor.avatarURL({ dynamic: true })
                        )
                        .setDescription(`Announcement Channel \`${channel.name}\` has been deleted`)
                        .setTimestamp(Date.now())
                );
            }
        } catch (err) {
            console.log(err);
        }
    }
};
