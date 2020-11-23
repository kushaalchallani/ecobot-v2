const Embed = require("../structures/embed");
const { afkModel } = require("../database/models/export/index");

module.exports = (client) => {
    client.on("message", (message) => {
        if (message.author.bot) return;
        const ping = message.mentions.members.first();
        if (ping) {
            afkModel.findOne(
                {
                    ID: ping.id,
                },
                (err, data) => {
                    if (err) throw err;
                    if (data) {
                        if (data.AFK === true) {
                            message.channel.send(
                                new Embed()
                                    .setColor("BLUE")
                                    .setDescription(`${ping.user} is AFK. **Reason:** ${data.Reason}`)
                            );
                        }
                    }
                }
            );
        }
        afkModel.findOne(
            {
                ID: message.author.id,
            },
            async (err, data) => {
                if (err) throw err;
                if (data) {
                    if (data.AFK === true) {
                        data.AFK = false;
                        data.Reason = "";
                        await data.save();
                        message.channel.send(
                            new Embed()
                                .setDescription(`Welcome back, ${message.author}! I removed your AFK`)
                                .setColor("BLUE")
                        );
                    }
                }
            }
        );
    });
};
