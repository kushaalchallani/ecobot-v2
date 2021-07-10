/* eslint-disable no-constant-condition */
require("dotenv/config");
const Event = require("../../structures/bases/eventBase");
const Embed = require("../../structures/embed");
const { serverlogsModel } = require("../../database/models/export/index");

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            name: "guildUpdate ",
        });
    }

    async execute(oldGuild, newGuild) {
        const data = await serverlogsModel.findOne({
            guildId: oldGuild.id,
        });

        if (!data) return;

        const sendchannel = oldGuild.channels.cache.find((channel) => channel.id === data.channelId);

        if (!sendchannel) return;

        let embed;

        // Guild name change

        if (oldGuild.name != newGuild.name) {
            embed = new Embed(this.client, newGuild)
                .setDescription("**Server name changed**")
                .setColor("YELLOW")
                .setAuthor(newGuild.name, newGuild.iconURL())
                .addField("Before:", oldGuild.name)
                .addField("After:", newGuild.name)
                .setTimestamp();

            sendchannel.send(embed);
        }

        // region change
        if (oldGuild.region != newGuild.region) {
            embed = new Embed(this.client, newGuild)
                .setDescription("**Server region changed**")
                .setAuthor(newGuild.name, newGuild.iconURL())
                .setColor("YELLOW")
                .addField("Before:", oldGuild.region)
                .addField("After:", newGuild.region)
                .setTimestamp();
            sendchannel.send(embed);
        }

        // Server's boost level has changed
        if (oldGuild.premiumTier != newGuild.premiumTier) {
            embed = new Embed(this.client, newGuild)
                .setDescription(
                    `**Server boost ${oldGuild.premiumTier < newGuild.premiumTier ? "increased" : "decreased"}**`
                )
                .setAuthor(newGuild.name, newGuild.iconURL())
                .setColor("YELlOW")
                .addField("Before:", oldGuild.premiumTier)
                .addField("After:", newGuild.premiumTier)
                .setTimestamp();
            sendchannel.send(embed);
        }

        // Server has got a new banner
        if (!oldGuild.banner && newGuild.banner) {
            embed = new Embed(this.client, newGuild)
                .setDescription("**Server banner changed**")
                .setColor("YELLOW")
                .setAuthor(newGuild.name, newGuild.iconURL())
                .addField("Before:", oldGuild.banner)
                .addField("After:", newGuild.banner)
                .setTimestamp();
            sendchannel.send(embed);
        }

        // Server has made a AFK channel
        if (!oldGuild.afkChannel && newGuild.afkChannel) {
            embed = new Embed(this.client, newGuild)
                .setDescription("**Server AFK channel changed**")
                .setAuthor(newGuild.name, newGuild.iconURL())
                .setColor("YELLOW")
                .addField("Before:", oldGuild.afkChannel)
                .addField("After:", newGuild.afkChannel)
                .setTimestamp();
            sendchannel.send(embed);
        }

        // Server now has a vanity URL
        if (!oldGuild.vanityURLCode && newGuild.vanityURLCode) {
            embed = new Embed(this.client, newGuild)
                .setDescription("**Server Vanity URL changed**")
                .setColor("YELLOW")
                .setAuthor(newGuild.name, newGuild.iconURL())
                .addField("Before:", oldGuild.vanityURLCode)
                .addField("After:", newGuild.vanityURLCode)
                .setTimestamp();
            sendchannel.send(embed);
        }
    }
};
