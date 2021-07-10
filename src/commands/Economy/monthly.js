const Command = require("../../structures/bases/commandBase");
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();
const Embed = require("../../structures/embed");
const { error } = require("../../utils/export/index");
const { prefixModel } = require("../../database/models/export/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "monthly",
            description: "Get your monthly coins and spend em!",
            category: "Economy",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
            premium: true,
        });
    }

    async execute(message) {
        const prefix = (await prefixModel.findOne({ guildID: message.guild.id }))
            ? (await prefixModel.findOne({ guildID: message.guild.id })).prefix
            : this.client.prefix;

        const result = await cs.monthly({
            user: message.author,
            guild: message.guild,
            amount: 10000,
        });
        if (result.error)
            return error(`You have used monthly recently Try again in \`${result.time}\``, message.channel);

        const claimed = new Embed()
            .setTitle(`Here are your monthly coins, **${message.author.username}**`)
            .setDescription(
                `**$${result.amount}** were placed in your wallet\n\nThank you for purchasing premium. Use \`${prefix}patreon\` and view the other perks. [Click here](https://www.patreon.com/Ecoobot) to go patreon`
            )
            .setColor("RANDOM");
        message.channel.send(claimed);
    }
};
