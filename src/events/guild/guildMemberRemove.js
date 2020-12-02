const Event = require("../../structures/bases/eventBase");
const { leaveModel } = require("../../database/models/export/index");
const Embed = require("../../structures/embed");

module.exports = class extends (
    Event
) {
    constructor(...args) {
        super(...args, {
            name: "guildMemberRemove",
        });
    }

    async execute(member) {
        const oldMembers = member.guild.members.cache.filter((m) => !m.user.bot).size;

        const embed = new Embed()
            .setColor("#ff0000")
            .setAuthor(`${member.user.tag}`, member.user.displayAvatarURL())
            .setDescription(`**${member.user.username}** has left the server`)
            .setFooter(`We now have ${oldMembers} members`, member.guild.iconURL());

        leaveModel.findOne(
            {
                guildId: member.guild.id,
            },
            async (data) => {
                if (data) {
                    const channel = member.guild.channels.cache.get(data.channelId);
                    console.log(data);
                    channel.send(embed);
                }
            }
        );
    }
};
