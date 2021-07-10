const Command = require("../../structures/bases/commandBase");
const { error, incorrect, success } = require("../../utils/export/index");
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "sell",
            description: "Sell the item that is in your inventory",
            category: "Economy",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
            cooldown: 10,
            examples: ["sell Brownie", "sell Axe"],
        });
    }

    async execute(message, args) {
        if (!args[0]) return incorrect("Which item to sell?", message.channel);
        const result = await cs.removeUserItem({
            user: message.author,
            guild: message.guild,
            item: parseInt(args[0]),
        });
        if (result.error) {
            if ((result.type == "Invalid-Item-Number", message.channel))
                return incorrect("There was a error, Please enter item number to remove.!", message.channel);
            if (result.type == "Unknown-Item")
                return error("There was a error, The Item Does not exist!", message.channel);
        } else
            success(
                "Done! Successfully sold the `" +
                    result.inventory.name +
                    "` for free! You now have " +
                    result.inventory.amount +
                    " of those items left!",
                message.channel
            );
    }
};
