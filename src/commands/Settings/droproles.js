/* eslint-disable no-unused-vars */
const Command = require("../../structures/bases/commandBase");
const Nuggies = require("nuggies");
const { Message } = require("discord.js");
const Embed = require("../../structures/embed");
const { incorrect, error } = require("../../utils/export/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "droprole",
            description: "Create dropdown roles (Almost like reaction roles)",
            category: "Settings",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            cooldown: 5,
            memberPermission: ["ADMINISTRATOR"],
            nsfw: false,
            ownerOnly: true,
            premium: true,
        });
    }

    async execute(message) {
        const dpmanager = new Nuggies.dropdownroles();
        message.channel.send(
            new Embed()
                .setImage("https://cdn.discordapp.com/attachments/862344684582862889/862358241035681802/unknown.png")
                .setDescription(
                    "To add Droprole send messages in this channel with `<roleID> <label> <emoji>` syntax! Once finished type `done`.\n\nAn example is given below:"
                )
                .setColor("BLUE")
                .setFooter("Type `cancel` to cancel the command")
        );

        /**
         * @param {Message} m
         */
        const filter = (m) => m.author.id === message.author.id;
        const collector = message.channel.createMessageCollector(filter, { max: 10000 });

        collector.on("collect", async (msg) => {
            if (msg.author.bot) return;
            if (!msg.content)
                return incorrect("Please use `<roleID> <label> <emoji>` syntax to create drop role", message.channel);
            if (msg.content.toLowerCase() == "done") {
                return collector.stop("DONE");
            }
            if (msg.content.toLowerCase() == "cancel") {
                msg.react("👍");
                return collector.stop("cancel");
            }
            if (!msg.content.split(" ")[0].match(/[0-9]{18}/g))
                return incorrect("Please use `<roleID> <label> <emoji>` syntax to create drop role", message.channel);

            const roleid = msg.content.split(" ")[0];
            const role = message.guild.roles.cache.get(roleid);
            if (!role) return error("The role does not exist. Please use a existing role", message.channel);

            const label = msg.content
                .split(" ")
                .slice(1, msg.content.split(" ").length - 1)
                .join(" ");

            const reaction = await msg
                .react(
                    msg.content
                        .split(" ")
                        .slice(msg.content.split(" ").length - 1)
                        .join(" ")
                )
                .catch(console.log);

            const final = {
                role: roleid,
                label: label,
                emoji: reaction ? reaction.emoji.id || reaction.emoji.name : null,
            };
            dpmanager.addrole(final);
        });

        collector.on("end", async (msgs, reason) => {
            if (reason == "DONE") {
                const embed = new Embed()
                    .setTitle("Dropdown roles!")
                    .setDescription("Click on the buttons to get the specific role or vice-versa")
                    .setColor("RANDOM")
                    .setTimestamp();
                Nuggies.dropdownroles.create({
                    message: message,
                    content: embed,
                    role: dpmanager,
                    channelID: message.channel.id,
                });
            }
        });
    }
};
