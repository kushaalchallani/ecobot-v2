const Event = require("../structures/bases/eventBase");
const Embed = require("../structures/embed");
const { automemeModel } = require("../database/models/export/index");

module.exports = class extends (
    Event
) {
    constructor(...args) {
        super(...args, {
            name: "ready",
            once: true,
        });
    }

    async execute() {
        console.log(this.client.user.tag + " is now online.");
        console.log(this.client.user.tag + " is in " + this.client.guilds.cache.size + " servers!");

        const statuses = [
            { name: "eb!help | @EcoBot for more Info", options: { type: "PLAYING" } },
            { name: `eb!help | ${this.client.users.cache.size} users`, options: { type: "PLAYING" } },
            { name: `eb!help | ${this.client.guilds.cache.size} servers`, options: { type: "PLAYING" } },
        ];

        setInterval(() => {
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            this.client.user.setActivity(status.name, status.options);
        }, 30000);

        const memedata = await automemeModel.findOne({
            guildId: this.client.guild.id,
        });
        if (memedata.status === false) return;

        const got = require("got");
        const data = await automemeModel.findOne({
            guildId: this.client.guild.id,
            status: true,
        });
        const channel = this.client.channels.cache.get(data[0]);
        const time = data[1];

        setInterval(() => {
            got("https://www.reddit.com/r/memes/random/.json").then((res) => {
                const content = JSON.parse(res.body);
                channel.send(
                    new Embed()
                        .setTitle(content[0].data.children[0].data.title)
                        .setImage(content[0].data.children[0].data.url)
                        .setColor("RANDOM")
                        .setFooter(
                            `👍 ${content[0].data.children[0].data.ups} 👎 ${content[0].data.children[0].data.downs} | Comments : ${content[0].data.children[0].data.num_comments}`
                        )
                );
            });
        }, time);
    }
};
