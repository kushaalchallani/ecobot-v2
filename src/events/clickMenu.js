const Event = require("../structures/bases/eventBase");
const Embed = require("../structures/embed");

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            name: "clickMenu",
        });
    }

    async execute(menu) {
        const arr = ["imageCmds", "ecoCmds", "funCmds", "nsfwCmds", "utilCmds", "modCmds", "settingsCmds", "musicCmds"];
        if (arr.some((x) => x === menu.values[0])) {
            if (this.client.author.find((x) => x.author.id === menu.clicker.user.id)) menuselection(menu);
            else
                menu.reply.send(
                    new Embed()
                        .setColor("RED")
                        .setDescription("You are not allowed to select an option!")
                        .setTitle("❌ Error"),
                    true
                );
        }
    }
};

function menuselection(menu) {
    switch (menu.values[0]) {
        case "imageCmds":
            menu.reply.send(
                new Embed()
                    .setColor("BLUE")
                    .setTitle("📸 Image Commands")
                    .setDescription(
                        "`clyde` `cry` `disabled` `disgust` `hand` `hug` `kiss` `lewd` `nobully` `noswear` `pat` `retarded` `rip` `shit` `slap` `supreme` `tickle` `trash` `triggered` `tweet` `wasted` `wink`"
                    ),
                true
            );
            break;
        case "ecoCmds":
            menu.reply.send(
                new Embed()
                    .setColor("BLUE")
                    .setTitle("💰 Economy Commands")
                    .setDescription(
                        "`additem` `addmoney` `balance` `beg` `buy` `daily` `deposit` `gamble` `give` `global-lb` `hourly` `inventory` `leaderboard` `monthly` `removeitem` `removemoney` `rob` `sell` `shop` `use` `weekly` `withdraw` `work`"
                    ),
                true
            );
            break;
        case "funCmds":
            menu.reply.send(
                new Embed()
                    .setColor("BLUE")
                    .setTitle("😄 Fun Commands")
                    .setDescription("`8ball` `avatar` `color` `fortune` `meme` `pp` `qr` `sacrifice`"),
                true
            );
            break;
        case "nsfwCmds":
            menu.reply.send(
                new Embed()
                    .setColor("BLUE")
                    .setTitle("🔞 NSFW Commands")
                    .setDescription("`4k` `anal` `ass` `bdsm` `blowjob` `boobs` `hentai` `lesbian` `porn` `pussy`"),
                true
            );
            break;
        case "utilCmds":
            menu.reply.send(
                new Embed()
                    .setColor("BLUE")
                    .setTitle("🛠️ Utilites Commands")
                    .setDescription(
                        "`afk` `announce` `botinfo` `bug` `channelinfo` `help` `invite` `myThanks` `patreon` `ping` `playstore` `premium` `roleinfo` `serverinfo` `suggestion` `thank` `uptime` `userinfo` `weather`"
                    ),
                true
            );
            break;
        case "modCmds":
            menu.reply.send(
                new Embed()
                    .setColor("BLUE")
                    .setTitle("🛡️ Moderation Commands")
                    .setDescription(
                        "`ban` `delwarn` `kick` `mute` `nuke` `purge` `tempmute` `unban` `unmute` `warn` `warnings`"
                    ),
                true
            );
            break;
        case "settingsCmds":
            menu.reply.send(
                new Embed()
                    .setColor("BLUE")
                    .setTitle("⚙️ Settings Commands")
                    .setDescription("`config` `droprole` `ghostping` `nsfw` `reset-thanks` `reset` `tag`"),
                true
            );
            break;
        case "musicCmds":
            menu.reply.send(
                new Embed()
                    .setColor("BLUE")
                    .setTitle("🎵 Music Commands")
                    .setDescription("`nowplaying` `pause` `play` `queue` `skip` `stop`"),
                true
            );
            break;
    }
}
