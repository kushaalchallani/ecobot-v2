require("dotenv/config");
const Event = require("../../structures/bases/eventBase");
const Embed = require("../../structures/embed");
const { allYour } = require("aybabtu");
const { rolelogsModel } = require("../../database/models/export/index");

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            name: "roleUpdate",
        });
    }

    async execute(Brole, Arole) {
        const data = await rolelogsModel.findOne({
            guildId: Brole.guild.id,
        });

        if (!data) return;

        const channel = Brole.guild.channels.cache.find((channel) => channel.id === data.channelId);

        if (!channel) return;

        try {
            const fetchLogs = await Brole.guild.fetchAuditLogs({
                limit: 1,
                type: "ROLE_UPDATE",
            });

            const log = fetchLogs.entries.first();

            const { executor } = log;

            if (Brole.rawPosition !== Arole.rawPosition) return;

            channel.send(
                new Embed()
                    .setColor(Arole.color || "#FFFF00")
                    .setAuthor(
                        `${executor.username}#${executor.discriminator} (${executor.id})`,
                        executor.avatarURL({ dynamic: true })
                    )
                    .addFields(
                        {
                            name: "❯ Before:",
                            value: `**Name:** ${Brole.name} 
                        **Hex Color:** #${allYour("decimal").areBelongTo("hexdecimal")(Brole.color)}
                        **Mentionable:** ${Brole.mentionable}
                        **❯ Permissions:** \n\` ${Brole.permissions.toArray().join("\n") || "No Permission"}\`
                    `,
                            inline: true,
                        },
                        {
                            name: "❯ After:",
                            value: `**Name:** ${Arole.name} 
                        **Hex Color:** #${allYour("decimal").areBelongTo("hexdecimal")(Arole.color)}
                        **Mentionable:** ${Arole.mentionable}
                        **❯ Permissions:** \n\` ${Arole.permissions.toArray().join("\n") || "No Permission"}\`
                    `,
                            inline: true,
                        }
                    )
            );
        } catch (err) {
            console.log(err);
        }
    }
};
