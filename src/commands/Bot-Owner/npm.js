const Command = require("../../structures/bases/commandBase");
const Embed = require("../../structures/embed");
const { success, error } = require("../../utils/export/index");
const fetch = require("node-fetch");
const moment = require("moment");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "npm",
            description: "Searches node package manager!",
            category: "Bot Owner",
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            nsfw: false,
            ownerOnly: true,
            cooldown: 10,
            examples: ["npm", "npm discord.js"],
        });
    }

    async execute(message, args) {
        let query = args.join(" ");
        if (!query) query = await this.awaitMessages(message);
        if (!query) return;
        const res = await fetch(`https://registry.npmjs.com/${encodeURIComponent(query)}`).catch((err) =>
            console.log(err)
        );
        if (res.status === 404)
            return error("No search results found, maybe try searching for something that exists.", message.channel);
        const body = await res.json();
        const embed = new Embed()
            .setColor(0xde2c2c)
            .setTitle(body.name)
            .setURL(`https://www.npmjs.com/package/${body.name}`)
            .setDescription(body.description || "No description.")
            .addField("❯ Version", body["dist-tags"].latest, true)
            .addField("❯ License", body.license || "None", true)
            .addField("❯ Author", body.author ? body.author.name : "???", true)
            .addField("❯ Creation Date", moment.utc(body.time.created).format("YYYY/MM/DD hh:mm:ss"), true)
            .addField(
                "❯ Modification Date",
                body.time.modified ? moment.utc(body.time.modified).format("YYYY/MM/DD hh:mm:ss") : "None",
                true
            )
            .addField(
                "❯ Repository",
                body.repository ? `[View Here](${body.repository.url.split("+")[1]})` : "None",
                true
            )
            .addField(
                "❯ Maintainers",
                this.client.util
                    .trimArray(
                        body.maintainers.map((user) => user.name),
                        10
                    )
                    .join(", ")
            );
        message.channel.send(embed);
    }

    async awaitMessages(message) {
        let responce;

        const filter = (user) => {
            return user.author.id === message.author.id;
        };

        success("**What do you want to search for?** \nType `cancel` to cancel the command.", message.channel);

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
