const Command = require("../../structures/bases/commandBase");
const { incorrect, success, error } = require("../../utils/export/index");
const {
    thanksModel,
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
            name: "reset",
            usage: "<Action> <...arguments>",
            description: "reset the bot settings",
            aliases: ["remove"],
            category: "Settings",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS", "ADMINISTRATOR"],
            memberPermission: ["ADMINISTRATOR", "MANAGE_SERVER"],
            nsfw: false,
            ownerOnly: false,
            cooldown: 15,
            examples: [
                "reset prefix !?",
                "reset thank-lb ",
                "reset thanks-lb #thank-lb",
                "reset suggestions",
                "reset suggestions #suggestions",
                "reset welcome-channel #join-leave",
                "reset leave-channel #join-leave",
                "reset join-role @Members",
                "reset message-logs #message-logs",
                "reset role-logs #role-logs",
                "reset channel-logs #channel-logs",
                "reset server-logs #server-logs",
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
            return incorrect("Please provide what to reset. Use `eb!help reset` for more info`", message.channel);
        }

        if (args[0] === "thanks") {
            thanksModel.deleteMany({ guildId: message.guild.id }, async (err, data) => {
                if (err) throw err;
                if (data) {
                    return success(`Successfully reseted the thanks of **${message.guild.name}**`, message.channel);
                } else if (!data) {
                    return error("The Thanks are already reseted!", message.channel);
                }
            });
        }

        if (args[0] === "prefix") {
            prefixModel.deleteMany({ guildID: message.guild.id }, async (err, data) => {
                if (err) throw err;
                if (data) {
                    return success(`Successfully reseted the prefix of **${message.guild.name}**`, message.channel);
                } else if (!data) {
                    return error("The prefix is already reseted!", message.channel);
                }
            });
        }

        if (args[0] === "lbchannel") {
            thanklbModel.deleteMany({ _Id: message.guild.id }, async (err, data) => {
                if (err) throw err;
                if (data) {
                    return success(
                        `Successfully reseted the leaderboard channel of **${message.guild.name}**`,
                        message.channel
                    );
                } else if (!data) {
                    return error("The leaderboard channel is not set", message.channel);
                }
            });
        }

        if (args[0] === "suggestions") {
            suggestionModel.deleteMany({ _id: message.guild.id }, async (err, data) => {
                if (err) throw err;
                if (data) {
                    return success(
                        `Successfully reseted the suggestion channel of **${message.guild.name}**`,
                        message.channel
                    );
                } else if (!data) {
                    return error("The leaderboard channel is not set", message.channel);
                }
            });
        }

        if (args[0] === "join-role") {
            joinroleModel.deleteMany({ guildId: message.guild.id }, async (err, data) => {
                if (err) throw err;
                if (data) {
                    return success(`Successfully reseted the joinrole of **${message.guild.name}**`, message.channel);
                } else if (!data) {
                    return error("The join role is not set", message.channel);
                }
            });
        }

        if (args[0] === "welcome-channel") {
            welcomeModel.deleteMany({ guildId: message.guild.id }, async (err, data) => {
                if (err) throw err;
                if (data) {
                    return success(
                        `Successfully reseted the welcome channel of **${message.guild.name}**`,
                        message.channel
                    );
                } else if (!data) {
                    return error("The welcome channel is not set", message.channel);
                }
            });
        }

        if (args[0] === "leave-channel") {
            leaveModel.deleteMany({ guildId: message.guild.id }, async (err, data) => {
                if (err) throw err;
                if (data) {
                    return success(
                        `Successfully reseted the leave channel of **${message.guild.name}**`,
                        message.channel
                    );
                } else if (!data) {
                    return error("The leave channel is not set", message.channel);
                }
            });
        }

        if (args[0] === "message-logs") {
            logsModel.deleteMany({ guildId: message.guild.id }, async (err, data) => {
                if (err) throw err;
                if (data) {
                    return success(
                        `Successfully reseted the message logs channel of **${message.guild.name}**`,
                        message.channel
                    );
                } else if (!data) {
                    return error("The message logs is not set", message.channel);
                }
            });
        }

        if (args[0] === "role-logs") {
            rolelogsModel.deleteMany({ guildId: message.guild.id }, async (err, data) => {
                if (err) throw err;
                if (data) {
                    return success(
                        `Successfully reseted the role logs channel of **${message.guild.name}**`,
                        message.channel
                    );
                } else if (!data) {
                    return error("The role logs is not set", message.channel);
                }
            });
        }

        if (args[0] === "channel-logs") {
            channellogsModel.deleteMany({ guildId: message.guild.id }, async (err, data) => {
                if (err) throw err;
                if (data) {
                    return success(
                        `Successfully reseted the channel logs channel of **${message.guild.name}**`,
                        message.channel
                    );
                } else if (!data) {
                    return error("The channel logs is not set", message.channel);
                }
            });
        }

        if (args[0] === "server-logs") {
            serverlogsModel.deleteMany({ guildId: message.guild.id }, async (err, data) => {
                if (err) throw err;
                if (data) {
                    return success(
                        `Successfully reseted the server log channel of **${message.guild.name}**`,
                        message.channel
                    );
                } else if (!data) {
                    return error("The server log is not set", message.channel);
                }
            });
        }
    }
};
