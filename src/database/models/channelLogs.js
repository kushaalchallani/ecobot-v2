const mongoose = require("mongoose");

const log = mongoose.Schema({
    guildId: String,
    guildName: String,
    channelId: String,
});

module.exports = mongoose.model("channel-log", log);
