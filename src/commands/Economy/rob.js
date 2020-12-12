const Command = require("../../structures/bases/commandBase");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "rob",
            description: "Rob an user and get some money",
            category: "Economy",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
            cooldown: 60,
            bankSpace: 5,
            examples: ["rob @Gogeta#2869", "rob 485716273901338634", "rob Gogeta"],
            usage: "<user>",
        });
    }

    async execute(message, args) {
        const user = await this.client.fetchUser(message.author.id);
        if (user.passive == true) return message.channel.send("You're in passive mode, turn that off to rob others");
        const member =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args.join(" ")) ||
            message.guild.members.cache.find(
                (member) => member.user.username.toLowerCase() === args.join(" ").toString().toLowerCase()
            );
        if (!member) {
            return message.channel.send("You think you can rob nobody?");
        }
        const devs = ["485716273901338634"];

        if (devs.includes(member.user.id)) return message.channel.send("You can't rob the bot devs lol.");

        const robbedUser = await this.client.fetchUser(member.id);
        if (robbedUser.passive == true) return message.channel.send("Leave them alone... they are in passive mode");
        if (robbedUser.coinsInWallet < 201) {
            return message.channel.send("This user doesn't have much coins, I wouldn't rob them");
        }
        if (user.items.find((x) => x.name == "Lucky Clover")) {
            const newInv = user.items.filter((i) => i.name != "Lucky Clover");
            const bypass = user.items.find((i) => i.name == "Lucky Clover");
            if (bypass.amount == 1) {
                user.items = newInv;
            } else {
                newInv.push({ name: "Lucky Clover", amount: bypass.amount - 1, description: bypass.description });
                user.items = newInv;
            }
        } else {
            const random = Math.floor(Math.random() * 5);
            if (random === 3) {
                message.channel.send(`You tried to rob **${member.user.tag}** but got caught! Better luck next time.`);
                return true;
            }
        }
        const array = robbedUser.items.filter((x) => x.name !== "Wallet Lock");
        const walletLock = robbedUser.items.find((x) => x.name === "Wallet Lock");
        if (walletLock) {
            message.channel.send(
                `You tried to rob **${member.user.tag}**, but they had a **Wallet Lock**. Try again next time.`
            );
            if (walletLock.amount === 1) {
                robbedUser.items = array;
                await robbedUser.save();
            } else {
                array.push({
                    name: "Wallet Lock",
                    amount: walletLock.amount - 1,
                    description: walletLock.description,
                });
                robbedUser.items = array;
                await robbedUser.save();
            }
            return true;
        }
        const randomAmount = Math.round(Math.random() * robbedUser.coinsInWallet);
        user.coinsInWallet += randomAmount;
        robbedUser.coinsInWallet -= randomAmount;
        await user.save();
        await robbedUser.save();
        message.channel.send(`:moneybag: You stole **${randomAmount.toLocaleString()}** coins from ${member}!`);
        return true;
    }
};
