const { redEmbed, error } = require("../../utils/export/index");
const Command = require("../../structures/bases/commandBase");
const Embed = require("../../structures/embed");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "volume",
            description: "Change the server song queue volume",
            category: "Music",
            ownerOnly: false,
            nsfw: false,
            cooldown: 5,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES", "CONNECT"],
            aliases: ["v", "vol"],
        });
    }

    async execute(message, args) {
        const channel = message.member.voice.channel;
        if (!channel) return error("I'm sorry but you need to be in a voice channel to play music!", message.channel);
        const serverQueue = message.client.queue.get(message.guild.id);
        if (!serverQueue) return redEmbed("There is nothing playing in this server.", message.channel);
        if (!args[0]) return message.channel.send(`The current volume is: **${serverQueue.volume}**`);
        serverQueue.volume = args[0];
        serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 5);
        const embed = new Embed()
            .setDescription(`I set the volume to: **${args[0] / 5}/5**(it will be divied by 5)`)
            .setAuthor("Server Volume Manager", "https://i.imgur.com/tZwBdli.gif")
            .setColor("BLUE");
        return message.channel.send(embed);
    }
};
