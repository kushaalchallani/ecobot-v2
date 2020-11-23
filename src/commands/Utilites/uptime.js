const Command = require("../../structures/bases/commandBase");
const Embed = require("../../structures/embed");
const moment = require("moment");
require("moment-duration-format");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "uptime",
            description: "Check how long a bot is online",
            category: "Utilites",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
            ownerOnly: false,
            cooldown: 10,
        });
    }

    async execute(message) {
        const duration = moment.duration(this.client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
        const embed = new Embed().setDescription(`⌛ | I've been up and running for **${duration}**!`).setColor("BLUE");
        return message.channel.send(embed);
    }
};
