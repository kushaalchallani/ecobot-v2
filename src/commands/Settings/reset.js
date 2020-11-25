const Command = require("../../structures/bases/commandBase");
const { incorrect, success, error } = require("../../utils/export/index");
const {
    prefixModel,
    thanklbModel,
    thanksModel,
    joinroleModel,
    welcomeModel,
    leaveModel,
} = require("../../database/models/export/index");

module.exports = class extends (
    Command
) {
    constructor(...args) {
        super(...args, {
            name: "reset",
            usage: "<prefix || thanks-lb || thanks>",
            description: "reset the bot settings",
            aliases: ["remove"],
            category: "Settings",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS", "ADMINISTRATOR"],
            memberPermission: ["ADMINISTRATOR", "MANAGE_SERVER"],
            nsfw: false,
            ownerOnly: false,
            cooldown: 15,
            examples: ["reset prefix", "reset lbchannel ", "reset thanks"],
            subcommands: ["prefix", "lbchannel", "thanks"],
        });
    }

    async execute(message, args) {
        if (!args[0]) {
            return incorrect("Please provide what to reset. `thanks` `prefix` `lbchannel`", message.channel);
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
    }
};
