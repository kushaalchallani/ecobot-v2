const { Util } = require("discord.js");
const Embed = require("../../structures/embed");
const ytdl = require("ytdl-core");
const yts = require("yt-search");
const { incorrect, error, success } = require("../../utils/export/index");
const Command = require("../../structures/bases/commandBase");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "play",
            description: "Plays a mentioned song or resumes it",
            category: "Music",
            ownerOnly: false,
            nsfw: false,
            cooldown: 5,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES", "CONNECT"],
            usage: "<song name>",
            aliases: ["p"],
        });
    }

    async execute(message, args) {
        const channel = message.member.voice.channel;
        if (!channel) return error("I'm sorry but you need to be in a voice channel to play music!", message.channel);

        const permissions = channel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT"))
            return error(
                "I cannot connect to your voice channel, make sure I have the proper permissions!",
                message.channel
            );
        if (!permissions.has("SPEAK"))
            return error(
                "I cannot speak in this voice channel, make sure I have the proper permissions!",
                message.channel
            );

        const resumeQueue = message.client.queue.get(message.guild.id);
        if (resumeQueue && !resumeQueue.playing) {
            resumeQueue.playing = true;
            resumeQueue.connection.dispatcher.resume();
            const embed = new Embed()
                .setColor("YELLOW")
                .setAuthor("Music has been Resumed!", "https://i.imgur.com/tZwBdli.gif");
            return message.channel.send(embed);
        }

        const searchString = args.join(" ");

        if (!searchString) {
            return incorrect("You have to provide me an music for me to play", message.channel);
        }

        const serverQueue = message.client.queue.get(message.guild.id);

        const searched = await yts.search(searchString);
        if (searched.videos.length === 0)
            return error("Looks like I was unable to find the song on YouTube", message.channel);
        const songInfo = searched.videos[0];

        const song = {
            id: songInfo.videoId,
            title: Util.escapeMarkdown(songInfo.title),
            views: String(songInfo.views).padStart(10, " "),
            url: songInfo.url,
            ago: songInfo.ago,
            duration: songInfo.duration.toString(),
            img: songInfo.image,
            req: message.author,
        };

        if (serverQueue) {
            serverQueue.songs.push(song);
            const thing = new Embed()
                .setAuthor("Song has been added to queue", "https://i.imgur.com/tZwBdli.gif")
                .setThumbnail(song.img)
                .setColor("YELLOW")
                .addField("Name", song.title, true)
                .addField("Duration", song.duration, true)
                .addField("Requested by", song.req.tag, true)
                .setFooter(`Views: ${song.views} | ${song.ago}`);
            return message.channel.send(thing);
        }

        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: channel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true,
        };
        message.client.queue.set(message.guild.id, queueConstruct);
        queueConstruct.songs.push(song);

        const play = async (song) => {
            const queue = message.client.queue.get(message.guild.id);
            if (!song) {
                success("Leaving the voice channel because I think there are no songs in the queue.", message.channel);
                queue.voiceChannel.leave();
                message.client.queue.delete(message.guild.id);
                return;
            }

            const dispatcher = queue.connection
                .play(ytdl(song.url))
                .on("finish", () => {
                    queue.songs.shift();
                    play(queue.songs[0]);
                })
                .on("error", (error) => console.error(error));
            dispatcher.setVolumeLogarithmic(5 / 5);
            const thing = new Embed()
                .setAuthor("Started Playing Music!", "https://i.imgur.com/tZwBdli.gif")
                .setThumbnail(song.img)
                .setColor("BLUE")
                .addField("Name", song.title, true)
                .addField("Duration", song.duration, true)
                .addField("Requested by", song.req.tag, true)
                .setFooter(`Views: ${song.views} | ${song.ago}`);
            queue.textChannel.send(thing);
        };

        try {
            const connection = await channel.join();
            queueConstruct.connection = connection;
            channel.guild.voice.setSelfDeaf(true);
            play(queueConstruct.songs[0]);
        } catch (error) {
            message.client.queue.delete(message.guild.id);
            await channel.leave();
            return error(`I could not join the voice channel: ${error}`, message.channel);
        }
    }
};
