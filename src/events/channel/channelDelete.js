require("dotenv/config");
const Event = require("../../structures/bases/eventBase");
const Embed = require("../../structures/embed");
const { channellogsModel } = require("../../database/models/export/index");

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            name: "channelDelete",
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
            if (channel.type === "text") {
                sendchannel.send(
                    new Embed()
                        .setColor("RED")
                        .setAuthor(channel.guild.name, channel.guild.iconURL())
                        .setDescription(`**Text Channel Deleted: \`#${channel.name}\`**`)
                        .setFooter(`ID: ${channel.id}`)
                        .setTimestamp(Date.now())
                );
            }

            if (channel.type === "news") {
                sendchannel.send(
                    new Embed()
                        .setColor("RED")
                        .setAuthor(channel.guild.name, channel.guild.iconURL())
                        .setDescription(`**Announcement Channel Deleted: \`#${channel.name}\`**`)
                        .setFooter(`ID: ${channel.id}`)
                        .setTimestamp(Date.now())
                );
            }

            if (channel.type === "voice") {
                sendchannel.send(
                    new Embed()
                        .setColor("RED")
                        .setAuthor(channel.guild.name, channel.guild.iconURL())
                        .setDescription(`**Voice Channel Deleted: \`#${channel.name}\`**`)
                        .setFooter(`ID: ${channel.id}`)
                        .setTimestamp(Date.now())
                );
            }
            if (channel.type === "store") {
                new Embed()
                    .setColor("RED")
                    .setAuthor(channel.guild.name, channel.guild.iconURL())
                    .setDescription(`**Store Channel Deleted: \`#${channel.name}\`**`)
                    .setFooter(`ID: ${channel.id}`)
                    .setTimestamp(Date.now());
            }
        } catch (err) {
            console.log(err);
        }
    }
};
