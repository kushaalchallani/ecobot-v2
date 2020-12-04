const Command = require("../../structures/bases/commandBase");
const Embed = require("../../structures/embed");
const prettyMilliseconds = require("pretty-ms");
const { success, error, incorrect } = require("../../utils/export/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "passive",
            description: "Enable / Disable passive mode",
            category: "Economy",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
            bankSpace: 0,
            examples: ["passive on", "passive true", "passive disable", "passive false"],
            usage: "<enable || disable>",
        });
    }

    async execute(message, args) {
        const userData = await this.client.util.fetchUser(message.author.id);
        const enable = ["true", "on", "enable"];
        const disable = ["false", "off", "disable"];

        if (Date.parse(userData.passiveStreak) + 3600000 > Date.now()) {
            const embed = new Embed()
                .setTitle("**Slow it down!**")
                .setDescription(
                    `Woah there, You need to wait \`${prettyMilliseconds(
                        Date.parse(userData.passiveStreak) + 3600000 - Date.now()
                    )}\` before turning or/off you passive.
            
            The default cooldown on this command is \`1d\``
                )
                .setColor(0x3c54b4);
            return message.channel.send(embed);
        } else {
            if (!args[0]) {
                let status = userData.passive;
                if (status == false) status = "`Disabled`";
                else status = "`Enabled`";
                return success(`Your passive mode is ${status}`, message.channel);
            }
            if (enable.includes(args[0].toString().toLowerCase())) {
                if (userData.passive == true) return error("You're already in passive mode", message.channel);
                userData.passive = true;
                userData.passiveStreak = new Date(Date.now());
                await userData.save();
                success("I have enabled your passive mode", message.channel);
            } else if (disable.includes(args[0].toString().toLowerCase())) {
                if (userData.passive == false) return error("You're not passive mode", message.channel);
                userData.passive = false;
                userData.passiveStreak = new Date(Date.now());
                await userData.save();
                success("I have disabled your passive mode", message.channel);
            } else incorrect("Dude that's not a valid option", message.channel);
        }
    }
};
