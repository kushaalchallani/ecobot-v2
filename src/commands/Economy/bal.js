const Command = require("../../structures/bases/commandBase");
const Embed = require("../../structures/embed");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "bal",
            description: "Search discord api documentation.",
            category: "Bot Owner",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
            cooldown: 10,
            bankSpace: 0,
            examples: ["docs Client", "docs Message", "docs ClientUser#setActivity --src=master"],
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
        const user = await this.client.fetchUser(member.id);
        const embed = new Embed()
            .setTitle(`${member.user.username}'s Balance`)
            .setDescription(
                `**Wallet**: ${user.coinsInWallet.toLocaleString()}
        **Bank**: ${user.coinsInBank.toLocaleString()}/${user.bankSpace.toLocaleString()}
        **Total**: ${(user.coinsInWallet + user.coinsInBank).toLocaleString()}`
            )
            .setColor("RANDOM");
        message.channel.send(embed);
    }
};
