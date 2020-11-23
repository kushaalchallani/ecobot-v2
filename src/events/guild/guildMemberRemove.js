const Event = require("../../structures/bases/eventBase");
const { leaveModel } = require("../../database/models/export/index");
const Embed = require("../../structures/embed");

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            name: "guildMemberRemove",
        });
    }

    async execute(member) {
        const leaveData = await leaveModel.findOne({
            guildId: member.guild.id,
        });

        const channel = member.guild.channels.cache.get(leaveData.channelId);

        const oldMembers = member.guild.members.cache.filter((m) => !m.user.bot).size;

        const embed = new Embed()
            .setColor("#ff0000")
            .setAuthor(`${member.user.tag}`, member.user.displayAvatarURL())
            .setDescription(`**${member.user.username}** has left the server`)
            .setFooter(`We now have ${oldMembers} members`, member.guild.iconURL());

        if (channel) {
            channel.send({ embed: embed });
            return;
        }
    }
};
