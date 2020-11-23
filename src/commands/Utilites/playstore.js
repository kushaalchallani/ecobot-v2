const PlayStore = require("google-play-scraper");
const Command = require("../../structures/bases/commandBase");
const Embed = require("../../structures/embed");
const { error, incorrect } = require("../../utils/export/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "playstore",
            description: "Show Playstore Application Information Of Your Given Name!",
            aliases: ["pstore", "googleplaystore", "ps"],
            category: "Utilites",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
            ownerOnly: false,
            cooldown: 12,
            usage: "<Application Name>",
        });
    }

    async execute(message, args) {
        if (!args[0]) {
            return incorrect("Please Give Something To Search", message.channel);
        }
        PlayStore.search({
            term: args.join(" "),
            num: 1,
        }).then((Data) => {
            let App;

            try {
                App = JSON.parse(JSON.stringify(Data[0]));
            } catch (err) {
                return error("No Application Found", message.channel);
            }

            const avatar = message.author.displayAvatarURL({ format: "png" });

            return message.channel.send(
                new Embed()
                    .setColor("RANDOM")
                    .setThumbnail(App.icon)
                    .setURL(App.url)
                    .setTitle(`${App.title}`)
                    .setDescription(App.summary)
                    .addField("Price", App.priceText, true)
                    .addField("Developer", App.developer, true)
                    .addField("Score", App.scoreText, true)
                    .setFooter(`Requested By ${message.author.username}`, avatar)
                    .setTimestamp()
            );
        });
    }
};
