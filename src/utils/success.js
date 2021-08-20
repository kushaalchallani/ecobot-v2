const Embed = require("../structures/embed");
const tick = "<:big_tick:876015832617086986>";

/**
 *
 * @param {String} text
 * @param {TextChannel} channel
 */

module.exports = async (text, channel) => {
    const embed = new Embed().setColor("BLUE").setDescription(`${tick} ${text}`);
    await channel.send(embed);
};
