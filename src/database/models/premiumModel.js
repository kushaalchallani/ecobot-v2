const mongoose = require("mongoose");

const reqString = {
    type: String,
    required: true,
};

const premiumSchema = mongoose.Schema({
    userID: reqString,
    guildID: reqString,
    premium: Boolean,
});

module.exports = mongoose.model("premium", premiumSchema);
