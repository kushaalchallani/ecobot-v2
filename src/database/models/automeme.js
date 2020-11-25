const mongoose = require("mongoose");

const automeme = mongoose.Schema({
    guildId: String,
    guildName: String,
    channelID: String,
    Time: String,
    status: Boolean,
});

module.exports = mongoose.model("auto-meme", automeme);
