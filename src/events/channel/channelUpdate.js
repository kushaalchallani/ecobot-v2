/* eslint-disable no-constant-condition */
require("dotenv/config");
const Event = require("../../structures/bases/eventBase");
const Embed = require("../../structures/embed");
const { channellogsModel } = require("../../database/models/export/index");

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            name: "channelUpdate",
        });
    }

    async execute(oldChannel, newChannel) {
        const data = await channellogsModel.findOne({
            guildId: oldChannel.guild.id,
        });

        if (!data) return;

        const sendchannel = oldChannel.guild.channels.cache.find((channel) => channel.id === data.channelId);

        if (!sendchannel) return;

        try {
            const guildChannel = newChannel.guild;
            if (!guildChannel || !guildChannel.available) return;

            const types = {
                text: "Text Channel",
                voice: "Voice Channel",
                null: "No Type",
                news: "News Channel",
                store: "Store Channel",
                category: "Category",
            };

            let embed;

            if (oldChannel.name != newChannel.name) {
                embed = new Embed(this.client, newChannel.guild)
                    .setDescription(`**${newChannel.type === "category" ? "Category" : "Channel"} Name Updated**`)
                    .setColor("YELLOW")
                    .setFooter(`ID: ${newChannel.id}`)
                    .setAuthor(newChannel.guild.name, newChannel.guild.iconURL())
                    .addFields(
                        { name: "Before:", value: `\`#${oldChannel.name}\``, inline: true },
                        { name: "After:", value: `\`#${newChannel.name}\``, inline: true }
                    )
                    .setTimestamp();
                sendchannel.send(embed);
            }
            if (oldChannel.type != newChannel.type) {
                const embed = new Embed(this.client, newChannel.guild)

                    .setDescription(
                        `**${newChannel.type === "category" ? "Category" : "Channel"} Type Updated \`#${
                            newChannel.name
                        }\`**`
                    )
                    .setColor("YELLOW")
                    .setFooter(`ID: ${newChannel.id}`)
                    .setAuthor(newChannel.guild.name, newChannel.guild.iconURL())
                    .addFields(
                        {
                            name: "Before:",
                            value: `\`${types[oldChannel.type]}\``,
                            inline: true,
                        },
                        {
                            name: "After:",
                            value: `\`${types[newChannel.type]}\``,
                            inline: true,
                        }
                    )
                    .setTimestamp();

                sendchannel.send(embed);
            }
            if (oldChannel.topic != newChannel.topic) {
                embed = new Embed(this.client, newChannel.guild)
                    .setDescription(`**${newChannel.type === "category" ? "Category" : "Channel"} Topic Updated**`)
                    .setColor("YELLOW")
                    .setFooter(`ID: ${newChannel.id}`)
                    .setAuthor(newChannel.guild.name, newChannel.guild.iconURL())
                    .addFields(
                        {
                            name: "Before:",
                            value: `${oldChannel.topic ? oldChannel.topic : "*Empty Topic*"}`,
                            inline: true,
                        },
                        {
                            name: "After:",
                            value: `${newChannel.topic ? newChannel.topic : "*Empty Topic*"}`,
                            inline: true,
                        }
                    )
                    .setTimestamp();
                sendchannel.send(embed);
            }

            const permDiff = oldChannel.permissionOverwrites
                .filter((x) => {
                    if (
                        newChannel.permissionOverwrites.find((y) => y.allow.bitfield == x.allow.bitfield) &&
                        newChannel.permissionOverwrites.find((y) => y.deny.bitfield == x.deny.bitfield)
                    ) {
                        return false;
                    }
                    return true;
                })
                .concat(
                    newChannel.permissionOverwrites.filter((x) => {
                        if (
                            oldChannel.permissionOverwrites.find((y) => y.allow.bitfield == x.allow.bitfield) &&
                            oldChannel.permissionOverwrites.find((y) => y.deny.bitfield == x.deny.bitfield)
                        ) {
                            return false;
                        }
                        return true;
                    })
                );

            if (permDiff.size) {
                // eslint-disable-next-line prefer-const
                embed = new Embed(this.client, newChannel.guild)
                    .setDescription(
                        `**${
                            newChannel.type === "category" ? "Category" : "Channel"
                        } Permission Updated**\n**Note:** Check [documentation](https://discordapp.com/developers/docs/topics/permissions) to see what the numbers mean`
                    )
                    .setColor("YELLOW")
                    .setFooter(`ID: ${newChannel.id}`)
                    .setAuthor(newChannel.guild.name, newChannel.guild.iconURL())
                    .setTimestamp();
                for (const permID of permDiff.keys()) {
                    // load both overwrites into variables
                    const oldPerm = oldChannel.permissionOverwrites.get(permID) || {};
                    const newPerm = newChannel.permissionOverwrites.get(permID) || {};
                    const oldBitfields = {
                        allowed: oldPerm.allow ? oldPerm.allow.bitfield : "None",
                        denied: oldPerm.deny ? oldPerm.deny.bitfield : "None",
                    };
                    const newBitfields = {
                        allowed: newPerm.allow ? newPerm.allow.bitfield : "None",
                        denied: newPerm.deny ? newPerm.deny.bitfield : "None",
                    };
                    // load roles / guildmember for that overwrite
                    let role;
                    let member;
                    if (oldPerm.type == "role" || newPerm.type == "role") {
                        role = newChannel.guild.roles.cache.get(newPerm.id || oldPerm.id);
                    }
                    if (oldPerm.type == "member" || newPerm.type == "member") {
                        member = await newChannel.guild.members.fetch(newPerm.id || oldPerm.id);
                    }
                    // make text about what changed
                    let value = "";
                    if (oldBitfields.allowed !== newBitfields.allowed) {
                        value += `Allowed Perms: \`${oldBitfields.allowed}\` to \`${newBitfields.allowed}\`\n`;
                    }
                    if (oldBitfields.denied !== newBitfields.denied) {
                        value += `Denied Perms: \`${oldBitfields.denied}\` to \`${newBitfields.denied}\``;
                    }
                    if (!value.length) value = "Overwrite got deleted";
                    // add field to embed
                    embed.fields.push({
                        name: role ? role.name + ` (ID: ${role.id}):` : member.user.username + ` (ID: ${member.id}):`,
                        value: value,
                    });
                    sendchannel.send(embed);
                }
            }
        } catch (err) {
            console.log(err);
        }
    }
};
