const Command = require("../../structures/bases/commandBase");
const Embed = require("../../structures/embed");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "ping",
            description: "Pong! Check the bot latency",
            aliases: ["pong", "latency"],
            category: "Utilites",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
            ownerOnly: false,
            cooldown: 5,
        });
    }

    async execute(message) {
        const msg = await message.channel.send("🏓 Pinging...");
        const embed = new Embed()
        .setTitle("🏓 Pong!")
        .setColor("BLUE")
        .setDescription(
                        `Message Latency is ${Math.floor(
                            msg.createdTimestamp - message.createdTimestamp
                        )}ms\nAPI Latency is ${Math.round(this.client.ws.ping)}ms`
                    );
                    await message.channel.send({ embeds: [embed] });
                    msg.delete();
    }
};

// message.channel.send("🏓 Pinging....").then((msg) => {
//     const embed = new Embed()
//         .setTitle("🏓Pong!")
//         .setDescription(
//             `Message Latency is ${Math.floor(
//                 msg.createdTimestamp - message.createdTimestamp
//             )}ms\nAPI Latency is ${Math.round(this.client.ws.ping)}ms`
//         )
//         .setColor("BLUE");
//     msg.edit("\u200B");
//     msg.edit(embed);
// });