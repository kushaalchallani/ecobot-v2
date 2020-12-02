const array = [
    {
        name: "Brownie",
        description: "Mmmmmm tastes so good. Don't eat too much or you'll be fat.",
        canUse: true,
        canBuy: true,
        displayOnShop: true,
        sellAmount: 10,
        price: 30,
        keep: false,
        run: async (message) => {
            const brownieRandom = [
                "You ate a brownie, and the taste of the chocolate watered in your mouth.",
                "You choked on a brownie and almost died. Be careful!",
                "The brownie tasted great.",
            ];
            const yes = brownieRandom[Math.floor(Math.random() * brownieRandom.length)];
            message.channel.send(`${yes}`);
        },
    },
    {
        name: "Wallet Lock",
        description: "Secure your wallet from those sneaky robbers",
        canUse: false,
        canBuy: true,
        displayOnShop: true,
        sellAmount: 2000,
        price: 5000,
        keep: true,
    },
    {
        name: "Axe",
        description: "Chop down trees",
        canUse: true,
        canBuy: true,
        displayOnShop: true,
        sellAmount: 3000,
        price: 10000,
        keep: true,
        run: async (message) => {
            const logsAmount = Math.round(Math.random() * 1) + 1;
            const data = await this.client.fetchUser(message.author.id);
            message.channel.send(`You swing your axe and chopped **${logsAmount}** logs`);
            const findItem = data.items.find((i) => i.name.toLowerCase() == "log");
            const userInv = data.items.filter((i) => i.name.toLowerCase() !== "log");
            if (findItem) {
                userInv.push({
                    name: "Log",
                    amount: findItem.amount + logsAmount,
                    description: "Sell logs to make money.",
                });
                data.items = userInv;
                await data.save();
            } else {
                userInv.push({ name: "Log", amount: logsAmount, description: "Sell logs to make money." });
                data.items = userInv;
                await data.save();
            }
        },
    },
    {
        name: "Log",
        description: "Sell logs to make money.",
        canUse: false,
        canBuy: false,
        displayOnShop: false,
        sellAmount: 500,
        price: 0,
        keep: true,
    },
    {
        name: "Bank Card",
        description: "Get more bank space.",
        canUse: true,
        canBuy: true,
        displayOnShop: true,
        sellAmount: 6667,
        price: 20000,
        keep: false,
        run: async (message) => {
            const random = Math.ceil(Math.random() * 5000 + 5000);
            const e = await this.client.giveBankSpace(message.author.id, random);
            message.channel.send(
                `You get a new bank card, which increases your bank space by **${random.toLocaleString()}**. You now have **${e.bankSpace.toLocaleString()}** bank space.`
            );
        },
    },
    {
        name: "Lucky Clover",
        description: "Increase your chances of successful robbery",
        canUse: false,
        canBuy: true,
        displayOnShop: true,
        sellAmount: 4000,
        price: 15000,
        keep: false,
    },
    {
        name: "Rice",
        description: "Eat rice because its best!",
        canUse: true,
        canBuy: true,
        displayOnShop: true,
        sellAmount: 20,
        price: 45,
        keep: false,
        run: async (message) => {
            const answers = [
                "You ate rice and gained 50 IQ",
                "You ate alot of rice and became an EPIC gamer",
                "You ate rice i suggest eating more",
                "You ate too much rice, stop it get some help",
            ];
            const randomAnswer = Math.floor(Math.random() * answers.length);
            message.channel.send(answers[randomAnswer]);
        },
    },
];

module.exports = array;
