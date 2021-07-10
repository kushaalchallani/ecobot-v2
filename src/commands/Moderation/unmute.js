const Command = require("../../structures/bases/commandBase");
const { muteModel } = require("../../database/models/export/index");
const { error, success, incorrect } = require("../../utils/export/index");
const Embed = require("../../structures/embed");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "ummute",
            description: "Unmute a previously muted user",
            aliases: ["um"],
            category: "Moderation",
            cooldown: 5,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_ROLES"],
            memberPermission: ["SEND_MESSAGES", "MANAGE_ROLES"],
            usage: "<user> [reason]",
            examples: [
                "unmute @Gogeta#0069",
                "ubmute @Gogeta#0069 Enough Punishment",
                "mute 485716273901338634 Enough Punishment",
            ],
            ownerOnly: false,
            nsfw: false,
        });
    }

    async execute(message, args) {
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        let muterole = message.guild.roles.cache.find((r) => r.name === "Muted");

        if (!user) {
            return incorrect("You need to mention a user to mute", message.channel);
        }

        if (!muterole) {
            muterole = await message.guild.roles
                .create({
                    data: {
                        name: "Muted",
                        color: "#7e9091",
                    },
                })
                .catch((err) => console.log(err));
        }

        if (user.roles.highest.position >= message.guild.me.roles.highest.position) {
            return error("I can't unmute this member as their roles are higher/equal to mine", message.channel);
        } else if (muterole.position >= message.guild.me.roles.highest.position) {
            return error("I can't unmute this member because the role `Muted` is higher than mine", message.channel);
        }

        const isNotMuted = await muteModel.findOne({
            guildID: message.guild.id,
            memberID: user.id,
        });

        if (!isNotMuted) {
            return error("This user is not muted", message.channel);
        }

        for (const channel of message.guild.channels.cache) {
            channel[1]
                .updateOverwrite(muterole, {
                    SEND_MESSAGES: false,
                    CONNECT: false,
                })
                .catch((err) => console.log(err));
        }

        const muteArray = await muteModel.find({
            guildID: message.guild.id,
        });

        for (const muteDoc of muteArray) {
            const guild = this.client.guilds.cache.get(muteDoc.guildID);
            if (!guild) return console.log("guild not found :(");
            const member = guild ? guild.members.cache.get(muteDoc.memberID) : null;
            const muteRole = guild ? guild.roles.cache.find((r) => r.name === "Muted") : null;
            if (member) {
                await member.roles.remove(muteRole ? muteRole.id : "").catch((err) => console.log(err));

                for (const role of muteDoc.memberRoles) {
                    await member.roles.add(role).catch((err) => console.log(err));
                }
            }
            await muteDoc.deleteOne().catch((err) => console.log(err));
        }

        const reason = args.slice(1).join(" ");

        try {
            success(`Unmuted **${user}** ${reason ? `for **Reason:** \`${reason}\`` : ""}`, message.channel);

            const embed = new Embed()
                .setColor("ORANGE")
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setTimestamp(Date.now())
                .setDescription(
                    `You have been unmuted in **${message.guild.name}** ${
                        reason ? `for **Reason:** \`${reason}\`` : ""
                    }!`
                );
            user.send(embed);
        } catch {
            error(`${user}'s DM is closed could not send message`, message.channel);
        }
    }
};
