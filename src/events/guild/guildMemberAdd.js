const Event = require("../../structures/bases/eventBase");
const { welcomeModel, joinroleModel } = require("../../database/models/export/index");
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

        const embed = new Embed()
            .setColor("#48ff00")
            .setAuthor(`${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
            .setDescription(randomMessage)
            .setFooter(`Member #${newMembers}`, member.guild.iconURL({ dynamic: true }));

        welcomeModel.findOne(
            {
                guildId: member.guild.id,
            },
            async (data) => {
                if (data) {
                    const channel = member.guild.channels.cache.get(data.channelId);
                    channel.send(embed);
                }
            }
        );

        joinroleModel.findOne(
            {
                guildId: member.guild.id,
            },
            async (data) => {
                if (data) {
                    member.roles.add(data.roleId);
                }
            }
        );
    }
};
