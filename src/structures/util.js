const { economyModel } = require("../database/models/export");

module.exports = class Util {
    constructor(client) {
        this.client = client;
    }

    getMentions() {
        const client = this.client;

        return {
            member(mention, guild) {
                if (!mention) return;
                const matches = mention.match(/<@!?(\d{17,19})>/);
                const memberID = matches ? matches[1] : mention;
                return guild.members.cache.get(memberID);
            },
            async user(mention) {
                if (!mention) return;
                const matches = mention.match(/<@!?(\d{17,19})>/);
                const userID = matches ? matches[1] : mention;
                return await client.users.fetch(userID).catch(() => null);
            },
            channel(mention, guild) {
                if (!mention) return;
                const matches = mention.match(/<#(\d{17,19})>/);
                const channelID = matches ? matches[1] : mention;
                return guild.channels.cache.get(channelID);
            },
            role(mention, guild) {
                if (!mention) return;
                const matches = mention.match(/<@&(\d{17,19})>/);
                const roleID = matches ? matches[1] : mention;
                return guild.roles.cache.get(roleID);
            },
        };
    }

    capitalise(string) {
        return string
            .split(" ")
            .map((str) => str.slice(0, 1).toUpperCase() + str.slice(1))
            .join(" ");
    }

    isNumeric(str) {
        if (typeof str != "string") return false;
        return !isNaN(str) && !isNaN(parseFloat(str));
    }

    trimArray(arr, maxLen = 10) {
        if (arr.length > maxLen) {
            const len = arr.length - maxLen;
            arr = arr.slice(0, maxLen);
            arr.push(`${len} more...`);
        }
        return arr;
    }

    formatBytes(bytes) {
        if (bytes === 0) return "0 Bytes";
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
    }

    removeDuplicates(arr) {
        return [...new Set(arr)];
    }

    // Economy Functions

    /**
     *
     * @param {string} userId - A discord user ID.
     */

    async fetchUser(userId) {
        const someone = this.client.users.cache.get(userId);
        if (!someone || someone.bot) return false;
        const user = await economyModel.findOne({ userId: userId });
        if (!user) {
            const newUser = new economyModel({
                userId: userId,
                items: [],
            });
            newUser.save();
            return newUser;
        }
        return user;
    }

    /**
     *
     * @param {string} userId - A discord user ID.
     * @param {number} amount - Amount of bank space to give.
     */

    async giveBankSpace(userId, amount) {
        const someone = this.client.users.cache.get(userId);
        if (!someone || someone.bot) return false;
        const user = await economyModel.findOne({ userId: userId });
        if (!user) {
            const newUser = new economyModel({
                userId: userId,
                items: [],
            });
            newUser.save();
            return newUser;
        }
        user.bankSpace += isNaN(amount);
        await user.save();
        return user;
    }

    /**
     *
     * @param {string} userId - A discord user ID.
     */

    async createUser(userId) {
        const someone = this.client.users.cache.get(userId);
        if (!someone || someone.bot) return false;
        const user = await economyModel.findOne({ userId: userId });
        if (!user) return false;
        const newUser = new economyModel({
            userId: userId,
            items: [],
        });
        newUser.save();
        return newUser;
    }

    /**
     *
     * @param {string} userId - A discord user ID.
     * @param {number} amount - Amount of coins to give.
     */

    async giveCoins(userId, amount) {
        const someone = this.client.users.cache.get(userId);
        if (!someone || someone.bot) return false;
        const user = await economyModel.findOne({ userId: userId });
        if (!user) {
            const newUser = new economyModel({
                userId: userId,
                items: [],
                coinsInWallet: parseInt(amount),
            });
            newUser.save();
            return newUser;
        }
        user.coinsInWallet += parseInt(amount);
        await user.save();
        return user;
    }
};
