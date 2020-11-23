const Command = require("../../structures/bases/commandBase");
const Embed = require("../../structures/embed");
const { incorrect } = require("../../utils/export/index");
const { inspect } = require("util");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "eval",
            description: "Evaluate an expected output",
            category: "Bot Owner",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["ADMINISTRATOR"],
            nsfw: false,
            ownerOnly: true,
            cooldown: 30,
        });
    }

    async execute(message, args) {
        const command = args.slice(0).join(" ");

        if (!command) {
            return incorrect("You need to specify something to eval", message.channel);
        }

        try {
            const evaled = eval(command);

            const embed = new Embed()
                .setColor("RANDOM")
                .setTitle("Evaluated")
                .addField("📥 To Eval", `\`\`\`${command}\`\`\``)
                .addField("📤 Evaled", `\`\`\`js\n${inspect(evaled, { depth: 0 })}\`\`\``)
                .addField("Type Of", `\`\`\`${typeof evaled}\`\`\``);
            message.channel.send(embed);
        } catch (error) {
            const embed = new Embed().setColor("RANDOM").setTitle("Error").addField("Error", `${error}`);
            message.channel.send(embed);
        }
    }
};
