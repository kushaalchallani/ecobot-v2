const { redEmbed, error } = require("../../utils/export/index");
const Command = require("../../structures/bases/commandBase");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "stop",
            description: "Stop the music and clear the queue",
            category: "Music",
            ownerOnly: false,
            nsfw: false,
            cooldown: 15,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES", "CONNECT"],
        });
    }

    async execute(message) {
        const channel = message.member.voice.channel;
        if (!channel) return error("I'm sorry but you need to be in a voice channel to play music!", message.channel);
        const serverQueue = message.client.queue.get(message.guild.id);
        if (!serverQueue) return redEmbed("There is nothing playing that I could stop for you.", message.channel);
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end("Stop the music");
        message.react("✅");
    }
};
