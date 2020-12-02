const Command = require("../../structures/bases/commandBase");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "passive",
            description: "Search discord api documentation.",
            category: "Bot Owner",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
            cooldown: 10,
            examples: ["docs Client", "docs Message", "docs ClientUser#setActivity --src=master"],
        });
    }

    async execute(message, args) {
        const userData = await this.client.fetchUser(message.author.id);
        const enable = ["true", "on", "enable"];
        const disable = ["false", "off", "disable"];
        if (!args[0]) {
            let status = userData.passive;
            if (status == false) status = "`Disabled`";
            else status = "`Enabled`";
            return message.channel.send(`Your passive mode is ${status}`);
        }
        if (enable.includes(args[0].toString().toLowerCase())) {
            if (userData.passive == true) return message.reply("You're already in passive mode");
            userData.passive = true;
            await userData.save();
            message.reply("I have enabled your passive mode");
        } else if (disable.includes(args[0].toString().toLowerCase())) {
            if (userData.passive == false) return message.reply("You're not passive mode");
            userData.passive = false;
            await userData.save();
            message.reply("I have disabled your passive mode");
        } else message.reply("Dude that's not a valid option");
    }
};
