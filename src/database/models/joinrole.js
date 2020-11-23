const mongoose = require("mongoose");

const roleSchema = mongoose.Schema({
    guildId: String,
    guildName: String,
    roleId: String,
});

module.exports = mongoose.model("join-role", roleSchema);
