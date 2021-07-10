require("dotenv/config");
const Event = require("../../structures/bases/eventBase");
const Embed = require("../../structures/embed");
const { rolelogsModel } = require("../../database/models/export/index");

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            name: "roleCreate",
        });
    }

    async execute(role) {
        const data = await rolelogsModel.findOne({
            guildId: role.guild.id,
        });

        if (!data) return;

        const channel = role.guild.channels.cache.find((channel) => channel.id === data.channelId);

        if (!channel) return;

        try {
            channel.send(
                new Embed()
                    .setColor("RED")
                    .setAuthor(`${role.guild.name}`, role.guild.iconURL({ dynamic: true }))
                    .setDescription(` **Role Deleted:** \`${role.name}\``)
                    .setTimestamp(Date.now())
                    .setFooter(`ID: ${role.id}`)
            );
        } catch (err) {
            console.log(err);
        }
    }
};
