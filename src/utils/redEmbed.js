const Embed = require("../structures/embed");

/**
 *
 * @param {String} text
 * @param {TextChannel} channel
 */

module.exports = async (text, channel) => {
    const embed = new Embed().setColor("RED").setDescription(text);
    await channel.send(embed);
};
