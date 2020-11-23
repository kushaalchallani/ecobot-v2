const Command = require("../../structures/bases/commandBase");
const Embed = require("../../structures/embed");
const weather = require("weather-js");
const { error, incorrect } = require("../../utils/export/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "weather",
            description: "Check the weather of a city",
            aliases: ["climate"],
            category: "Utilites",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
            ownerOnly: false,
            cooldown: 15,
            usage: "<C || F> <location>",
        });
    }

    async execute(message, args) {
        let degree;
        if (args[0]) {
            if (args[0] === "C" || args[0] === "c" || args[0] === "F" || args[0] === "f") {
                degree = args[0].toUpperCase();
            } else {
                return incorrect("Enter a valid degree type (C | F)", message.channel);
            }
        } else {
            return incorrect("Enter a valid degree type (C | F)", message.channel);
        }

        if (!args[1]) return incorrect("Enter a location to search for", message.channel);

        // eslint-disable-next-line space-before-function-paren
        weather.find({ search: args[1], degreeType: degree }, function (err, result) {
            try {
                const embed = new Embed()
                    .setColor("BLUE")
                    .setTitle("Weather")
                    .setThumbnail(result[0].current.imageUrl)
                    .setDescription(`Showing weather data for ${result[0].location.name}`)
                    .addField("**Temp:**", `${result[0].current.temperature}°${result[0].location.degreetype}`, true)
                    .addField("**Weather:**", `${result[0].current.skytext}`, true)
                    .addField("**Day:**", `${result[0].current.shortday}`, true)
                    .addField(
                        "**Feels like:**",
                        `${result[0].current.feelslike}°${result[0].location.degreetype}`,
                        true
                    )
                    .addField("**Humidity:**", `${result[0].current.humidity}%`, true)
                    .addField("**Wind:**", `${result[0].current.winddisplay}`, true);

                message.channel.send(embed);
            } catch {
                return error("Are you sure that place exists?", message.channel);
            }
        });
    }
};
