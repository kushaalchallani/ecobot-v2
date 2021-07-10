const { error } = require("../../utils/export/index");
const Embed = require("../../structures/embed");
const Command = require("../../structures/bases/commandBase");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "skip",
            description: "Skip the currently playing song",
            category: "Music",
            ownerOnly: false,
            nsfw: false,
            cooldown: 30,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES", "CONNECT"],
            aliases: ["s"],
        });
    }

    async execute(message) {
        const channel = message.member.voice.channel;
        if (!channel) return error("I'm sorry but you need to be in a voice channel to play music!", message.channel);
        const serverQueue = message.client.queue.get(message.guild.id);
        if (!serverQueue) return error("There is nothing playing that I could skip for you.", message.channel);
        serverQueue.connection.dispatcher.end("Skiped the music");

        const embed = new Embed()
            .setColor("YELLOW")
            .setAuthor("Music has been skipped!", "https://i.imgur.com/tZwBdli.gif");
        return message.channel.send(embed);
    }
};
