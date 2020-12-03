const solenolyrics = require("solenolyrics");
const Command = require("../../structures/bases/commandBase");
const Embed = require("../../structures/embed");
const { splitMessage } = require("discord.js");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "lyrics",
            description: "Get song lyrics. POG!",
            category: "Music",
            ownerOnly: false,
            nsfw: false,
            cooldown: 10,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            usage: "<song name>",
            examples: ["lyrics Despacito", "lyrics Alone"],
        });
    }

    async execute(message, args) {
        if (!args[0]) return message.channel.send("Please provide a song name!");
        const lyrics = await solenolyrics.requestLyricsFor(args.slice(0).join(" "));

        try {
            const embed = new Embed()
                .setDescription(lyrics)
                .setFooter(
                    `Requested by ${message.author.username}`,
                    message.author.displayAvatarURL({ dynamic: true })
                )
                .setTitle(`${this.client.util.capitalise(args.slice(0).join(" "))} Lyrics`)
                .setColor("BLUE");

            const splitDescription = splitMessage(lyrics, {
                maxLength: 2048,
                char: "\n",
                prepend: "",
                append: "",
            });

            splitDescription.forEach(async (m) => {
                embed.setDescription(m);
                embed.setColor("BLUE");

                message.channel.send(embed);
            });
        } catch {
            return message.channel.send(
                `I can't find a song with following name: \`${this.client.util.capitalise(args.slice(0).join(" "))}\``
            );
        }
    }
};
