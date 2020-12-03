const mongoose = require("mongoose");

const premiumSchema = mongoose.Schema({
    userID: String,
    guildID: String,
    premium: Boolean,
});

module.exports = mongoose.model("premium", premiumSchema);
