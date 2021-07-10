const Command = require("../../structures/bases/commandBase");
const Embed = require("../../structures/embed");
require("dotenv/config");
const { error, incorrect, success } = require("../../utils/export/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "bug",
            description: "Send a messages to the support server about a bug in in the bot",
            category: "Utilites",
            ownerOnly: false,
            nsfw: false,
            cooldown: 60,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["ADMINISTRATOR"],
            usage: "<..issue>",
        });
    }

    async execute(message, args) {
        const issue = args.slice(0).join(" ");

        const channel = this.client.channels.cache.get(process.env.support_channel_id);

        if (!issue) {
            return incorrect("Please add an issue to your message!", message.channel);
        } else {
            try {
                const embed = new Embed()
                    .setAuthor(
                        `${message.member.user.tag}`,
                        message.member.user.displayAvatarURL({
                            dynamic: true,
                            format: "png",
                        })
                    )
                    .setColor("RANDOM")
                    .setTimestamp()
                    .addField("Guild Name:", message.guild.name)
                    .addField("Guild ID:", message.guild.id)
                    .addField("Channel ID:", message.channel.id)
                    .addField("Issue:", issue);
                channel.send(embed);

                await success(`Your issue \`${issue}\` has been sent to the support server`, message.channel);

                return null;
            } catch (err) {
                return error(`An Error Occured.\n\n**${err}**`, message.channel);
            }
        }
    }
};
