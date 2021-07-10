const Embed = require("../../structures/embed");
const { error } = require("../../utils/export/index");
const fetch = require("node-fetch");
const Command = require("../../structures/bases/commandBase");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "meme",
            description: "Get a meme",
            aliases: ["funny"],
            category: "Fun",
            cooldown: 3,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            usage: "<question>",
            examples: ["8ball is this a good bot?"],
            ownerOnly: false,
            nsfw: false,
        });
    }

    async execute(message) {
        const random = ["memes", "dank", "meme"];
        const memes = random[Math.floor(Math.random() * random.length)];

        fetch(`https://www.reddit.com/r/${memes}.json?sort=top&t=daily`)
            .then((res) => res.json())
            .then((body) => {
                if (!body) return error("I could not generate a meme", message.channel);

                const allowed = message.channel.nsfw
                    ? body.data.children
                    : body.data.children.filter((post) => !post.data.over_18);

                if (!allowed.length)
                    return error(
                        "I got an error. Kindly report the problem to the server **Administrator** by telling them to use the `bug` command or [Join the support server](https://discord.gg/5E7enQfVJW) and report the problem"
                    );

                const randomnumber = Math.floor(Math.random() * allowed.length);

                const url = `https://www.reddit.com${allowed[randomnumber].data.permalink}`;
                const embed = new Embed()
                    .setTitle(allowed[randomnumber].data.title)
                    .setURL(url)
                    .setImage(allowed[randomnumber].data.url)
                    .setColor("RANDOM")
                    .setFooter(`👍 ${allowed[randomnumber].data.ups} | 💬 ${allowed[randomnumber].data.num_comments}`);

                return message.channel.send(embed);
            });
    }
};
