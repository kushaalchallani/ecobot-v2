const Command = require("../../structures/bases/commandBase");
const { premiumModel } = require("../../database/models/export/index");
const Embed = require("../../structures/embed");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "gimmemyperks",
            description: "Claim your [patreon](https://www.patreon.com/Ecoobot) perks.",
            aliases: ["patreonperks", "premiumperks", "claimperks"],
            category: "Utilites",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
            ownerOnly: false,
            guildOnly: true,
            cooldown: 15,
        });
    }

    async execute(message) {
        const role =
            message.member.roles.cache.get("775630671301312513") ||
            message.member.roles.cache.get("775630719544328202");

        if (!role) {
            return message.channel.send(
                "Looks like you have nothing to claim! If you have purchased a tier, make sure you have connected your Discord account to your patreon: https://support.patreon.com/hc/en-us/articles/212052266-Get-my-Discord-role"
            );
        }

        const data = await premiumModel.findOne({
            user: message.author.id,
        });

        if (role) {
            message.channel.send(
                new Embed().setDescription("Please provide a Guild id to add Premium.").setColor("BLUE")
            );
            const filter = (m) => m.author.id === message.author.id;

            message.channel
                .awaitMessages(filter, { max: 1, time: 100000, errors: ["time"] })
                .then((collected) => {
                    if (data) {
                        data.premium = true;
                        data.save();
                    } else {
                        const premium = new premiumModel({
                            guildID: collected.first(),
                            user: message.author.id,
                            premium: true,
                        });

                        premium.save();
                    }
                })
                .catch((err) => console.log(err));
        }
    }
};
