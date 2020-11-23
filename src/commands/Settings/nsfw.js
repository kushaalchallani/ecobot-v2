/* eslint-disable no-useless-escape */
const { prefixModel } = require("../../database/models/export/index");
const Command = require("../../structures/bases/commandBase");
const Embed = require("../../structures/embed");
const { error, success, incorrect } = require("../../utils/export/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "nsfw",
            description: "Sets or Removes channel from nsfw category",
            category: "Settings",
            ownerOnly: false,
            nsfw: false,
            cooldown: 20,
            botPermission: ["MANAGE_CHANNELS", "EMBED_LINKS"],
            memberPermission: ["MANAGE_CHANNELS"],
            usage: "<set || remove>",
        });
    }

    async execute(message, args) {
        const PREFIX = (await prefixModel.findOne({ guildID: message.guild.id }))
            ? (await prefixModel.findOne({ guildID: message.guild.id })).prefix
            : this.client.prefix;

        if (!args[0]) {
            return incorrect("Provide `set` or `remove` to change the channel settings", message.channel);
        }

        if (args[0] === "remove") {
            if (!message.channel.nsfw)
                return success(
                    `Looks like you\'ve got it all set up already! This channel isn\'t NSFW! Try \`${PREFIX}setnsfw\` to see how to make it into an NSFW channel!`,
                    message.channel
                );

            const embed2 = new Embed()
                .setColor("RANDOM")
                .setDescription(
                    "__**Here's how to set a channel to SFW!**__\n**1)** Click the __channel settings cog__ beside the channel name!\n**2)** Click the __NSFW switch__ right under the channel topic box!\n**3)** You're done! Save the settings and there's your pure, innocent channel back!\n\n**Would you like me to make this channel SFW for you?** `(yes/no)`"
                )
                .setImage("https://b.catgirlsare.sexy/i6CE.png");
            message.channel.send(embed2);

            const msgs = await message.channel.awaitMessages((res) => res.author.id === message.author.id, {
                max: 1,
                time: 30000,
            });

            if (!msgs.size || !["y", "yes"].includes(msgs.first().content.toLowerCase()))
                return message.channel.send(new Embed().setColor("RED").setDescription("Cancelled command!"));
            if (["n", "no"].includes(msgs.first().content.toLowerCase()))
                return message.channel.send(new Embed().setColor("RED").setDescription("Cancelled command!"));

            try {
                await message.channel.setNSFW(false, `set by ${message.author.tag}`);
            } catch (err) {
                await error(
                    `There was an error trying to make this channel into a SFW channel! \`${err}\``,
                    message.channel
                );
            }

            return await success(`Successfully made **${message.channel.name}** into an SFW channel!`, message.channel);
        }
        if (args[0] === "set") {
            if (message.channel.nsfw)
                return success(
                    `Looks like you\'ve got it all set up already! An NSFW channel perfect for...lewding? Try \`${PREFIX}help\` to see what I can do!`,
                    message.channel
                );

            const embed2 = new Embed()
                .setColor("RANDOM")
                .setDescription(
                    "__**Here's how to set a channel into NSFW!**__\n**1)** Click the __channel settings cog__ beside the channel name!\n**2)** Click the __NSFW switch__ right under the channel topic box!\n**3)** You're done! Save the settings and an NSFW channel all set up for you!\n\n**Would you like me to make this channel NSFW for you?** `(yes/no)`"
                )
                .setImage("https://b.catgirlsare.sexy/i6CE.png");
            message.channel.send(embed2);

            const msgs = await message.channel.awaitMessages((res) => res.author.id === message.author.id, {
                max: 1,
                time: 30000,
            });
            if (!msgs.size || !["y", "yes"].includes(msgs.first().content.toLowerCase()))
                return message.channel.send(new Embed().setColor("RED").setDescription("Cancelled command!"));
            if (["n", "no"].includes(msgs.first().content.toLowerCase()))
                return message.channel.send("Cancelled command!");
            try {
                await message.channel.setNSFW(true, `set by ${message.author.tag}`);
            } catch (err) {
                await error(
                    `There was an error trying to make this channel into a NSFW channel! \`${err}\``,
                    message.channel
                );
            }

            return await success(
                `Successfully made **${message.channel.name}** into an NSFW channel!`,
                message.channel
            );
        }
    }
};
