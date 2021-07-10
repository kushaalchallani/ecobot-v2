const Command = require("../../structures/bases/commandBase");
const CurrencySystem = require("currency-system");
const { error, incorrect, success } = require("../../utils/export/index");
const cs = new CurrencySystem();

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "rob",
            description: "Rob an user and get some money",
            category: "Economy",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
            examples: ["rob @Gogeta#2869", "rob 485716273901338634"],
            usage: "<user>",
        });
    }

    async execute(message, args) {
        let user;
        if (message.mentions.users.first()) {
            user = message.mentions.users.first();
        } else if (args[0]) {
            user = message.guild.members.cache.get(args[0]);
            if (user) user = user.user;
        }

        if (user.bot || user === this.client.user) return error("This user is a bot.", message.channel);
        if (!user) return incorrect("Sorry, you forgot to mention somebody.", message.channel);
        if (user === message.author) return error("You can't rob yourself", message.channel);

        const result = await cs.rob({
            user: message.author,
            user2: user,
            guild: message.guild,
            minAmount: 100,
            successPercentage: 5,
            cooldown: 1800,
            maxRob: 2500,
        });
        if (result.error) {
            if (result.type === "time")
                return error(`You have already robbed recently Try again in \`${result.time}\``, message.channel);
            if (result.type === "low-money")
                return error(`You need atleast \`$${result.minAmount}\` to rob somebody.`, message.channel);
            if (result.type === "low-wallet")
                return error(
                    `${result.user2.username} have less than \`$${result.minAmount}\` to rob.`,
                    message.channel
                );
            if (result.type === "caught")
                return success(
                    `${message.author.username} you robbed **${result.user2.username}** and got caught and you payed \`$${result.amount}\` to **${result.user2.username}**!`,
                    message.channel
                );
        } else if (result.type === "success")
            return success(
                `**${message.author.username}** you robbed **${result.user2.username}** and got away with \`${result.amount}\`!`,
                message.channel
            );
    }
};
