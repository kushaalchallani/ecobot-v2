/* eslint-disable no-constant-condition */
require("dotenv/config");
const Event = require("../../structures/bases/eventBase");
const Embed = require("../../structures/embed");
const { serverlogsModel } = require("../../database/models/export/index");

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            name: "guildBanAdd",
        });
    }

    async execute(guild, user) {
        const data = await serverlogsModel.findOne({
            guildId: guild.id,
        });

        if (!data) return;

        const sendchannel = guild.channels.cache.find((channel) => channel.id === data.channelId);

        if (!sendchannel) return;

        try {
            if (guild.partial) await guild.fetch();
            if (user.partial) await user.fetch();
        } catch (err) {
            console.log(err);
        }

        const embed = new Embed(this.client, guild)
            .setDescription(`User: ${user.toString()}`)
            .setColor("RED")
            .setAuthor("User banned:", user.displayAvatarURL())
            .setThumbnail(user.displayAvatarURL())
            .addField("Reason:", guild.reason ?? "No reason given")
            .setTimestamp()
            .setFooter(`ID: ${user.id}`);
        sendchannel.send(embed);
    }
};
