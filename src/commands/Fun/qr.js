const Embed = require("../../structures/embed");
const { error } = require("../../utils/export/index");
const Command = require("../../structures/bases/commandBase");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "qr",
            description: "Generates a qr code",
            aliases: ["code"],
            category: "Fun",
            cooldown: 10,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS", "ATTACT_FILES"],
            memberPermission: ["SEND_MESSAGES"],
            usage: "<text>",
            examples: ["qr is this a good bot?"],
            ownerOnly: false,
            nsfw: false,
        });
    }

    async execute(message, args) {
        const text = args.slice(0).join(" ");
        if (!text) {
            error("You must add text to your command, so I can convert it to a QR code.", message.channel);
        } else {
            const user_text = text.replace(/ /g, "%20");
            const qr_generator = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${user_text}`;

            message.channel.send(
                new Embed()
                    .setTitle("QR Code")
                    .setColor("#3440eb")
                    .setDescription("Here is your QR Code!")
                    .setImage(qr_generator)
            );
        }
    }
};
