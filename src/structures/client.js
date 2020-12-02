require("dotenv/config");
const { Client, Collection } = require("discord.js");
const { eventRegistry, commandRegistry } = require("../registries/export/index");
const Util = require("./util");
const { suggestion, afk, thanklb } = require("../features/exports/index");
const { ecoGuildModel, economyModel } = require("../database/models/export/index");
const ItemManager = require("./ItemManager");

module.exports = class EcoBot extends (
    Client
) {
    constructor() {
        super({
            disableMentions: "everyone",
        });

        this.events = new Collection();

        this.commands = new Collection();

        this.aliases = new Collection();

        this.cooldowns = new Collection();

        this.queue = new Map();

        this.util = new Util(this);

        this.prefix = process.env.PREFIX;

        this.economy = economyModel;

        this.items = new ItemManager();

        this.commandsUsed = 0;
    }

    async start() {
        eventRegistry(this);
        commandRegistry(this);
        suggestion(this);
        thanklb(this);
        afk(this);
        require("../database/database")();
        super.login(process.env.BOT_TOKEN);
    }

    /**
     *
     * @param {string} userId - A discord user ID.
     */

    async fetchUser(userId) {
        const someone = this.users.cache.get(userId);
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
        const someone = this.users.cache.get(userId);
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
        user.bankSpace += parseInt(amount);
        await user.save();
        return user;
    }

    /**
     *
     * @param {string} userId - A discord user ID.
     */

    async createUser(userId) {
        const someone = this.users.cache.get(userId);
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
        const someone = this.users.cache.get(userId);
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

    async fetchGuild(guildID) {
        const guild = this.guilds.cache.get(guildID);
        if (!guild) return undefined;
        const config = await ecoGuildModel.findOne({ guildId: guildID });
        if (!config) {
            const newConfig = new ecoGuildModel({
                guildId: guildID,
            });
            await newConfig.save();
            return newConfig;
        } else {
            return config;
        }
    }
};
