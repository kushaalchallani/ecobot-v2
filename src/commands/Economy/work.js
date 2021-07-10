const Command = require("../../structures/bases/commandBase");
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();
const { error, success } = require("../../utils/export/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "work",
            description: "Work your ass to get some money",
            category: "Economy",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
        });
    }

    async execute(message) {
        const result = await cs.work({
            user: message.author,
            guild: message.guild,
            maxAmount: 3000,
            replies: ["Programmer", "Builder", "Waiter", "Busboy", "Chief", "Mechanic"],
            cooldown: 3600,
        });
        if (result.error) return error(`You have already worked recently Try again in ${result.time}`, message.channel);
        else success(`You worked as a **${result.workType}** and earned \`$${result.amount}\`.`, message.channel);
    }
};
