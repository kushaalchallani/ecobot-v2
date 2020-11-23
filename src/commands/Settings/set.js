const Command = require("../../structures/bases/commandBase");
const { fetchSuggestionChannels } = require("../../features/suggestion");
const {
    prefixModel,
    suggestionModel,
    thanklbModel,
    welcomeModel,
    joinroleModel,
    leaveModel,
} = require("../../database/models/export/index");
const { incorrect, success, error } = require("../../utils/export/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "set",
            usage: "<prefix || thanks-lb || suggestions> <...arguments>",
            description: "Change the bot settings",
            aliases: ["setprefix", "changeprefix", "newprefix", "server-settings", "settings"],
            category: "Settings",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS", "ADMINISTRATOR"],
            memberPermission: ["ADMINISTRATOR", "MANAGE_SERVER"],
            nsfw: false,
            ownerOnly: false,
            cooldown: 15,
            examples: [
                "set prefix !?",
                "set thank-lb ",
                "set thank-lb #thank-lb",
                "set suggestions",
                "set suggestions #suggestions",
            ],
            subcommands: ["prefix", "thanks-lb", "suggestions"],
        });
    }

    async execute(message, args) {
        if (!args[0]) {
            return incorrect("Please provide what to set. `prefix` `thank-lb` `suggestions`", message.channel);
        }

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
                welcomeModel.save();
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
                joinroleModel.save();
            } else {
                const newRole = new joinroleModel({
                    guildId: message.guild.id,
                    guildName: message.guild.name,
                    roleId: joinrole.id,
                });

                await newRole.save();
            }

            return await success(`Successfully set the join role to ${joinrole}`, message.channel);
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
                leaveModel.save();
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
    }
};
