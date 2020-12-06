require("dotenv/config");
const Event = require("../../structures/bases/eventBase");
const Embed = require("../../structures/embed");
const { rolelogsModel } = require("../../database/models/export/index");

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            name: "roleCreate",
        });
    }

    async execute(role) {
        const data = await rolelogsModel.findOne({
            guildId: role.guild.id,
        });

        if (!data) return;

        const channel = role.guild.channels.cache.find((channel) => channel.id === data.channelId);

        if (!channel) return;

        try {
            const fetchLogs = await role.guild.fetchAuditLogs({
                limit: 1,
                type: "ROLE_CREATE",
            });

            const log = fetchLogs.entries.first();

            const { executor } = log;

            channel.send(
                new Embed()
                    .setColor("#00FF00")
                    .setAuthor(
                        `${executor.username}#${executor.discriminator} (${executor.id})`,
                        executor.avatarURL({ dynamic: true })
                    )
                    .setDescription(
                        `**Role Created**
                    **Role Name:** ${role.name}
                    **Role ID:** ${role.id}
                    `
                    )
                    .setTimestamp(Date.now())
            );
        } catch (err) {
            console.log(err);
        }
    }
};
