const Embed = require("../structures/embed");

/**
 *
 * @param {String} text
 * @param {TextChannel} channel
 */

module.exports = async (text, channel) => {
    const embed = new Embed().setColor("RED").setDescription(text).setTitle("❌ Error");
    await channel.send(embed);
};
