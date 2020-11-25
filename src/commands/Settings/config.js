const Command = require("../../structures/bases/commandBase");
const Embed = require("../../structures/embed");
const {
    prefixModel,
    suggestionModel,
    thanklbModel,
    welcomeModel,
    leaveModel,
    joinroleModel,
} = require("../../database/models/export/index");

module.exports = class extends (
    Command
) {
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

        const leave = await leaveModel.findOne({
            guildId: message.guild.id,
        });

        const role = await joinroleModel.findOne({
            guildId: message.guild.id,
        });

        const embed = new Embed()
            .setColor("BLUE")
            .setTitle("⚙ Config")
            .setFooter(`Use ${prefix}set to change settings in your server`)

            .addField(
                "Welcome Channel",
                welcome ? (welcome.channelId ? `<#${welcome.channelId}>` : "None") : "None",
                true
            )
            .addField(
                "Suggestion Channel",
                suggestion ? (suggestion.channelId ? `<#${suggestion.channelId}>` : "None") : "None",
                true
            )
            .addField(
                "Thank Leaderboard",
                thanksLB ? (thanksLB.channelId ? `<#${thanksLB.channelId}>` : "None") : "None",
                true
            )
            .addField("Prefix", `\`${prefix}\``, true)
            .addField("Leave Channel", leave ? (leave.channelId ? `<#${leave.channelId}>` : "None") : "None", true)
            .addField("Join Role", role ? (role.roleId ? `<@${role.roleId}>` : "None") : "None", true);
        message.channel.send(embed);
    }
};
