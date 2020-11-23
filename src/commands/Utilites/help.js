const Command = require("../../structures/bases/commandBase");
const Embed = require("../../structures/embed");
const { prefixModel } = require("../../database/models/export/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "help",
            description: "Display a list of all available commands!",
            aliases: ["commands", "commandinfo"],
            category: "Utilites",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
            ownerOnly: false,
            cooldown: 5,
            examples: ["help", "help ping", "help serverinfo"],
            usage: "[command name]",
        });
    }

    async execute(message, args) {
        const embed = new Embed().setColor("BLUE");

        const PREFIX = (await prefixModel.findOne({ guildID: message.guild.id }))
            ? (await prefixModel.findOne({ guildID: message.guild.id })).prefix
            : this.client.prefix;

        const command =
            this.client.commands.get(args[0]) ||
            this.client.commands.find((c) => c.aliases && c.aliases.includes(args[0]));

        if (command) {
            embed.setTitle(`\`${command.name} ${command.usage || ""}\``);
            embed.addField("❯ Description", `\`${command.description}\``);
            if (command.category) embed.addField("❯ Category", `\`${command.category}\``);
            if (command.aliases.length)
                embed.addField("❯ Aliases", command.aliases.map((alias) => `\`${alias}\``).join(" "));
            if (command.cooldown) embed.addField("❯ Cooldown", `\`${command.cooldown}\``);
            if (command.memberPermission.length)
                embed.addField(
                    "❯ Permissions",
                    command.memberPermission.map((memberPermission) => `\`${memberPermission}\``).join(" ")
                );
            if (command.botPermission.length)
                embed.addField(
                    "❯ Permissions",
                    command.botPermission.map((botPermission) => `\`${botPermission}\``).join(" ")
                );
            if (command.subcommands)
                embed.addField(
                    "❯ Subcommands",
                    command.subcommands.map((subcommands) => `\`${subcommands}\``).join("\n")
                );
            if (command.examples.length)
                embed.addField("❯ Examples", command.examples.map((examples) => `\`${examples}\``).join("\n"));
        } else {
            const helpembed = new Embed()
                .setAuthor("EcoBot Help Menu")
                .setDescription("Support us by donating through [patreon](https://www.patreon.com/kcplayz)")
                .addFields(
                    {
                        name: "📷 Image",
                        value: `\`${PREFIX}help-image\``,
                        inline: true,
                    },
                    {
                        name: "💰 Economy",
                        value: `\`${PREFIX}help-economy\``,
                        inline: true,
                    },
                    {
                        name: "😄 Fun",
                        value: `\`${PREFIX}help-fun\``,
                        inline: true,
                    },
                    {
                        name: "🔞 NSFW",
                        value: `\`${PREFIX}help-nsfw\``,
                        inline: true,
                    },
                    {
                        name: "🛠️ Utilites",
                        value: `\`${PREFIX}help-utilites\``,
                        inline: true,
                    },
                    {
                        name: "🛡️ Moderation",
                        value: `\`${PREFIX}help-moderation\``,
                        inline: true,
                    },
                    {
                        name: "🐶 Animals",
                        value: `\`${PREFIX}help-animals\``,
                        inline: true,
                    },
                    {
                        name: "⚙️ Settings",
                        value: `\`${PREFIX}help-settings\``,
                        inline: true,
                    },
                    {
                        name: "🎵 Music",
                        value: `\`${PREFIX}help-music\``,
                        inline: true,
                    }
                )
                .setColor("YELLOW");
            return message.channel.send(helpembed);
        }

        message.channel.send({ embed: embed });
    }
};
