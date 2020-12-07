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
                type: "EMOJI_DELETE",
            });

            const log = fetchLogs.entries.first();

            const { executor } = log;

            if(emoji.animated) {
                channel.send(
                    new Embed()
                        .setColor("#FFFF00")
                        .setAuthor(
                            `${executor.username}#${executor.discriminator} (${executor.id})`,
                            executor.avatarURL({ dynamic: true })
                        )
                        .setDescription(
                        `Emoji ${emoji.name}(${emoji.id}) has been Deleted`
                        )
                        .setTitle("Emoji Deleted")
                        .setURL(emoji.url)
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
                        `Emoji ${emoji.name}(${emoji.id}) has been Deleted`
                        )
                        .setTitle("Emoji Deleted")
                        .setURL(emoji.url)
                        .setTimestamp(Date.now())
                );
            }

            
        } catch (err) {
            console.log(err);
        }
    }
};
