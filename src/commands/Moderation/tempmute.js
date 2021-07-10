const Command = require("../../structures/bases/commandBase");
const ms = require("ms");
const { tempMuteModel } = require("../../database/models/export/index");
const { error, success, incorrect } = require("../../utils/export/index");
const Embed = require("../../structures/embed");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "tempmute",
            description: "Mute a user for a specific amount of time",
            aliases: ["timemute", "timermute", "tmute"],
            category: "Moderation",
            cooldown: 5,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_ROLES"],
            memberPermission: ["SEND_MESSAGES", "MANAGE_ROLES"],
            usage: "<user> <time> [reason]",
            examples: [
                "tempmute @Gogeta#0069 10m",
                "tempmute @Gogeta#0069 1h Spamming",
                "tempmute 485716273901338634 1d Spamming",
            ],
            ownerOnly: false,
            nsfw: false,
        });
    }

    async execute(message, args) {
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const msRegex = RegExp(/(\d+(s|m|h|w))/);

        let muterole = message.guild.roles.cache.find((r) => r.name === "Muted");

        if (!user) {
            return incorrect("You need to mention a user to mute", message.channel);
        } else if (!msRegex.test(args[1])) {
            return incorrect("That is not a valid amount to time to mute a member", message.channel);
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
        } else if (ms(msRegex.exec(args[1])[0]) > 2592000000) {
            return error("You can't mute a member for more than a month", message.channel);
        }

        const isMuted = await tempMuteModel.findOne({
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

        const muteDoc = new tempMuteModel({
            guildID: message.guild.id,
            memberID: user.id,
            length: Date.now() + ms(msRegex.exec(args[1])[0]),
            memberRoles: noEveryone.map((r) => r),
        });

        await muteDoc.save().catch((err) => console.log(err));

        const reason = args.slice(2).join(" ");

        try {
            success(
                `Tempmuted **${user}** for \`${msRegex.exec(args[1])[0]}\` ${
                    reason ? `for **Reason:** \`${reason}\`` : ""
                }`,
                message.channel
            );

            const embed = new Embed()
                .setColor("ORANGE")
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setTimestamp(Date.now())
                .setDescription(
                    `You have been tempmuted in **${message.guild.name}** for \`${msRegex.exec(args[1])[0]}\` ${
                        reason ? `for **Reason:** \`${reason}\`` : ""
                    }`
                );
            user.send(embed);
        } catch {
            error(`${user}'s DM is closed could not send message`, message.channel);
        }
    }
};
