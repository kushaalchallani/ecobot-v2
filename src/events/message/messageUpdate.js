require("dotenv/config");
const Event = require("../../structures/bases/eventBase");
const Embed = require("../../structures/embed");
const { logsModel } = require("../../database/models/export/index");

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            name: "messageUpdate",
        });
    }

    async execute(oldMessage, newMessage) {
        if (!oldMessage.guild) return;
        if (!oldMessage.content) return;

        const { author } = oldMessage;

        if (oldMessage.author.bot) return;

        const data = await logsModel.findOne({
            guildId: oldMessage.guild.id,
        });

        if (!data) return;

        const channel = oldMessage.guild.channels.cache.find((channel) => channel.id === data.channelId);

        if (!channel) return;

        const embed = new Embed()
            .setColor("YELLOW")
            .setAuthor(`${author.username}#${author.discriminator}`, author.avatarURL({ dynamic: true }))
            .setDescription(
                `**Message edited in ${oldMessage.channel}** [Jump to Message](${oldMessage.url})\n\n
        **Before:** \n${oldMessage.content}
        **After:** \n${newMessage.content}`
            )
            .setTimestamp(Date.now())
            .setFooter(`Author: ${author.id}`);

        channel.send(embed);
    }
};
