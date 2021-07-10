const Event = require("../structures/bases/eventBase");
const { tempMuteModel } = require("../database/models/export/index");
const Embed = require("../structures/embed");
const chalk = require("chalk");
const express = require("express");
const app = express();
const port = 3000 || 3001;
const path = require("path");

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            name: "ready",
            once: true,
        });
    }

    async execute() {
        console.log(chalk.cyan("[BOT] ") + this.client.user.tag + " is now online.");
        console.log(
            chalk.cyan("[BOT] ") + this.client.user.tag + " is in " + this.client.guilds.cache.size + " servers!"
        );

        const statuses = [
            { name: "eb!help | @EcoBot for more Info", options: { type: "PLAYING" } },
            { name: `eb!help | ${this.client.users.cache.size} users`, options: { type: "PLAYING" } },
            { name: `eb!help | ${this.client.guilds.cache.size} servers`, options: { type: "PLAYING" } },
        ];

        setInterval(() => {
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            this.client.user.setActivity(status.name, status.options);
        }, 30000);

        // temp mute role add

        setInterval(async () => {
            for (const guild of this.client.guilds.cache) {
                const muteArray = await tempMuteModel.find({
                    guildID: guild[0],
                });

                for (const muteDoc of muteArray) {
                    if (Date.now() >= Number(muteDoc.length)) {
                        const guild = this.client.guilds.cache.get(muteDoc.guildID);
                        if (!guild) return console.log("guild not found :(");
                        const member = guild ? guild.members.cache.get(muteDoc.memberID) : null;
                        const muteRole = guild ? guild.roles.cache.find((r) => r.name === "Muted") : null;
                        if (member) {
                            await member.roles.remove(muteRole ? muteRole.id : "").catch((err) => console.log(err));

                            for (const role of muteDoc.memberRoles) {
                                await member.roles.add(role).catch((err) => console.log(err));

                                try {
                                    const embed = new Embed()
                                        .setColor("ORANGE")
                                        .setAuthor(member.guild.name, member.guild.iconURL())
                                        .setTimestamp(Date.now())
                                        .setDescription(
                                            `Your tempmute in **${member.guild.name}** has ended. You can now talk!`
                                        );
                                    member.send(embed);
                                } catch (err) {
                                    console.log(err);
                                }
                            }
                        }
                        await muteDoc.deleteOne().catch((err) => console.log(err));
                    }
                }
            }
        }, 60000);

        // website express JS

        app.use(express.static(path.join(__dirname, "..", "website")));

        app.get("/", (req, res) => {
            res.status(200).sendFile(path.join(__dirname, "..", "website", "index.html"));
        });

        app.get("/about", (req, res) => {
            res.status(200).sendFile(path.join(__dirname, "..", "website", "about.html"));
        });

        app.get("/sourcecode", (req, res) => {
            res.status(200).redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
        });

        app.get("*", (req, res) => {
            res.sendFile(path.join(__dirname, "..", "website", "404.html"));
        });

        app.get("/error", (req, res) => {
            res.status(200).sendFile(path.join(__dirname, "..", "website", "404.html"));
        });

        app.listen(port, () => {
            console.log(chalk.green("[WEBSITE] ") + "Website in now Online at " + `localhost:${port}`);
        });
    }
};
