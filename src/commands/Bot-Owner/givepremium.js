const Command = require("../../structures/bases/commandBase");
const { premiumModel } = require("../../database/models/export/index");
const { success, error, incorrect } = require("../../utils/export/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "givepremium",
            description: "Sets a server as a premium",
            category: "Bot Owner",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["ADMINISTRATOR"],
            nsfw: false,
            ownerOnly: true,
            cooldown: 30,
            usage: "<add || remove> <Guild ID>",
        });
    }

    async execute(message, args) {
        if (!args[0]) {
            return incorrect("Use `add` or `remove`", message.channel);
        }
        if (!args[1]) {
            return incorrect("Provide a guild id", message.channel);
        }

        const guild = message.client.guilds.cache.get(args[1]);
        if (!guild) {
            return error("Server not found", message.channel);
        }

        const data =
            (await premiumModel.findOne({
                guildID: args[1],
            })) ||
            new premiumModel({
                guildID: args[1],
            });

        if (args[0].toLowerCase() === "add") {
            if (data.premium) {
                return error("That guild already has premium", message.channel);
            }

            data.premium = true;
            await data.save();

            return success(`Added premium to **${guild.name}**`, message.channel);
        } else if (args[0].toLowerCase() === "remove") {
            if (!data.premium) {
                return error("That guild does not have premium", message.channel);
            }

            data.premium = false;
            await data.save();

            return success(`Removed premium from **${guild.name}**`, message.channel);
        }
    }
};
