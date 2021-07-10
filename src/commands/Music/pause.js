const { error } = require("../../utils/export/index");
const Command = require("../../structures/bases/commandBase");
const Embed = require("../../structures/embed");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "pause",
            description: "Pause an currently playing song",
            category: "Music",
            ownerOnly: false,
            nsfw: false,
            cooldown: 10,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES", "CONNECT"],
        });
    }

    async execute(message) {
        const serverQueue = message.client.queue.get(message.guild.id);
        if (serverQueue && serverQueue.playing) {
            serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause();
            const embed = new Embed()
                .setColor("YELLOW")
                .setAuthor("Music has been paused!", "https://i.imgur.com/tZwBdli.gif");
            return message.channel.send(embed);
        }
        return error("There is nothing playing in this server.", message.channel);
    }
};
