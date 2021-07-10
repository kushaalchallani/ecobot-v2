const Command = require("../../structures/bases/commandBase");
const { muteModel } = require("../../database/models/export/index");
const { error, success, incorrect } = require("../../utils/export/index");
const Embed = require("../../structures/embed");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "mute",
            description: "Mute a user for breaking rules",
            aliases: ["m"],
            category: "Moderation",
            cooldown: 5,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_ROLES"],
            memberPermission: ["SEND_MESSAGES", "MANAGE_ROLES"],
            usage: "<user> [reason]",
            examples: ["mute @Gogeta#0069", "mute @Gogeta#0069 Spamming", "mute 485716273901338634 Spamming"],
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
            return error("I can't Mute this member as their roles are higher/equal to mine", message.channel);
        } else if (muterole.position >= message.guild.me.roles.highest.position) {
            return error("I can't mute this member because the role `Muted` is higher than mine", message.channel);
        }

        const isMuted = await muteModel.findOne({
            guildID: message.guild.id,
            memberID: user.id,
        });

        if (isMuted) {
            return error("This user is already muted", message.channel);
        }

        for (const channel of message.guild.channels.cache) {
            channel[1]
                .updateOverwrite(muterole, {
                    SEND_MESSAGES: false,
                    CONNECT: false,
                })
                .catch((err) => console.log(err));
        }
        const muteRole = message.guild.roles.cache.find((r) => r.name === "Muted");
        const noEveryone = user.roles.cache.filter((r) => r.name !== "@everyone");

        for (const role of noEveryone) {
            await user.roles.remove(role[0]).catch((err) => console.log(err));
        }

        user.roles.add(muteRole).catch((err) => console.log(err));

        const muteDoc = new muteModel({
            guildID: message.guild.id,
            memberID: user.id,
            memberRoles: noEveryone.map((r) => r),
        });

        await muteDoc.save().catch((err) => console.log(err));

        const reason = args.slice(1).join(" ");

        try {
            success(`Muted **${user}** ${reason ? `for **Reason:** \`${reason}\`` : ""}`, message.channel);

            const embed = new Embed()
                .setColor("ORANGE")
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setTimestamp(Date.now())
                .setDescription(
                    `You have been muted in **${message.guild.name}** ${reason ? `for **Reason:** \`${reason}\`` : ""}`
                );
            user.send(embed);
        } catch {
            error(`${user}'s DM is closed could not send message`, message.channel);
        }
    }
};
