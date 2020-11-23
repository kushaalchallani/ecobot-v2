const { redEmbed } = require("../../utils/export/index");
const Command = require("../../structures/bases/commandBase");
const Embed = require("../../structures/embed");
const { prefixModel } = require("../../database/models/export/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "queue",
            description: "See the server song queue",
            category: "Music",
            ownerOnly: false,
            nsfw: false,
            cooldown: 5,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES", "CONNECT"],
            aliases: ["q", "list", "songlist", "song-list"],
        });
    }

    async execute(message) {
        const prefix = (await prefixModel.findOne({ guildID: message.guild.id }))
            ? (await prefixModel.findOne({ guildID: message.guild.id })).prefix
            : this.client.prefix;

        const serverQueue = message.client.queue.get(message.guild.id);
        if (!serverQueue) return redEmbed("There is nothing playing in this server.", message.channel);

        const queue = new Embed()
            .setAuthor("Server Songs Queue", "https://i.imgur.com/tZwBdli.gif")
            .setColor("BLUE")
            .addField("Now Playing", serverQueue.songs[0].title, true)
            .addField("Text Channel", serverQueue.textChannel, true)
            .addField("Voice Channel", serverQueue.voiceChannel, true)
            .setDescription(
                serverQueue.songs
                    .map((song) => {
                        if (song === serverQueue.songs[0]) return;
                        return `**-** ${song.title}`;
                    })
                    .join("\n")
            )
            .setFooter("Currently Server Volume is " + serverQueue.volume);
        if (serverQueue.songs.length === 1)
            queue.setDescription(`No songs to play next add songs by \`\`${prefix}play <song_name>\`\``);
        message.channel.send(queue);
    }
};
