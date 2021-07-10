const Command = require("../../structures/bases/commandBase");
const Embed = require("../../structures/embed");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "invite",
            description: "Get all the neccessary link of the bots",
            aliases: ["supportserver"],
            category: "Utilites",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
            ownerOnly: false,
            cooldown: 10,
        });
    }

    async execute(message) {
        const embed = new Embed()
            .setColor("BLUE")
            .addField(
                "Add the bot",
                "[Here](https://discord.com/oauth2/authorize?client_id=742738378445029387&scope=bot&permissions=8)",
                true
            )

            .addField("Support Server", "[Here](https://discord.gg/ZfeUuHn)", true)
            .addField("Twitter", "[Here](https://twitter.com/itz__kcplayz)", true)
            .addField("Patreon", "[Here](https://patreon.com/Ecoobot)", true);
        message.channel.send(embed);
    }
};
