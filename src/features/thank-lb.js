const { thanklbModel, thanksModel } = require("../database/models/export/index");

const fetchTopMembers = async (guildId) => {
    let text = "";

    const results = await thanksModel
        .find({
            guildId,
        })
        .sort({
            received: -1,
        })
        .limit(10);

    for (let counter = 0; counter < results.length; ++counter) {
        const { userId, received = 0 } = results[counter];

        text += `#${counter + 1} <@${userId}> with ${received} thanks\n`;
    }

    text += "\nThis is updated every minute. Dont send any messages in this channel";

    return text;
};

const updateLeaderboard = async (client) => {
    const results = await thanklbModel.find({});

    for (const result of results) {
        const { channelId, _Id: guildId } = result;

        const guild = client.guilds.cache.get(guildId);
        if (guild) {
            const channel = guild.channels.cache.get(channelId);
            if (channel) {
                const messages = await channel.messages.fetch();
                const firstMessage = messages.first();

                const topMembers = await fetchTopMembers(guildId);

                if (firstMessage) {
                    firstMessage.edit(topMembers);
                } else {
                    channel.send(topMembers);
                }
            }
        }
    }

    setTimeout(() => {
        updateLeaderboard(client);
    }, 1000 * 60);
};

module.exports = async (client) => {
    updateLeaderboard(client);
};
