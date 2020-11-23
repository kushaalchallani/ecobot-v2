const { redEmbed } = require("../../utils/export/index");
const Command = require("../../structures/bases/commandBase");
const Embed = require("../../structures/embed");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "nowplaying",
            description: "See which music is currently playing in this server",
            category: "Music",
            ownerOnly: false,
            nsfw: false,
            cooldown: 10,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES", "CONNECT"],
            aliases: ["np"],
        });
    }

    async execute(message) {
        const serverQueue = message.client.queue.get(message.guild.id);
        if (!serverQueue) return redEmbed("There is nothing playing in this server.", message.channel);
        const song = serverQueue.songs[0];
        const thing = new Embed()
            .setAuthor("Now Playing", "https://i.imgur.com/tZwBdli.gif")
            .setThumbnail(song.img)
            .setColor("BLUE")
            .addField("Name", song.title, true)
            .addField("Duration", song.duration, true)
            .addField("Requested by", song.req.tag, true)
            .setFooter(`Views: ${song.views} | ${song.ago}`);
        return message.channel.send(thing);
    }
};
