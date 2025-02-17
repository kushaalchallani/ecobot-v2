require("dotenv/config");
const { Client, Collection, Intents } = require("discord.js");
const { eventRegistry, commandRegistry } = require("../registries/export/index");
const Util = require("./util");
const { suggestion, afk, thanklb, clickMenu, ghostPingDetector } = require("../features/feature/exports/index");
const statcord = require("../bot");
const { ItemManager } = require("../utils/export/index");
const { economyModel } = require("../database/models/export/index");

module.exports = class EcoBot extends Client {
    constructor() {
        super({
            allowedMentions: {
                parse: ["users", "roles"],
            },
            intents: Intents.ALL,
        });

        this.events = new Collection();

        this.commands = new Collection();

        this.aliases = new Collection();

        this.cooldowns = new Collection();

        this.author = new Collection();

        this.queue = new Map();

        this.util = new Util(this);

        this.prefix = process.env.PREFIX;

        this.commandsUsed = 0;

        this.statcord = statcord;

        // Economy

        this.economy = economyModel;
        this.items = new ItemManager();
        this.commandsUsed = 1;
    }

    async start() {
        eventRegistry(this);
        commandRegistry(this);
        suggestion(this);
        thanklb(this);
        afk(this);
        clickMenu(this);
        ghostPingDetector(this);
        require("../database/database")();
        require("../features/load-features")();
        super.login(process.env.BOT_TOKEN);
        // super.login(process.env.BOT_TOKEN);
    }
};
