const mongoose = require("mongoose");

const welcomeSchema = mongoose.Schema({
    guildId: String,
    guildName: String,
    channelId: String,
});

module.exports = mongoose.model("welcome-channel", welcomeSchema);
