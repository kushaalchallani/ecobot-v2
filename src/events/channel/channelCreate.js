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
        if (!channel.guild) return;
        if (!channel.content) return;

        const data = await channellogsModel.findOne({
            guildId: channel.guild.id,
        });

        if (!data) return;

        const sendchannel = channel.guild.channels.cache.find((channel) => channel.id === data.channelId);

        if (!sendchannel) return;

        try {
            if (channel.type === "text") {
                sendchannel.send(
                    new Embed()
                        .setColor("#00FF00")
                        .setAuthor(channel.guild.name, channel.guild.iconURL())
                        .setDescription(`**Text Channel Created: \`#${channel.name}\`**`)
                        .setFooter(`ID: ${channel.id}`)
                        .setTimestamp(Date.now())
                );
            }

            if (channel.type === "news") {
                sendchannel.send(
                    new Embed()
                        .setColor("#00FF00")
                        .setAuthor(channel.guild.name, channel.guild.iconURL())
                        .setDescription(`**Announcement Channel Created: \`#${channel.name}\`**`)
                        .setFooter(`ID: ${channel.id}`)
                        .setTimestamp(Date.now())
                );
            }

            if (channel.type === "voice") {
                sendchannel.send(
                    new Embed()
                        .setColor("#00FF00")
                        .setAuthor(channel.guild.name, channel.guild.iconURL())
                        .setDescription(`**Voice Channel Created: \`#${channel.name}\`**`)
                        .setFooter(`ID: ${channel.id}`)
                        .setTimestamp(Date.now())
                );
            }
            if (channel.type === "store") {
                new Embed()
                    .setColor("#00FF00")
                    .setAuthor(channel.guild.name, channel.guild.iconURL())
                    .setDescription(`**Store Channel Created: \`#${channel.name}\`**`)
                    .setFooter(`ID: ${channel.id}`)
                    .setTimestamp(Date.now());
            }
        } catch (err) {
            console.log(err);
        }
    }
};
