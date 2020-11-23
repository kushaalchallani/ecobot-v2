const mongoose = require("mongoose");

const leaveSchema = mongoose.Schema({
    guildId: String,
    guildName: String,
    channelId: String,
});

module.exports = mongoose.model("leave-channel", leaveSchema);
