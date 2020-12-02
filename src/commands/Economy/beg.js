const Command = require("../../structures/bases/commandBase");

module.exports = class extends (
    Command
) {
    constructor(...args) {
        super(...args, {
            name: "beg",
            description: "Search discord api documentation.",
            category: "Bot Owner",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
            cooldown: 10,
            examples: ["docs Client", "docs Message", "docs ClientUser#setActivity --src=master"],
        });
    }

    async execute(message) {
        const random = Math.round(Math.random() * 200);
        const randomMessage = [
            `WOW **Elon Musk** gave you ${random.toLocaleString()} coins.`,
            `**Bill Gates** gave you ${random.toLocaleString()} coins.`,
            `A **beggar** found ${random.toLocaleString()} coins for you.`,
            `**ur mom** found ${random.toLocaleString()} coins while cleaning the house.`,
            `You looked inside your **stepsister's** drawer and found ${random.toLocaleString()} coins.`,
            `You asked your **dog** and he vomited ${random.toLocaleString()} coins.`,
            `You gave **DashCruft** free subscribers so he gave you ${random.toLocaleString()} coins.`,
        ];
        const response = randomMessage[Math.floor(Math.random() * randomMessage.length)];
        await message.reply(`${response}`).catch();
        await this.client.giveCoins(message.author.id, random);
    }
};
