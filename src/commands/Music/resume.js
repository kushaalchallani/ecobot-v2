const { redEmbed } = require("../../utils/export/index");
const Command = require("../../structures/bases/commandBase");
const Embed = require("../../structures/embed");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "resume",
            description: "Resume a paused song",
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
        if (serverQueue && !serverQueue.playing) {
            serverQueue.playing = true;
            serverQueue.connection.dispatcher.resume();
            const embed = new Embed()
                .setDescription("▶ Resumed the music for you!")
                .setColor("YELLOW")
                .setAuthor("Music has been Resumed!", "https://i.imgur.com/tZwBdli.gif");
            return message.channel.send(embed);
        }
        return redEmbed("There is nothing playing in this server.", message.channel);
    }
};
