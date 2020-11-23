const Command = require("../../structures/bases/commandBase");
const Embed = require("../../structures/embed");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "patreon",
            description: "Help EcoBot running by donating",
            aliases: ["donate"],
            category: "Utilites",
            ownerOnly: false,
            nsfw: false,
            cooldown: 10,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
        });
    }

    async execute(message) {
        const embed = new Embed()
            .setTitle("EcoBot Premium")
            .setDescription(
                "Help fund EcoBot to keep it alive and performing well, as well as earning some sweet and juicy perks!\n\n[Patreon](https://www.patreon.com/Ecoobot) - Monthly support\n\nAll the premium perks are listed on [patreon](https://www.patreon.com/Ecoobot) and remember to link your discord account on patreon."
            )
            .setColor("RANDOM");

        message.channel.send(embed);
    }
};
