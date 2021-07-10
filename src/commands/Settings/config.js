/* eslint-disable spaced-comment */
const Command = require("../../structures/bases/commandBase");
const { fetchSuggestionChannels } = require("../../features/feature/suggestion");
const { incorrect, success, error } = require("../../utils/export/index");
const Embed = require("../../structures/embed");
const {
    prefixModel,
    suggestionModel,
    thanklbModel,
    welcomeModel,
    joinroleModel,
    leaveModel,
    logsModel,
    rolelogsModel,
    channellogsModel,
    serverlogsModel,
} = require("../../database/models/export/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "config",
            usage: "<Action> <...arguments>",
            description: "Change the bot settings",
            aliases: ["set", "server-settings"],
            category: "Settings",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS", "ADMINISTRATOR"],
            memberPermission: ["ADMINISTRATOR", "MANAGE_SERVER"],
            nsfw: false,
            ownerOnly: false,
            cooldown: 15,
            examples: [
                "config prefix !?",
                "config thank-lb ",
                "config thanks-lb #thank-lb",
                "config suggestions",
                "config suggestions #suggestions",
                "config welcome-channel #join-leave",
                "config leave-channel #join-leave",
                "config join-role @Members",
                "config message-logs #message-logs",
                "config role-logs #role-logs",
                "config channel-logs #channel-logs",
                "config server-logs #server-logs",
            ],
            subcommands: [
                "prefix",
                "thanks-lb",
                "suggestions",
                "welcome-channel",
                "leave-channel",
                "join-role",
                "message-logs",
                "role-logs",
                "channel-logs",
                "server-logs",
            ],
        });
    }

    async execute(message, args) {
        if (!args[0]) {
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

            const messagelog = await logsModel.findOne({
                guildId: message.guild.id,
            });

            const rolelog = await rolelogsModel.findOne({
                guildId: message.guild.id,
            });
            const channellog = await channellogsModel.findOne({
                guildId: message.guild.id,
            });
            const serverlog = await serverlogsModel.findOne({
                guildId: message.guild.id,
            });

            const embed = new Embed()
                .setColor("BLUE")
                .setTitle("⚙ Config")
                .setFooter(`Use \`${prefix}help config\` to change settings in your server`)

                .addField(
                    "Welcome Channel",
                    welcome ? (welcome.channelId ? `<#${welcome.channelId}>` : "`None`") : "`None`",
                    true
                )
                .addField(
                    "Suggestion Channel",
                    suggestion ? (suggestion.channelId ? `<#${suggestion.channelId}>` : "`None`") : "`None`",
                    true
                )
                .addField(
                    "Thank Leaderboard",
                    thanksLB ? (thanksLB.channelId ? `<#${thanksLB.channelId}>` : "`None`") : "`None`",
                    true
                )
                .addField("Prefix", `\`${prefix}\``, true)
                .addField(
                    "Leave Channel",
                    leave ? (leave.channelId ? `<#${leave.channelId}>` : "`None`") : "`None`",
                    true
                )
                .addField("Join Role", role ? (role.roleId ? `<@&${role.roleId}>` : "`None`") : "`None`", true)
                .addField(
                    "Message Logs",
                    messagelog ? (messagelog.channelId ? `<#${messagelog.channelId}>` : "`None`") : "`None`",
                    true
                )
                .addField(
                    "Role Logs",
                    rolelog ? (rolelog.channelId ? `<#${rolelog.channelId}>` : "`None`") : "`None`",
                    true
                )
                .addField(
                    "Channel Logs",
                    channellog ? (channellog.channelId ? `<#${channellog.channelId}>` : "`None`") : "`None`",
                    true
                )
                .addField(
                    "Server Logs",
                    serverlog ? (serverlog.channelId ? `<#${serverlog.channelId}>` : "`None`") : "`None`",
                    true
                );
            message.channel.send(embed);
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////// Sub Commands //////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        if (args[0] === "prefix") {
            const prefix = await prefixModel.findOne({
                guildID: message.guild.id,
            });

            if (!args[1]) {
                return incorrect("You need to specify a new prefix", message.channel);
            }

            if (args[1].length > 3) {
                return error("The prefix needs to be 3 or less characters", message.channel);
            }

            if (prefix) {
                prefix.prefix = args[1];
                prefix.save();
            } else {
                const newPrefix = new prefixModel({
                    guildID: message.guild.id,
                    guildName: message.guild.name,
                    prefix: args[1],
                });

                await newPrefix.save();
            }

            return await success(`Successfully Changed the prefix to \`${args[1]}\``, message.channel);
        }

        if (args[0] === "thanks-lb") {
            const guildId = message.guild.id;
            const channel = message.mentions.channels.first() || message.channel;

            const lb = await thanklbModel.findOne({
                _Id: guildId,
            });

            if (lb) {
                lb.channelId = channel.id;
                lb.save();
            } else {
                const newLB = new thanklbModel({
                    _Id: guildId,
                    channelId: channel.id,
                });

                await newLB.save();
            }

            await success(
                `Thank Leaderboard set to ${channel}. Make sure there are no messages in that channel`,
                message.channel
            );
            message.delete();
        }

        if (args[0] === "suggestions") {
            const channel = message.mentions.channels.first() || message.channel;

            const guildId = message.guild.id;

            await suggestionModel.findOneAndUpdate(
                {
                    _id: guildId,
                },
                {
                    _id: guildId,
                    channelId: channel.id,
                },
                {
                    upsert: true,
                }
            );

            await success(`The suggestions channel has been set to ${channel}`, message.channel);

            fetchSuggestionChannels(message.guild.id);
        }

        if (args[0] === "welcome-channel") {
            const welcome = await welcomeModel.findOne({
                guildId: message.guild.id,
            });

            const welcomeChanel = message.mentions.channels.first();

            if (!welcomeChanel) {
                return incorrect("You need to specify a welcome channel to set", message.channel);
            }

            if (args[2]) {
                return error("You can only set 1 welcome channel", message.channel);
            }

            if (welcome) {
                welcome.channelId = welcomeChanel.id;
                welcome.save();
            } else {
                const newWelcome = new welcomeModel({
                    guildId: message.guild.id,
                    guildName: message.guild.name,
                    channelId: welcomeChanel.id,
                });

                await newWelcome.save();
            }

            return await success(`Successfully set the welcome channel to ${welcomeChanel}`, message.channel);
        }

        if (args[0] === "leave-channel") {
            const leave = await leaveModel.findOne({
                guildId: message.guild.id,
            });

            const leaveChanel = message.mentions.channels.first();

            if (!leaveChanel) {
                return incorrect("You need to specify a leave channel to set", message.channel);
            }

            if (args[2]) {
                return error("You can only set 1 leave channel", message.channel);
            }

            if (leave) {
                leave.channelId = leaveChanel.id;
                leave.save();
            } else {
                const newleave = new leaveModel({
                    guildId: message.guild.id,
                    guildName: message.guild.name,
                    channelId: leaveChanel.id,
                });

                await newleave.save();
            }

            return await success(`Successfully set the leave channel to ${leaveChanel}`, message.channel);
        }

        if (args[0] === "join-role") {
            const role = await joinroleModel.findOne({
                guildId: message.guild.id,
            });

            const joinrole = message.mentions.roles.first();

            if (!joinrole) {
                return incorrect("You need to specify a join role to set", message.channel);
            }

            if (args[2]) {
                return error("You can only set 1 joinrole", message.channel);
            }

            if (role) {
                role.roleId = joinrole.id;
                role.save();
            } else {
                const newRole = new joinroleModel({
                    guildId: message.guild.id,
                    guildName: message.guild.name,
                    roleId: joinrole.id,
                });

                await newRole.save();
            }

            return await success(
                `Successfully set the join role to ${joinrole}\n\nMake the the bot has an higher role than the role you want to give to the members`,
                message.channel
            );
        }

        if (args[0] === "message-logs") {
            const log = await logsModel.findOne({
                guildId: message.guild.id,
            });

            const logchannel = message.mentions.channels.first();

            if (!logchannel) {
                return incorrect("You need to specify a message log channel to set", message.channel);
            }

            if (args[2]) {
                return error("You can only set 1 message logs channel", message.channel);
            }

            if (log) {
                log.channelId = logchannel.id;
                log.save();
            } else {
                const newLog = new logsModel({
                    guildId: message.guild.id,
                    guildName: message.guild.name,
                    channelId: logchannel.id,
                });

                await newLog.save();
            }

            return await success(`Successfully set the message logs channel to ${logchannel}`, message.channel);
        }

        if (args[0] === "role-logs") {
            const log = await rolelogsModel.findOne({
                guildId: message.guild.id,
            });

            const logchannel = message.mentions.channels.first();

            if (!logchannel) {
                return incorrect("You need to specify a role log channel to set", message.channel);
            }

            if (args[2]) {
                return error("You can only set 1 role log channel", message.channel);
            }

            if (log) {
                log.channelId = logchannel.id;
                log.save();
            } else {
                const newLog = new rolelogsModel({
                    guildId: message.guild.id,
                    guildName: message.guild.name,
                    channelId: logchannel.id,
                });

                await newLog.save();
            }

            return await success(`Successfully set the role logs channel to ${logchannel}`, message.channel);
        }

        if (args[0] === "channel-logs") {
            const log = await channellogsModel.findOne({
                guildId: message.guild.id,
            });

            const logchannel = message.mentions.channels.first();

            if (!logchannel) {
                return incorrect("You need to specify a channel log channel to set", message.channel);
            }

            if (args[2]) {
                return error("You can only set 1 channel log channel", message.channel);
            }

            if (log) {
                log.channelId = logchannel.id;
                log.save();
            } else {
                const newLog = new channellogsModel({
                    guildId: message.guild.id,
                    guildName: message.guild.name,
                    channelId: logchannel.id,
                });

                await newLog.save();
            }

            return await success(`Successfully set the channel logs channel to ${logchannel}`, message.channel);
        }

        if (args[0] === "server-logs") {
            const log = await serverlogsModel.findOne({
                guildId: message.guild.id,
            });

            const logchannel = message.mentions.channels.first();

            if (!logchannel) {
                return incorrect("You need to specify a server log channel to set", message.channel);
            }

            if (args[2]) {
                return error("You can only set 1 server log channel", message.channel);
            }

            if (log) {
                log.channelId = logchannel.id;
                log.save();
            } else {
                const newLog = new serverlogsModel({
                    guildId: message.guild.id,
                    guildName: message.guild.name,
                    channelId: logchannel.id,
                });

                await newLog.save();
            }

            return await success(`Successfully set the server logs channel to ${logchannel}`, message.channel);
        }
    }
};
