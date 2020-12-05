const { MessageEmbed } = require("discord.js");
const { suggestionModel } = require("../../database/models/export/index");

const statusMessages = {
    WAITING: {
        text: "📊 Waiting for community feedback, please vote!",
        color: 0xffea00,
    },
    ACCEPT: {
        text: "✅ Accepted idea! Expect this soon.",
        color: 0x34eb5b,
    },
    DENY: {
        text: "❌ Thank you for the feedback, but we are not interested in this idea at this time.",
        color: 0xc20808,
    },
};

const suggestionCache = {};

const fetchSuggestionChannels = async (guildId) => {
    const query = {};

    if (guildId) {
        query._id = guildId;
    }

    const results = await suggestionModel.find(query);

    for (const result of results) {
        const { _id, channelId } = result;
        suggestionCache[_id] = channelId;
    }
};

module.exports = (client) => {
    fetchSuggestionChannels();

    client.on("message", (message) => {
        const { guild, channel, content, member } = message;

        if (!guild) return;

        const cachedChannelId = suggestionCache[guild.id];
        if (!cachedChannelId) return;
        if (cachedChannelId && cachedChannelId === channel.id && !member.user.bot) {
            message.delete();

            const status = statusMessages.WAITING;

            const embed = new MessageEmbed()
                .setColor(status.color)
                .setAuthor(member.displayName, member.user.displayAvatarURL())
                .setDescription(content)
                .addFields({
                    name: "Status",
                    value: status.text,
                })
                .setFooter("Want to suggest something? Simply type it in this channel");

            channel.send(embed).then((message) => {
                message.react("👍").then(() => {
                    message.react("👎");
                });
            });
        }
    });
};

module.exports.fetchSuggestionChannels = fetchSuggestionChannels;

module.exports.statusMessages = statusMessages;

module.exports.suggestionCache = () => {
    return suggestionCache;
};
