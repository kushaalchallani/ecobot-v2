const cache = {};
const { ghostPingModel } = require("../../database/models/export/index");
const Embed = require("../../structures/embed");

module.exports = (client) => {
    client.on("messageDelete", async (message) => {
        if (!message.author || message.author.bot || message.mentions.users.size === 0) {
            return;
        }

        let channelId = cache[message.guild.id];
        if (!channelId) {
            const result = await ghostPingModel.findById(message.guild.id);
            if (!result) {
                return;
            }

            channelId = result.channelId;
            cache[message.guild.id] = channelId;
        }

        const embed = new Embed()
            .setTitle("Possible Ghost Ping Detected!")
            .setDescription(`**Content:**\n${message.content}`)
            .addField("Channel", message.channel)
            .setColor("BLUE")
            .setTimestamp(Date.now())
            .addField("Message Author", message.author);

        const targetChannel = message.guild.channels.cache.get(channelId);
        if (!targetChannel) return;
        targetChannel.send(embed);
    });
};
