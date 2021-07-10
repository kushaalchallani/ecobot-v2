const Command = require("../../structures/bases/commandBase");
const Embed = require("../../structures/embed");
const { prefixModel } = require("../../database/models/export/index");
const { MessageMenuOption, MessageMenu } = require("discord-buttons");

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
            examples: ["help", "help ping", "help serverinfo"],
            usage: "[command name]",
        });
    }

    async execute(message, args) {
        const PREFIX = (await prefixModel.findOne({ guildID: message.guild.id }))
            ? (await prefixModel.findOne({ guildID: message.guild.id })).prefix
            : this.client.prefix;

        const command =
            this.client.commands.get(args[0]) ||
            this.client.commands.find((c) => c.aliases && c.aliases.includes(args[0]));

        if (command) {
            const embed = new Embed()
                .setDescription(`**❯ Description**\n\`${command.description}\``)
                .setColor("BLUE")
                .setFooter("<> is required & [] is optional. Make sure to remove the brackets while using commands");
            embed.setTitle(`\`${command.name} ${command.usage || ""}\``);
            if (command.category) embed.addField("❯ Category", `\`${command.category}\``);
            if (command.aliases.length)
                embed.addField("❯ Aliases", command.aliases.map((alias) => `\`${alias}\``).join(" "));
            if (command.cooldown) embed.addField("❯ Cooldown", `\`${command.cooldown}\``);
            if (command.memberPermission.length)
                embed.addField(
                    "❯ User Permissions",
                    command.memberPermission.map((memberPermission) => `\`${memberPermission}\``).join(" ")
                );
            if (command.botPermission.length)
                embed.addField(
                    "❯ Bot Permissions",
                    command.botPermission.map((botPermission) => `\`${botPermission}\``).join(" ")
                );
            if (command.subcommands)
                embed.addField(
                    "❯ Subcommands",
                    command.subcommands.map((subcommands) => `\`${subcommands}\``).join("\n")
                );
            if (command.examples.length)
                embed.addField("❯ Examples", command.examples.map((examples) => `\`${examples}\``).join("\n"));
            message.channel.send(embed);
        } else {
            // const imageCmds = new MessageMenuOption()
            //     .setLabel("Image")
            //     .setValue("imageCmds")
            //     .setDescription("Click This to view the Image related commands")
            //     .setDefault()
            //     .setEmoji("📸");

            const ecoCmds = new MessageMenuOption()
                .setLabel("Economy")
                .setValue("ecoCmds")
                .setDescription("Click This to view the Economy related commands")
                .setDefault()
                .setEmoji("💰");

            const funCmds = new MessageMenuOption()
                .setLabel("Fun")
                .setValue("funCmds")
                .setDescription("Click This to view the Fun related commands")
                .setDefault()
                .setEmoji("😄");

            const nsfwCmds = new MessageMenuOption()
                .setLabel("NSFW")
                .setValue("nsfwCmds")
                .setDescription("Click This to view the NSFW related commands")
                .setDefault()
                .setEmoji("🔞");

            const utilCmds = new MessageMenuOption()
                .setLabel("Utilites")
                .setValue("utilCmds")
                .setDescription("Click This to view the Utilites related commands")
                .setDefault()
                .setEmoji("🛠️");

            const modCmds = new MessageMenuOption()
                .setLabel("Moderation")
                .setValue("modCmds")
                .setDescription("Click This to view the Moderation related commands")
                .setDefault()
                .setEmoji("🛡️");

            const settingsCmds = new MessageMenuOption()
                .setLabel("Settings")
                .setValue("settingsCmds")
                .setDescription("Click This to view the Settings related commands")
                .setDefault()
                .setEmoji("⚙️");

            const musicCmds = new MessageMenuOption()
                .setLabel("Music")
                .setValue("musicCmds")
                .setDescription("Click This to view the Music related commands")
                .setDefault()
                .setEmoji("🎵");
            const selection = new MessageMenu()
                .setID("Selection")
                .setMaxValues(1)
                .setMinValues(1)
                .setPlaceholder("Click me to view a command category")
                // .addOption(imageCmds)
                .addOption(ecoCmds)
                .addOption(funCmds)
                .addOption(nsfwCmds)
                .addOption(utilCmds)
                .addOption(modCmds)
                .addOption(settingsCmds)
                .addOption(musicCmds);
            const embed = new Embed()
                .setColor("YELLOW")
                .setAuthor("EcoBot Help Menu", this.client.user.displayAvatarURL())
                .setDescription(
                    `Support us by donating through **[patreon](https://www.patreon.com/ecoobot)**\n\nTo view more information about a command, type \`${PREFIX}help <command name>\`.`
                );

            this.client.author.set(message.author.id, message);
            await message.channel.send(embed, selection);
        }
    }
};
