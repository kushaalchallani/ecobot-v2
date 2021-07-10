const mongoose = require("mongoose");

const ghostPingModel = new mongoose.Schema({
    _id: String,
    guildName: String,
    channelId: String,
});

module.exports = mongoose.model("ghostPingChannels", ghostPingModel);
