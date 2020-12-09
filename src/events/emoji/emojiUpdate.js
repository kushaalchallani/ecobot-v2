require("dotenv/config");
const Event = require("../../structures/bases/eventBase");
const Embed = require("../../structures/embed");
const { serverlogsModel } = require("../../database/models/export/index");

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            name: "emojiUpdate",
        });
    }

    async execute(oldEmoji, newEmoji) {
        const data = await serverlogsModel.findOne({
            guildId: oldEmoji.guild.id,
        });

        if (!data) return;

        const channel = oldEmoji.guild.channels.cache.find((channel) => channel.id === data.channelId);

        if (!channel) return;

        try {
            const fetchLogs = await oldEmoji.guild.fetchAuditLogs({
                limit: 1,
                type: "EMOJI_",
            });

            const log = fetchLogs.entries.first();

            const { executor } = log;

            if (oldEmoji.animated) {
                channel.send(
                    new Embed()
                        .setColor("#FFFF00")
                        .setAuthor(
                            `${executor.username}#${executor.discriminator} (${executor.id})`,
                            executor.avatarURL({ dynamic: true })
                        )
                        .setDescription(
                            `Emoji ${oldEmoji.name}(${oldEmoji.id}) has been Updated
                        **Before:** [${oldEmoji.name}](${oldEmoji.url})
                        **After:** [${newEmoji.name}](${newEmoji.url})`
                        )
                        .setTitle("Emoji Updated")
                        .setTimestamp(Date.now())
                );
            } else {
                channel.send(
                    new Embed()
                        .setColor("#FFFF00")
                        .setAuthor(
                            `${executor.username}#${executor.discriminator} (${executor.id})`,
                            executor.avatarURL({ dynamic: true })
                        )
                        .setDescription(
                            `Emoji ${oldEmoji.name}(${oldEmoji.id}) has been Deleted
                        **Before:** [${oldEmoji.name}](${oldEmoji.url})
                        **After:** [${newEmoji.name}](${newEmoji.url})`
                        )
                        .setTitle("Emoji Updated")
                        .setTimestamp(Date.now())
                );
            }
        } catch (err) {
            console.log(err);
        }
    }
};
