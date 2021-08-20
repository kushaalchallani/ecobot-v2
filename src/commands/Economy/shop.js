const Embed = require("../../structures/embed");
const Command = require("../../structures/bases/commandBase");

const lock = "<:shiny_lock:875762407526514800>";
const rifle = "<:rifle:875762407216136232> ";
const axe = "<:eco_axe:875762406977056808>";
const pick = "<:pickaxe:875762406444376086>";
const rainbow_coin = "<a:rainbow_coin:875762408600252447>";
const gold_coin = "<a:gold_coin:875762409145528330> ";
const silver_coin = "<a:silver_coin:875762409111973938>";
const bronze_coin = "<a:bronze_coin:875762408675745832>";
const trophy = "<a:eco_trophy:875762408990322729>";
const clover = "<:clover:875762407539085352> ";

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "shop",
            description: "Check what's new on the shop!",
            aliases: ["store", "item", "items"],
            category: "Economy",
            cooldown: 3,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            ownerOnly: false,
            nsfw: false,
            bankspace: 0,
        });
    }

    async execute(message, args) {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        const pages = [
            `🍪 **Cookie - __40__** __coins__\n\`id: cookie\`\nUse to make you fatter \n${lock} **Padlock - __10__,__000__** __coins__\n\`id: padlock\`\nUse this to stop those pesky robber\n📜 **Bank Note - __20__,__000__** __coins__\n\`id: banknote\`\nUse this to increase your back capacity\n${clover} **Lucky Clover - __10__,__000__** __coins__\n\`id: luckyclover\`\nUse this to increase you chances of robbing`,
            `${rifle} **Rifle - __20__,__000__** __coins__\n\`id: rifle\`\nUse this to go hunting\n${axe} **Axe - __20__,__000__** __coins__\n\`id: axe\`\nUse this to cut trees down!\n🎣 **Fishing Rod - __10__,__000__** __coins__\n\`id: fishingrod\`\nUse this to go fishing!\n${pick} **Pickaxe - __30__,__000__** __coins__\n\`id: pickaxe\`\nUse this to mine gems!`,
            `${rainbow_coin} **Hydra Rainbow Coin - __10__,__00__,__00__,__000__** __coins__\n\`id: rainbowcoin\`\n${gold_coin} **Hydra Gold Coin - __50__,__00__,__000__** __coins__\n\`id: goldcoin\`\n${silver_coin} **Hydra Silver Coin - __1__,__50__,__00__,__000__** __coins__\n\`id: silvercoin\`\n${bronze_coin} **Hydra Bronze Coin - ,__50__,__00__,__000__** __coins__\n\`id: bronzecoin\`\n${trophy} **Hydra Trophy - __10__,__00,__00__,__000__** __coins__\n\`id: trophy\``,
        ];
        let page = 1;

        const embed = new Embed()
            .setAuthor(`Welcome ${member.user.username} To Hydra+ Shop`)
            .setColor("RANDOM")
            .setThumbnail(member.user.displayAvatarURL({ format: "png", size: 256, dynamic: true }))
            .setFooter(`page ${page} / ${pages.length}`)
            .setDescription(pages[page - 1]);
        message.channel.send(embed).then((msg) => {
            msg.react("⏪").then(() => {
                msg.react("⏩");

                const backwardsFilter = (reaction, user) =>
                    reaction.emoji.name === "⏪" && user.id === message.author.id;
                const forwardsFilter = (reaction, user) =>
                    reaction.emoji.name === "⏩" && user.id === message.author.id;

                const backwards = msg.createReactionCollector(backwardsFilter, { time: 100000 });
                const forwards = msg.createReactionCollector(forwardsFilter, { time: 100000 });

                forwards.on("collect", (r) => {
                    if (page === pages.length) return;
                    page++;
                    embed.setDescription(pages[page - 1]);
                    embed.setColor("RANDOM");
                    embed.setFooter(`Page ${page} / ${pages.length}`);
                    msg.edit(embed);
                    r.users.remove(member.id);
                });

                backwards.on("collect", (r) => {
                    if (page === 1) return;
                    page--;
                    embed.setColor("RANDOM");
                    embed.setDescription(pages[page - 1]);
                    embed.setFooter(`Page ${page} / ${pages.length}`);
                    msg.edit(embed);
                    r.users.remove(member.id);
                });
            });
        });
    }
};
