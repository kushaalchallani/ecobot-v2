require("dotenv/config");
const { Client, Collection } = require("discord.js");
const { eventRegistry, commandRegistry } = require("../registries/export/index");
const Util = require("./util");
const { suggestion, afk, thanklb } = require("../features/exports/index");

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
};
