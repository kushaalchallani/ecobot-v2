const Embed = require("../../structures/embed");
const Command = require("../../structures/bases/commandBase");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "balance",
            description:
                "Check your coin balance, or someone elses. Shows pocket, bank and networth, if you are using it for yourself it also shows your bankspace available.",
            aliases: ["bal", "coins", "bank", "networth"],
            category: "Economy",
            cooldown: 3,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            usage: "[user]",
            examples: ["balance", "balance @Gogeta#0069", "balance Gogeta", "balance 485716273901338634"],
            ownerOnly: false,
            nsfw: false,
            bankspace: 0,
        });
    }

    async execute(message, args) {
        const member =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]) ||
            message.guild.members.cache.find(
                (member) => member.user.username === args.slice(0).join(" ") || member.user.username === args[0]
            ) ||
            message.member;
        const user = await this.client.util.fetchUser(member.id);
        const embed = new Embed()
            .setTitle(`${member.user.username}'s Balance`)
            .setTimestamp()
            .setFooter("💰")
            .setDescription(
                `💳 **Wallet**: ${user.coinsInWallet.toLocaleString()}\n🏦 **Bank**: ${user.coinsInBank.toLocaleString()}/${user.bankSpace.toLocaleString()}\n\n🌐 **Total Net Worth**: ${(
                    user.coinsInWallet + user.coinsInBank
                ).toLocaleString()}`
            )
            .setColor("RANDOM");
        message.channel.send(embed);
    }
};
