const Command = require("../../structures/bases/commandBase");
const { error } = require("../../utils/export/index");
const { prefixModel } = require("../../database/models/export/index");
const CurrencySystem = require("currency-system");
const Embed = require("../../structures/embed");
const cs = new CurrencySystem();

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "hourly",
            description: "Get your hourly coins and spend em!",
            category: "Economy",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
        });
    }

    async execute(message) {
        const prefix = (await prefixModel.findOne({ guildID: message.guild.id }))
            ? (await prefixModel.findOne({ guildID: message.guild.id })).prefix
            : this.client.prefix;

        const result = await cs.hourly({
            user: message.author,
            guild: message.guild,
            amount: 50,
        });
        if (result.error)
            return error(`You have used hourly recently Try again in \`${result.time}\``, message.channel);

        const claimed = new Embed()
            .setTitle(`Here are your hourly coins, **${message.author.username}**`)
            .setDescription(
                `**$${result.amount}** were placed in your wallet\n\nYou can get your weekly and monthly coins by buying premium. Use \`${prefix}patreon\` and view the perks. [Click here](https://www.patreon.com/Ecoobot) to go patreon`
            )
            .setColor("RANDOM");
        message.channel.send(claimed);
    }
};
