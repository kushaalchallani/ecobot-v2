const { success } = require("../../utils/export/index");
const Command = require("../../structures/bases/commandBase");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "beg",
            description: "Don't have money, then start beggin",
            category: "Economy",
            cooldown: 60,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            ownerOnly: false,
            nsfw: false,
            bankspace: 7,
        });
    }

    async execute(message) {
        const another = Math.round(Math.random() * 50);
        if (another === 4) {
            return success("**KC Playz**: i'm too broke man sorry", message.channel);
        }

        if (another === 10) {
            return success("**Gordon Ramsay**: go ask someone else", message.channel);
        }

        if (another === 14) {
            return success("**Kamala Harris**: ew get away", message.channel);
        }

        if (another === 16) {
            return success("**Barack Obama**: ew no", message.channel);
        }

        if (another === 22) {
            return success("**Deadpool**: begone thot", message.channel);
        }

        if (another === 25) {
            return success("**Jack Mehoff**: Get a job you hippy", message.channel);
        }

        if (another === 30) {
            return success("**Kim Kardashian**: bye bitch, no money for you", message.channel);
        }

        if (another === 33) {
            return success("**Rihanna**: I maxed my credit cards already", message.channel);
        }

        if (another === 37) {
            return success("**Jeff Kaplan**: nah, would rather not feed your gambling addiction", message.channel);
        }

        if (another === 40) {
            return success("**Sophie Turner**: I share money with no-one", message.channel);
        }

        if (another === 44) {
            return success("**Paula Deen**: stop begging", message.channel);
        }

        if (another === 48) {
            return success("**Billie Eyelash**: honestly stop asking me for money", message.channel);
        }

        if (another === 50) {
            return success("**2pac**: money.exe has stopped working", message.channel);
        }

        const random = Math.round(Math.random() * 150);
        const randomMessage = [
            `WOW **Elon Musk** gave \`$${random.toLocaleString()}\` to ${message.author}.`,
            `**Bill Gates** gave \`$${random.toLocaleString()}\` to ${message.author}.`,
            `A **beggar** found \`$${random.toLocaleString()}\` for ${message.author}.`,
            `**ur mom** found \`$${random.toLocaleString()}\` while cleaning the house and gave it to ${
                message.author
            }.`,
            `${message.author} looked inside their **stepsister's** drawer and found \`$${random.toLocaleString()}\`.`,
            `${message.author} asked their **dog** and he vomited \`$${random.toLocaleString()}\`.`,
            `${message.author} gave **KC Playz** free subscribers so he gave them \`$${random.toLocaleString()}\`.`,
            `**Oprah** has donated \`$${random.toLocaleString()}\` to ${message.author}.`,
            `**Gordon Ramsay** has donated \`$${random.toLocaleString()}\` to ${message.author}.`,
            `**Spoopy Skelo** has donated \`$${random.toLocaleString()}\` to ${message.author}.`,
            `**Mike Ock** has donated \`$${random.toLocaleString()}\` to ${message.author}.`,
            `**I. C. Wiener** has donated \`$${random.toLocaleString()}\` to ${message.author}.`,
            `**Zack Martin** has donated \`$${random.toLocaleString()}\` to ${message.author}.`,
            `**Default Jonesy** has donated \`$${random.toLocaleString()}\` to ${message.author}.`,
            `**Selena Gomez** has donated \`$${random.toLocaleString()}\` to ${message.author}.`,
        ];

        const response = randomMessage[Math.floor(Math.random() * randomMessage.length)];

        success(`${response}`, message.channel);

        await this.client.util.giveCoins(message.author.id, random);
    }
};
