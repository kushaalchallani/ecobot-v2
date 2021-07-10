const Command = require("../../structures/bases/commandBase");
const CurrencySystem = require("currency-system");
const { error, success, incorrect } = require("../../utils/export/index");
const cs = new CurrencySystem();

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "removeitem",
            description: "A way to remove item from the shop",
            category: "Economy",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES", "ADMINISTRATOR"],
            nsfw: false,
            cooldown: 5,
            ownerOnly: false,
        });
    }

    async execute(message, args) {
        if (!args[0]) return incorrect("Which item to remove?", message.channel);
        const result = await cs.removeItem({
            guild: message.guild,
            item: parseInt(args[0]),
        });
        if (result.error) {
            if (result.type == "Invalid-Item-Number")
                return incorrect("There was a error, Please enter item number to remove.!", message.channel);
            if (result.type == "Unknown-Item")
                return error("There was a error, The Item Does not exist!", message.channel);
        } else success("Done! Successfully removed the `" + result.inventory.name + "` from shop!", message.channel);
    }
};
