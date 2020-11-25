const Command = require("../../structures/bases/commandBase");
const { incorrect, success } = require("../../utils/export/index");
const ms = require("ms");
const { automemeModel } = require("../../database/models/export/index");

module.exports = class extends (
    Command
) {
    constructor(...args) {
        super(...args, {
            name: "automeme",
            usage: "<Action> <..arguments>",
            description: "reset the bot settings",
            aliases: ["automatic"],
            category: "Settings",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["ADMINISTRATOR", "MANAGE_SERVER"],
            nsfw: false,
            ownerOnly: false,
            cooldown: 15,
            examples: ["reset prefix", "reset lbchannel ", "reset thanks"],
            subcommands: ["meme", "nsfw"],
        });
    }

    async execute(message, args) {
        if (!args[0]) {
            return incorrect("Please provide what to reset. `meme`", message.channel);
        }

        if (args[0] === "enable") {
            const channel = message.mentions.channels.first();

            if (!channel) {
                return incorrect("Please Provide a channel to post automemes", message.channel);
            }

            let time = args[2];

            if (!time) {
                return incorrect("Please specify a time.", message.channel);
            }

            time = ms(time);
            time = parseInt(time);

            const auto = await automemeModel.findOne({
                guildId: message.guild.id,
            });

            if (auto) {
                auto.channelID = channel.id;
                auto.Time = time;
                auto.status = true;
                auto.save();
            } else {
                const newMeme = new automemeModel({
                    guildId: message.guild.id,
                    guildName: message.guild.name,
                    channelID: channel.id,
                    Time: time,
                    status: true,
                });

                await newMeme.save();
            }

            await success(`Successfully set the automeme channel to ${channel}`, message.channel);
        }
    }
};
