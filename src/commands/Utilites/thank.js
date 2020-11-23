const Command = require("../../structures/bases/commandBase");
const { thanksModel } = require("../../database/models/export/index");
const { error, incorrect, success } = require("../../utils/export/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "thank",
            description: "Thank an user who helped you",
            category: "Utilites",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
            ownerOnly: false,
            cooldown: 15,
            usage: "<user>",
        });
    }

    async execute(message) {
        const target = message.mentions.users.first();
        if (!target) {
            incorrect("Please specify someone to thank", message.channel);
            return;
        }

        const { guild } = message;
        const guildId = guild.id;
        const targetId = target.id;
        const authorId = message.author.id;
        const now = new Date();

        if (targetId === authorId) {
            error("You cannot thank yourself", message.channel);
            return;
        }

        const authorData = await thanksModel.findOne({
            userId: authorId,
            guildId,
        });

        if (authorData && authorData.lastGave) {
            const then = new Date(authorData.lastGave);

            const diff = now.getTime() - then.getTime();
            const diffHours = Math.round(diff / (1000 * 60 * 60));

            const hours = 24;
            if (diffHours <= hours) {
                error(`You have already thanked someone within the last ${hours} hours.`, message.channel);
                return;
            }
        }

        // Update the "lastGave" property for the command sender
        await thanksModel.findOneAndUpdate(
            {
                userId: authorId,
                guildId,
            },
            {
                userId: authorId,
                guildId,
                lastGave: now,
            },
            {
                upsert: true,
            }
        );

        // Increase how many thanks the target user has had
        const result = await thanksModel.findOneAndUpdate(
            {
                userId: targetId,
                guildId,
            },
            {
                userId: targetId,
                guildId,
                $inc: {
                    received: 1,
                },
            },
            {
                upsert: true,
                new: true,
            }
        );

        const amount = result.received;
        success(`You have thanked <@${targetId}>! They now have ${amount} thanks.`, message.channel);
    }
};
