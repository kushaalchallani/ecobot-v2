const Command = require("../../structures/bases/commandBase");
const { error } = require("../../utils/export/index");
const CurrencySystem = require("currency-system");
const Embed = require("../../structures/embed");
const cs = new CurrencySystem();

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "global-lb",
            description: "Show's Global money leaderboard",
            category: "Economy",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            aliases: ["glb"],
        });
    }

    async execute(message) {
        const data = await cs.globalLeaderboard();
        if (data.length < 1) return error("Nobody's in Global leaderboard yet.", message.channel);
        const msg = new Embed().setColor("RANDOM");
        let pos = 0;
        // This is to get First 10 Users )
        data.slice(0, 10).map((e) => {
            pos++;
            if (!this.client.users.cache.get(e.userID)) return;
            msg.addField(
                `${pos} - **${this.client.users.cache.get(e.userID).username}**`,
                `Wallet: **${e.wallet}** - Bank: **${e.bank}**`,
                true
            );
        });

        message.channel.send(msg).catch();
    }
};
