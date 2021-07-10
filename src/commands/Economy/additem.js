const Command = require("../../structures/bases/commandBase");
const CurrencySystem = require("currency-system");
const { error, success } = require("../../utils/export/index");
const cs = new CurrencySystem();

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "additem",
            description: "A way to additem to shop",
            category: "Economy",
            aliases: ["ai"],
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES", "ADMINISTRATOR"],
            nsfw: false,
            cooldown: 5,
            ownerOnly: false,
        });
    }

    async execute(message) {
        success("What should be item name?", message.channel);
        const Name = await message.channel.awaitMessages((msg) => msg.author.id == message.author.id, {
            max: 1,
        });

        success("What should be its price?", message.channel);
        const Price = await message.channel.awaitMessages((msg) => msg.author.id == message.author.id, {
            max: 1,
        });
        const result = await cs.addItem({
            guild: message.guild,
            inventory: {
                name: Name.first().content,
                price: parseInt(Price.first().content),
            },
        });
        if (result.error) {
            if (result.type == "No-Inventory-Name")
                return error("There was a error, Please enter item name to add!", message.channel);
            if (result.type == "Invalid-Inventory-Price")
                return error("There was a error, invalid price!", message.channel);
            if (result.type == "No-Inventory-Price")
                return error("There was a error, You didnt specify price!", message.channel);
            if (result.type == "No-Inventory") return error("There was a error, No data recieved!", message.channel);
        } else success("Done! Successfully added `" + Name.first().content + "` to the shop!", message.channel);
    }
};
