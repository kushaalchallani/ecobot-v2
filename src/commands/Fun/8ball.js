const Embed = require("../../structures/embed");
const { replies } = require("../../json/exports/index");
const { incorrect } = require("../../utils/export/index");
const Command = require("../../structures/bases/commandBase");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "8ball",
            description: "Ask A question to the bot and see what it replies",
            aliases: ["8b", "luck"],
            category: "Fun",
            cooldown: 3,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            usage: "<question>",
            examples: ["8ball is this a good bot?"],
            ownerOnly: false,
            nsfw: false,
        });
    }

    async execute(message, args) {
        if (!args[0]) {
            return incorrect("Please ask a question!", message.channel);
        }

        if (!args[3]) {
            return incorrect("Your question be 4 or more characters", message.channel);
        }

        const result = Math.floor(Math.random() * replies.length);
        const question = args.slice(1).join(" ");

        const ballembed = new Embed()
            .setAuthor(message.author.tag)
            .setColor("#03f4fc")
            .addField("Question", question)
            .addField("Answer", replies[result]);

        message.channel.send(ballembed);
    }
};
