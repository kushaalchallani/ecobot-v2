const mongoose = require("mongoose");

const automeme = mongoose.Schema({
    guildId: String,
    guildName: String,
    channelID: String,
    Time: String,
});

module.exports = mongoose.model("auto-meme", automeme);
