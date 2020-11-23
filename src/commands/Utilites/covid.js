const covid = require("novelcovid");
const Command = require("../../structures/bases/commandBase");
const Embed = require("../../structures/embed");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "covid",
            description: "See Latest Covid Stats of the world",
            aliases: ["virus", "virus-stats", "covid-stats"],
            category: "Utilites",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
            ownerOnly: false,
            cooldown: 10,
        });
    }

    async execute(message) {
        const covidStats = await covid.all();

        return message.channel.send(
            new Embed().setTitle("Covid 19 Worldwide Stats").setColor("RANDOM").addFields(
                {
                    name: "Cases",
                    value: covidStats.cases.toLocaleString(),
                    inline: true,
                },
                {
                    name: "Cases Today",
                    value: covidStats.cases.toLocaleString(),
                    inline: true,
                },
                {
                    name: "Deaths",
                    value: covidStats.deaths.toLocaleString(),
                    inline: true,
                },
                {
                    name: "Deaths Today",
                    value: covidStats.todayDeaths.toLocaleString(),
                    inline: true,
                },
                {
                    name: "Recovered",
                    value: covidStats.recovered.toLocaleString(),
                    inline: true,
                },
                {
                    name: "Recovered Today",
                    value: covidStats.todayRecovered.toLocaleString(),
                    inline: true,
                },
                {
                    name: "Infected Right Now",
                    value: covidStats.active.toLocaleString(),
                    inline: true,
                },
                {
                    name: "Critical Condition",
                    value: covidStats.critical.toLocaleString(),
                    inline: true,
                },
                {
                    name: "Tested",
                    value: covidStats.tests.toLocaleString(),
                    inline: true,
                }
            )
        );
    }
};
