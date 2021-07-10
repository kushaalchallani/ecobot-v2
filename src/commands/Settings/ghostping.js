/* eslint-disable no-useless-escape */
const Command = require("../../structures/bases/commandBase");
const { ghostPingModel } = require("../../database/models/export/index");
const { incorrect, success, error } = require("../../utils/export/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "ghostping",
            description: "Send a message to a channel whenever someone ghostpings a user",
            category: "Settings",
            ownerOnly: false,
            nsfw: false,
            cooldown: 10,
            botPermission: ["MANAGE_CHANNELS", "EMBED_LINKS", "ADMINISTRATOR"],
            memberPermission: ["MANAGE_SERVER"],
            usage: "<set || remove>",
            premium: true,
        });
    }

    async execute(message, args) {
        if (!args[0]) {
            incorrect("You have to provide `set` or `remove`", message.channel);
        }

        if (args[0] === "set") {
            const targetChannel = message.mentions.channels.last();

            if (!targetChannel) {
                incorrect("Please tag a channel", message.channel);
            }

            await ghostPingModel.findOneAndUpdate(
                {
                    _id: message.guild.id,
                },
                {
                    _id: message.guild.id,
                    guildName: message.guild.name,
                    channelId: targetChannel.id,
                },
                {
                    upsert: true,
                }
            );

            return success(`Ghost ping channel has been set to <#${targetChannel.id}>`, message.channel);
        }

        if (args[0] === "remove") {
            ghostPingModel.deleteMany({ _id: message.guild.id }, async (err, data) => {
                if (err) throw err;
                if (data) {
                    return success(
                        `Successfully remove the Ghost Ping channel of **${message.guild.name}**`,
                        message.channel
                    );
                } else if (!data) {
                    return error("The ghost ping channel is not set", message.channel);
                }
            });
        }
    }
};
