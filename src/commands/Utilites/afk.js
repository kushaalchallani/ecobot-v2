const Command = require("../../structures/bases/commandBase");
const { afkModel } = require("../../database/models/export/index");
const { error, incorrect, success } = require("../../utils/export/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "afk",
            description: "Set an AFK status",
            category: "Utilites",
            ownerOnly: false,
            nsfw: false,
            cooldown: 30,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            usage: "<..reason>",
        });
    }

    async execute(message, args) {
        const reason = args.slice(0).join(" ");

        if (!reason) return incorrect("Please provide a reason.", message.channel);

        if (reason.toLowerCase() === "@everyone") {
            return error("Please provide another reason", message.channel);
        }

        if (reason.toLowerCase() === "@here") {
            return error("Please provide another reason", message.channel);
        }

        await afkModel.findOne(
            {
                ID: message.author.id,
            },
            (err, data) => {
                if (err) throw err;
                if (!data) {
                    const newD = new afkModel({
                        ID: message.author.id,
                        AFK: true,
                        Reason: reason,
                    });
                    return newD.save();
                }
                data.AFK = true;
                data.Reason = reason;
                data.save();
            }
        );
        return success(`I have set your AFK status. **Reason:** ${reason}`, message.channel);
    }
};
