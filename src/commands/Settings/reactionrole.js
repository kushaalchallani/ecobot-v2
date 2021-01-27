const Command = require("../../structures/bases/commandBase");
const { incorrect } = require("../../utils/export/index");
const { fetchCache, addToCache } = require("../../features/feature/reactionrole");
const { reactionroleModel } = require("../../database/models/export/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "reactionrole",
            usage: "<message>",
            description: "Add Reaction Roles for your users",
            aliases: ["rr", "self-roles"],
            category: "Settings",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_ROLES"],
            memberPermission: ["ADMINISTRATOR", "MANAGE_SERVER"],
            nsfw: false,
            ownerOnly: false,
            cooldown: 5,
            examples: ["reactionrole message #roles React for roles", "reactionrole add "],
            subcommands: ["message", "add   "],
        });
    }

    async execute(message, args) {
        const { guild, mentions } = message;
        const { channels } = mentions;

        if (!args[0]) {
            return incorrect("Please provide a method. `message` `add`", message.channel);
        }

        if (args[0] === "message" || args[0] === "msg") {
            const targetChannel = channels.first() || message.channel;

            if (channels.first()) {
                args.shift();
            }

            const text = args.slice(1).join(" ");

            if (!text) {
                return message.channel.send("Please provide a text for reaction role message!");
            }
            const newMessage = await targetChannel.send(text);

            if (guild.me.hasPermission("MANAGE_MESSAGE")) {
                message.delete();
            }

            addToCache(guild.id, newMessage);

            new reactionroleModel({
                guildId: guild.id,
                messageId: newMessage.id,
                channelId: targetChannel.id,
            })
                .save()
                .catch(() => {
                    message.reply("Failed to save to the database. Report this!").then((message) => {
                        message.delete({
                            timeout: 1000 * 10,
                        });
                    });
                });
        }

        if (args[0] === "add" || args[0] === "make" || args[0] === "create") {
            const { guild } = message;
            const displayName = args.slice(3).join(" ");
            let emoji = args[1];
            let role = args[2];

            if (!emoji) {
                message.channel.send("Please provide an Emoji");
            }

            if (!role) {
                message.channel.send("Please provide an Role");
            }

            if (!displayName) {
                message.channel.send("Please provide an Display Name");
            }

            if (role.startsWith("<@&")) {
                role = role.substring(3, role.length - 1);
            }

            const newRole =
                guild.roles.cache.find((r) => {
                    return r.name === role || r.id === role;
                }) || null;

            if (!newRole) {
                message.channel.send(`Could not find a role for ${role}`);
                return;
            }

            role = newRole;

            if (emoji.includes(":")) {
                const emojiName = emoji.split(":")[1];
                emoji = guild.emojis.cache.find((e) => {
                    return (e.name = emojiName);
                });
            }

            console.log(emoji);

            const [fetchedMessage] = fetchCache(guild.id);

            if (!fetchedMessage) {
                message.channel.send("An error Occurred, Try Again");
                return;
            }

            const newLine = `${emoji} ${displayName}`;
            let { content } = fetchedMessage;

            if (content.includes(emoji)) {
                const split = content.split("\n");

                for (let a = 0; a < split.length; ++a) {
                    if (split[a].includes(emoji)) {
                        split[a] = newLine;
                    }
                }

                content = split.join("\n");
            } else {
                content += `\n${newLine}`;
                fetchedMessage.react(emoji);
            }

            fetchedMessage.edit(content);

            const obj = {
                guildId: guild.id,
                channelId: fetchedMessage.channel.id,
                messageId: fetchedMessage.id,
            };

            await reactionroleModel.findOneAndUpdate(
                obj,
                {
                    ...obj,
                    $addToSet: {
                        roles: {
                            emoji,
                            roleId: role.id,
                        },
                    },
                },
                {
                    upsert: true,
                }
            );

            addToCache(guild.id, fetchedMessage, emoji, role.id);
        }
    }
};
