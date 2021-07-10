const Event = require("../../structures/bases/eventBase");
const { welcomeModel, joinroleModel, tempMuteModel } = require("../../database/models/export/index");
const Embed = require("../../structures/embed");

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            name: "guildMemberAdd",
        });
    }

    async execute(member) {
        const array = [
            `Hey **${member.user.username}**, thank for joining!`,
            `Hello there **${member.user.username}**`,
            `A wild **${member.user.username}** has been spotted joining the server!`,
            `Welcome **${member.user.username}** to **${member.guild.name}**`,
            `**${member.user.username}** just slid into the server.`,
            `**${member.user.username}** just showed up`,
            `**${member.user.username}** is here`,
            `Yay you made it, **${member.user.username}**`,
            `Glad you're here, **${member.user.username}**`,
        ];

        const randomMessage = array[Math.floor(Math.random() * array.length)];
        const newMembers = member.guild.members.cache.filter((m) => !m.user.bot).size;

        const welcomeData = await welcomeModel.findOne({
            guildId: member.guild.id,
        });

        const roleData = await joinroleModel.findOne({
            guildId: member.guild.id,
        });

        if (!roleData) return;
        if (!welcomeData) return;

        const channel = member.guild.channels.cache.find((channel) => channel.id === welcomeData.channelId);
        const role = member.guild.roles.cache.get(roleData.roleId);

        if (!channel) return;

        const embed = new Embed()
            .setColor("#48ff00")
            .setAuthor(`${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
            .setDescription(randomMessage)
            .setFooter(`Member #${newMembers}`, member.guild.iconURL({ dynamic: true }));

        channel.send(embed);

        if (role.position >= member.guild.me.roles.highest.position) return;

        member.roles.add(role);

        // tempmute role add

        const muteDoc = await tempMuteModel.findOne({
            guildID: member.guild.id,
            memberID: member.id,
        });

        if (muteDoc) {
            const muteRole = member.guild.roles.cache.find((r) => r.name === "Muted");

            if (muteRole) member.roles.add(muteRole).catch((err) => console.log(err));

            muteDoc.memberRoles = [];

            await muteDoc.save().catch((err) => console.log(err));
        }
    }
};
