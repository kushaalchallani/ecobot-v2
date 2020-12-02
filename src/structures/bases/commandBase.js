module.exports = class Command {
    constructor(client, name, options = {}) {
        this.client = client;
        this.name = options.name || name;
        this.description = options.description || null;
        this.usage = options.usage || null;
        this.category = options.category || null;
        this.aliases = options.aliases || [];
        this.nsfw = options.nsfw || false;
        this.ownerOnly = options.ownerOnly || false;
        this.premium = options.premium || false;
        this.bankSpace = options.bankSpace || 0;
        this.guildOnly = options.guildOnly || false;
        this.cooldown = options.cooldown || null;
        this.memberPermission = options.memberPermission || [];
        this.botPermission = options.botPermission || [];
        this.subcommands = options.subcommands || null;
        this.examples = options.examples || [];
    }
};
