require("dotenv/config");
const Event = require("../../structures/bases/eventBase");
const Embed = require("../../structures/embed");
const { serverlogsModel } = require("../../database/models/export/index");

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            name: "emojiCreate",
        });
    }

    async execute(emoji) {
        const data = await serverlogsModel.findOne({
            guildId: emoji.guild.id,
        });

        if (!data) return;

        const channel = emoji.guild.channels.cache.find((channel) => channel.id === data.channelId);

        if (!channel) return;

        try {
            const fetchLogs = await emoji.guild.fetchAuditLogs({
                limit: 1,
                type: "EMOJI_CREATE",
            });

            const log = fetchLogs.entries.first();

            const { executor } = log;

            if (emoji.animated) {
                channel.send(
                    new Embed()
                        .setColor("GREEN")
                        .setAuthor(
                            `${executor.username}#${executor.discriminator}`,
                            executor.avatarURL({ dynamic: true })
                        )
                        .setDescription(`Animated Emoji **${emoji.name}** has been created`)
                        .setTitle("Emoji Created")
                        .setThumbnail(emoji.url)
                        .setTimestamp(Date.now())
                        .setFooter(`ID: ${emoji.id}`)
                );
            } else {
                channel.send(
                    new Embed()
                        .setColor("GREEN")
                        .setAuthor(
                            `${executor.username}#${executor.discriminator}`,
                            executor.avatarURL({ dynamic: true })
                        )
                        .setDescription(`Emoji **${emoji.name}** has been created`)
                        .setTitle("Emoji Created")
                        .setThumbnail(emoji.url)
                        .setTimestamp(Date.now())
                        .setFooter(`ID: ${emoji.id}`)
                );
            }
        } catch (err) {
            console.log(err);
        }
    }
};
