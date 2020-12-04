require("dotenv/config");
const Event = require("../../structures/bases/eventBase");
const Embed = require("../../structures/embed");
const { Collection } = require("discord.js");
const { prefixModel, tagModel, premiumModel } = require("../../database/models/export/index");
const { errormsgs } = require("../../json/exports/index");
const { redEmbed } = require("../../utils/export/index");

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            name: "message",
        });
    }

    async execute(message) {
        if (!message.guild) return;

        const prefix = (await prefixModel.findOne({ guildID: message.guild.id }))
            ? (await prefixModel.findOne({ guildID: message.guild.id })).prefix
            : this.client.prefix;

        const mentionRegex = RegExp(`^<@!?${this.client.user.id}>$`);
        const mentionRegexPrefix = RegExp(`^<@!?${this.client.user.id}> `);

        if (message.content.match(mentionRegex))
            message.channel.send(
                `My prefix for ${message.guild.name} is \`${prefix}\`.\n> For more info type \`${prefix}help\``
            );

        const PREFIX = message.content.match(mentionRegexPrefix)
            ? message.content.match(mentionRegexPrefix)[0]
            : prefix;

        if (!message.content.startsWith(PREFIX)) return;
        if (message.author.bot) return;
        if (message.channel.type === "dm") return;

        const [commandName, ...args] = message.content.slice(PREFIX.length).trim().split(/ +/g);

        const command =
            this.client.commands.get(commandName) || this.client.commands.get(this.client.aliases.get(commandName));

        if (!command) {
            const tagName = message.content.slice(PREFIX.length);

            const tagDoc =
                (await tagModel.findOne({ guildID: message.guild.id, tagName: tagName })) ||
                (await tagModel.findOne({ guildID: message.guild.id, tagAliases: tagName }));

            if (tagDoc) {
                await tagDoc.updateOne({ tagUses: parseInt(tagDoc.tagUses) + 1 });
                return message.channel.send(tagDoc.tagContent);
            }
            return;
        }

        if (command.ownerOnly && message.author.id !== process.env.BOT_OWNERID) {
            return redEmbed("This command can only be used by the bot owner.", message.channel);
        }

        if (command.guildOnly && message.guild.id !== process.env.support_server_id) {
            return redEmbed("This command can only be used in support server.", message.channel);
        }

        if (command.bankSpace !== 0) {
            this.client.util.giveBankSpace(message.author.id, command.bankSpace);
        }

        const errMessage = errormsgs[Math.round(Math.random() * (errormsgs.length - 1))];
        if (command.nsfw && !message.channel.nsfw) {
            return message.channel.send(new Embed().setColor("RED").setDescription(errMessage));
        }

        const data = await premiumModel.findOne({
            guildID: message.guild.id,
            premium: true,
        });

        if (command.premium && !data) {
            return redEmbed(
                `This command is for patron only. You can find more information by using \`${prefix}premium\` if you are interested.`,
                message.channel
            );
        }

        const mentionedMember = this.client.util.getMentions().member(args[0], message.guild);

        if (command.requireMentioned && !mentionedMember) {
            return redEmbed(`You need to mention a member you want to **${command.name}**`, message.channel);
        }

        if (command.cooldown) {
            const { cooldowns } = this.client;

            if (!cooldowns.has(command.name)) {
                cooldowns.set(command.name, new Collection());
            }

            const now = Date.now();
            const timestamps = cooldowns.get(command.name);
            const cooldownAmount = command.cooldown * 1000;

            if (timestamps.has(message.author.id)) {
                const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    return message.channel.send(
                        new Embed()
                            .setColor("#7289da")
                            .setTitle("**Slow it down!**")
                            .setDescription(
                                `Please wait **${timeLeft.toFixed(1)}** more second(s) before reusing the \`${
                                    command.name
                                }\` command.\nThe default cooldown is \`${
                                    command.cooldown
                                }\`\n\nWhile you wait, go check out our [Twitter](https://www.twitter.com/itz__kcplayz), [YouTube](https://www.youtube.com/kcplayz), and [Patreon](https://patreon.com/Ecoobot)
                                `
                            )
                    );
                }
            }

            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        }

        if (command.memberPermission && !message.member.hasPermission(command.memberPermission)) {
            const memberPerms = command.memberPermission
                .map((perm) => `\`${perm.toLowerCase().replace(/_/g, " ")}\``)
                .join(", ");
            return redEmbed(
                `You don't have permission to execute this command. You require ${memberPerms} permissions`,
                message.channel
            );
        }

        if (command.botPermission && !message.guild.me.hasPermission(command.botPermission)) {
            const botPermissions = command.botPermission
                .map((perm) => `\`${perm.toLowerCase().replace(/_/g, " ")}\``)
                .join(", ");
            return redEmbed(
                `I don't have permission to execute this command. Make sure I have ${botPermissions} permissions`,
                message.channel
            );
        }

        try {
            command.execute(message, args, prefix, mentionedMember);
        } catch (error) {
            console.log(`There was an error while executing a command: ${error}`);
            redEmbed(error, message.channel);
        }
    }
};
