const Command = require("../../structures/bases/commandBase");
const { error, success } = require("../../utils/export/index");
const fetch = require("node-fetch");
const srcRegex = RegExp(/\s?--src=([a-zA-Z-]+)/);

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "docs",
            description: "Search discord api documentation.",
            category: "Bot Owner",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            guildOnly: true,
            nsfw: false,
            cooldown: 10,
            examples: ["docs Client", "docs Message", "docs ClientUser#setActivity --src=master"],
        });
    }

    async execute(message, args) {
        let searchString = args.join(" ");
        if (!searchString) searchString = await this.awaitMessages(message);
        if (!searchString) return;
        const project = srcRegex.test(searchString) ? srcRegex.exec(searchString)[1] : "stable";
        const query = srcRegex.test(searchString)
            ? searchString.replace(RegExp(`\\s?--src=${project}`), "")
            : searchString;
        const res = await fetch(
            `https://djsdocs.sorta.moe/v2/embed?src=${project}&q=${encodeURIComponent(query)}`
        ).catch(console.error);
        const embed = await res.json();
        if (!embed) return error("Nothing found, maybe try searching for something that exists.", message.channel);
        message.channel.send({ embed: embed });
    }

    async awaitMessages(message) {
        let responce;

        const filter = (user) => {
            return user.author.id === message.author.id;
        };

        await success("**What do you want to search for?** \nType `cancel` to cancel the command.", message.channel);

        await message.channel
            .awaitMessages(filter, { max: 1, time: 120000, errors: ["time"] })
            .then((msg) => {
                const firstMsg = msg.first();
                if (firstMsg.content.toLowerCase() === "cancel") return firstMsg.react("👍");
                responce = firstMsg.content;
            })
            .catch(() => {
                return error("Welp.. you took too long, cancelling the command.", message.channel);
            });

        return responce;
    }
};
