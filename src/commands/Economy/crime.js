const { success } = require("../../utils/export/index");
const Command = require("../../structures/bases/commandBase");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "crime",
            description: "Break the law to earn to coins? Interesting",
            category: "Economy",
            cooldown: 300,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            ownerOnly: false,
            nsfw: false,
            bankspace: 7,
        });
    }

    async execute(message) {
        const another = Math.round(Math.random() * 3);
        if (another === 2) {
            return success("You were caught!", message.channel);
        }

        const random = Math.round(Math.random() * 250);
        const randomMessage = [
            `You assassinated **Bill Gates**, You were payed \`$${random.toLocaleString()}\` coins.`,
            `You stole from a poor old grannie and she only had \`$${random.toLocaleString()}\` coins.`,
            `You raided a drug dealers home and found \`$${random.toLocaleString()}\` coins.`,
            `You murdered **Donald Trump**, You were payed \`$${random.toLocaleString()}\` coins.`,
            `You almost got shot, but you had **GODMODE** enabled and killed him, You were payed \`$${random.toLocaleString()}\` coins.`,
        ];

        const response = randomMessage[Math.floor(Math.random() * randomMessage.length)];

        success(`${response}`, message.channel);

        await this.client.util.giveCoins(message.author.id, random);
    }
};
