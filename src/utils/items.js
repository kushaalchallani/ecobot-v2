/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
const { success } = require("./export/index");

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
        run: async (bot, message, args) => {
            const brownieRandom = [
                "You ate a brownie, and the taste of the chocolate watered in your mouth.",
                "You choked on a brownie and almost died. Be careful!",
                "The brownie tasted great.",
            ];
            const yes = brownieRandom[Math.floor(Math.random() * brownieRandom.length)];
            success(`${yes}`, message.channel);
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
        run: async (bot, message, args) => {},
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
        run: async (bot, message, args) => {
            const logsAmount = Math.round(Math.random() * 1) + 1;
            const data = await this.client.util.fetchUser(message.author.id);
            success(`You swing your axe and chopped **${logsAmount}** logs`, message.channel);
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
        run: async (bot, message, args) => {},
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
        run: async (bot, message, args) => {
            const random = Math.ceil(Math.random() * 5000 + 5000);
            const e = await this.client.util.giveBankSpace(message.author.id, random);
            success(
                `You get a new bank card, which increases your bank space by **${random.toLocaleString()}**. You now have **${e.bankSpace.toLocaleString()}** bank space.`,
                message.channel
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
        run: async (bot, message, args) => {},
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
        run: async (bot, message) => {
            const answers = [
                "You ate rice and gained 50 IQ",
                "You ate alot of rice and became an EPIC gamer",
                "You ate rice i suggest eating more",
                "You ate too much rice, stop it get some help",
            ];
            const randomAnswer = Math.floor(Math.random() * answers.length);
            success(answers[randomAnswer], message.channel);
        },
    },
];

module.exports = array;
