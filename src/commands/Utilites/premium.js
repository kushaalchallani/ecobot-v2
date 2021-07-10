/* eslint-disable no-unused-vars */
const Command = require("../../structures/bases/commandBase");
const { premiumModel } = require("../../database/models/export/index");
const { error, incorrect, success } = require("../../utils/export/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "premium",
            description: "Claim your [patreon](https://www.patreon.com/Ecoobot) perks.",
            aliases: ["patreonperks", "premiumperks", "claimperks"],
            category: "Utilites",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
            ownerOnly: false,
            guildOnly: true,
            cooldown: 1,
        });
    }

    async execute(message, args) {
        const notclaimedrole = message.member.roles.cache.get("775630719544328202");
        const claimedrole = message.member.roles.cache.get("775630671301312513");

        const data =
            (await premiumModel.findOne({
                guildID: args[1],
            })) ||
            new premiumModel({
                guildID: args[1],
            });

        if (args[0].toLowerCase() === "add") {
            if (!notclaimedrole) {
                return error("You have not purchased premium or you have already redeemed it!", message.channel);
            }

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

            if (data.premium) {
                return error("The server already has premium", message.channel);
            }

            data.premium = true;
            data.userID = message.author.id;
            await data.save();

            message.member.roles.remove("775630719544328202");
            message.member.roles.add("775630671301312513");

            return success(`Added premium to **${guild.name}**`, message.channel);
        } else if (args[0].toLowerCase() === "remove") {
            if (!claimedrole) {
                return error("You have not redeemed you premium", message.channel);
            }

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

            if (!data.premium) {
                return error("That guild does not have premium", message.channel);
            }

            data.premium = false;
            await data.save();

            message.member.roles.remove("775630671301312513");
            message.member.roles.add("775630719544328202");
            return success(`Removed premium from **${guild.name}**`, message.channel);
        }
    }
};

// Premium add - Checks if the user has a Not claimed role
// If the user has the Not claimed role then the cmd should run, Give the premium and remove the role to add premium supporter role

// Premium remove - Checks if the user has a premium supporter role
// If the user has the premium supporter  role then the cmd should run, Give the premium and remove the role to add Not claimed role
