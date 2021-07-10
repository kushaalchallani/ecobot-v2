const Command = require("../../structures/bases/commandBase");
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();
const Embed = require("../../structures/embed");
const { error } = require("../../utils/export/index");
const { prefixModel } = require("../../database/models/export/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "weekly",
            description: "Get your weekly coins",
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

        const result = await cs.weekly({
            user: message.author,
            guild: message.guild,
            amount: 2000,
        });
        if (result.error)
            return error(`You have used weekly recently Try again in \`${result.time}\``, message.channel);

        const claimed = new Embed()
            .setTitle(`Here are your weekly coins, **${message.author.username}**`)
            .setDescription(
                `**$${result.amount}** were placed in your wallet\n\nThank you for purchasing premium. Use \`${prefix}patreon\` and view the other perks. [Click here](https://www.patreon.com/Ecoobot) to go patreon`
            )
            .setColor("RANDOM");
        message.channel.send(claimed);
    }
};
