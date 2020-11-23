const Command = require("../../structures/bases/commandBase");
const Embed = require("../../structures/embed");
const { error, incorrect, success } = require("../../utils/export/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "announce",
            description: "Announce a message in specified channel",
            aliases: ["announcement", "embed"],
            category: "Utilites",
            ownerOnly: false,
            nsfw: false,
            cooldown: 30,
            botPermission: ["ADMINISTRATOR", "EMBED_LINKS"],
            memberPermission: ["ADMINISTRATOR"],
            usage: "<channel> <text>",
        });
    }

    async execute(message, args) {
        try {
            const channel = message.mentions.channels.first();

            if (!args[0]) {
                return incorrect("Please Mention the channel first", message.channel);
            }
            if (!args[1]) {
                return incorrect("Please put the message you want to Announce", message.channel);
            }
            const avatar = message.author.displayAvatarURL({
                dynamic: true,
                format: "png",
            });

            channel.send(
                new Embed()
                    .setColor("RANDOM")
                    .setAuthor(`${message.author.tag}`, avatar)
                    .setDescription(args.slice(2).join(" "))
                    .setTimestamp()
            );

            return success("Message Sent", message.channel);
        } catch {
            return error(
                "I dont have permission to send messages in that channel make sure to give me `ADMINISTRATOR` or Overwrite permission in the channel where you want to send message",
                message.channel
            );
        }
    }
};
