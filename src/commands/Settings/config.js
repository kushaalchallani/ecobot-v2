const Command = require("../../structures/bases/commandBase");
const { prefixModel, suggestionModel, thanklbModel, welcomeModel } = require("../../database/models/export/index");
const Embed = require("../../structures/embed");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "config",
            description: "reset the thanks of an user",
            category: "Settings",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS", "ADMINISTRATOR"],
            memberPermission: ["ADMINISTRATOR", "MANAGE_SERVER"],
            nsfw: false,
            ownerOnly: false,
            cooldown: 15,
            aliases: ["rt"],
        });
    }

    async execute(message) {
        const prefix = (await prefixModel.findOne({ guildID: message.guild.id }))
            ? (await prefixModel.findOne({ guildID: message.guild.id })).prefix
            : this.client.prefix;

        const suggestion = await suggestionModel.findOne({
            _id: message.guild.id,
        });

        const thanksLB = await thanklbModel.findOne({
            _Id: message.guild.id,
        });

        const welcome = await welcomeModel.findOne({
            guildId: message.guild.id,
        });

        const embed = new Embed()
            .setColor("BLUE")
            .setFooter(`Use ${prefix}set to change settings in your server`)
            .addField("Prefix", `\`${prefix}\``, true)
            .addField("Suggestion Channel", `<#${suggestion.channelId}>` || "None", true)
            .addField(
                "Thank Leaderboard",
                thanksLB ? (thanksLB.channelId ? `<#${thanksLB.channelId}>` : "None") : "None",
                true
            )
            .addField("Welcome Channel", `<#${welcome.channelId}>` || "None", true);
        message.channel.send(embed);
    }
};
